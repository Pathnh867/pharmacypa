const express = require("express")
const router = express.Router()
const PrescriptionController = require('../controllers/PrescriptionController')
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware")

// Routes cho người dùng
router.post('/upload', authUserMiddleware, PrescriptionController.uploadPrescription)
router.get('/user', authUserMiddleware, PrescriptionController.getUserPrescriptions)
router.get('/details/:id', authUserMiddleware, PrescriptionController.getPrescriptionDetails)

// Routes cho admin
router.put('/status/:id', authMiddleware, PrescriptionController.updatePrescriptionStatus)
router.get('/all', authMiddleware, PrescriptionController.getAllPrescriptions)

module.exports = router