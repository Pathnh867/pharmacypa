const Prescription = require("../models/PrescriptionModel")
const Product = require("../models/ProductModel")

const createPrescription = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra sản phẩm có tồn tại và có yêu cầu đơn thuốc không
            const product = await Product.findById(data.product)
            if (!product) {
                resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy sản phẩm'
                })
                return
            }
            
            if (!product.requiresPrescription) {
                resolve({
                    status: 'ERR',
                    message: 'Sản phẩm này không yêu cầu đơn thuốc'
                })
                return
            }
            
            // Kiểm tra người dùng đã có đơn thuốc đang xử lý hoặc đã duyệt chưa
            const existingPrescription = await Prescription.findOne({
                user: data.user,
                product: data.product,
                status: { $in: ['pending', 'approved'] }
            })
            
            if (existingPrescription) {
                resolve({
                    status: 'OK',
                    message: 'Bạn đã có đơn thuốc cho sản phẩm này',
                    data: existingPrescription
                })
                return
            }
            
            // Tạo đơn thuốc mới
            const newPrescription = await Prescription.create(data)
            
            resolve({
                status: 'OK',
                message: 'Tải lên đơn thuốc thành công',
                data: newPrescription
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getUserPrescriptions = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const prescriptions = await Prescription.find({ user: userId })
                .populate('product')
                .sort({ createdAt: -1 })
                
            resolve({
                status: 'OK',
                message: 'Success',
                data: prescriptions
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getPrescriptionDetails = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const prescription = await Prescription.findById(id)
                .populate('product')
                .populate('user', 'name email phone')
                
            if (!prescription) {
                resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy đơn thuốc'
                })
                return
            }
            
            resolve({
                status: 'OK',
                message: 'Success',
                data: prescription
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updatePrescriptionStatus = async (id, status, note) => {
    return new Promise(async (resolve, reject) => {
        try {
            const prescription = await Prescription.findById(id)
            
            if (!prescription) {
                resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy đơn thuốc'
                })
                return
            }
            
            // Nếu duyệt, đặt ngày hết hạn là 30 ngày kể từ ngày duyệt
            let update = { status, note }
            if (status === 'approved') {
                const expiryDate = new Date()
                expiryDate.setDate(expiryDate.getDate() + 30)
                update.expiryDate = expiryDate
            }
            
            const updatedPrescription = await Prescription.findByIdAndUpdate(
                id,
                update,
                { new: true }
            ).populate('product').populate('user', 'name email')
            
            resolve({
                status: 'OK',
                message: status === 'approved' ? 'Đã duyệt đơn thuốc' : 'Đã từ chối đơn thuốc',
                data: updatedPrescription
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllPrescriptions = async (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {}
            
            // Áp dụng bộ lọc nếu có
            if (filter) {
                const label = filter[0]
                if (label === 'status') {
                    query.status = filter[1]
                } else if (label === 'user') {
                    query.user = filter[1]
                }
            }
            
            const totalPrescriptions = await Prescription.countDocuments(query)
            
            let prescriptionsQuery = Prescription.find(query)
                .populate('product')
                .populate('user', 'name email phone')
                
            // Áp dụng sắp xếp nếu có
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                prescriptionsQuery = prescriptionsQuery.sort(objectSort)
            } else {
                // Mặc định sắp xếp theo ngày tạo (mới nhất trước)
                prescriptionsQuery = prescriptionsQuery.sort({ createdAt: -1 })
            }
            
            // Áp dụng phân trang
            if (limit !== null) {
                prescriptionsQuery = prescriptionsQuery
                    .limit(limit)
                    .skip(page * limit)
            }
            
            const prescriptions = await prescriptionsQuery
            
            resolve({
                status: 'OK',
                message: 'Success',
                data: prescriptions,
                total: totalPrescriptions,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalPrescriptions/limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createPrescription,
    getUserPrescriptions,
    getPrescriptionDetails,
    updatePrescriptionStatus,
    getAllPrescriptions
}