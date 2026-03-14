const User = require('../models/UserModel')
const Voucher = require('../models/VoucherModel')
const LoyaltyService = require('../services/LoyaltyService')

const VOUCHER_CONFIG = {
    1: { pointsRequired: 100, discountValue: 10000 },
    2: { pointsRequired: 200, discountValue: 25000 },
    3: { pointsRequired: 500, discountValue: 70000 }
}

const generateVoucherCode = (type) => {
    const randomSegment = Math.random().toString(36).slice(2, 10).toUpperCase()
    return `LOYALTY-${type}-${randomSegment}`
}

const getBalance = async (req, res) => {
    try {
        const { wallet } = req.query
        if (!wallet) {
            return res.status(400).json({ status: 'ERR', message: 'wallet is required' })
        }

        LoyaltyService.assertValidAddress(wallet)

        const points = await LoyaltyService.balanceOf(wallet)
        return res.status(200).json({ wallet, points })
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'ERR', message: error.message })
    }
}

const linkWallet = async (req, res) => {
    try {
        const { walletAddress } = req.body
        const userId = req.user?.id

        if (!userId || !walletAddress) {
            return res.status(400).json({ status: 'ERR', message: 'user and walletAddress are required' })
        }

        LoyaltyService.assertValidAddress(walletAddress)

        const updatedUser = await User.findByIdAndUpdate(userId, {
            walletAddress,
            loyaltyLinked: true
        }, { new: true }).select('-password -access_token -refresh_token')

        return res.status(200).json({ status: 'OK', message: 'Wallet linked', data: updatedUser })
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'ERR', message: error.message })
    }
}

const redeemVoucher = async (req, res) => {
    try {
        const { wallet, voucherType } = req.body
        const userId = req.user?.id

        if (!wallet || !voucherType) {
            return res.status(400).json({ status: 'ERR', message: 'wallet and voucherType are required' })
        }

        LoyaltyService.assertValidAddress(wallet)

        const voucherRule = VOUCHER_CONFIG[voucherType]
        if (!voucherRule) {
            return res.status(400).json({ status: 'ERR', message: 'Invalid voucherType' })
        }

        const currentPoints = await LoyaltyService.balanceOf(wallet)
        if (currentPoints < voucherRule.pointsRequired) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Insufficient points',
                required: voucherRule.pointsRequired,
                currentPoints
            })
        }

        const redeemResult = await LoyaltyService.redeem(wallet, voucherRule.pointsRequired, voucherType)

        const voucher = await Voucher.create({
            userId,
            code: generateVoucherCode(voucherType),
            type: voucherType,
            pointsUsed: voucherRule.pointsRequired,
            discountValue: voucherRule.discountValue,
            expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active'
        })

        return res.status(200).json({
            status: 'OK',
            message: 'Redeem successful',
            data: {
                voucherCode: voucher.code,
                voucher,
                blockchainTxHash: redeemResult.txHash
            }
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'ERR', message: error.message })
    }
}

const getRedeemHistory = async (req, res) => {
    try {
        const vouchers = await Voucher.find({ userId: req.user?.id }).sort({ createdAt: -1 })
        return res.status(200).json({ status: 'OK', data: vouchers })
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'ERR', message: error.message })
    }
}

module.exports = {
    getBalance,
    linkWallet,
    redeemVoucher,
    getRedeemHistory,
    VOUCHER_CONFIG
}