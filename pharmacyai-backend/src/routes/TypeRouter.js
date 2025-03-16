const express = require("express");
const router = express.Router()
const TypeController = require('../controllers/TypeController');


// Thêm routes cho Type
router.post('/create', TypeController.createType);
router.get('/get-all', TypeController.getAllType);

module.exports = router