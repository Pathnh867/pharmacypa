import { Alert, Button, Card, Col, List, message, Row, Tag, Typography } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import * as LoyaltyService from '../../services/LoyaltyService'

const VOUCHERS = [
    { type: 1, pointsRequired: 100, discountValue: 10000 },
    { type: 2, pointsRequired: 200, discountValue: 25000 },
    { type: 3, pointsRequired: 500, discountValue: 70000 }
]

const LoyaltyPage = () => {
    const user = useSelector((state) => state.user)
    const [wallet, setWallet] = useState(user?.walletAddress || '')
    const [points, setPoints] = useState(0)
    const [history, setHistory] = useState([])

    const linked = useMemo(() => Boolean(wallet), [wallet])

    const refreshData = async (walletAddress = wallet) => {
        if (!walletAddress) return
        const [balanceRes, historyRes] = await Promise.all([
            LoyaltyService.getBalance(walletAddress),
            LoyaltyService.getRedeemHistory(user?.access_token)
        ])
        setPoints(Number(balanceRes?.points || 0))
        setHistory(historyRes?.data || [])
    }
    const syncWalletFromMetamask = async () => {
        if (!window.ethereum || !user?.access_token) return

        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        const selectedWallet = accounts?.[0]
        if (!selectedWallet) return

        setWallet(selectedWallet)
        if (user?.walletAddress?.toLowerCase() !== selectedWallet.toLowerCase()) {
            await LoyaltyService.linkWallet(selectedWallet, user?.access_token)
        }
    }

    const handleConnectWallet = async () => {
        try {
            if (!window.ethereum) {
                message.error('MetaMask chưa được cài đặt')
                return
            }

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            const selectedWallet = accounts?.[0]
            if (!selectedWallet) {
                return
            }

            await LoyaltyService.linkWallet(selectedWallet, user?.access_token)
            setWallet(selectedWallet)
            await refreshData(selectedWallet)
            message.success('Liên kết ví thành công')
        } catch (error) {
            message.error(error?.response?.data?.message || 'Không thể liên kết ví')
        }
    }

    const handleRedeem = async (voucherType) => {
        try {
            const res = await LoyaltyService.redeemVoucher({ wallet, voucherType }, user?.access_token)
            message.success(`Đổi điểm thành công. Mã voucher: ${res?.data?.voucherCode}`)
            await refreshData(wallet)
        } catch (error) {
            message.error(error?.response?.data?.message || 'Không thể đổi điểm')
        }
    }

    useEffect(() => {
        if (user?.walletAddress) {
            setWallet(user.walletAddress)
        }
    }, [user?.walletAddress])

    useEffect(() => {
        if (!user?.access_token) return

        syncWalletFromMetamask().catch(() => {
            // ignore silent wallet sync errors
        })

        if (window.ethereum?.on) {
            const handleAccountsChanged = (accounts) => {
                setWallet(accounts?.[0] || '')
            }

            window.ethereum.on('accountsChanged', handleAccountsChanged)
            return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
    }, [user?.access_token, user?.walletAddress])


    useEffect(() => {
        if (wallet && user?.access_token) {
            refreshData(wallet)
        }
    }, [wallet, user?.access_token])

    return (
        <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
            <Typography.Title level={2}>Loyalty Points</Typography.Title>
            {!linked ? (
                <Alert
                    type='info'
                    message='Bạn chưa liên kết ví blockchain'
                    action={<Button type='primary' onClick={handleConnectWallet}>Kết nối MetaMask</Button>}
                />
            ) : (
                <Card style={{ marginBottom: 16 }}>
                    <Typography.Text strong>Ví: </Typography.Text>
                    <Typography.Text>{wallet}</Typography.Text>
                    <Typography.Title level={3} style={{ marginTop: 12 }}>Điểm hiện tại: {points}</Typography.Title>
                </Card>
            )}

            <Row gutter={[16, 16]}>
                {VOUCHERS.map((voucher) => (
                    <Col span={8} key={voucher.type}>
                        <Card title={`Voucher loại ${voucher.type}`}>
                            <p>Giảm: {voucher.discountValue.toLocaleString('vi-VN')}đ</p>
                            <p>Điểm yêu cầu: {voucher.pointsRequired}</p>
                            <Button
                                type='primary'
                                disabled={!linked || points < voucher.pointsRequired}
                                onClick={() => handleRedeem(voucher.type)}
                            >
                                Đổi voucher
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Card title='Lịch sử đổi voucher' style={{ marginTop: 16 }}>
                <List
                    dataSource={history}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text>{item.code} - dùng {item.pointsUsed} điểm</Typography.Text>
                            <Tag color={item.status === 'active' ? 'green' : 'default'}>{item.status}</Tag>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}

export default LoyaltyPage