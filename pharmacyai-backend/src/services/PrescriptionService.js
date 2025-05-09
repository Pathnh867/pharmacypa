// pharmacyai-backend/src/services/PrescriptionService.js
const Prescription = require('../models/PrescriptionModel');
const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

// Hàm tải lên đơn thuốc
const uploadPrescription = async (orderId, file, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Đang xử lý đơn thuốc cho orderId: ${orderId}`);
      console.log('File đã nhận:', file);
      
      // Kiểm tra đơn hàng tồn tại
      const order = await Order.findById(orderId);
      if (!order) {
        console.error(`Không tìm thấy đơn hàng với ID: ${orderId}`);
        reject(new Error('Đơn hàng không tồn tại'));
        return;
      }
      
      // Lấy thông tin từ file đã được xử lý bởi multer
      if (!file) {
        console.error('Không có file được tải lên');
        reject(new Error('Không tìm thấy file đơn thuốc'));
        return;
      }
      
      // Kiểm tra sản phẩm trong đơn hàng có yêu cầu đơn thuốc không
      const prescriptionProductIds = [];
      
      // Nếu không có orderItems, đây là một sản phẩm đơn lẻ
      if (!order.orderItems || order.orderItems.length === 0) {
        // Kiểm tra sản phẩm này có yêu cầu đơn thuốc không
        console.log('Sản phẩm đơn lẻ, đang kiểm tra yêu cầu đơn thuốc');
        const product = await Product.findById(orderId);
        if (product && product.requiresPrescription) {
          prescriptionProductIds.push(product._id);
        }
      } else {
        // Trường hợp đơn hàng bình thường
        console.log('Đơn hàng có', order.orderItems.length, 'sản phẩm, đang kiểm tra đơn thuốc');
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          if (product && product.requiresPrescription) {
            prescriptionProductIds.push(product._id);
          }
        }
      }
      
      console.log('Sản phẩm yêu cầu đơn thuốc:', prescriptionProductIds);
      
      if (prescriptionProductIds.length === 0) {
        reject(new Error('Đơn hàng không có sản phẩm yêu cầu đơn thuốc'));
        return;
      }
      
      // Tạo đường dẫn tương đối cho file
      const fileUrl = `/uploads/prescriptions/${file.filename}`;
      console.log('File URL:', fileUrl);
      
      // Tạo bản ghi đơn thuốc mới
      const prescription = await Prescription.create({
        order: orderId,
        user: userId,
        products: prescriptionProductIds,
        imageUrl: fileUrl,
        status: 'pending',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày
      });
      
      console.log('Đơn thuốc đã được tạo:', prescription._id);
      
      // Cập nhật đơn hàng với ID đơn thuốc
      await Order.findByIdAndUpdate(orderId, { 
        prescription: prescription._id,
        prescriptionStatus: 'pending'
      });
      
      resolve({
        status: 'OK',
        message: 'Tải lên đơn thuốc thành công',
        data: prescription
      });
    } catch (error) {
      console.error('Error in uploadPrescription service:', error);
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

// Hàm lấy danh sách đơn thuốc (cho admin)
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

// Hàm xác minh đơn thuốc (cho admin)
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