// Cập nhật OrderController trong pharmacyai-backend/src/controllers/OrderController.js

const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('res', req.body)
        const { fullName, address, city, phone, itemsPrice, shippingPrice, totalPrice, paymentMethod, orderItems, user } = req.body
        
        if (!fullName || !address || !city || !phone || !itemsPrice || !shippingPrice || !totalPrice || !paymentMethod || !orderItems || !user) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

// Lấy chi tiết đơn hàng
const getOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID is required'
            })
        }
        
        const response = await OrderService.getDetailsOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        })
    }
}

// Lấy danh sách đơn hàng của người dùng hiện tại
const getUserOrders = async (req, res) => {
    try {
        // Lấy user ID từ middleware auth
        const userId = req.user.id
        
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'User ID is required'
            })
        }
        
        const response = await OrderService.getOrdersByUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        })
    }
}

// Lấy tất cả đơn hàng (dành cho admin)
const getAllOrders = async (req, res) => {
    try {
        let { limit = 10, page = 0, sort } = req.query
        
        // Chuyển đổi từ chuỗi sang số
        limit = Number(limit)
        page = Number(page)
        
        // Xử lý tham số sort
        if (sort && typeof sort === 'string') {
            try {
                sort = JSON.parse(sort)
            } catch (e) {
                console.error('Error parsing sort parameter:', e)
            }
        }
        
        const response = await OrderService.getAllOrders(limit, page, sort)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        })
    }
}

// Cập nhật trạng thái đơn hàng (dành cho admin)
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id
        const { status, note } = req.body
        
        if (!orderId || !status) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID and new status are required'
            })
        }
        
        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid status value'
            })
        }
        
        const response = await OrderService.updateOrderStatus(orderId, status, note)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        })
    }
}

// API để hủy đơn hàng
const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        const { reason } = req.body
        
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID is required'
            })
        }
        
        // Kiểm tra quyền - người dùng chỉ được hủy đơn hàng của họ
        const orderDetails = await OrderService.getDetailsOrder(orderId)
        
        if (orderDetails.status === 'ERR') {
            return res.status(404).json(orderDetails)
        }
        
        // Nếu không phải admin, kiểm tra xem đơn hàng có phải của người dùng hiện tại không
        if (!req.user.isAdmin && String(orderDetails.data.user._id || orderDetails.data.user) !== String(req.user.id)) {
            return res.status(403).json({
                status: 'ERR',
                message: 'You are not authorized to cancel this order'
            })
        }
        
        // Kiểm tra trạng thái - chỉ được hủy đơn hàng ở trạng thái pending hoặc processing
        if (!['pending', 'processing'].includes(orderDetails.data.status)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Cannot cancel order with current status'
            })
        }
        
        const response = await OrderService.cancelOrder(orderId, reason)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Internal server error'
        })
    }
}

module.exports = {
    createOrder,
    getOrderDetails,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    cancelOrder
}