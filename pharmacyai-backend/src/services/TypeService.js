const Type = require("../models/TypeModel")

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await Type.find({})
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType
            });
        } catch (e) {
            reject(e);
        }
    });
};

const createType = (newType) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { name } = newType;
            const checkType = await Type.findOne({ name })
            if (checkType) {
                resolve({
                    status: 'OK',
                    message: 'Loại sản phẩm đã tồn tại',
                    data: checkType
                });
                return;
            }
            
            const createdType = await Type.create({ name });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: createdType
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllType,
    createType
};