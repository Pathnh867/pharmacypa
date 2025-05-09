// PrescriptionRouter.js
const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PrescriptionController = require('../controllers/PrescriptionController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../../uploads/prescriptions');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Chỉ cho phép upload hình ảnh và PDF
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Không hỗ trợ định dạng file này'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// Thêm log để debug
router.use((req, res, next) => {
  console.log(`Prescription Route hit: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes cho đơn thuốc - đảm bảo tên tham số đúng
router.post('/:orderId/upload', authUserMiddleware, upload.single('prescription'), PrescriptionController.uploadPrescription);
router.get('/:orderId/status', authUserMiddleware, PrescriptionController.getPrescriptionStatus);
router.get('/admin/list', authMiddleware, PrescriptionController.getAllPrescriptions);
router.post('/:prescriptionId/verify', authMiddleware, PrescriptionController.verifyPrescription);

module.exports = router;