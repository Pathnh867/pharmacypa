// pharmacyai-backend/src/services/PrescriptionService.js
const Prescription = require('../models/PrescriptionModel');
const Order = require('../models/OrderProduct');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

// Hàm tải lên đơn thuốc
const uploadPrescription = async (productId, file, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Đang xử lý đơn thuốc cho sản phẩm ID: ${productId}`);
      console.log('File đã nhận:', file);
      
      // Kiểm tra sản phẩm tồn tại và yêu cầu đơn thuốc
      const product = await Product.findById(productId);
      if (!product) {
        console.error(`Không tìm thấy sản phẩm với ID: ${productId}`);
        reject(new Error('Sản phẩm không tồn tại'));
        return;
      }
      
      if (!product.requiresPrescription) {
        console.error(`Sản phẩm này không yêu cầu đơn thuốc: ${productId}`);
        reject(new Error('Sản phẩm này không yêu cầu đơn thuốc'));
        return;
      }
      
      // Kiểm tra file
      if (!file) {
        console.error('Không có file được tải lên');
        reject(new Error('Không tìm thấy file đơn thuốc'));
        return;
      }
      
      // Tạo đường dẫn tương đối cho file
      const fileUrl = `/uploads/prescriptions/${file.filename}`;
      console.log('File URL:', fileUrl);
      
      // Tạo đơn thuốc tạm thời cho sản phẩm này
      // Lưu ý: Chúng ta sẽ liên kết đơn thuốc với đơn hàng sau khi người dùng đặt hàng
      const prescription = await Prescription.create({
        product: productId,
        user: userId,
        imageUrl: fileUrl,
        status: 'pending',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 ngày
      });
      
      console.log('Đơn thuốc đã được tạo:', prescription._id);
      
      // Cập nhật sản phẩm với thông tin đơn thuốc
      product.pendingPrescription = prescription._id;
      await product.save();
      
      resolve({
        status: 'OK',
        message: 'Tải lên đơn thuốc thành công',
        data: {
          prescriptionId: prescription._id,
          status: 'pending'
        }
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
      const prescription = await Prescription.findById(prescriptionId)
        .populate('user')
        .populate('product');
      
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
      
      // Nếu đơn thuốc được phê duyệt, thêm vào danh sách được phép mua của người dùng
      if (status === 'approved') {
        // Tính ngày hết hạn (ví dụ: 30 ngày kể từ khi duyệt)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Thêm vào danh sách đơn thuốc được phê duyệt của người dùng
        await User.findByIdAndUpdate(
          prescription.user._id,
          {
            $push: {
              approvedPrescriptions: {
                productId: prescription.product._id,
                prescriptionId: prescription._id,
                approvedAt: new Date(),
                expiryDate: expiryDate
              }
            }
          }
        );
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
const getUserPrescriptions = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const prescriptions = await Prescription.find({ user: userId })
        .populate('product')
        .sort({ createdAt: -1 });
      
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: prescriptions
      });
    } catch (error) {
      reject(error);
    }
  });
}; 
const getProductPrescription = async (productId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm đơn thuốc gần nhất của sản phẩm này cho người dùng
      const prescription = await Prescription.findOne({
        product: productId,
        user: userId
      }).sort({ createdAt: -1 });
      
      if (!prescription) {
        resolve({
          status: 'OK',
          message: 'No prescription found for this product',
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

module.exports = {
  uploadPrescription,
  getPrescriptionStatus,
  getAllPrescriptions,
  verifyPrescription,
  getUserPrescriptions,
  getProductPrescription
};