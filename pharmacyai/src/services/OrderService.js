// Cập nhật hoặc tạo mới OrderService trong pharmacyai/src/services/OrderService.js

import { axiosJWT } from "./UserService"

export const createOrder = async (access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
             token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getOrderStatus = async (orderId, access_token) => {
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/details/${orderId}`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching order status:", error);
        throw error;
    }
}

// Lấy danh sách đơn hàng của người dùng
export const getUserOrders = async (access_token) => {
    try {
        const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/user-orders`, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error;
    }
}

// Hủy đơn hàng
export const cancelOrder = async (orderId, reason, access_token) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/cancel/${orderId}`, 
            { reason }, 
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error cancelling order:", error);
        throw error;
    }
}

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (access_token, limit = 10, page = 0, sort = null) => {
    try {
        let url = `${process.env.REACT_APP_API_URL}/order/all?limit=${limit}&page=${page}`;
        
        if (sort) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        
        const res = await axiosJWT.get(url, {
            headers: {
                token: `Bearer ${access_token}`,
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error;
    }
}

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status, note, access_token) => {
    try {
        const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/order/status/${orderId}`, 
            { status, note }, 
            {
                headers: {
                    token: `Bearer ${access_token}`,
                }
            }
        );
        return res.data;
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
    }
}