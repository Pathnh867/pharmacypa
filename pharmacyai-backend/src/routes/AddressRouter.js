const express = require("express");
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const { authAddressMiddleware } = require("../middleware/authMiddleware");

// Sử dụng authAddressMiddleware cho tất cả các route địa chỉ
router.post('/create', authAddressMiddleware, AddressController.createAddress);
router.get('/get-all', authAddressMiddleware, AddressController.getAllAddresses);
router.put('/update/:id', authAddressMiddleware, AddressController.updateAddress);
router.delete('/delete/:id', authAddressMiddleware, AddressController.deleteAddress);
router.put('/set-default/:id', authAddressMiddleware, AddressController.setDefaultAddress);

module.exports = router;