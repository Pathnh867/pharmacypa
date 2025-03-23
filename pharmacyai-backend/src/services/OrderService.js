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

module.exports = {
    createOrder,
}