const express = require('express')
const router = express.Router()
const LoyaltyController = require('../controllers/LoyaltyController')
const { authAddressMiddleware } = require('../middleware/authMiddleware')

router.get('/balance', LoyaltyController.getBalance)
router.post('/link-wallet', authAddressMiddleware, LoyaltyController.linkWallet)
router.post('/redeem', authAddressMiddleware, LoyaltyController.redeemVoucher)
router.get('/history', authAddressMiddleware, LoyaltyController.getRedeemHistory)

module.exports = router