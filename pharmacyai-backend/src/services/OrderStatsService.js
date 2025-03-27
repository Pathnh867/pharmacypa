// pharmacyai-backend/src/services/OrderStatsService.js

const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const Type = require('../models/TypeModel');
const moment = require('moment');

// Lấy thống kê tổng hợp về đơn hàng
const getOrderStats = (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Chuyển đổi sang định dạng Date
            const startDateTime = new Date(startDate);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999); // Đặt thành cuối ngày
            
            // Trường hợp ngày không hợp lệ
            if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
                resolve({
                    status: 'ERR',
                    message: 'Ngày không hợp lệ'
                });
                return;
            }
            
            // Truy vấn đơn hàng trong khoảng thời gian
            const orders = await Order.find({
                createdAt: {
                    $gte: startDateTime,
                    $lte: endDateTime
                }
            }).populate('user', 'name email');
            
            // Tính toán các thống kê
            const totalOrders = orders.length;
            
            // Đơn hàng đã giao
            const deliveredOrders = orders.filter(order => order.status === 'delivered');
            const totalDeliveredOrders = deliveredOrders.length;
            
            // Doanh thu
            const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
            
            // Giá trị đơn hàng trung bình
            const averageOrderValue = totalDeliveredOrders > 0 ? totalRevenue / totalDeliveredOrders : 0;
            
            // Đơn hàng theo trạng thái
            const ordersByStatus = {
                pending: orders.filter(order => order.status === 'pending').length,
                processing: orders.filter(order => order.status === 'processing').length,
                shipping: orders.filter(order => order.status === 'shipping').length,
                delivered: totalDeliveredOrders,
                cancelled: orders.filter(order => order.status === 'cancelled').length
            };
            
            // Doanh thu theo ngày
            const revenueByDay = {};
            deliveredOrders.forEach(order => {
                const date = moment(order.createdAt).format('YYYY-MM-DD');
                if (!revenueByDay[date]) {
                    revenueByDay[date] = {
                        date,
                        revenue: 0,
                        orders: 0
                    };
                }
                revenueByDay[date].revenue += order.totalPrice;
                revenueByDay[date].orders += 1;
            });
            
            // Chuyển đổi thành mảng và sắp xếp theo ngày
            const dailyRevenue = Object.values(revenueByDay).sort((a, b) => a.date.localeCompare(b.date));
            
            resolve({
                status: 'OK',
                message: 'Success',
                data: {
                    totalOrders,
                    totalDeliveredOrders,
                    totalRevenue,
                    averageOrderValue,
                    ordersByStatus,
                    dailyRevenue,
                    startDate,
                    endDate
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Lấy thống kê doanh thu theo sản phẩm
const getProductRevenueStats = (startDate, endDate, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Chuyển đổi sang định dạng Date
            const startDateTime = new Date(startDate);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999); // Đặt thành cuối ngày
            
            // Giới hạn số lượng sản phẩm trả về
            const productLimit = Number(limit) || 10;
            
            // Truy vấn đơn hàng đã giao trong khoảng thời gian
            const orders = await Order.find({
                createdAt: {
                    $gte: startDateTime,
                    $lte: endDateTime
                },
                status: 'delivered'
            });
            
            // Tính toán doanh thu theo sản phẩm
            const productRevenue = {};
            
            orders.forEach(order => {
                if (order.orderItems && order.orderItems.length > 0) {
                    order.orderItems.forEach(item => {
                        const productId = item.product.toString();
                        
                        if (!productRevenue[productId]) {
                            productRevenue[productId] = {
                                productId,
                                name: item.name,
                                quantity: 0,
                                revenue: 0
                            };
                        }
                        
                        productRevenue[productId].quantity += item.amount;
                        productRevenue[productId].revenue += item.price * item.amount;
                    });
                }
            });
            
            // Chuyển đổi thành mảng và sắp xếp theo doanh thu
            const productStats = Object.values(productRevenue)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, productLimit);
            
            // Đối với top sản phẩm, lấy thêm thông tin chi tiết
            const productIds = productStats.map(item => item.productId);
            const productDetails = await Product.find({ _id: { $in: productIds } }).populate('type');
            
            // Kết hợp thông tin chi tiết với thống kê
            const enhancedProductStats = productStats.map(stat => {
                const details = productDetails.find(p => p._id.toString() === stat.productId);
                return {
                    ...stat,
                    image: details?.image || '',
                    type: details?.type?.name || 'Không xác định',
                    typeId: details?.type?._id || ''
                };
            });
            
            resolve({
                status: 'OK',
                message: 'Success',
                data: enhancedProductStats,
                startDate,
                endDate
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Lấy thống kê doanh thu theo danh mục sản phẩm
const getCategoryRevenueStats = (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Chuyển đổi sang định dạng Date
            const startDateTime = new Date(startDate);
            const endDateTime = new Date(endDate);
            endDateTime.setHours(23, 59, 59, 999); // Đặt thành cuối ngày
            
            // Truy vấn đơn hàng đã giao trong khoảng thời gian
            const orders = await Order.find({
                createdAt: {
                    $gte: startDateTime,
                    $lte: endDateTime
                },
                status: 'delivered'
            });
            
            // Lấy tất cả loại sản phẩm
            const types = await Type.find();
            
            // Lấy tất cả sản phẩm để map với loại
            const products = await Product.find();
            
            // Tạo bảng tra cứu product -> type
            const productTypeMap = {};
            products.forEach(product => {
                productTypeMap[product._id.toString()] = product.type.toString();
            });
            
            // Tạo bảng tra cứu type id -> type name
            const typeMap = {};
            types.forEach(type => {
                typeMap[type._id.toString()] = type.name;
            });
            
            // Tính toán doanh thu theo danh mục
            const categoryRevenue = {};
            
            orders.forEach(order => {
                if (order.orderItems && order.orderItems.length > 0) {
                    order.orderItems.forEach(item => {
                        const productId = item.product.toString();
                        const typeId = productTypeMap[productId];
                        const typeName = typeMap[typeId] || 'Không xác định';
                        
                        if (!categoryRevenue[typeId]) {
                            categoryRevenue[typeId] = {
                                typeId,
                                typeName,
                                quantity: 0,
                                revenue: 0
                            };
                        }
                        
                        categoryRevenue[typeId].quantity += item.amount;
                        categoryRevenue[typeId].revenue += item.price * item.amount;
                    });
                }
            });
            
            // Chuyển đổi thành mảng và sắp xếp theo doanh thu
            const categoryStats = Object.values(categoryRevenue)
                .sort((a, b) => b.revenue - a.revenue);
            
            resolve({
                status: 'OK',
                message: 'Success',
                data: categoryStats,
                startDate,
                endDate
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getOrderStats,
    getProductRevenueStats,
    getCategoryRevenueStats
};