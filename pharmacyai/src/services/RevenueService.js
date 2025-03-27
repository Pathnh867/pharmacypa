// pharmacyai/src/services/RevenueService.js
import { axiosJWT } from "./UserService";
import moment from 'moment';

// Lấy thống kê doanh thu
export const getRevenueStats = async (access_token, startDate, endDate) => {
  try {
    // Format dates
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    
    const url = `${process.env.REACT_APP_API_URL}/stats/stats?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        token: `Bearer ${access_token}`,
      }
    });
    
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê doanh thu:", error);
    throw error;
  }
};

// Lấy thống kê doanh thu theo sản phẩm
export const getProductRevenueStats = async (access_token, startDate, endDate, limit = 10) => {
  try {
    // Format dates
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    
    const url = `${process.env.REACT_APP_API_URL}/stats/product-stats?startDate=${formattedStartDate}&endDate=${formattedEndDate}&limit=${limit}`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        token: `Bearer ${access_token}`,
      }
    });
    
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê doanh thu theo sản phẩm:", error);
    throw error;
  }
};

// Lấy thống kê doanh thu theo danh mục
export const getCategoryRevenueStats = async (access_token, startDate, endDate) => {
  try {
    // Format dates
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    
    const url = `${process.env.REACT_APP_API_URL}/stats/category-stats?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        token: `Bearer ${access_token}`,
      }
    });
    
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê doanh thu theo danh mục:", error);
    throw error;
  }
};

// Xuất dữ liệu ra Excel
export const exportRevenueToExcel = async (access_token, startDate, endDate, reportType = 'all') => {
  try {
    // Format dates
    const formattedStartDate = startDate.format('YYYY-MM-DD');
    const formattedEndDate = endDate.format('YYYY-MM-DD');
    
    const url = `${process.env.REACT_APP_API_URL}/stats/export-excel?startDate=${formattedStartDate}&endDate=${formattedEndDate}&reportType=${reportType}`;
    
    const res = await axiosJWT.get(url, {
      headers: {
        token: `Bearer ${access_token}`,
      }
    });
    
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xuất dữ liệu ra Excel:", error);
    throw error;
  }
};

// Tải file Excel
export const downloadExcelFile = (access_token, fileName) => {
  const url = `${process.env.REACT_APP_API_URL}/stats/download/${fileName}`;
  
  // Tạo link tạm thời để tải file
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  
  // Thêm token vào URL
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('token', `Bearer ${access_token}`);
  xhr.responseType = 'blob';
  
  xhr.onload = function() {
    const blob = xhr.response;
    const objectUrl = window.URL.createObjectURL(blob);
    link.href = objectUrl;
    
    // Tự động nhấp vào link để tải file
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    }, 100);
  };
  
  xhr.send();
};

// Cập nhật hàm xuất Excel trong RevenueManagement.jsx
export const handleExportExcel = async (access_token, startDate, endDate, reportType) => {
  try {
    // Gọi API để tạo file Excel
    const response = await exportRevenueToExcel(access_token, startDate, endDate, reportType);
    
    if (response.status === 'OK' && response.data?.fileName) {
      // Tải file Excel
      downloadExcelFile(access_token, response.data.fileName);
      return {
        success: true,
        message: 'Xuất báo cáo thành công'
      };
    } else {
      return {
        success: false,
        message: response.message || 'Không thể xuất báo cáo'
      };
    }
  } catch (error) {
    console.error('Lỗi khi xuất báo cáo:', error);
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi xuất báo cáo'
    };
  }
};