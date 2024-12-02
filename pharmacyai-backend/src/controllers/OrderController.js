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

module.exports = {
    createOrder,
}