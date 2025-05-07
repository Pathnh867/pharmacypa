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
  Descriptions
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
  ShoppingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import {
  AdminSectionTitle,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSearchContainer,
  colors
} from '../../pages/AdminPage/style';
import * as PrescriptionService from '../../services/PrescriptionService';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const PrescriptionManagement = () => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('pending');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Lấy thông tin user từ redux store
  const user = useSelector((state) => state.user);
  
  // Tải danh sách đơn thuốc khi component mount và khi tab thay đổi
  useEffect(() => {
    fetchPrescriptions();
  }, [activeTab]);
  
  // Hàm tải danh sách đơn thuốc - hiện tại chỉ sử dụng dữ liệu mẫu
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      // Gọi API thực tế thay vì sử dụng dữ liệu mẫu
      const response = await PrescriptionService.getAllPrescriptions(
        activeTab, // 'pending', 'approved', hoặc 'rejected'
        0, // page
        10, // limit
        user?.access_token
      );
      
      if (response?.status === 'OK') {
        setPrescriptions(response.data || []);
      } else {
        setPrescriptions([]);
        message.error(response?.message || 'Không thể tải danh sách đơn thuốc');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      message.error('Không thể tải danh sách đơn thuốc');
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm lấy màu và text cho trạng thái đơn thuốc
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: colors.warning, text: 'Chờ xác minh' };
      case 'approved':
        return { color: colors.success, text: 'Đã phê duyệt' };
      case 'rejected':
        return { color: colors.error, text: 'Đã từ chối' };
      case 'needs_info':
        return { color: colors.info, text: 'Cần thêm thông tin' };
      default:
        return { color: 'default', text: 'Không xác định' };
    }
  };
  
  // Hàm xử lý xem chi tiết đơn thuốc
  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setViewModalVisible(true);
  };
  
  // Hàm xử lý phê duyệt đơn thuốc
  const handleApprove = (prescription) => {
    setSelectedPrescription(prescription);
    form.resetFields();
    setVerifyModalVisible(true);
  };
  
  // Hàm xử lý từ chối đơn thuốc
  const handleReject = (prescription) => {
    setSelectedPrescription(prescription);
    rejectForm.resetFields();
    setRejectModalVisible(true);
  };
  
  // Hàm xử lý lưu phê duyệt
  const handleSubmitVerify = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      try {
        // Trong thực tế, gọi API để cập nhật trạng thái đơn thuốc
        // await PrescriptionService.verifyPrescription(
        //   selectedPrescription._id,
        //   'approved',
        //   values.notes,
        //   user?.access_token
        // );
        
        message.success('Đơn thuốc đã được phê duyệt');
        setVerifyModalVisible(false);
        fetchPrescriptions();
      } catch (error) {
        console.error('Error approving prescription:', error);
        message.error('Không thể phê duyệt đơn thuốc');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xử lý lưu từ chối
  const handleSubmitReject = async () => {
    try {
      const values = await rejectForm.validateFields();
      
      if (!values.rejectReason) {
        message.error('Vui lòng nhập lý do từ chối');
        return;
      }
      
      setLoading(true);
      
      try {
        // Trong thực tế, gọi API để cập nhật trạng thái đơn thuốc
        // await PrescriptionService.verifyPrescription(
        //   selectedPrescription._id,
        //   'rejected',
        //   values.rejectReason,
        //   user?.access_token
        // );
        
        message.success('Đơn thuốc đã bị từ chối');
        setRejectModalVisible(false);
        fetchPrescriptions();
      } catch (error) {
        console.error('Error rejecting prescription:', error);
        message.error('Không thể từ chối đơn thuốc');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xử lý tìm kiếm và lọc
  const handleSearch = () => {
    fetchPrescriptions();
  };
  
  // Hàm reset tìm kiếm và lọc
  const handleResetSearch = () => {
    setSearchText('');
    setStatusFilter(null);
    fetchPrescriptions();
  };
  
  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text) => <a>{text}</a>,
      width: 120,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <div>
          <div style={{ fontWeight: '500' }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: colors.textSecondary }}>{user.email}</div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'products',
      key: 'products',
      render: (products) => (
        <div>
          {products.map((product, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: index < products.length - 1 ? '8px' : 0 }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '8px', borderRadius: '4px' }}
              />
              <div>
                <div style={{ fontWeight: '500' }}>{product.name}</div>
                <div style={{ fontSize: '12px', color: colors.textSecondary }}>SL: {product.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      ),
      width: 250,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const { color, text } = getStatusInfo(status);
        return <Tag color={color}>{text}</Tag>;
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
      
      {/* Tabs trạng thái */}
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
      
      {/* Tìm kiếm và lọc */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <AdminSearchContainer>
          <div className="search-item">
            <AdminInput 
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng" 
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
      
      {/* Bảng dữ liệu */}
      <AdminCard>
        <AdminTable
          columns={columns}
          dataSource={prescriptions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </AdminCard>
      
      {/* Modal xem chi tiết đơn thuốc */}
      <Modal
        title="Chi tiết đơn thuốc"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedPrescription && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Thông tin đơn hàng" bordered={false}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Mã đơn hàng">
                      {selectedPrescription.orderNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khách hàng">
                      {selectedPrescription.user.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedPrescription.user.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {moment(selectedPrescription.createdAt).format('DD/MM/YYYY HH:mm')}
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
                          {moment(selectedPrescription.verifiedAt).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                      </>
                    )}
                    {selectedPrescription.notes && (
                      <Descriptions.Item label="Ghi chú">
                        {selectedPrescription.notes}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
                
                <Card title="Sản phẩm" bordered={false} style={{ marginTop: '16px' }}>
                  {selectedPrescription.products.map((product, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: index < selectedPrescription.products.length - 1 ? '16px' : 0,
                      padding: index < selectedPrescription.products.length - 1 ? '0 0 16px 0' : 0,
                      borderBottom: index < selectedPrescription.products.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '12px', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>{product.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Số lượng: {product.quantity}</span>
                          <span style={{ color: colors.primary, fontWeight: '500' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                      <Text>Ngày hết hạn: {moment(selectedPrescription.expiryDate).format('DD/MM/YYYY')}</Text>
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
        )}
      </Modal>
      
      {/* Modal phê duyệt đơn thuốc */}
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
        confirmLoading={loading}
      >
        <div style={{ marginBottom: '16px' }}>
          <Alert
            message="Xác nhận phê duyệt đơn thuốc"
            description="Khi bạn phê duyệt đơn thuốc này, khách hàng sẽ có thể thanh toán và nhận được sản phẩm. Vui lòng kiểm tra kỹ thông tin đơn thuốc trước khi phê duyệt."
            type="info"
            showIcon
          />
        </div>
        
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
      </Modal>
      
      {/* Modal từ chối đơn thuốc */}
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
        confirmLoading={loading}
      >
        <div style={{ marginBottom: '16px' }}>
          <Alert
            message="Từ chối đơn thuốc"
            description="Khi bạn từ chối đơn thuốc này, khách hàng sẽ được thông báo và cần phải gửi lại đơn thuốc mới. Vui lòng cung cấp lý do từ chối rõ ràng để khách hàng có thể hiểu và khắc phục vấn đề."
            type="warning"
            showIcon
          />
        </div>
        
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
      </Modal>
    </div>
  );
};

export default PrescriptionManagement;