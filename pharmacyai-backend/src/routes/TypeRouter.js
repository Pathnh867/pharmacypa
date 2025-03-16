const express = require("express");
const router = express.Router()
const TypeController = require('../controllers/TypeController');


// Thêm routes cho Type
router.post('/type/create', TypeController.createType);
router.get('/type/get-all', TypeController.getAllType);

module.exports = router