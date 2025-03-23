const Type = require("../models/TypeModel")
const mongoose = require('mongoose');

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
const findTypeByName = async (name) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Sử dụng tìm kiếm không phân biệt chữ hoa/thường
            const typeObj = await Type.findOne({ 
                name: { '$regex': `^${name}$`, '$options': 'i' } 
            });
            console.log('findTypeByName result:', typeObj);
            resolve(typeObj);
        } catch (e) {
            console.error('Error in findTypeByName:', e);
            reject(e);
        }
    });
};
module.exports = {
    getAllType,
    createType,
    findTypeByName
};