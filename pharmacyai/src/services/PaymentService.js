import axios from "axios";

export const getConfig = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`);
    return res.data;
};

export const createMomoPayment = async (data) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/payment/momo/create`, data);
        return res.data;
    } catch (error) {
        console.error('Error creating MoMo payment:', error);
        throw error;
    }
};