const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword, name, phone, address, avatar, isAdmin } = newUser;
        try {
            // Kiểm tra email đã tồn tại
            const checkUser = await User.findOne({
                email: email
            });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email này đã được sử dụng!'
                });
                return;
            }
            
            // Kiểm tra mật khẩu khớp
            if (password !== confirmPassword) {
                resolve({
                    status: 'ERR',
                    message: 'Mật khẩu không khớp!'
                });
                return;
            }
            
            // Mã hóa mật khẩu
            const hash = bcrypt.hashSync(password, 10);
            
            // Tạo đối tượng user với các trường bắt buộc và tùy chọn
            const userData = {
                email,
                password: hash,
                isAdmin: isAdmin || false
            };
            
            // Thêm các trường tùy chọn nếu có
            if (name) userData.name = name;
            if (phone) userData.phone = phone;
            if (address) userData.address = address;
            if (avatar) userData.avatar = avatar;
            
            // Tạo user
            const createdUser = await User.create(userData);
            
            if (createdUser) {
                // Tạo tokens
                const access_token = await generalAccessToken({
                    id: createdUser.id,
                    isAdmin: createdUser.isAdmin
                });
                
                const refresh_token = await generalRefreshToken({
                    id: createdUser.id,
                    isAdmin: createdUser.isAdmin
                });
                
                // Chuyển đổi thành object để có thể xóa trường password
                const userObject = createdUser.toObject();
                delete userObject.password;
                
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: {
                        ...userObject,
                        access_token,
                        refresh_token
                    }
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined!'
                })
            }
            
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is wrong!'
                })
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id);
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined!'
                });
                return;
            }
            
            // Nếu không thấy isAdmin trong data, giữ lại giá trị hiện tại
            if (data.isAdmin === undefined) {
                data.isAdmin = checkUser.isAdmin;
            }
            
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined!'
                })
                return;
            }
            
            await User.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete user SUCCESS'
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById({
                _id:id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined!'
                })
                return;
            }
            
            

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,

    
};