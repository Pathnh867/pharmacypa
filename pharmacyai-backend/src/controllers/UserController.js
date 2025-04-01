const UserService = require('../services/UserService')
const JWTService = require('../services/JwtService')

// Sửa phần createUser trong file pharmacyai-backend/src/controllers/UserController.js
const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, phone, address, avatar } = req.body;
        
        // Kiểm tra các trường bắt buộc
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email, mật khẩu và xác nhận mật khẩu là bắt buộc'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không khớp'
            });
        }
        
        // Phân quyền: Kiểm tra xem request có phải từ admin không
        const isAdminRequest = req.headers.token && req.user?.isAdmin;
        
        // Chỉ ghi đè isAdmin thành false nếu KHÔNG phải request từ admin
        // Nếu là request từ admin, giữ nguyên giá trị isAdmin đã gửi lên
        if (!isAdminRequest) {
            req.body.isAdmin = false;
        }
        // Nếu là admin request thì sẽ giữ nguyên giá trị req.body.isAdmin
        
        // Gọi service để tạo người dùng
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log('req.body')
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        console.log(email,password)
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email và mật khẩu là bắt buộc'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        }
        const response = await UserService.loginUser(req.body)
        const {refresh_token, ...newReponse} = response
        // console.log('response',response)
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict',
            path: '/',
        })
        return res.status(200).json({...newReponse, refresh_token})
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
             return res.status(400).json({
                status: 'ERR',
                message:'The token is required'
            })
        }
        const response = await JWTService.refreshTokenJWTService(token)
        return res.status(200).json(response)
        
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        
        return res.status(200).json({
            status: 'OK',
            message:'Logout Successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const createUserByAdmin = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, phone, address, avatar, isAdmin } = req.body;
        
        // Kiểm tra các trường bắt buộc
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(email);
        
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email, mật khẩu và xác nhận mật khẩu là bắt buộc'
            });
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            });
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không khớp'
            });
        }
        
        // Route này được bảo vệ bởi authMiddleware, chỉ admin mới có thể truy cập
        // Nên chúng ta có thể giữ nguyên giá trị isAdmin từ request body
        const userData = {
            email,
            password,
            confirmPassword,
            name,
            phone,
            address,
            avatar,
            isAdmin: !!isAdmin // Chuyển đổi thành boolean để đảm bảo giá trị chính xác
        };
        
        // Gọi service để tạo người dùng
        const response = await UserService.createUser(userData);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};
module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    createUserByAdmin,
}