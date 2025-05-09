// pharmacyai/src/services/PrescriptionService.js

import axios from "axios";
import { axiosJWT } from "./UserService";

// Lấy tất cả sản phẩm theo trạng thái kê đơn
export const getProductsByPrescriptionStatus = async (requiresPrescription = false, page = 0, limit = 10, access_token) => {
  try {
    const status = requiresPrescription ? 'true' : 'false';
    const url = `${process.env.REACT_APP_API_URL}/product/prescription?status=${status}&page=${page}&limit=${limit}`;
    
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('Error fetching products by prescription status:', error);
    throw error;
  }
};

// Lấy tất cả các loại thuốc theo trạng thái kê đơn
export const getTypesByPrescriptionStatus = async (requiresPrescription = false) => {
  try {
    const status = requiresPrescription ? 'true' : 'false';
    const url = `${process.env.REACT_APP_API_URL}/type/prescription/${status}`;
    
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error('Error fetching types by prescription status:', error);
    throw error;
  }
};

// Tải lên đơn thuốc cho đơn hàng
export const uploadPrescription = async (orderId, formData, access_token) => {
    try {
      if (!access_token) {
        throw new Error('Không có token xác thực');
      }
      
      console.log(`Đang gửi đơn thuốc đến API: /api/prescription/${orderId}/upload`);
      
      const url = `${process.env.REACT_APP_API_URL}/prescription/${orderId}/upload`;
      
      const res = await axiosJWT.post(url, formData, {
        headers: {
          'token': `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return res.data;
    } catch (error) {
      console.error('Error uploading prescription:', error);
      // Thêm chi tiết lỗi để debug
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  };

// Lấy tất cả đơn thuốc (cho admin)
export const getAllPrescriptions = async (status, page = 0, limit = 10, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    let url = `${process.env.REACT_APP_API_URL}/prescription/admin/list?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    const res = await axiosJWT.get(url, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    throw error;
  }
};

// Xác minh đơn thuốc (chỉ admin)
export const verifyPrescription = async (prescriptionId, status, notes, adminId, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/${prescriptionId}/verify`;
    
    const res = await axiosJWT.post(url, { status, notes }, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error verifying prescription:', error);
    throw error;
  }
};

// Kiểm tra trạng thái đơn thuốc
export const checkPrescriptionStatus = async (orderId, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/${orderId}/status`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error checking prescription status:', error);
    throw error;
  }
};

export default {
  getProductsByPrescriptionStatus,
  getTypesByPrescriptionStatus,
  uploadPrescription,
  verifyPrescription,
  checkPrescriptionStatus,
  getAllPrescriptions
};