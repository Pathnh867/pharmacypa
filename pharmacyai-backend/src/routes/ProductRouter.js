const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleware } = require("../middleware/authMiddleware");


router.post('/create', ProductController.createProduct)
router.put('/update/:id', authMiddleware, ProductController.updateProduct)
router.get('/details/:id', ProductController.getdetailsProduct)
router.delete('/delete/:id',authMiddleware, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.get('/get-all-type', ProductController.getAllType)
router.get('/get-by-type-name', ProductController.getProductsByTypeName);

module.exports = router