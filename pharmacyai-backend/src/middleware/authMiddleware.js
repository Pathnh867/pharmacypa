const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực',
                status: 'ERROR'
            })
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                console.log('JWT verification error:', err.name, err.message);
                return res.status(401).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    status: 'ERROR'
                })
            }
            // Lưu thông tin người dùng vào request
            req.user = user;
            
            if (user?.isAdmin) {
                next()
            } else {
                return res.status(403).json({
                    message: 'Bạn không có quyền truy cập',
                    status: 'ERROR'
                })
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Lỗi xác thực',
            status: 'ERROR'
        })
    }
}

const authUserMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token?.split(' ')[1]
        const userId = req.params.id
        
        if (!token) {
            return res.status(401).json({
                message: 'Không tìm thấy token xác thực',
                status: 'ERROR'
            })
        }
        
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
            if (err) {
                console.log('JWT verification error:', err.name, err.message);
                return res.status(401).json({
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    status: 'ERROR'
                })
            }
            
            // Lưu thông tin người dùng vào request
            req.user = user;
            
            // Chuyển đổi các ID thành chuỗi để so sánh chính xác
            const userIdString = String(userId);
            const jwtUserIdString = String(user?.id);
            
            console.log('JWT user.id:', jwtUserIdString);
            console.log('Request userId:', userIdString);
            
            // Cho phép nếu là admin hoặc chính người dùng đó
            if (user?.isAdmin || jwtUserIdString === userIdString) {
                next()
            } else {
                return res.status(403).json({
                    message: 'Bạn không có quyền thực hiện hành động này',
                    status: 'ERROR'
                })
            }
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            message: 'Lỗi xác thực',
            status: 'ERROR'
        })
    }
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}