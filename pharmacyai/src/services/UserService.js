import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const axiosJWT = axios.create({
    withCredentials: true, // Đặt mặc định để tất cả request gửi cookie
});

// Interceptor cho request
axiosJWT.interceptors.request.use(
    async (config) => {
        try {
            let currentDate = new Date();
            
            // Kiểm tra nếu đã có token trong header
            if (config.headers.token) {
                console.log('Token already set in headers:', config.headers.token.slice(0, 15) + '...');
                return config;
            }
            
            // Lấy access token từ localStorage
            const tokenStorage = localStorage.getItem('access_token');
            const refreshTokenStorage = localStorage.getItem('refresh_token');
            
            // Debug
            console.log('Token from storage:', tokenStorage ? 'Exists' : 'Not found');
            console.log('Refresh token from storage:', refreshTokenStorage ? 'Exists' : 'Not found');
            
            if (!tokenStorage || !refreshTokenStorage) {
                console.log('Không tìm thấy token, cần đăng nhập lại');
                return config;
            }
            
            let accessToken;
            try {
                accessToken = JSON.parse(tokenStorage);
            } catch (e) {
                console.error('Error parsing access token:', e);
                accessToken = tokenStorage; // Nếu không parse được, dùng trực tiếp
            }
            
            console.log('Parsed access token type:', typeof accessToken);
            
            // Giải mã token để kiểm tra thời gian hết hạn
            try {
                const decodedToken = jwtDecode(accessToken);
                console.log('Token expiry:', new Date(decodedToken.exp * 1000).toISOString());
                
                // Kiểm tra nếu token đã hết hạn (trừ 30 giây để đảm bảo)
                if (decodedToken.exp * 1000 < currentDate.getTime() - 30000) {
                    console.log('Token hết hạn, đang refresh token...');
                    
                    // Gọi API refresh token
                    let refreshToken;
                    try {
                        refreshToken = JSON.parse(refreshTokenStorage);
                    } catch (e) {
                        console.error('Error parsing refresh token:', e);
                        refreshToken = refreshTokenStorage; // Nếu không parse được, dùng trực tiếp
                    }
                    
                    const refreshResponse = await refreshTokenApi(refreshToken);
                    
                    if (refreshResponse?.status === 'OK' && refreshResponse?.access_token) {
                        // Cập nhật token mới vào localStorage
                        localStorage.setItem('access_token', JSON.stringify(refreshResponse.access_token));
                        
                        // Cập nhật token trong header của request hiện tại
                        config.headers.token = `Bearer ${refreshResponse.access_token}`;
                        console.log('Đã refresh token thành công, new token:', refreshResponse.access_token.slice(0, 15) + '...');
                    } else {
                        console.error('Refresh token thất bại:', refreshResponse);
                        // Có thể thêm xử lý đăng xuất tại đây nếu refresh token cũng hết hạn
                    }
                } else {
                    // Token vẫn còn hạn, sử dụng bình thường
                    config.headers.token = `Bearer ${accessToken}`;
                    console.log('Using valid token, expiry in:', Math.floor((decodedToken.exp * 1000 - currentDate.getTime()) / 1000 / 60), 'minutes');
                }
            } catch (e) {
                console.error('Error decoding token:', e);
                // Nếu không decode được token, vẫn gán token vào header
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
            console.log('Intercepting 401 error, attempting token refresh');
            
            try {
                let refreshToken;
                const refreshTokenStorage = localStorage.getItem('refresh_token');
                
                if (!refreshTokenStorage) {
                    console.error('No refresh token found');
                    // Redirect tới trang đăng nhập nếu không có refresh token
                    window.location.href = '/sign-in';
                    return Promise.reject(error);
                }
                
                try {
                    refreshToken = JSON.parse(refreshTokenStorage);
                } catch (e) {
                    console.error('Error parsing refresh token:', e);
                    refreshToken = refreshTokenStorage; // Nếu không parse được, dùng trực tiếp
                }
                
                // Gọi API để refresh token
                const refreshResponse = await refreshTokenApi(refreshToken);
                
                if (refreshResponse?.status === 'OK' && refreshResponse?.access_token) {
                    console.log('Token refreshed successfully');
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
    try {
        const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/sign-in`,
            data,
            { withCredentials: true }
        );
        
        // Lưu token vào localStorage ngay khi đăng nhập thành công
        if (res.data?.status === 'OK') {
            if (res.data.access_token) {
                localStorage.setItem('access_token', JSON.stringify(res.data.access_token));
                console.log('Access token saved to localStorage');
            }
            
            if (res.data.refresh_token) {
                localStorage.setItem('refresh_token', JSON.stringify(res.data.refresh_token));
                console.log('Refresh token saved to localStorage');
            }
        }
        
        return res.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
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
export const refreshAndGetToken = async () => {
    try {
        const tokenStorage = localStorage.getItem('access_token');
        const refreshTokenStorage = localStorage.getItem('refresh_token');
        
        if (!tokenStorage || !refreshTokenStorage) {
            console.error('No tokens found in storage');
            return null;
        }
        
        let accessToken = JSON.parse(tokenStorage);
        let refreshToken = JSON.parse(refreshTokenStorage);
        
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
            const response = await refreshTokenApi(refreshToken);
            
            if (response?.status === 'OK' && response?.access_token) {
                // Cập nhật token mới
                localStorage.setItem('access_token', JSON.stringify(response.access_token));
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token));
                }
                
                console.log('Token refreshed successfully');
                return response.access_token;
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

export const logoutUser = async () => {
    // Xóa token khỏi localStorage khi đăng xuất
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('Tokens removed from localStorage');
    
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
        return res.data;
    } catch (error) {
        console.error('Logout error:', error);
        // Vẫn xóa tokens ngay cả khi API gọi thất bại
        return { status: 'OK', message: 'Logged out client-side' };
    }
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

export const createUser = async (userData, token) => {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/user/sign-up`,
      userData,
      {
        headers: {
          token: `Bearer ${token}`
        }
      }
    );
    return res.data;
};
  
export const createUserByAdmin = async (userData, token) => {
    const res = await axiosJWT.post(
      `${process.env.REACT_APP_API_URL}/user/admin/create-user`,
      userData,
      {
        headers: {
          token: `Bearer ${token}`
        }
      }
    );
    return res.data;
};

export const getUserPrescriptions = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/prescriptions`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};
