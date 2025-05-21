// src/pages/MyPrescriptions/MyPrescriptions.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Table, 
    Tag, 
    Button, 
    message, 
    Image, 
    Modal, 
    Spin,
    Card,
    Tabs,
    Empty,
    Space
} from 'antd';
import { 
    EyeOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    ClockCircleOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import * as PrescriptionService from '../../services/PrescriptionService';
import { formatOrderDate } from '../../utils';

const { TabPane } = Tabs;

const MyPrescriptions = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState('all');
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    
    useEffect(() => {
        if (!user?.access_token) {
            navigate('/sign-in', { state: '/my-prescriptions' });
            return;
        }
        
        fetchPrescriptions();
    }, [user?.access_token, navigate]);
    
    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await PrescriptionService.getUserPrescriptions(user?.access_token);
            if (response?.status === 'OK') {
                setPrescriptions(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
            message.error('Không thể tải danh sách đơn thuốc');
        } finally {
            setLoading(false);
        }
    };
    
    // Hàm lấy thông tin trạng thái đơn thuốc
    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { 
                    color: 'orange', 
                    text: 'Đang chờ duyệt', 
                    icon: <ClockCircleOutlined /> 
                };
            case 'approved':
                return { 
                    color: 'green', 
                    text: 'Đã duyệt', 
                    icon: <CheckCircleOutlined /> 
                };
            case 'rejected':
                return { 
                    color: 'red', 
                    text: 'Bị từ chối', 
                    icon: <CloseCircleOutlined /> 
                };
            default:
                return { 
                    color: 'default', 
                    text: 'Không xác định', 
                    icon: <ClockCircleOutlined /> 
                };
        }
    };
    
    const showPrescriptionDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setDetailsModalVisible(true);
    };
    
    const filteredPrescriptions = currentTab === 'all' 
        ? prescriptions 
        : prescriptions.filter(p => p.status === currentTab);
    
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'product',
            key: 'product',
            render: product => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover' }} 
                    />
                    <div>{product.name}</div>
                </div>
            ),
        },
        {
            title: 'Ngày tải lên',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => formatOrderDate(date),
            sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: status => {
                const { color, text, icon } = getStatusInfo(status);
                return (
                    <Tag color={color} icon={icon}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: note => note || 'Không có ghi chú',
            ellipsis: true,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        size="small" 
                        onClick={() => showPrescriptionDetails(record)}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'approved' && (
                        <Button 
                            type="primary" 
                            size="small" 
                            onClick={() => navigate(`/product-detail/${record.product._id}`)}
                        >
                            Mua ngay
                        </Button>
                    )}
                </Space>
            ),
        },
    ];
    
    return (
        <div style={{ width: '1270px', margin: '0 auto', padding: '20px 15px' }}>
            <h1 style={{ marginBottom: '24px' }}>Đơn thuốc của tôi</h1>
            
            <Tabs 
                activeKey={currentTab} 
                onChange={setCurrentTab}
                tabBarStyle={{ marginBottom: '24px' }}
            >
                <TabPane tab="Tất cả đơn thuốc" key="all" />
                <TabPane tab="Đang chờ duyệt" key="pending" />
                <TabPane tab="Đã duyệt" key="approved" />
                <TabPane tab="Bị từ chối" key="rejected" />
            </Tabs>
            
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: '16px' }}>Đang tải đơn thuốc...</div>
                </div>
            ) : filteredPrescriptions.length > 0 ? (
                <Table 
                    columns={columns} 
                    dataSource={filteredPrescriptions.map(p => ({ ...p, key: p._id }))} 
                    pagination={{ pageSize: 10 }}
                />
            ) : (
                <Empty 
                    description="Bạn chưa có đơn thuốc nào" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            )}
            
            <Modal
                title="Chi tiết đơn thuốc"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setDetailsModalVisible(false)}>
                        Đóng
                    </Button>,
                    selectedPrescription?.status === 'approved' && (
                        <Button 
                            key="buy" 
                            type="primary" 
                            onClick={() => {
                                setDetailsModalVisible(false);
                                navigate(`/product-detail/${selectedPrescription.product._id}`);
                            }}
                        >
                            Mua sản phẩm
                        </Button>
                    )
                ]}
                width={700}
            >
                {selectedPrescription && (
                    <div>
                        <Card title="Thông tin sản phẩm" style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex' }}>
                                <img 
                                    src={selectedPrescription.product.image} 
                                    alt={selectedPrescription.product.name} 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '16px' }} 
                                />
                                <div>
                                    <h3>{selectedPrescription.product.name}</h3>
                                    <p>Giá: {selectedPrescription.product.price.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>
                        </Card>
                        
                        <Card title="Thông tin đơn thuốc" style={{ marginBottom: '16px' }}>
                            <p><strong>Trạng thái:</strong> {getStatusInfo(selectedPrescription.status).text}</p>
                            <p><strong>Ngày tải lên:</strong> {formatOrderDate(selectedPrescription.createdAt)}</p>
                            {selectedPrescription.expiryDate && (
                                <p><strong>Hết hạn:</strong> {formatOrderDate(selectedPrescription.expiryDate)}</p>
                            )}
                            {selectedPrescription.note && (
                                <p><strong>Ghi chú:</strong> {selectedPrescription.note}</p>
                            )}
                        </Card>
                        
                        <Card title="Hình ảnh đơn thuốc">
                            <div style={{ textAlign: 'center' }}>
                                <Image
                                    src={selectedPrescription.prescriptionImage}
                                    alt="Đơn thuốc"
                                    style={{ maxWidth: '100%' }}
                                />
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MyPrescriptions;