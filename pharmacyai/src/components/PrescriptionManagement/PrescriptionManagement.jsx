// pharmacyai/src/components/PrescriptionManagement/PrescriptionManagement.jsx

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Image, 
  Form, 
  Input, 
  Select, 
  Tag, 
  Tooltip, 
  message,
  Tabs,
  Badge,
  Card,
  Typography,
  Divider,
  Alert,
  Row,
  Col,
  Descriptions,
  Skeleton,
  Empty,
  Result
} from 'antd';
import { 
  EyeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  FileProtectOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  LockOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  AdminSectionTitle,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSearchContainer,
  colors
} from '../AdminProduct/style';
import * as PrescriptionService from '../../services/PrescriptionService';
import { convertPrice } from '../../utils';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const PrescriptionManagement = () => {
  // State
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Forms
  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();
  
  // Redux
  const user = useSelector((state) => state.user);
  
  // Fetch prescriptions when component mounts or tab changes
  useEffect(() => {
    // Kiểm tra token trước khi gọi API
    if (user?.access_token) {
      console.log('Fetching prescriptions with token:', user.access_token ? 'Token exists' : 'No token');
      fetchPrescriptions();
    } else {
      console.warn('No access token available, cannot fetch prescriptions');
      message.warning('Bạn cần đăng nhập lại để xem danh sách đơn thuốc');
    }
  }, [activeTab, user?.access_token]);
  
  // Functions
  const fetchPrescriptions = async (page = 0, limit = 10) => {
    if (!user?.access_token) {
      message.error('Không có thông tin xác thực. Vui lòng đăng nhập lại.');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log(`Fetching prescriptions with status: ${activeTab}`);
      
      const response = await PrescriptionService.getAllPrescriptions(
        activeTab,
        page,
        limit,
        user?.access_token
      );
      
      console.log("Prescription response:", response);
      
      if (response?.status === 'OK') {
        setPrescriptions(response.data || []);
        
        if (response.total !== undefined) {
          setPagination({
            ...pagination,
            total: response.total,
            current: page + 1
          });
        }
        
        // Debug first prescription if exists
        if (response.data && response.data.length > 0) {
          console.log("First prescription structure:", response.data[0]);
        }
      } else {
        // Không xóa danh sách trước đó nếu có lỗi API
        // setPrescriptions([]);
        message.warning(response?.message || 'Không có đơn thuốc nào trong hệ thống');
        
        // Nếu lỗi là do token, thử đăng nhập lại
        if (response?.message?.includes('token')) {
          message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        }
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      message.error('Lỗi khi tải danh sách đơn thuốc: ' + (error.message || 'Lỗi không xác định'));
      // Không xóa danh sách trước đó nếu có lỗi
      // setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Get status info (color, text, icon)
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: colors.warning, 
          text: 'Chờ xác minh',
          icon: <ClockCircleOutlined />
        };
      case 'approved':
        return { 
          color: colors.success, 
          text: 'Đã phê duyệt',
          icon: <CheckCircleOutlined />
        };
      case 'rejected':
        return { 
          color: colors.error, 
          text: 'Đã từ chối',
          icon: <CloseCircleOutlined />
        };
      case 'needs_info':
        return { 
          color: colors.info, 
          text: 'Cần thêm thông tin',
          icon: <InfoCircleOutlined />
        };
      default:
        return { 
          color: 'default', 
          text: 'Không xác định',
          icon: <InfoCircleOutlined />
        };
    }
  };
  
  // Handle prescription view
  const handleViewPrescription = (prescription) => {
    console.log("Viewing prescription:", prescription);
    setSelectedPrescription(prescription);
    setViewModalVisible(true);
  };
  
  // Handle prescription approval
  const handleApprove = (prescription) => {
    console.log("Approving prescription:", prescription);
    setSelectedPrescription(prescription);
    form.resetFields();
    setVerifyModalVisible(true);
  };
  
  // Handle prescription rejection
  const handleReject = (prescription) => {
    console.log("Rejecting prescription:", prescription);
    setSelectedPrescription(prescription);
    rejectForm.resetFields();
    setRejectModalVisible(true);
  };
  
  // Submit verify form
  const handleSubmitVerify = async () => {
    if (!selectedPrescription?._id) {
      message.error('Không thể xác định đơn thuốc');
      return;
    }
    
    if (!user?.access_token) {
      message.error('Bạn cần đăng nhập lại để thực hiện thao tác này');
      return;
    }
    
    try {
      const values = await form.validateFields();
      setActionLoading(true);
      
      // Log thông tin cho việc debug
      console.log('Submitting prescription approval:', {
        id: selectedPrescription._id,
        status: 'approved',
        notes: values.notes || '',
        token: user.access_token ? 'Token exists' : 'No token'
      });
      
      try {
        const response = await PrescriptionService.verifyPrescription(
          selectedPrescription._id,
          'approved',
          values.notes || '',
          user.access_token
        );
        
        console.log('Verify prescription response:', response);
        
        if (response?.status === 'OK') {
          message.success('Đơn thuốc đã được phê duyệt thành công');
          setVerifyModalVisible(false);
          fetchPrescriptions(); // Refresh list
        } else {
          message.error(response?.message || 'Không thể phê duyệt đơn thuốc');
          
          // Nếu lỗi là do token, thử fetch lại danh sách để xem đơn đã được cập nhật chưa
          if (response?.message?.includes('token')) {
            setTimeout(() => {
              fetchPrescriptions();
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error approving prescription:', error);
        message.error('Lỗi khi phê duyệt đơn thuốc: ' + (error.message || 'Lỗi không xác định'));
        
        // Thử fetch lại danh sách kể cả khi có lỗi để kiểm tra xem server đã xử lý request chưa
        setTimeout(() => {
          fetchPrescriptions();
        }, 1000);
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Submit reject form
  const handleSubmitReject = async () => {
    if (!selectedPrescription?._id) {
      message.error('Không thể xác định đơn thuốc');
      return;
    }
    
    if (!user?.access_token) {
      message.error('Bạn cần đăng nhập lại để thực hiện thao tác này');
      return;
    }
    
    try {
      const values = await rejectForm.validateFields();
      
      if (!values.rejectReason) {
        message.error('Vui lòng nhập lý do từ chối');
        return;
      }
      
      setActionLoading(true);
      
      // Log thông tin cho việc debug
      console.log('Submitting prescription rejection:', {
        id: selectedPrescription._id,
        status: 'rejected',
        reason: values.rejectReason,
        token: user.access_token ? 'Token exists' : 'No token'
      });
      
      try {
        const response = await PrescriptionService.verifyPrescription(
          selectedPrescription._id,
          'rejected',
          values.rejectReason,
          user.access_token
        );
        
        console.log('Reject prescription response:', response);
        
        if (response?.status === 'OK') {
          message.success('Đơn thuốc đã bị từ chối');
          setRejectModalVisible(false);
          fetchPrescriptions(); // Refresh list
        } else {
          message.error(response?.message || 'Không thể từ chối đơn thuốc');
          
          // Nếu lỗi là do token, thử fetch lại danh sách để xem đơn đã được cập nhật chưa
          if (response?.message?.includes('token')) {
            setTimeout(() => {
              fetchPrescriptions();
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error rejecting prescription:', error);
        message.error('Lỗi khi từ chối đơn thuốc: ' + (error.message || 'Lỗi không xác định'));
        
        // Thử fetch lại danh sách kể cả khi có lỗi để kiểm tra xem server đã xử lý request chưa
        setTimeout(() => {
          fetchPrescriptions();
        }, 1000);
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle search and filter
  const handleSearch = () => {
    fetchPrescriptions();
  };
  
  // Reset search and filter
  const handleResetSearch = () => {
    setSearchText('');
    setStatusFilter(null);
    fetchPrescriptions();
  };
  
  // Handle pagination change
  const handleTableChange = (pagination) => {
    fetchPrescriptions(pagination.current - 1, pagination.pageSize);
  };
  
  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return moment(date).format('DD/MM/YYYY HH:mm');
  };
  
  // Table columns
  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span>{id.substring(id.length - 8).toUpperCase()}</span>,
      width: 100,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => {
        if (!user) return <span>Không xác định</span>;
        
        return (
          <div>
            <div style={{ fontWeight: '500' }}>{user.name || 'Không tên'}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>{user.email || 'Không email'}</div>
          </div>
        );
      },
      width: 200,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (product) => {
        if (!product) return <span>Không có thông tin</span>;
        
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '8px', borderRadius: '4px' }}
            />
            <div>
              <div style={{ fontWeight: '500' }}>{product.name}</div>
            </div>
          </div>
        );
      },
      width: 250,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, text, icon } = getStatusInfo(status);
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      width: 120,
      filters: [
        { text: 'Chờ xác minh', value: 'pending' },
        { text: 'Đã phê duyệt', value: 'approved' },
        { text: 'Đã từ chối', value: 'rejected' },
        { text: 'Cần thêm thông tin', value: 'needs_info' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              type="primary" 
              ghost
              onClick={() => handleViewPrescription(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (
            <>
              <Tooltip title="Phê duyệt">
                <Button 
                  icon={<CheckCircleOutlined />} 
                  type="primary"
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button 
                  icon={<CloseCircleOutlined />} 
                  danger
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
      width: 180,
    },
  ];
  
  return (
    <div>
      <AdminSectionTitle>Quản lý đơn thuốc</AdminSectionTitle>
      
      {/* Status Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: '16px' }}
      >
        <TabPane 
          tab={
            <span>
              <Badge status="warning" />
              Chờ xác minh
            </span>
          } 
          key="pending"
        />
        <TabPane 
          tab={
            <span>
              <Badge status="success" />
              Đã phê duyệt
            </span>
          } 
          key="approved"
        />
        <TabPane 
          tab={
            <span>
              <Badge status="error" />
              Đã từ chối
            </span>
          } 
          key="rejected"
        />
      </Tabs>
      
      {/* Search and Filter */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <AdminSearchContainer>
          <div className="search-item">
            <AdminInput 
              placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng" 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
          
          <div className="search-actions">
            <AdminButton 
              type="primary" 
              icon={<FilterOutlined />} 
              onClick={handleSearch}
              ghost
            >
              Lọc
            </AdminButton>
            <AdminButton 
              icon={<ReloadOutlined />} 
              onClick={handleResetSearch}
            >
              Đặt lại
            </AdminButton>
          </div>
        </AdminSearchContainer>
      </AdminCard>
      
      {/* Prescriptions Table */}
      <AdminCard>
        <AdminTable
          columns={columns}
          dataSource={prescriptions}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span>
                    {activeTab === 'pending' 
                      ? 'Không có đơn thuốc nào đang chờ xác minh' 
                      : activeTab === 'approved'
                        ? 'Không có đơn thuốc nào đã được phê duyệt'
                        : 'Không có đơn thuốc nào đã bị từ chối'}
                  </span>
                }
              />
            )
          }}
        />
      </AdminCard>
      
      {/* View Prescription Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FileProtectOutlined style={{ marginRight: '8px', color: colors.primary }} />
            <span>Chi tiết đơn thuốc</span>
          </div>
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        {selectedPrescription ? (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Thông tin đơn hàng" bordered={false}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Mã đơn thuốc">
                      {selectedPrescription._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">
                      {selectedPrescription.user?.name || 'Không xác định'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedPrescription.user?.email || 'Không có email'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {formatDate(selectedPrescription.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={getStatusInfo(selectedPrescription.status).color}>
                        {getStatusInfo(selectedPrescription.status).text}
                      </Tag>
                    </Descriptions.Item>
                    {selectedPrescription.verifiedBy && (
                      <>
                        <Descriptions.Item label="Người xác minh">
                          {selectedPrescription.verifiedBy.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày xác minh">
                          {formatDate(selectedPrescription.verifiedAt)}
                        </Descriptions.Item>
                      </>
                    )}
                    {selectedPrescription.notes && (
                      <Descriptions.Item label="Ghi chú">
                        {selectedPrescription.notes}
                      </Descriptions.Item>
                    )}
                    {selectedPrescription.rejectReason && (
                      <Descriptions.Item label="Lý do từ chối">
                        {selectedPrescription.rejectReason}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
                
                <Card title="Sản phẩm" bordered={false} style={{ marginTop: '16px' }}>
                  {selectedPrescription.product && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={selectedPrescription.product.image} 
                        alt={selectedPrescription.product.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '12px', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{selectedPrescription.product.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Số lượng: 1</span>
                          <span style={{ color: colors.primary, fontWeight: '500' }}>
                            {convertPrice(selectedPrescription.product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Đơn thuốc" bordered={false}>
                  <div style={{ textAlign: 'center' }}>
                    <Image
                      src={selectedPrescription.imageUrl}
                      alt="Đơn thuốc"
                      style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                    />
                    
                    <Divider />
                    
                    <div style={{ textAlign: 'left' }}>
                      <Text strong>Thông tin đơn thuốc:</Text>
                      <br />
                      {selectedPrescription.expiryDate && (
                        <Text>Ngày hết hạn: {formatDate(selectedPrescription.expiryDate)}</Text>
                      )}
                    </div>
                  </div>
                </Card>
                
                {selectedPrescription.status === 'pending' && (
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <Button 
                      type="primary" 
                      icon={<CheckCircleOutlined />} 
                      onClick={() => handleApprove(selectedPrescription)}
                      block
                    >
                      Phê duyệt
                    </Button>
                    <Button 
                      danger 
                      icon={<CloseCircleOutlined />} 
                      onClick={() => handleReject(selectedPrescription)}
                      block
                    >
                      Từ chối
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        ) : (
          <Skeleton active paragraph={{ rows: 10 }} />
        )}
      </Modal>
      
      {/* Approve Prescription Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: colors.success }}>
            <CheckCircleOutlined style={{ marginRight: '8px' }} />
            Phê duyệt đơn thuốc
          </div>
        }
        open={verifyModalVisible}
        onCancel={() => setVerifyModalVisible(false)}
        onOk={handleSubmitVerify}
        okText="Xác nhận phê duyệt"
        cancelText="Hủy"
        confirmLoading={actionLoading}
        destroyOnClose
      >
        {selectedPrescription ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <Alert
                message="Xác nhận phê duyệt đơn thuốc"
                description="Khi bạn phê duyệt đơn thuốc này, khách hàng sẽ có thể thanh toán và nhận được sản phẩm. Vui lòng kiểm tra kỹ thông tin đơn thuốc trước khi phê duyệt."
                type="info"
                showIcon
              />
            </div>
            
            {/* Product info */}
            {selectedPrescription.product && (
              <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={selectedPrescription.product.image} 
                    alt={selectedPrescription.product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '12px', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{selectedPrescription.product.name}</div>
                    <div>
                      <Tag color={colors.primary}>
                        {convertPrice(selectedPrescription.product.price)}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Form form={form} layout="vertical">
              <Form.Item
                name="notes"
                label="Ghi chú (không bắt buộc)"
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập ghi chú về đơn thuốc nếu cần"
                />
              </Form.Item>
            </Form>
          </>
        ) : (
          <Alert
            message="Lỗi dữ liệu"
            description="Không thể tải thông tin đơn thuốc. Vui lòng thử lại."
            type="error"
            showIcon
          />
        )}
      </Modal>
      
      {/* Reject Prescription Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: colors.error }}>
            <CloseCircleOutlined style={{ marginRight: '8px' }} />
            Từ chối đơn thuốc
          </div>
        }
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleSubmitReject}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        confirmLoading={actionLoading}
        destroyOnClose
      >
        {selectedPrescription ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <Alert
                message="Từ chối đơn thuốc"
                description="Khi bạn từ chối đơn thuốc này, khách hàng sẽ được thông báo và cần phải gửi lại đơn thuốc mới. Vui lòng cung cấp lý do từ chối rõ ràng để khách hàng có thể hiểu và khắc phục vấn đề."
                type="warning"
                showIcon
              />
            </div>
            
            {/* Product info */}
            {selectedPrescription.product && (
              <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={selectedPrescription.product.image} 
                    alt={selectedPrescription.product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '12px', borderRadius: '4px' }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{selectedPrescription.product.name}</div>
                    <div>
                      <Tag color={colors.primary}>
                        {convertPrice(selectedPrescription.product.price)}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <Form form={rejectForm} layout="vertical">
              <Form.Item
                name="rejectReason"
                label="Lý do từ chối"
                rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập lý do từ chối đơn thuốc"
                />
              </Form.Item>
            </Form>
          </>
        ) : (
          <Alert
            message="Lỗi dữ liệu"
            description="Không thể tải thông tin đơn thuốc. Vui lòng thử lại."
            type="error"
            showIcon
          />
        )}
      </Modal>
    </div>
  );
};

export default PrescriptionManagement;