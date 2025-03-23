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