const PrescriptionService = require('../services/PrescriptionService')

const uploadPrescription = async (req, res) => {
    try {
        const { productId, prescriptionImage } = req.body
        const userId = req.user.id
        
        if (!productId || !prescriptionImage) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu thông tin sản phẩm hoặc hình ảnh đơn thuốc'
            })
        }
        
        const response = await PrescriptionService.createPrescription({
            user: userId,
            product: productId,
            prescriptionImage
        })
        
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getUserPrescriptions = async (req, res) => {
    try {
        const userId = req.user.id
        const response = await PrescriptionService.getUserPrescriptions(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getPrescriptionDetails = async (req, res) => {
    try {
        const prescriptionId = req.params.id
        const response = await PrescriptionService.getPrescriptionDetails(prescriptionId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updatePrescriptionStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status, note } = req.body
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Trạng thái không hợp lệ'
            })
        }
        
        const response = await PrescriptionService.updatePrescriptionStatus(id, status, note)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllPrescriptions = async (req, res) => {
    try {
        let { limit, page, sort, filter } = req.query
        const response = await PrescriptionService.getAllPrescriptions(
            Number(limit) || null, 
            Number(page) || 0,
            sort,
            filter
        )
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    uploadPrescription,
    getUserPrescriptions,
    getPrescriptionDetails,
    updatePrescriptionStatus,
    getAllPrescriptions
}