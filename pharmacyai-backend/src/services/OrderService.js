// Cập nhật OrderService trong pharmacyai-backend/src/services/OrderService.js

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
                // Thêm trạng thái ban đầu
                status: 'pending',
                statusHistory: [{
                    status: 'pending',
                    timestamp: new Date(),
                    note: 'Đơn hàng được tạo'
                }],
                // Thêm ngày giao dự kiến (3 ngày sau)
                estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
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

// Lấy chi tiết đơn hàng
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

// Cập nhật trạng thái thanh toán đơn hàng
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
            
            // Cập nhật trạng thái đơn hàng nếu đang ở trạng thái pending
            if (order.status === 'pending') {
                order.status = 'processing';
                order.statusHistory.push({
                    status: 'processing',
                    timestamp: new Date(),
                    note: 'Đã thanh toán, đang xử lý đơn hàng'
                });
            }
            
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

// Lấy danh sách đơn hàng của một người dùng
const getOrdersByUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({ user: userId })
                .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
                .populate('user', 'name email')
                .select('-__v'); // Loại bỏ trường __v
                
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: orders
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy tất cả đơn hàng (cho admin)
const getAllOrders = (limit, page, sort) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = Order.find()
                .populate('user', 'name email')
                .select('-__v');
            
            // Áp dụng sắp xếp nếu có
            if (sort && Array.isArray(sort) && sort.length === 2) {
                const [option, field] = sort;
                const sortObj = {};
                sortObj[field] = option === 'asc' ? 1 : -1;
                query = query.sort(sortObj);
            } else {
                // Mặc định sắp xếp theo thời gian tạo, mới nhất trước
                query = query.sort({ createdAt: -1 });
            }
            
            // Áp dụng phân trang
            if (limit && page !== undefined) {
                query = query.skip(page * limit).limit(limit);
            }
            
            const orders = await query.exec();
            
            // Đếm tổng số đơn hàng
            const totalOrders = await Order.countDocuments();
            
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: orders,
                total: totalOrders,
                currentPage: page + 1,
                totalPages: Math.ceil(totalOrders / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật trạng thái đơn hàng (cho admin)
const updateOrderStatus = (orderId, newStatus, note) => {
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
            
            // Cập nhật trạng thái
            order.status = newStatus;
            
            // Thêm vào lịch sử trạng thái
            order.statusHistory.push({
                status: newStatus,
                timestamp: new Date(),
                note: note || `Trạng thái được cập nhật thành ${newStatus}`
            });
            
            // Cập nhật các trường liên quan đến trạng thái
            if (newStatus === 'delivered') {
                order.isDeliverd = true;
                order.deliverdAt = Date.now();
                
                // Cập nhật số lượng đã bán cho từng sản phẩm
                const Product = require('../models/ProductModel');
                
                // Lặp qua từng sản phẩm trong đơn hàng
                for (const item of order.orderItems) {
                    // Tìm và cập nhật sản phẩm
                    await Product.findByIdAndUpdate(
                        item.product,
                        { $inc: { selled: item.amount } },
                        { new: true }
                    );
                }
            }
            
            const updatedOrder = await order.save();
            
            resolve({
                status: 'OK',
                message: 'Order status updated successfully',
                data: updatedOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};
// Hủy đơn hàng
const cancelOrder = (orderId, reason) => {
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
            
            // Kiểm tra nếu đơn hàng đã giao thì không thể hủy
            if (order.status === 'delivered') {
                resolve({
                    status: 'ERR',
                    message: 'Cannot cancel delivered order'
                });
                return;
            }
            
            // Cập nhật trạng thái
            order.status = 'cancelled';
            
            // Thêm vào lịch sử trạng thái
            order.statusHistory.push({
                status: 'cancelled',
                timestamp: new Date(),
                note: reason || 'Đơn hàng đã bị hủy'
            });
            
            const updatedOrder = await order.save();
            
            resolve({
                status: 'OK',
                message: 'Order cancelled successfully',
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
    updateOrderPaymentStatus,
    getOrdersByUser,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
};