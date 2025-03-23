const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware cho ADMIN - chỉ admin mới có thể truy cập
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực',
                status: 'ERROR'
            });
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                console.log('JWT verification error:', err.name, err.message);
                return res.status(401).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    status: 'ERROR'
                });
            }
            // Lưu thông tin người dùng vào request
            req.user = user;
            
            if (user?.isAdmin) {
                next();
            } else {
                return res.status(403).json({
                    message: 'Bạn không có quyền truy cập',
                    status: 'ERROR'
                });
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Lỗi xác thực',
            status: 'ERROR'
        });
    }
};

// Middleware để xác thực người dùng và kiểm tra quyền sở hữu (dùng cho routes có params ID)
const authUserMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1];
        const userId = req.params.id;
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực',
                status: 'ERROR'
            });
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                console.log('JWT verification error:', err.name, err.message);
                return res.status(401).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    status: 'ERROR'
                });
            }
            
            // Lưu thông tin người dùng vào request
            req.user = user;
            
            // Nếu không có userId trong params, cho phép tiếp tục
            if (!userId) {
                return next();
            }
            
            // Cho phép admin hoặc chính người dùng đó
            if (user?.isAdmin || String(user?.id) === String(userId)) {
                next();
            } else {
                return res.status(403).json({
                    message: 'Bạn không có quyền thực hiện hành động này',
                    status: 'ERROR'
                });
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Lỗi xác thực',
            status: 'ERROR'
        });
    }
};

// Middleware chỉ xác thực nguời dùng đã đăng nhập (sử dụng cho các API Address)
const authAddressMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực',
                status: 'ERROR'
            });
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                console.log('JWT verification error:', err.name, err.message);
                return res.status(401).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    status: 'ERROR'
                });
            }
            
            // Lưu thông tin người dùng vào request
            req.user = user;
            
            // Bất kỳ người dùng nào đã đăng nhập đều có thể truy cập
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Lỗi xác thực',
            status: 'ERROR'
        });
    }
};

module.exports = {
    authMiddleware,
    authUserMiddleware,
    authAddressMiddleware
};