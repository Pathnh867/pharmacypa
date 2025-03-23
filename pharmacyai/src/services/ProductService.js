import axios from "axios"
import { axiosJWT } from "./UserService"

export const getAllProduct = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?limit=${limit}`)
    }
    return res.data
}

export const getProductType = async (type, page, limit) => {
    if (!type) return null;
    
    console.log(`Getting products for type: ${type}, page: ${page}, limit: ${limit}`);
    
    try {
        // Xác định cách xử lý dựa trên loại của type
        const isMongoId = typeof type === 'string' && /^[0-9a-fA-F]{24}$/.test(type);
        const typeName = typeof type === 'object' ? (type.name || '') : String(type);
        
        if (isMongoId) {
            console.log('Using MongoDB ID query');
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`);
            return res.data;
        } else {
            console.log('Using type name query:', typeName);
            const encodedTypeName = encodeURIComponent(typeName);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-by-type-name?typeName=${encodedTypeName}&page=${page}&limit=${limit}`);
            return res.data;
        }
    } catch (error) {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        throw error;
    }
};

// Thêm hàm mới để test endpoint trực tiếp
export const testTypeEndpoint = async (typeName) => {
    try {
        const encodedTypeName = encodeURIComponent(typeName);
        console.log(`Testing endpoint with type: ${encodedTypeName}`);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-by-type-name?typeName=${encodedTypeName}`);
        console.log('Response:', res.data);
        return res.data;
    } catch (error) {
        console.error('Test endpoint error:', error);
        throw error;
    }
};

export const createProduct = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
    return res.data
}
export const getDetailsProduct = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/details/${id}`)
    return res.data
}
export const updateProduct = async (id, access_token,data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update/${id}`, data, {
        headers: {
             token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const deleteProduct = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete/${id}`,{
        headers: {
             token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getAllTypeProduct = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/type/get-all`)
    console.log("API response for types:", res.data);
    return res.data
}

export const createType = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/type/create`, data)
    return res.data
}
export const getProductByName = async (typeName, page, limit) => {
    console.log(`Searching products by type name: ${typeName}, page ${page}, limit ${limit}`);
    try {
        // Dùng query khác để lọc theo tên loại
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-by-type-name?typeName=${encodeURIComponent(typeName)}&page=${page || 0}&limit=${limit || 10}`);
        return res.data;
    } catch (error) {
        console.error('Error fetching products by type name:', error);
        throw error;
    }
}