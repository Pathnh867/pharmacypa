// pharmacyai-backend/src/routes/OrderStatsRouter.js

const express = require("express");
const router = express.Router();
const OrderStatsController = require('../controllers/OrderStatsController');
const { authMiddleware } = require("../middleware/authMiddleware");

// Các routes cần quyền admin
router.get('/stats', authMiddleware, OrderStatsController.getOrderStats);
router.get('/product-stats', authMiddleware, OrderStatsController.getProductRevenueStats);
router.get('/category-stats', authMiddleware, OrderStatsController.getCategoryRevenueStats);
router.get('/export-excel', authMiddleware, OrderStatsController.exportRevenueToExcel);
router.get('/download/:fileName', authMiddleware, OrderStatsController.downloadExcelFile);

module.exports = router;