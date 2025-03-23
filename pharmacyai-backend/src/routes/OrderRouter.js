const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');


router.post('/create', OrderController.createOrder)
// Thêm route để lấy chi tiết đơn hàng
router.get('/details/:id', OrderController.getOrderDetails)

module.exports = router