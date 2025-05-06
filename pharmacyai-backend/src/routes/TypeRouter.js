const express = require("express");
const router = express.Router()
const TypeController = require('../controllers/TypeController');
const { authMiddleware } = require("../middleware/authMiddleware");

// Thêm routes cho Type
router.post('/create', authMiddleware, TypeController.createType);
router.get('/get-all', TypeController.getAllType);
router.put('/update/:id', authMiddleware, TypeController.updateType);
router.get('/prescription/:status', TypeController.getTypesByPrescriptionStatus);

module.exports = router