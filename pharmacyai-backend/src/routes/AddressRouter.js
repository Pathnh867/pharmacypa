// routes/AddressRouter.js
const express = require("express");
const router = express.Router();
const AddressController = require('../controllers/AddressController');
const { authUserMiddleware } = require("../middleware/authMiddleware");

router.post('/create', authUserMiddleware, AddressController.createAddress);
router.get('/get-all', authUserMiddleware, AddressController.getAllAddresses);
router.put('/update/:id', authUserMiddleware, AddressController.updateAddress);
router.delete('/delete/:id', authUserMiddleware, AddressController.deleteAddress);
router.put('/set-default/:id', authUserMiddleware, AddressController.setDefaultAddress);

module.exports = router;