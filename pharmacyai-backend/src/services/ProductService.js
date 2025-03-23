const Product = require("../models/ProductModel")
const mongoose = require('mongoose');

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description, discount} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'OK',
                    message: 'Sản phẩm đã có'
                })
                
            }
            const createdProduct = await Product.create({
                name,
                image,
                type,
                price,
                countInStock,
                rating,
                description,
                discount
            });
            if (createdProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdProduct
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById(id)
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined!'
                })
                return;
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updateProduct
            });
        } catch (e) {
            reject(e);
        }
    });
};
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById(id)
            if (checkProduct === null) {
                resolve({
                    status: 'OK',
                    message: 'The product is not defined!'
                })
                return;
            }
            
            await Product.findByIdAndDelete(id)

            resolve({
                status: 'OK',
                message: 'Delete product SUCCESS'
            });
        } catch (e) {
            reject(e);
        }
    });
};
const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments();
            
            // Trường hợp có filter
            if (filter) {
                const label = filter[0];
                
                // Nếu filter theo type, cần xử lý đặc biệt vì type là ObjectId
                if (label === 'type') {
                    try {
                        let query = {};
                        
                        // Kiểm tra xem filter[1] có phải là ObjectId không
                        if (mongoose.Types.ObjectId.isValid(filter[1])) {
                            console.log('Filtering by type ID:', filter[1]);
                            // Nếu là ObjectId hợp lệ, tìm theo ID
                            query = { type: mongoose.Types.ObjectId(filter[1]) };
                        } else {
                            console.log('Filtering by type name:', filter[1]);
                            // Nếu không, tìm Type theo tên, sau đó tìm Product theo type._id
                            const typeObj = await Type.findOne({ 
                                name: { '$regex': filter[1], '$options': 'i' } 
                            });
                            
                            if (typeObj) {
                                console.log('Found type object:', typeObj.name, typeObj._id);
                                query = { type: typeObj._id };
                            } else {
                                console.log('Type not found with name:', filter[1]);
                                // Không tìm thấy loại, trả về mảng rỗng
                                resolve({
                                    status: 'OK',
                                    message: 'Success',
                                    data: [],
                                    total: 0,
                                    pageCurrent: Number(page + 1),
                                    totalPage: 0
                                });
                                return;
                            }
                        }
                        
                        // Tìm sản phẩm theo query đã xác định
                        const products = await Product.find(query)
                            .limit(limit)
                            .skip(page * limit)
                            .populate('type'); // Thêm thông tin đầy đủ về type
                            
                        const totalFiltered = await Product.countDocuments(query);
                        
                        console.log(`Found ${products.length} products with type filter`);
                        
                        resolve({
                            status: 'OK',
                            message: 'Success',
                            data: products,
                            total: totalFiltered,
                            pageCurrent: Number(page + 1),
                            totalPage: Math.ceil(totalFiltered/limit)
                        });
                        return;
                    } catch (error) {
                        console.error('Error filtering by type:', error);
                        reject(error);
                        return;
                    }
                } else {
                    // Xử lý các filter khác như cũ
                    console.log(`Filtering by ${label}:`, filter[1]);
                    const allobjectfilter = await Product.find({[label]:{'$regex':filter[1], '$options': 'i'}})
                        .limit(limit)
                        .skip(page * limit);
                        
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
            }
            
            // Trường hợp có sort
            if (sort) {
                const objectSort = {};
                objectSort[sort[1]] = sort[0];
                const allProductSort = await Product.find()
                    .limit(limit)
                    .skip(page * limit)
                    .sort(objectSort);
                    
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
            let allProduct;
            if (!limit) {
                allProduct = await Product.find();
            } else {
                allProduct = await Product.find()
                    .limit(limit)
                    .skip(page * limit);
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
const getdetailsProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById({
                _id:id
            })
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
const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // Thay đổi từ Product.distinct sang Type.find
            const TypeModel = require('../models/TypeModel');
            const allType = await TypeModel.find({});
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
module.exports = {
    createProduct,
    updateProduct,
    getdetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllType
};
//  Chuong 1 5 cau
//Chuong 2 3 moi chuong 6 cau
// Chuong 4 5 moi chuong 4 cau