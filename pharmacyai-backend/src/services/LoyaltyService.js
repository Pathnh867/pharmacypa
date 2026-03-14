const loyaltyAbi = require('../blockchain/LoyaltyPoints.abi.json')

const getEthers = () => {
    try {
        return require('ethers')
    } catch (error) {
        throw new Error('Missing dependency: ethers. Please install ethers in pharmacyai-backend before using loyalty APIs.')
    }
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
    const { ethers } = getEthers()
    if (!ethers.isAddress(wallet)) {
        const error = new Error('Invalid wallet address')
        error.statusCode = 400
        throw error
    }
}

const balanceOf = async (wallet) => {
    assertValidAddress(wallet)

    const { contract } = getReadContract()
    const points = await contract.balanceOf(wallet)
    return Number(points)
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