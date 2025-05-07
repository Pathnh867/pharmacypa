// pharmacyai-backend/src/routes/PrescriptionRouter.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const PrescriptionController = require('../controllers/PrescriptionController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

// Cấu hình multer để xử lý file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Routes cho đơn thuốc
router.post('/:orderId/upload', authUserMiddleware, upload.single('prescription'), PrescriptionController.uploadPrescription);
router.get('/:orderId/status', authUserMiddleware, PrescriptionController.getPrescriptionStatus);
router.get('/admin/list', authMiddleware, PrescriptionController.getAllPrescriptions);
router.post('/:prescriptionId/verify', authMiddleware, PrescriptionController.verifyPrescription);

module.exports = router;