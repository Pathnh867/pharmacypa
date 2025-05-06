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
            const { name, requiresPrescription = false, description = '' } = newType;
            const checkType = await Type.findOne({ name })
            if (checkType) {
                resolve({
                    status: 'OK',
                    message: 'Loại sản phẩm đã tồn tại',
                    data: checkType
                });
                return;
            }
            
            const createdType = await Type.create({ 
                name, 
                requiresPrescription, 
                description 
            });
            
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

const updateType = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkType = await Type.findById(id);
            if (!checkType) {
                resolve({
                    status: 'ERR',
                    message: 'Loại sản phẩm không tồn tại!'
                });
                return;
            }
            
            const updatedType = await Type.findByIdAndUpdate(id, data, { new: true });
            
            resolve({
                status: 'OK',
                message: 'Cập nhật loại sản phẩm thành công',
                data: updatedType
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

const getTypesByPrescriptionStatus = (requiresPrescription = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            const types = await Type.find({ requiresPrescription });
            resolve({
                status: 'OK',
                message: 'Success',
                data: types
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllType,
    createType,
    findTypeByName,
    updateType,
    getTypesByPrescriptionStatus
};