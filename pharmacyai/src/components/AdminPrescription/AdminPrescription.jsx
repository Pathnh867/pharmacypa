// src/components/AdminPrescription/AdminPrescription.jsx
import React, { useEffect, useState } from 'react';
import { 
    Table, 
    Button, 
    Tag, 
    Space, 
    Modal, 
    Form, 
    Input, 
    Select, 
    message, 
    Card, 
    Image, 
    Tabs,
    Typography,
    Statistic,
    Row,
    Col,
    Spin,
    Radio
} from 'antd';
import { 
    CheckCircleOutlined, 
    CloseCircleOutlined, 
    EyeOutlined, 
    SearchOutlined, 
    FilterOutlined, 
    ReloadOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as PrescriptionService from '../../services/PrescriptionService';
import { formatOrderDate } from '../../utils';

import { 
    AdminSectionTitle, 
    AdminCard, 
    AdminTable, 
    AdminButton, 
    AdminInput, 
    AdminSelect, 
    AdminSearchContainer,
    colors
} from '../AdminUser/style';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

const AdminPrescription = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [reviewStatus, setReviewStatus] = useState('approved');
    const [reviewNote, setReviewNote] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState(null);
    const [currentTab, setCurrentTab] = useState('all');
    
    const user = useSelector((state) => state?.user);
    
    // Stats state
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    
    useEffect(() => {
        loadPrescriptions(0, pagination.pageSize);
    }, [currentTab]);
    
    useEffect(() => {
        // Calculate stats from prescription data
        if (prescriptions.length > 0) {
            setStats({
                total: prescriptions.length,
                pending: prescriptions.filter(p => p.status === 'pending').length,
                approved: prescriptions.filter(p => p.status === 'approved').length,
                rejected: prescriptions.filter(p => p.status === 'rejected').length
            });
        }
    }, [prescriptions]);
    
    const loadPrescriptions = async (page, pageSize) => {
        try {
            setLoading(true);
            
            // Create filter based on current tab
            let filter = null;
            if (currentTab !== 'all') {
                filter = ['status', currentTab];
            }
            
            const response = await PrescriptionService.getAllPrescriptions(
                user?.access_token,
                pageSize,
                page,
                null,
                filter
            );
            
            if (response?.status === 'OK') {
                setPrescriptions(response.data);
                setPagination({
                    ...pagination,
                    current: page + 1,
                    pageSize: pageSize,
                    total: response.total
                });
            } else {
                message.error('Không thể tải danh sách đơn thuốc');
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách đơn thuốc');
        } finally {
            setLoading(false);
        }
    };
    
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
    
    const handleTableChange = (pagination, filters, sorter) => {
        loadPrescriptions(pagination.current - 1, pagination.pageSize);
    };
    
    const showPrescriptionDetails = (prescription) => {
        setSelectedPrescription(prescription);
        setDetailsModalVisible(true);
    };
    
    const showReviewModal = (prescription) => {
        setSelectedPrescription(prescription);
        setReviewStatus('approved');
        setReviewNote('');
        setReviewModalVisible(true);
    };
    
    const handleReviewSubmit = async () => {
        if (!selectedPrescription) return;
        
        try {
            setSubmitLoading(true);
            const response = await PrescriptionService.updatePrescriptionStatus(
                selectedPrescription._id,
                reviewStatus,
                reviewNote,
                user?.access_token
            );
            
            if (response?.status === 'OK') {
                message.success(`Đơn thuốc đã được ${reviewStatus === 'approved' ? 'duyệt' : 'từ chối'}`);
                setReviewModalVisible(false);
                
                // Refresh the list
                loadPrescriptions(pagination.current - 1, pagination.pageSize);
            } else {
                message.error(response?.message || 'Không thể cập nhật trạng thái đơn thuốc');
            }
        } catch (error) {
            console.error('Error updating prescription status:', error);
            message.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn thuốc');
        } finally {
            setSubmitLoading(false);
        }
    };
    
    const handleSearch = (value) => {
        setSearchText(value);
        // Implement search functionality here
    };
    
    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        // Implement filter functionality here
    };
    
    const resetFilters = () => {
        setSearchText('');
        setStatusFilter(null);
        loadPrescriptions(0, pagination.pageSize);
    };
    
    const filterData = (data) => {
        if (!data) return [];
        
        return data.filter(item => {
            // Search in product name or user name/email
            const searchMatch = !searchText || 
                             (item.product?.name && item.product.name.toLowerCase().includes(searchText.toLowerCase())) ||
                             (item.user?.name && item.user.name.toLowerCase().includes(searchText.toLowerCase())) ||
                             (item.user?.email && item.user.email.toLowerCase().includes(searchText.toLowerCase()));
            
            // Filter by status
            const statusMatch = !statusFilter || item.status === statusFilter;
            
            return searchMatch && statusMatch;
        });
    };
    
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
            width: '25%',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: user => (
                <div>
                    <div>{user.name || 'Không có tên'}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{user.email}</div>
                </div>
            ),
            width: '20%',
        },
        {
            title: 'Ngày tải lên',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => formatOrderDate(date),
            width: '15%',
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
            width: '15%',
            filters: [
                { text: 'Đang chờ duyệt', value: 'pending' },
                { text: 'Đã duyệt', value: 'approved' },
                { text: 'Bị từ chối', value: 'rejected' },
            ],
            onFilter: (value, record) => record.status === value,
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
                    {record.status === 'pending' && (
                        <Button 
                            type="primary" 
                            size="small" 
                            onClick={() => showReviewModal(record)}
                        >
                            Duyệt
                        </Button>
                    )}
                </Space>
            ),
            width: '20%',
        },
    ];
    
    return (
        <div>
            <AdminSectionTitle>Quản lý đơn thuốc</AdminSectionTitle>
            
            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Tổng đơn thuốc"
                            value={stats.total}
                            valueStyle={{ color: colors.info }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đang chờ duyệt"
                            value={stats.pending}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đã duyệt"
                            value={stats.approved}
                            valueStyle={{ color: colors.success }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Bị từ chối"
                            value={stats.rejected}
                            valueStyle={{ color: colors.error }}
                        />
                    </Card>
                </Col>
            </Row>
            
            {/* Tabs */}
            <Tabs 
                activeKey={currentTab} 
                onChange={setCurrentTab}
                tabBarStyle={{ marginBottom: '16px' }}
            >
                <TabPane tab="Tất cả đơn thuốc" key="all" />
                <TabPane tab="Đang chờ duyệt" key="pending" />
                <TabPane tab="Đã duyệt" key="approved" />
                <TabPane tab="Bị từ chối" key="rejected" />
            </Tabs>
            
            {/* Search/Filter */}
            <AdminCard style={{ marginBottom: '24px' }}>
                <AdminSearchContainer>
                    <div className="search-item">
                        <AdminInput
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm theo tên sản phẩm hoặc khách hàng"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            allowClear
                        />
                    </div>
                    
                    <div className="search-item">
                        <AdminSelect
                            placeholder="Lọc theo trạng thái"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value="pending">Đang chờ duyệt</Option>
                            <Option value="approved">Đã duyệt</Option>
                            <Option value="rejected">Bị từ chối</Option>
                        </AdminSelect>
                    </div>
                    
                    <div className="search-actions">
                        <AdminButton
                            icon={<FilterOutlined />}
                            onClick={() => loadPrescriptions(0, pagination.pageSize)}
                            type="primary"
                            ghost
                        >
                            Lọc
                        </AdminButton>
                        
                        <AdminButton
                            icon={<ReloadOutlined />}
                            onClick={resetFilters}
                        >
                            Đặt lại
                        </AdminButton>
                    </div>
                </AdminSearchContainer>
            </AdminCard>
            
            {/* Table */}
            <AdminCard>
                <AdminTable
                    columns={columns}
                    dataSource={filterData(prescriptions).map(p => ({ ...p, key: p._id }))}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: 1000 }}
                />
            </AdminCard>
            
            {/* Chi tiết đơn thuốc */}
            <Modal
                title="Chi tiết đơn thuốc"
                open={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setDetailsModalVisible(false)}>
                        Đóng
                    </Button>,
                    selectedPrescription?.status === 'pending' && (
                        <Button 
                            key="review" 
                            type="primary" 
                            onClick={() => {
                                setDetailsModalVisible(false);
                                showReviewModal(selectedPrescription);
                            }}
                        >
                            Duyệt đơn này
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
                        
                        <Card title="Thông tin khách hàng" style={{ marginBottom: '16px' }}>
                            <p><strong>Tên:</strong> {selectedPrescription.user.name || 'Không có tên'}</p>
                            <p><strong>Email:</strong> {selectedPrescription.user.email}</p>
                            <p><strong>Số điện thoại:</strong> {selectedPrescription.user.phone || 'Không có thông tin'}</p>
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
            
            {/* Modal duyệt đơn thuốc */}
            <Modal
                title="Duyệt đơn thuốc"
                open={reviewModalVisible}
                onCancel={() => setReviewModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setReviewModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        loading={submitLoading}
                        onClick={handleReviewSubmit}
                    >
                        {reviewStatus === 'approved' ? 'Duyệt đơn thuốc' : 'Từ chối đơn thuốc'}
                    </Button>
                ]}
                width={500}
            >
                {selectedPrescription && (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <p>Sản phẩm: <strong>{selectedPrescription.product.name}</strong></p>
                            <p>Khách hàng: <strong>{selectedPrescription.user.name || selectedPrescription.user.email}</strong></p>
                        </div>
                        
                        <Form layout="vertical">
                            <Form.Item label="Kết quả duyệt đơn">
                                <Radio.Group 
                                    value={reviewStatus} 
                                    onChange={(e) => setReviewStatus(e.target.value)}
                                >
                                    <Radio value="approved">
                                        <Tag color="green" icon={<CheckCircleOutlined />}>Duyệt</Tag>
                                    </Radio>
                                    <Radio value="rejected">
                                        <Tag color="red" icon={<CloseCircleOutlined />}>Từ chối</Tag>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                            
                            <Form.Item label="Ghi chú">
                                <TextArea 
                                    rows={4} 
                                    value={reviewNote}
                                    onChange={(e) => setReviewNote(e.target.value)}
                                    placeholder="Nhập ghi chú cho khách hàng (không bắt buộc)"
                                />
                            </Form.Item>
                        </Form>
                        
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <Image
                                width={200}
                                src={selectedPrescription.prescriptionImage}
                                alt="Đơn thuốc"
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminPrescription;