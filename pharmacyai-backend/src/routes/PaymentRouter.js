const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const MomoController = require('../controllers/MomoController');
dotenv.config();

// Để tương thích với mã hiện tại
router.get('/config', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        data: process.env.CLIENT_ID
    });
});

// API để tạo thanh toán MoMo
router.post('/momo/create', MomoController.createMomoPayment);

// API để nhận callback từ MoMo
router.post('/momo-ipn', MomoController.momoIpnCallback);

// API để xử lý redirect từ MoMo
router.get('/momo-redirect', MomoController.momoRedirect);

module.exports = router;