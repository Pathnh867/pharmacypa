const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generalAccessToken = async (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30m' }) // Tăng thời gian từ 10m lên 30m
    return access_token
}

const generalRefreshToken = async (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

const refreshTokenJWTService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log('JWT refresh error:', err);
                    resolve({
                        status: 'ERR',
                        message: 'Token xác thực không hợp lệ'
                    })
                    return;
                }
                
                // Tạo access token mới
                const access_token = await generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                });
            })   
        } catch (e) {
            console.error('refreshTokenJWTService error:', e);
            reject(e);
        }
    });
}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenJWTService
}