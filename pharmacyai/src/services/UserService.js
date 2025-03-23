import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const axiosJWT = axios.create({
    withCredentials: true, // Đặt mặc định để tất cả request gửi cookie
});

// Interceptor cho request
axiosJWT.interceptors.request.use(
    async (config) => {
        try {
            const currentDate = new Date();
            // Lấy access token từ localStorage
            const tokenStorage = localStorage.getItem('access_token');
            const refreshTokenStorage = localStorage.getItem('refresh_token');
            
            if (!tokenStorage || !refreshTokenStorage) {
                console.log('Không tìm thấy token, cần đăng nhập lại');
                // Redirect tới trang đăng nhập nếu cần
                // window.location.href = '/sign-in';
                return config;
            }
            
            const accessToken = JSON.parse(tokenStorage);
            
            // Giải mã token để kiểm tra thời gian hết hạn
            const decodedToken = jwtDecode(accessToken);
            
            // Kiểm tra nếu token đã hết hạn (trừ 30 giây để đảm bảo)
            if (decodedToken.exp * 1000 < currentDate.getTime() - 30000) {
                console.log('Token hết hạn, đang refresh token...');
                
                // Gọi API refresh token
                const refreshToken = JSON.parse(refreshTokenStorage);
                const refreshResponse = await refreshTokenApi(refreshToken);
                
                if (refreshResponse?.status === 'OK' && refreshResponse?.access_token) {
                    // Cập nhật token mới vào localStorage
                    localStorage.setItem('access_token', JSON.stringify(refreshResponse.access_token));
                    
                    // Cập nhật token trong header của request hiện tại
                    config.headers.token = `Bearer ${refreshResponse.access_token}`;
                    console.log('Đã refresh token thành công');
                } else {
                    console.error('Refresh token thất bại:', refreshResponse);
                    // Có thể thêm xử lý đăng xuất tại đây nếu refresh token cũng hết hạn
                }
            } else {
                // Token vẫn còn hạn, sử dụng bình thường
                config.headers.token = `Bearer ${accessToken}`;
            }
            
            return config;
        } catch (error) {
            console.error('Error in request interceptor:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho response để xử lý các mã lỗi
axiosJWT.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Kiểm tra nếu là lỗi 401 và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = JSON.parse(localStorage.getItem('refresh_token'));
                if (!refreshToken) {
                    // Redirect tới trang đăng nhập nếu không có refresh token
                    window.location.href = '/sign-in';
                    return Promise.reject(error);
                }
                
                // Gọi API để refresh token
                const refreshResponse = await refreshTokenApi(refreshToken);
                
                if (refreshResponse?.status === 'OK' && refreshResponse?.access_token) {
                    // Lưu token mới vào localStorage
                    localStorage.setItem('access_token', JSON.stringify(refreshResponse.access_token));
                    
                    // Cập nhật token trong request ban đầu và gửi lại
                    originalRequest.headers.token = `Bearer ${refreshResponse.access_token}`;
                    return axiosJWT(originalRequest);
                } else {
                    // Nếu refresh token cũng hết hạn, đăng xuất
                    console.error('Refresh token không hợp lệ, đăng xuất...');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/sign-in';
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('Lỗi khi refresh token:', refreshError);
                // Đăng xuất và chuyển hướng đến trang đăng nhập
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/sign-in';
                return Promise.reject(error);
            }
        }
        
        return Promise.reject(error);
    }
);

// Hàm gọi API refresh token
const refreshTokenApi = async (refreshToken) => {
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/refresh-token`,
            {}, // Body trống
            {
                headers: {
                    token: `Bearer ${refreshToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

// Auth functions
export const loginUser = async (data) => {
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-in`,
        data,
        { withCredentials: true }
    );
    return res.data;
};

export const signupUser = async (data, token = null) => {
    const config = { withCredentials: true };
    
    // Thêm token vào header nếu có
    if (token) {
        config.headers = { token: `Bearer ${token}` };
    }
    
    const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/sign-up`,
        data,
        config
    );
    return res.data;
};

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details/${id}`, {
        headers: {
             token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const refreshToken = async (refreshToken) => {
    return refreshTokenApi(refreshToken);
};

export const logoutUser = async () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
    return res.data;
};

export const updateUser = async (id, access_token, data) => {
    // Sử dụng axiosJWT với interceptor để tự động refresh token nếu cần
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data, {
        headers: {
             token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
};