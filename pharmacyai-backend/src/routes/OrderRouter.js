// Cập nhật OrderRouter trong pharmacyai-backend/src/routes/OrderRouter.js

const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

// API tạo đơn hàng mới
router.post('/create', OrderController.createOrder);

// API lấy chi tiết đơn hàng theo ID
router.get('/details/:id', OrderController.getOrderDetails);

// API lấy danh sách đơn hàng của người dùng hiện tại
router.get('/user-orders', authUserMiddleware, OrderController.getUserOrders);

// API lấy tất cả đơn hàng (chỉ cho admin)
router.get('/all', authMiddleware, OrderController.getAllOrders);

// API cập nhật trạng thái đơn hàng (chỉ cho admin)
router.put('/status/:id', authMiddleware, OrderController.updateOrderStatus);

// API hủy đơn hàng
router.put('/cancel/:id', authUserMiddleware, OrderController.cancelOrder);

module.exports = router