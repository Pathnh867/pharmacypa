const Address = require('../models/AddressModel');
const mongoose = require('mongoose');

// Tạo địa chỉ mới
const createAddress = async (addressData) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra xem có đặt địa chỉ này làm mặc định không
            const { isDefault, userId } = addressData;
            
            // Nếu đặt làm mặc định, cập nhật tất cả địa chỉ khác thành không mặc định
            if (isDefault) {
                await Address.updateMany(
                    { userId: userId },
                    { $set: { isDefault: false } }
                );
            }
            
            // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
            const addressCount = await Address.countDocuments({ userId });
            if (addressCount === 0) {
                addressData.isDefault = true;
            }
            
            // Tạo địa chỉ mới
            const newAddress = await Address.create(addressData);
            
            resolve({
                status: 'OK',
                message: 'Tạo địa chỉ thành công',
                data: newAddress
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Lấy địa chỉ theo userId
const getAddressesByUserId = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra userId
            if (!userId) {
                resolve({
                    status: 'ERR',
                    message: 'UserId là bắt buộc'
                });
                return;
            }
            
            // Lấy tất cả địa chỉ của người dùng
            const addresses = await Address.find({ userId }).sort({ isDefault: -1, updatedAt: -1 });
            
            resolve({
                status: 'OK',
                message: 'Lấy danh sách địa chỉ thành công',
                data: addresses
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Cập nhật địa chỉ
const updateAddress = async (addressId, userId, updates) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra addressId
            if (!mongoose.Types.ObjectId.isValid(addressId)) {
                resolve({
                    status: 'ERR',
                    message: 'ID địa chỉ không hợp lệ'
                });
                return;
            }
            
            // Kiểm tra xem địa chỉ có tồn tại và thuộc người dùng này không
            const address = await Address.findOne({ _id: addressId, userId });
            
            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại hoặc không có quyền truy cập'
                });
                return;
            }
            
            // Nếu update đặt địa chỉ làm mặc định
            if (updates.isDefault) {
                await Address.updateMany(
                    { userId, _id: { $ne: addressId } },
                    { $set: { isDefault: false } }
                );
            }
            
            // Cập nhật địa chỉ
            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                updates,
                { new: true }
            );
            
            resolve({
                status: 'OK',
                message: 'Cập nhật địa chỉ thành công',
                data: updatedAddress
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Xóa địa chỉ
const deleteAddress = async (addressId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra addressId
            if (!mongoose.Types.ObjectId.isValid(addressId)) {
                resolve({
                    status: 'ERR',
                    message: 'ID địa chỉ không hợp lệ'
                });
                return;
            }
            
            // Kiểm tra xem địa chỉ có tồn tại và thuộc người dùng này không
            const address = await Address.findOne({ _id: addressId, userId });
            
            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại hoặc không có quyền truy cập'
                });
                return;
            }
            
            // Lưu trữ thông tin về địa chỉ là mặc định hay không
            const wasDefault = address.isDefault;
            
            // Xóa địa chỉ
            await Address.findByIdAndDelete(addressId);
            
            // Nếu địa chỉ bị xóa là mặc định, cập nhật địa chỉ khác thành mặc định
            if (wasDefault) {
                const remainingAddress = await Address.findOne({ userId }).sort({ updatedAt: -1 });
                if (remainingAddress) {
                    await Address.findByIdAndUpdate(remainingAddress._id, { isDefault: true });
                }
            }
            
            resolve({
                status: 'OK',
                message: 'Xóa địa chỉ thành công'
            });
        } catch (error) {
            reject(error);
        }
    });
};

// Đặt địa chỉ mặc định
const setDefaultAddress = async (addressId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra addressId
            if (!mongoose.Types.ObjectId.isValid(addressId)) {
                resolve({
                    status: 'ERR',
                    message: 'ID địa chỉ không hợp lệ'
                });
                return;
            }
            
            // Kiểm tra xem địa chỉ có tồn tại và thuộc người dùng này không
            const address = await Address.findOne({ _id: addressId, userId });
            
            if (!address) {
                resolve({
                    status: 'ERR',
                    message: 'Địa chỉ không tồn tại hoặc không có quyền truy cập'
                });
                return;
            }
            
            // Đặt tất cả địa chỉ khác thành không mặc định
            await Address.updateMany(
                { userId, _id: { $ne: addressId } },
                { $set: { isDefault: false } }
            );
            
            // Đặt địa chỉ này làm mặc định
            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                { isDefault: true },
                { new: true }
            );
            
            resolve({
                status: 'OK',
                message: 'Đặt địa chỉ mặc định thành công',
                data: updatedAddress
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createAddress,
    getAddressesByUserId,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};