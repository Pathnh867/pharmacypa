import { axiosJWT } from './UserService'

export const getBalance = async (wallet) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/loyalty/balance`, {
        params: { wallet }
    })
    return res.data
}

export const linkWallet = async (walletAddress, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/loyalty/link-wallet`, {
        walletAddress
    }, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const redeemVoucher = async (payload, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/loyalty/redeem`, payload, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getRedeemHistory = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/loyalty/history`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}