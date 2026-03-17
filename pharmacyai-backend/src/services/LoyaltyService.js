const loyaltyAbi = require('../blockchain/LoyaltyPoints.abi.json')
const User = require('../models/UserModel')
const Order = require('../models/OrderProduct')
const Voucher = require('../models/VoucherModel')
const ETH_WALLET_REGEX = /^0x[a-fA-F0-9]{40}$/
const loadEthers  = () => {
    try {
        return require('ethers')
    } catch (error) {
        return null
    }
}
const getEthers = () => {
    const ethersPackage = loadEthers()
    if (!ethersPackage) {
        const error = new Error('Missing dependency: ethers. Please install ethers in pharmacyai-backend before using loyalty APIs.')
        error.code = 'ETHERS_MISSING'
        throw error
    }

    return ethersPackage
}


const ensureReadEnv = () => {
    if (!process.env.GANACHE_RPC || !process.env.LOYALTY_CONTRACT_ADDRESS) {
        throw new Error('Loyalty blockchain environment variables are not configured (GANACHE_RPC, LOYALTY_CONTRACT_ADDRESS)')
    }
}

const ensureWriteEnv = () => {
    ensureReadEnv()
    if (!process.env.LOYALTY_OWNER_PRIVATE_KEY) {
        throw new Error('Loyalty owner private key is not configured (LOYALTY_OWNER_PRIVATE_KEY)')
    }
}

const getReadContract = () => {
    const { ethers } = getEthers()
    ensureReadEnv()

    const provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC)
    return { ethers, contract: new ethers.Contract(process.env.LOYALTY_CONTRACT_ADDRESS, loyaltyAbi, provider) }
}

const getWriteContract = () => {
    const { ethers } = getEthers()
    ensureWriteEnv()

    const provider = new ethers.JsonRpcProvider(process.env.GANACHE_RPC)
    const ownerWallet = new ethers.Wallet(process.env.LOYALTY_OWNER_PRIVATE_KEY, provider)
    return { ethers, contract: new ethers.Contract(process.env.LOYALTY_CONTRACT_ADDRESS, loyaltyAbi, ownerWallet) }
}

const assertValidAddress = (wallet) => {
    if (!ETH_WALLET_REGEX.test(String(wallet || ''))) {
        const error = new Error('Invalid wallet address')
        error.statusCode = 400
        throw error
    }
}
const getOffchainBalance = async (wallet) => {
    const normalizedWallet = String(wallet || '').toLowerCase()
    const user = await User.findOne({
        walletAddress: {
            $regex: `^${normalizedWallet}$`,
            $options: 'i'
        }
    }).select('_id')

    if (!user?._id) {
        return 0
    }

    const [earnedAgg, usedAgg] = await Promise.all([
        Order.aggregate([
            {
                $match: {
                    user: user._id,
                    status: 'delivered'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ['$pointsEarned', 0] } }
                }
            }
        ]),
        Voucher.aggregate([
            {
                $match: {
                    userId: user._id
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ['$pointsUsed', 0] } }
                }
            }
        ])
    ])

    const earnedPoints = Number(earnedAgg?.[0]?.total || 0)
    const usedPoints = Number(usedAgg?.[0]?.total || 0)
    return Math.max(earnedPoints - usedPoints, 0)
}


const balanceOf = async (wallet) => {
    assertValidAddress(wallet)

    try {
        const { contract } = getReadContract()
        const points = await contract.balanceOf(wallet)
        return Number(points)
    } catch (error) {
        if (error.code === 'ETHERS_MISSING') {
            return 0
        }
        throw error
    }
}


const addPoints = async (wallet, amount, orderId) => {
    assertValidAddress(wallet)

    const { ethers, contract } = getWriteContract()
    const orderIdBytes32 = ethers.id(String(orderId))
    const tx = await contract.addPoints(wallet, amount, orderIdBytes32)
    const receipt = await tx.wait()

    return {
        txHash: receipt.hash,
        orderIdBytes32
    }
}

const redeem = async (wallet, amount, voucherType) => {
    assertValidAddress(wallet)

    const { contract } = getWriteContract()
    const tx = await contract.redeem(wallet, amount, voucherType)
    const receipt = await tx.wait()

    return {
        txHash: receipt.hash
    }
}

module.exports = {
    balanceOf,
    addPoints,
    redeem,
    assertValidAddress
}