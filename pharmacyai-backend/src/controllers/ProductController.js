const ProductService = require('../services/ProductService')
const TypeService = require('../services/TypeService');

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
        let { limit, page, sort, filter } = req.query;
        
        console.log('Controller hit:', { limit, page, sort, filter });
        
        // Xử lý filter nếu nó đến dưới dạng chuỗi
        if (filter && !Array.isArray(filter)) {
            // Nếu filter là một chuỗi JSON, parse nó
            try {
                filter = JSON.parse(filter);
            } catch (e) {
                // Nếu không phải JSON, có thể là một chuỗi đơn, chuyển thành mảng
                filter = [filter];
            }
        }
        
        const response = await ProductService.getAllProduct(Number(limit)||null, Number(page)||0, sort, filter);
        return res.status(200).json(response);
    } catch (e) {
        console.error("Error in getAllProduct:", e);
        return res.status(404).json({
            message: e.message || e
        });
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
// ProductController.js - thêm route mới
const getProductsByTypeName = async (req, res) => {
    try {
        const { typeName, page = 0, limit = 10 } = req.query;
        console.log('Searching by type name:', typeName);
        
        if (!typeName) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Type name is required'
            });
        }
        
        // Giải mã URL cho typeName nếu cần
        const decodedTypeName = decodeURIComponent(typeName);
        console.log('Decoded type name:', decodedTypeName);
        
        // Tìm kiếm type có tên tương ứng
        const typeObj = await TypeService.findTypeByName(decodedTypeName);
        console.log('Found type object:', typeObj);
        
        if (!typeObj) {
            return res.status(200).json({
                status: 'OK',
                message: 'No products found for this type',
                data: [],
                total: 0,
                pageCurrent: 1,
                totalPage: 0
            });
        }
        
        // Query sản phẩm với type ID
        const query = { type: typeObj._id };
        const totalProduct = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(Number(limit))
            .skip(Number(page) * Number(limit))
            .populate('type');
            
        console.log(`Found ${products.length} products for type ${decodedTypeName}`);
            
        return res.status(200).json({
            status: 'OK',
            message: 'Success',
            data: products,
            total: totalProduct,
            pageCurrent: Number(page) + 1,
            totalPage: Math.ceil(totalProduct/Number(limit))
        });
    } catch (e) {
        console.error('Error in getProductsByTypeName:', e);
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Server error'
        });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getdetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType,
    getProductsByTypeName,
}