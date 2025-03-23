import axios from "axios";
import { axiosJWT } from "./UserService";

const BASE_URL = `${process.env.REACT_APP_API_URL}/address`;

// Lấy tất cả địa chỉ của người dùng
export const getAllAddresses = async (access_token) => {
    try {
        const res = await axiosJWT.get(`${BASE_URL}/get-all`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching addresses:", error);
        throw error;
    }
};

// Tạo địa chỉ mới
export const createAddress = async (access_token, data) => {
    try {
        const res = await axiosJWT.post(`${BASE_URL}/create`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error creating address:", error);
        throw error;
    }
};

// Cập nhật địa chỉ
export const updateAddress = async (access_token, addressId, data) => {
    try {
        const res = await axiosJWT.put(`${BASE_URL}/update/${addressId}`, data, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error updating address:", error);
        throw error;
    }
};

// Xóa địa chỉ
export const deleteAddress = async (access_token, addressId) => {
    try {
        const res = await axiosJWT.delete(`${BASE_URL}/delete/${addressId}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error deleting address:", error);
        throw error;
    }
};

// Đặt địa chỉ mặc định
export const setDefaultAddress = async (access_token, addressId) => {
    try {
        const res = await axiosJWT.put(`${BASE_URL}/set-default/${addressId}`, {}, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error setting default address:", error);
        throw error;
    }
};