const Order = require("../models/OrderProduct")
const EmailService = require("./EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, fullName, address, city, phone, itemsPrice, shippingPrice, totalPrice, paymentMethod, user } = newOrder;
        try {
            
            const createdOrder = await Order.create({
                orderItems,
                shippingAddress: {
                    fullName,
                    address,
                    city,
                    phone
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                user: user,
            });
            
            if (createdOrder) { 
                // Gửi email thông báo đơn hàng mới
                try {
                    await EmailService.sendEmailOrderSuccess(createdOrder);
                    console.log('Order notification email sent');
                } catch (emailError) {
                    console.error('Failed to send order notification email:', emailError);
                    // Không reject promise nếu gửi email thất bại, vẫn coi như đặt hàng thành công
                }
                
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdOrder
                });
            }
        } catch (e) {
            console.error('Error creating order:', e);
            reject(e);
        }
    });
};

// Thêm hàm để lấy chi tiết đơn hàng
const getDetailsOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId)
                .populate('user', 'name email')
                .populate('orderItems.product');
                
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: 'Order not found'
                });
                return;
            }
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Thêm hàm để cập nhật trạng thái thanh toán đơn hàng
const updateOrderPaymentStatus = (orderId, paymentInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId);
            
            if (!order) {
                resolve({
                    status: 'ERR',
                    message: 'Order not found'
                });
                return;
            }
            
            // Cập nhật trạng thái thanh toán
            order.isPaid = true;
            order.paidAt = Date.now();
            
            // Lưu thông tin thanh toán nếu có
            if (paymentInfo) {
                order.paymentResult = {
                    id: paymentInfo.transId || paymentInfo.id,
                    status: 'COMPLETED',
                    update_time: Date.now(),
                    email_address: paymentInfo.email || ''
                };
            }
            
            const updatedOrder = await order.save();
            
            resolve({
                status: 'OK',
                message: 'Payment status updated successfully',
                data: updatedOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
    getDetailsOrder,
    updateOrderPaymentStatus
};