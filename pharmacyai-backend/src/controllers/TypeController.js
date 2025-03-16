const TypeService = require('../services/TypeService');

const createType = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Tên loại sản phẩm là bắt buộc'
            });
        }
        const response = await TypeService.createType(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

const getAllType = async (req, res) => {
    try {
        const response = await TypeService.getAllType();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e
        });
    }
};

module.exports = {
    createType,
    getAllType
};