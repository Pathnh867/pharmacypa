// pharmacyai-backend/src/controllers/PrescriptionController.js
const PrescriptionService = require('../services/PrescriptionService');
const Prescription = require('../models/PrescriptionModel'); 

const uploadPrescription = async (req, res) => {
  try {
    const productId = req.params.productId; // Thay đổi từ orderId thành productId
    const file = req.file;
    
    if (!productId || !file) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Thiếu thông tin cần thiết'
      });
    }
    
    const result = await PrescriptionService.uploadPrescription(productId, file, req.user.id);
    
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
    const productId = req.params.productId;
    
    if (!productId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'ID sản phẩm là bắt buộc'
      });
    }
    
    const result = await PrescriptionService.getPrescriptionStatus(productId);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};

const getAllPrescriptions = async (status, page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = status ? { status } : {};
      
      const options = {
        populate: [
          { path: 'user', select: 'name email phone' },
          { path: 'products', select: 'name image price' },
          { path: 'order', select: 'orderItems totalPrice' },
          { path: 'verifiedBy', select: 'name email' }
        ],
        limit: Number(limit),
        skip: Number(page) * Number(limit),
        sort: { createdAt: -1 }
      };
      
      const totalCount = await Prescription.countDocuments(query);
      const prescriptions = await Prescription.find(query, null, options);
      
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: prescriptions,
        total: totalCount,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalCount / limit)
      });
    } catch (error) {
      reject(error);
    }
  });
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

const getUserPrescriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'User ID là bắt buộc'
      });
    }
    
    const result = await PrescriptionService.getUserPrescriptions(userId);
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: 'ERR',
      message: error.message
    });
  }
};
const getProductPrescription = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;
    
    if (!productId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'Product ID is required'
      });
    }
    
    const result = await PrescriptionService.getProductPrescription(productId, userId);
    
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
  verifyPrescription,
  getUserPrescriptions,
  getProductPrescription
};