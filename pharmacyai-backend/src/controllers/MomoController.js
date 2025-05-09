const crypto = require('crypto');
const https = require('https');
const EmailService = require('../services/EmailService');
const Order = require('../models/OrderProduct');
const OrderService = require('../services/OrderService');

// Cấu hình MoMo từ biến môi trường
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;
const redirectUrl = `${process.env.FRONTEND_URL}/payment-result`;
const ipnUrl = `${process.env.BACKEND_URL}/api/payment/momo-ipn`;

const createMomoPayment = async (req, res) => {
    try {
        const { orderId, amount, orderInfo } = req.body;
        
        // Tạo requestId ngẫu nhiên
        const requestId = partnerCode + new Date().getTime();
        const momoOrderId = orderId || requestId;
        
        // Tạo raw signature
        const rawSignature = 
            "accessKey=" + accessKey + 
            "&amount=" + amount + 
            "&extraData=" + "" + 
            "&ipnUrl=" + ipnUrl + 
            "&orderId=" + momoOrderId + 
            "&orderInfo=" + orderInfo + 
            "&partnerCode=" + partnerCode + 
            "&redirectUrl=" + redirectUrl + 
            "&requestId=" + requestId + 
            "&requestType=" + "captureWallet";
        
        // Tạo signature
        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');
        
        // Tạo request body
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Nhà thuốc tiện lợi",
            storeId: "PharmacyStore",
            requestId: requestId,
            amount: amount,
            orderId: momoOrderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: "vi",
            requestType: "captureWallet",
            autoCapture: true,
            extraData: "",
            signature: signature
        });
        
        console.log("Sending request to MoMo:", requestBody);
        
        // Tạo HTTPS request
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };
        
        // Gửi request và xử lý response
        const momoRequest = https.request(options, response => {
            response.setEncoding('utf8');
            let responseData = '';
            
            response.on('data', (chunk) => {
                responseData += chunk;
            });
            
            response.on('end', () => {
                console.log("MoMo response:", responseData);
                
                try {
                    const jsonResponse = JSON.parse(responseData);
                    return res.status(200).json(jsonResponse);
                } catch (error) {
                    console.error("Error parsing MoMo response:", error);
                    return res.status(500).json({
                        status: 'ERR',
                        message: 'Invalid response from MoMo'
                    });
                }
            });
        });
        
        momoRequest.on('error', (error) => {
            console.error("Error sending request to MoMo:", error);
            return res.status(500).json({
                status: 'ERR',
                message: error.message
            });
        });
        
        // Gửi request
        momoRequest.write(requestBody);
        momoRequest.end();
    } catch (error) {
        console.error("Error in createMomoPayment:", error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const momoIpnCallback = async (req, res) => {
    try {
        console.log("MoMo IPN callback received:", req.body);
        
        // Xác thực signature từ MoMo trước khi xử lý giao dịch
        const { orderId, resultCode, amount, transId, signature } = req.body;
        
        // Kiểm tra kết quả giao dịch từ MoMo
        if (resultCode === 0) {
            // Thanh toán thành công - cập nhật trạng thái đơn hàng
            try {
                // Lấy thông tin đơn hàng từ database
                const orderResult = await OrderService.getDetailsOrder(orderId);

                if (orderResult?.status === 'OK' && orderResult?.data) {
                    // Cập nhật trạng thái thanh toán của đơn hàng
                    const paymentInfo = {
                        transId,
                        amount
                    };
                    
                    await OrderService.updateOrderPaymentStatus(orderId, paymentInfo);
                    console.log(`Order ${orderId} payment status updated successfully`);
                    
                    // Gửi email xác nhận đơn hàng
                    await EmailService.sendEmailOrderSuccess(orderResult.data);
                } else {
                    console.error(`Order ${orderId} not found or invalid`);
                }
            } catch (error) {
                console.error("Error updating order payment status:", error);
            }
        } else {
            console.warn(`MoMo payment for order ${orderId} failed with code ${resultCode}`);
        }
        
        // Trả về 200 OK cho MoMo bất kể kết quả xử lý
        return res.status(200).json({
            status: 'OK',
            message: 'Notification received'
        });
    } catch (error) {
        console.error("Error in momoIpnCallback:", error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message
        });
    }
};

const momoRedirect = async (req, res) => {
    // Xử lý redirect từ MoMo
    console.log("MoMo redirect received:", req.query);
    
    const { orderId, resultCode, message } = req.query;
    const redirectUrl = resultCode === '0' 
        ? `/payment-result?status=success&orderId=${orderId}&resultCode=${resultCode}` 
        : `/payment-result?status=error&orderId=${orderId}&resultCode=${resultCode}&message=${encodeURIComponent(message || '')}`;
    
    res.redirect(`${process.env.FRONTEND_URL}${redirectUrl}`);
};

module.exports = {
    createMomoPayment,
    momoIpnCallback,
    momoRedirect
};