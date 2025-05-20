// pharmacyai/src/services/PrescriptionService.js

import axios from "axios";
import { axiosJWT } from "./UserService";
import { message } from 'antd';
import { jwtDecode } from "jwt-decode";

// Hàm refresh token và lấy token mới
export const refreshAndGetToken = async () => {
  try {
    const tokenStorage = localStorage.getItem('access_token');
    const refreshTokenStorage = localStorage.getItem('refresh_token');
    
    if (!tokenStorage || !refreshTokenStorage) {
      console.error('No tokens found in storage');
      return null;
    }
    
    let accessToken;
    let refreshToken;
    
    try {
      accessToken = JSON.parse(tokenStorage);
      refreshToken = JSON.parse(refreshTokenStorage);
    } catch (e) {
      console.error('Error parsing tokens from storage:', e);
      accessToken = tokenStorage;
      refreshToken = refreshTokenStorage;
    }
    
    // Kiểm tra token hết hạn
    try {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      
      // Nếu token còn hạn dùng thì trả về luôn
      if (decodedToken.exp > currentTime + 60) { // Thêm 60s buffer
        return accessToken;
      }
      
      // Nếu token sắp hết hạn hoặc đã hết hạn, refresh token
      console.log('Token expired or about to expire, refreshing...');
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/refresh-token`,
        {}, // Body trống
        {
          headers: {
            token: `Bearer ${refreshToken}`
          }
        }
      );
      
      if (response?.data?.status === 'OK' && response?.data?.access_token) {
        // Cập nhật token mới
        localStorage.setItem('access_token', JSON.stringify(response.data.access_token));
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh_token));
        }
        
        console.log('Token refreshed successfully');
        return response.data.access_token;
      } else {
        throw new Error('Failed to refresh token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in refreshAndGetToken:', error);
    return null;
  }
};

// Lấy tất cả sản phẩm theo trạng thái kê đơn
export const getProductsByPrescriptionStatus = async (requiresPrescription = false, page = 0, limit = 10) => {
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

// Tải lên đơn thuốc cho sản phẩm
export const uploadPrescription = async (productId, formData, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    console.log(`Đang gửi đơn thuốc đến API: /api/prescription/${productId}/upload`);
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/${productId}/upload`;
    
    const res = await axiosJWT.post(url, formData, {
      headers: {
        'token': `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error uploading prescription:', error);
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
    
    let url = `${process.env.REACT_APP_API_URL}/prescription/admin/list`;
    
    // Thêm tham số query đúng cách
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status) {
      params.append('status', status);
    }
    
    // Gọi API với params thay vì thêm vào URL
    const res = await axiosJWT.get(`${url}?${params.toString()}`, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    console.log('API response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching all prescriptions:', error);
    // Trả về đối tượng lỗi thay vì throw lỗi
    return {
      status: 'ERR',
      message: error.message || 'Không thể tải danh sách đơn thuốc'
    };
  }
};

// Xác minh đơn thuốc (chỉ admin)
export const verifyPrescription = async (prescriptionId, status, notes, access_token) => {
  try {
    // Đảm bảo token hợp lệ
    let token = access_token;
    try {
      // Thử refresh token trước khi gửi request
      token = await refreshAndGetToken() || access_token;
    } catch (tokenError) {
      console.warn('Could not refresh token, using existing token');
    }
    
    if (!token) {
      throw new Error('Không có token xác thực');
    }
    
    console.log('Verifying prescription with token:', token ? 'Token exists' : 'No token');
    
    if (!prescriptionId) {
      throw new Error('Thiếu ID đơn thuốc');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/${prescriptionId}/verify`;
    
    console.log('Request data:', { status, notes });
    
    const res = await axiosJWT.post(url, { status, notes }, {
      headers: {
        'token': `Bearer ${token}`
      }
    });
    
    console.log('Verify prescription response:', res.data);
    return res.data;
  } catch (error) {
    // Xử lý lỗi cụ thể từ API
    if (error.response?.status === 401 && error.response.data?.tokenExpired) {
      // Token đã hết hạn và không thể refresh
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      // Có thể redirect đến trang đăng nhập
      setTimeout(() => {
        window.location.href = '/sign-in';
      }, 2000);
    }
    
    console.error('Error verifying prescription:', error);
    return {
      status: 'ERR',
      message: error.response?.data?.message || error.message || 'Không thể xác minh đơn thuốc'
    };
  }
};

// Kiểm tra trạng thái đơn thuốc
export const checkPrescriptionStatus = async (productId, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/${productId}/status`;
    
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

// Lấy danh sách đơn thuốc của người dùng
export const getUserPrescriptions = async (access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/user-prescriptions`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error fetching user prescriptions:', error);
    throw error;
  }
};

// Lấy đơn thuốc cho một sản phẩm cụ thể của người dùng
export const getProductPrescription = async (productId, access_token) => {
  try {
    if (!access_token) {
      throw new Error('Không có token xác thực');
    }
    
    const url = `${process.env.REACT_APP_API_URL}/prescription/product/${productId}/prescription`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        'token': `Bearer ${access_token}`
      }
    });
    
    return res.data;
  } catch (error) {
    console.error('Error fetching product prescription:', error);
    throw error;
  }
};

export default {
  getProductsByPrescriptionStatus,
  getTypesByPrescriptionStatus,
  uploadPrescription,
  verifyPrescription,
  checkPrescriptionStatus,
  getAllPrescriptions,
  getUserPrescriptions,
  getProductPrescription
};