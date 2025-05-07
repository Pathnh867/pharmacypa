// pharmacyai-backend/src/services/PrescriptionService.js
const Prescription = require('../models/PrescriptionModel');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

// Hàm tải lên đơn thuốc
const uploadPrescription = async (orderId, file, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra đơn hàng tồn tại
      const order = await Order.findById(orderId);
      if (!order) {
        reject(new Error('Đơn hàng không tồn tại'));
        return;
      }
      
      // Kiểm tra sản phẩm trong đơn hàng có yêu cầu đơn thuốc không
      const prescriptionProductIds = [];
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.requiresPrescription) {
          prescriptionProductIds.push(product._id);
        }
      }
      
      if (prescriptionProductIds.length === 0) {
        reject(new Error('Đơn hàng không có sản phẩm yêu cầu đơn thuốc'));
        return;
      }
      
      // Lưu file đơn thuốc
      const uploadDir = path.join(__dirname, '../../uploads/prescriptions');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const uniqueFileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      
      fs.writeFileSync(filePath, file.buffer);
      
      // Tạo bản ghi đơn thuốc mới
      const prescription = await Prescription.create({
        order: orderId,
        user: userId,
        products: prescriptionProductIds,
        imageUrl: `/uploads/prescriptions/${uniqueFileName}`,
        status: 'pending',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày
      });
      
      // Cập nhật đơn hàng với ID đơn thuốc
      await Order.findByIdAndUpdate(orderId, { prescription: prescription._id });
      
      resolve({
        status: 'OK',
        message: 'Tải lên đơn thuốc thành công',
        data: prescription
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm lấy trạng thái đơn thuốc
const getPrescriptionStatus = async (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prescription = await Prescription.findOne({ order: orderId })
        .populate('verifiedBy', 'name email')
        .populate('products', 'name');
      
      if (!prescription) {
        resolve({
          status: 'OK',
          message: 'Đơn hàng chưa có đơn thuốc',
          data: null
        });
        return;
      }
      
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: prescription
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Hàm lấy danh sách đơn thuốc
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

// Hàm xác minh đơn thuốc
const verifyPrescription = async (prescriptionId, status, notes, adminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prescription = await Prescription.findById(prescriptionId);
      
      if (!prescription) {
        reject(new Error('Đơn thuốc không tồn tại'));
        return;
      }
      
      prescription.status = status;
      prescription.notes = notes;
      prescription.verifiedBy = adminId;
      prescription.verifiedAt = new Date();
      
      if (status === 'rejected') {
        prescription.rejectReason = notes;
      }
      
      await prescription.save();
      
      // Nếu đơn thuốc được phê duyệt, cập nhật đơn hàng có thể thanh toán
      if (status === 'approved') {
        await Order.findByIdAndUpdate(prescription.order, { 
          prescriptionVerified: true 
        });
      }
      
      resolve({
        status: 'OK',
        message: `Đơn thuốc đã được ${status === 'approved' ? 'phê duyệt' : 'từ chối'}`,
        data: prescription
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  uploadPrescription,
  getPrescriptionStatus,
  getAllPrescriptions,
  verifyPrescription
};