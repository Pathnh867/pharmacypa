const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config()

const sendEmailOrderSuccess = async (orderData) => {
    try {
        // Tạo transporter với thông tin từ biến môi trường
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: process.env.MAIL_ACCOUNT,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Tạo thông tin chi tiết đơn hàng để hiển thị trong email
        const orderItems = orderData.orderItems.map(item => {
            return `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.amount}</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.amount).toLocaleString('vi-VN')}đ</td>
                </tr>
            `;
        }).join('');

        // Format thông tin người nhận
        const shippingInfo = `
            <p><strong>Họ tên:</strong> ${orderData.shippingAddress.fullName}</p>
            <p><strong>Địa chỉ:</strong> ${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}</p>
            <p><strong>Số điện thoại:</strong> ${orderData.shippingAddress.phone}</p>
        `;

        // Tạo email HTML
        const emailHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
                <div style="text-align: center; background-color: #4cb551; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                    <h1 style="color: white; margin: 0;">Đơn hàng mới</h1>
                </div>
                
                <p>Xin chào Admin,</p>
                <p>Có đơn hàng mới vừa được đặt trên hệ thống với thông tin như sau:</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3>Thông tin người nhận:</h3>
                    ${shippingInfo}
                </div>
                
                <h3>Chi tiết đơn hàng:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                            <th style="padding: 10px; text-align: center;">Số lượng</th>
                            <th style="padding: 10px; text-align: right;">Đơn giá</th>
                            <th style="padding: 10px; text-align: right;">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tạm tính:</td>
                            <td style="padding: 10px; text-align: right;">${orderData.itemsPrice.toLocaleString('vi-VN')}đ</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Phí vận chuyển:</td>
                            <td style="padding: 10px; text-align: right;">${orderData.shippingPrice.toLocaleString('vi-VN')}đ</td>
                        </tr>
                        <tr style="background-color: #f9f9f9;">
                            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold; color: #ff4d4f; font-size: 16px;">
                                ${orderData.totalPrice.toLocaleString('vi-VN')}đ
                            </td>
                        </tr>
                    </tfoot>
                </table>
                
                <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
                    <p><strong>Phương thức thanh toán:</strong> ${orderData.paymentMethod === 'later_money' ? 'Thanh toán khi nhận hàng' : 'Ví MoMo'}</p>
                    <p><strong>Ngày đặt hàng:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                </div>
                
                <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                    <p>Email này được gửi tự động từ hệ thống Nhà Thuốc Tiện Lợi.</p>
                </div>
            </div>
        `;

        // Gửi email
        let info = await transporter.sendMail({
            from: '"Nhà Thuốc Tiện Lợi" <nhathuocthongminh@gmail.com>',
            to: "thanhkg5@gmail.com", // Email cố định của admin
            subject: `[Đơn hàng mới] #${orderData._id || 'NEW_ORDER'}`,
            html: emailHTML,
        });

        console.log("Email sent:", info.messageId);
        return { status: 'OK', message: 'Email sent successfully' };
    } catch (error) {
        console.error("Error sending email:", error);
        return { status: 'ERR', message: error.message };
    }
}

module.exports = {
    sendEmailOrderSuccess
}