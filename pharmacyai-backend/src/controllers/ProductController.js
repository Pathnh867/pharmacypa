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
const getdetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById({
                _id: id
            }).populate("type", "name") // Chỉ lấy trường name từ type

            if (product === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined!'
                })
                return;
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: product
            });
        } catch (e) {
            reject(e);
        }
    });
};
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
const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            let allProduct;
            
            // Thêm .populate('type', 'name') vào các truy vấn để lấy thông tin type
            
            // Trường hợp có filter
            if (filter) {
                const label = filter[0];
                const allobjectfilter = await Product.find({[label]:{'$regex':filter[1]}})
                    .populate('type', 'name')
                    .limit(limit)
                    .skip(page * limit)
                    
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allobjectfilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct/limit)
                });
                return;
            }
            
            // Trường hợp có sort
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find()
                    .populate('type', 'name')
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort)
                    
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct/limit)
                });
                return;
            }
            
            // Trường hợp mặc định
            if (!limit) {
                allProduct = await Product.find().populate('type', 'name')
            } else {
                allProduct = await Product.find()
                    .populate('type', 'name')
                    .limit(limit)
                    .skip(page * limit)
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct/limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};
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