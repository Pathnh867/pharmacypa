const AddressService = require('../services/AddressService');

// Tạo địa chỉ mới
const createAddress = async (req, res) => {
    try {
        // Lấy user ID từ token (xử lý trong middleware)
        const userId = req.user.id;
        
        // Lấy thông tin địa chỉ từ request
        const { fullName, phone, address, city, isDefault, label } = req.body;
        
        // Validate dữ liệu đầu vào
        if (!fullName || !phone || !address || !city) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Vui lòng cung cấp đầy đủ thông tin địa chỉ'
            });
        }
        
        // Tạo object địa chỉ
        const addressData = {
            userId,
            fullName,
            phone,
            address,
            city,
            isDefault: isDefault || false,
            label: label || 'Nhà'
        };
        
        // Gọi service để tạo địa chỉ
        const response = await AddressService.createAddress(addressData);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in createAddress:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Lỗi server'
        });
    }
};

// Lấy tất cả địa chỉ của người dùng
const getAllAddresses = async (req, res) => {
    try {
        // Lấy user ID từ token
        const userId = req.user.id;
        
        // Gọi service
        const response = await AddressService.getAddressesByUserId(userId);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in getAllAddresses:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Lỗi server'
        });
    }
};

// Cập nhật địa chỉ
const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        const updates = req.body;
        
        if (!addressId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID địa chỉ là bắt buộc'
            });
        }
        
        // Gọi service
        const response = await AddressService.updateAddress(addressId, userId, updates);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in updateAddress:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Lỗi server'
        });
    }
};

// Xóa địa chỉ
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        
        if (!addressId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID địa chỉ là bắt buộc'
            });
        }
        
        // Gọi service
        const response = await AddressService.deleteAddress(addressId, userId);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in deleteAddress:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Lỗi server'
        });
    }
};

// Đặt địa chỉ mặc định
const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.id;
        
        if (!addressId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ID địa chỉ là bắt buộc'
            });
        }
        
        // Gọi service
        const response = await AddressService.setDefaultAddress(addressId, userId);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error in setDefaultAddress:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Lỗi server'
        });
    }
};

module.exports = {
    createAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};