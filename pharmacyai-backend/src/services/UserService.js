const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The email is already!'
                })
                return;
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            });
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdUser
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
            const checkUser = await User.findOne({ email })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not defined!'
                })
                return;
            }
            
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'The password or user is wrong!'
                })
                return;
            }

            const access_token = await generalAccessToken({
                id: checkUser.id,
                email: checkUser.email,
                isAdmin: checkUser.isAdmin
            })
            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                email: checkUser.email,
                isAdmin: checkUser.isAdmin
            })


            console.log('User info:', {
                id: checkUser.id,
                email: checkUser.email,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                access_token,
                refresh_token,
                isAdmin: checkUser.isAdmin
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateUser = (id, data) => {
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
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })

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
//  Chuong 1 5 cau
//Chuong 2 3 moi chuong 6 cau
// Chuong 4 5 moi chuong 4 cau