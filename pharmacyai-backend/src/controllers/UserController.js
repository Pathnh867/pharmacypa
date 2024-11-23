const UserService = require('../services/UserService')
const JWTService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!name || !email || !password || !confirmPassword || !phone) {
            return res.status(400).json({
                status: 'ERR',
                message:'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message:'Email không hợp lệ'
            })
        } else if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'ERR',
                message:'Mật khẩu và xác nhận mật khẩu không khớp'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email và mật khẩu là bắt buộc'
            })
        }

        // Kiểm tra email hợp lệ
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!isCheckEmail) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Email không hợp lệ'
            })
        }

        // Gọi service login
        const response = await UserService.loginUser({
            email,
            password
        })
        
        return res.status(200).json(response)
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
        const token = req.headers.token.split(' ')[1]
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

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
}