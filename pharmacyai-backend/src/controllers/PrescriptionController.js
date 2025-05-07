// pharmacyai-backend/src/controllers/PrescriptionController.js
const PrescriptionService = require('../services/PrescriptionService');

const uploadPrescription = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const file = req.file;
    
    if (!orderId || !file) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const result = await PrescriptionService.uploadPrescription(orderId, file, req.user.id);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};

const getPrescriptionStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    
    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'ID đơn hàng là bắt buộc'
      });
    }
    
    const result = await PrescriptionService.getPrescriptionStatus(orderId);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};

const getAllPrescriptions = async (req, res) => {
  try {
    const { status, page = 0, limit = 10 } = req.query;
    
    const result = await PrescriptionService.getAllPrescriptions(status, page, limit);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};

const verifyPrescription = async (req, res) => {
  try {
    const prescriptionId = req.params.prescriptionId;
    const { status, notes } = req.body;
    
    if (!prescriptionId || !status) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const result = await PrescriptionService.verifyPrescription(
      prescriptionId,
      status,
      notes,
      req.user.id
    );
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};

module.exports = {
  uploadPrescription,
  getPrescriptionStatus,
  getAllPrescriptions,
  verifyPrescription
};