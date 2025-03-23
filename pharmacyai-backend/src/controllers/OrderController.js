const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        console.log('res',req.body)
        const { fullName, address, city, phone, itemsPrice, shippingPrice, totalPrice, paymentMethod, orderItems, user} = req.body
        
        if (!fullName || !address || !city || !phone|| !itemsPrice|| !shippingPrice||!totalPrice ||!paymentMethod || !orderItems || !user) {
            return res.status(400).json({
                status: 'ERR',
                message:'The input is required'
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

// Thêm controller để lấy chi tiết đơn hàng
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

module.exports = {
    createOrder,
    getOrderDetails
}