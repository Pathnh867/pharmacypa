const ProductService = require('../services/ProductService')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, discount} = req.body
        
        if (!name || !image || !type || !price || !countInStock|| !rating||!discount) {
            return res.status(400).json({
                status: 'ERR',
                message:'The input is required'
            })
        
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (! productId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The userId is required'
            })
        }
        const response = await ProductService.updateProduct( productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getdetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The productId is required'
            })
        }
        const response = await ProductService.getdetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
             return res.status(400).json({
                status: 'ERR',
                message:'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        console.log('Controller hit:', { limit, page, sort, filter });
        const response = await ProductService.getAllProduct(Number(limit)||null, Number(page)||0,sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createProduct,
    updateProduct,
    getdetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
}