// pharmacyai/src/components/AdminOrder/AdminOrder.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Select, 
  Input, 
  DatePicker, 
  message, 
  Card, 
  Timeline, 
  Typography,
  Tooltip,
  Drawer,
  Statistic,
  Row,
  Col,
  Badge,
  Descriptions,
  Popconfirm,
  Spin
} from 'antd';
import {
  EyeOutlined,
  CarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  UserOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  DollarOutlined,
  MailOutlined
} from '@ant-design/icons';
import * as OrderService from '../../services/OrderService';
import * as UserService from '../../services/UserService';
import { convertPrice, formatOrderDate } from '../../utils';
import moment from 'moment';

// Import style từ file style.js
import { 
  WrapperHeader, 
  OrderItem, 
  OrderItemsList, 
  StatusBadge, 
  StatsCard, 
  TimelineContainer,
  OrderSummary,
  colors
} from './style';

// Import các component styled chung từ AdminUser để đồng bộ style
import {
  AdminSectionTitle,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSearchContainer
} from '../AdminUser/style';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const AdminOrder = () => {
  // State quản lý danh sách đơn hàng và phân trang
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // State quản lý drawer và modal
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // Lấy thông tin user từ redux store
  const user = useSelector((state) => state.user);
  
  // State cho tìm kiếm và lọc
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(null);
  
  // State cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  
  // Thống kê đơn hàng
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    pendingRevenue: 0
  });
  
  // Tải đơn hàng khi component mount
  useEffect(() => {
    loadOrders(0, pagination.pageSize);
  }, []);
  
  // Tính toán thống kê từ danh sách đơn hàng
  useEffect(() => {
    if (orders.length > 0) {
      // Tính doanh thu từ đơn hàng đã giao
      const totalRevenue = orders
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + order.totalPrice, 0);
      
      // Tính doanh thu từ đơn hàng đang xử lý
      const pendingRevenue = orders
        .filter(order => ['pending', 'processing', 'shipping'].includes(order.status))
        .reduce((total, order) => total + order.totalPrice, 0);
        
      // Cập nhật stats
      const newStats = {
        total: orders.length,
        pending: orders.filter(order => order.status === 'pending').length,
        processing: orders.filter(order => order.status === 'processing').length,
        shipping: orders.filter(order => order.status === 'shipping').length,
        delivered: orders.filter(order => order.status === 'delivered').length,
        cancelled: orders.filter(order => order.status === 'cancelled').length,
        totalRevenue,
        pendingRevenue
      };
      setStats(newStats);
    }
  }, [orders]);
  
  // Tải danh sách đơn hàng
  const loadOrders = async (page, pageSize) => {
    try {
      setLoading(true);
      const response = await OrderService.getAllOrders(
        user?.access_token,
        pageSize,
        page
      );
      
      if (response?.status === 'OK') {
        setOrders(response.data);
        setPagination({
          ...pagination,
          current: page + 1,
          pageSize: pageSize,
          total: response.total
        });
      } else {
        message.error('Không thể tải danh sách đơn hàng');
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      message.error('Đã xảy ra lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };
  
  // Tải thông tin khách hàng
  const loadCustomerInfo = async (userId) => {
    if (!userId) return;
    
    try {
      setLoadingCustomer(true);
      const response = await UserService.getDetailsUser(userId, user?.access_token);
      if (response?.status === 'OK') {
        setCustomerInfo(response.data);
      }
    } catch (error) {
      console.error('Error loading customer info:', error);
    } finally {
      setLoadingCustomer(false);
    }
  };
  
  // Hàm lấy màu sắc và icon cho trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: colors.warning, 
          text: 'Chờ xử lý', 
          icon: <ClockCircleOutlined /> 
        };
      case 'processing':
        return { 
          color: colors.info, 
          text: 'Đang xử lý', 
          icon: <ShoppingOutlined /> 
        };
      case 'shipping':
        return { 
          color: '#722ed1', 
          text: 'Đang giao hàng', 
          icon: <CarOutlined /> 
        };
      case 'delivered':
        return { 
          color: colors.success, 
          text: 'Đã giao hàng', 
          icon: <CheckCircleOutlined /> 
        };
      case 'cancelled':
        return { 
          color: colors.error, 
          text: 'Đã hủy', 
          icon: <CloseCircleOutlined /> 
        };
      default:
        return { 
          color: 'default', 
          text: 'Không xác định', 
          icon: <ExclamationCircleOutlined /> 
        };
    }
  };
  
  // Xử lý thay đổi phân trang
  const handleTableChange = (pagination, filters, sorter) => {
    loadOrders(pagination.current - 1, pagination.pageSize);
  };
  
  // Hiển thị drawer chi tiết đơn hàng
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
    
    // Tải thông tin khách hàng nếu có
    if (order.user && typeof order.user === 'string') {
      loadCustomerInfo(order.user);
    } else if (order.user && order.user._id) {
      loadCustomerInfo(order.user._id);
    }
  };
  
  // Hiển thị modal cập nhật trạng thái
  const showStatusModal = (order) => {
    setSelectedOrder(order);
    form.setFieldsValue({
      status: order.status,
      note: ''
    });
    
    // Nếu trạng thái là shipping, set ngày giao dự kiến
    if (order.estimatedDeliveryDate) {
      form.setFieldsValue({
        estimatedDelivery: moment(order.estimatedDeliveryDate)
      });
    }
    
    setStatusModalVisible(true);
  };
  
  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Chuẩn bị data gửi lên server
      const data = {
        status: values.status,
        note: values.note
      };
      
      // Nếu có ngày giao dự kiến và trạng thái là shipping
      if (values.estimatedDelivery && values.status === 'shipping') {
        data.estimatedDeliveryDate = values.estimatedDelivery.format('YYYY-MM-DD');
      }
      
      const response = await OrderService.updateOrderStatus(
        selectedOrder._id,
        values.status,
        values.note,
        user?.access_token
      );
      
      if (response?.status === 'OK') {
        message.success('Cập nhật trạng thái đơn hàng thành công');
        setStatusModalVisible(false);
        
        // Refresh lại drawer nếu đang mở
        if (drawerVisible) {
          const orderDetails = await OrderService.getOrderStatus(selectedOrder._id, user?.access_token);
          if (orderDetails?.status === 'OK') {
            setSelectedOrder(orderDetails.data);
          }
        }
        
        // Refresh lại danh sách đơn hàng
        loadOrders(pagination.current - 1, pagination.pageSize);
      } else {
        message.error(response?.message || 'Không thể cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng');
    } finally {
      setLoading(false);
    }
  };
  
  // Xử lý tìm kiếm và lọc
  const handleSearch = () => {
    loadOrders(0, pagination.pageSize);
  };
  
  // Reset tìm kiếm và lọc
  const handleResetSearch = () => {
    setSearchText('');
    setDateRange(null);
    setStatusFilter(null);
    setPaymentMethodFilter(null);
    
    loadOrders(0, pagination.pageSize);
  };
  
  // Render lịch sử trạng thái
  const renderStatusTimeline = (statusHistory) => {
    if (!statusHistory || !statusHistory.length) return null;
    
    return (
      <TimelineContainer>
        <Timeline mode="left">
          {statusHistory.map((item, index) => {
            const { color, icon } = getStatusInfo(item.status);
            return (
              <Timeline.Item 
                key={index} 
                color={color} 
                dot={icon}
              >
                <div>
                  <Text strong>{getStatusInfo(item.status).text}</Text>
                  <div>
                    <Text type="secondary">
                      {formatOrderDate(item.timestamp)}
                    </Text>
                  </div>
                  {item.note && <div>{item.note}</div>}
                </div>
              </Timeline.Item>
            );
          })}
        </Timeline>
      </TimelineContainer>
    );
  };
  
  // Render danh sách sản phẩm trong đơn hàng
  const renderOrderItems = (items) => {
    return (
      <OrderItemsList>
        {items && items.map((item, index) => (
          <OrderItem key={index}>
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info">
              <div className="item-name">{item.name}</div>
              <div className="item-price">
                {convertPrice(item.price)} x {item.amount} = {convertPrice(item.price * item.amount)}
              </div>
            </div>
          </OrderItem>
        ))}
      </OrderItemsList>
    );
  };
  
  // Filter data
  const filterData = (data) => {
    if (!data) return [];
    
    return data.filter(item => {
      // Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
      const searchMatch = !searchText || 
                         item._id.toLowerCase().includes(searchText.toLowerCase()) ||
                         (item.shippingAddress?.fullName && item.shippingAddress.fullName.toLowerCase().includes(searchText.toLowerCase()));
      
      // Lọc theo trạng thái
      const statusMatch = !statusFilter || item.status === statusFilter;
      
      // Lọc theo phương thức thanh toán
      const paymentMatch = !paymentMethodFilter || item.paymentMethod === paymentMethodFilter;
      
      // Lọc theo khoảng thời gian
      let dateMatch = true;
      if (dateRange && dateRange[0] && dateRange[1]) {
        const orderDate = new Date(item.createdAt);
        const startDate = dateRange[0].startOf('day').toDate();
        const endDate = dateRange[1].endOf('day').toDate();
        dateMatch = orderDate >= startDate && orderDate <= endDate;
      }
      
      return searchMatch && statusMatch && paymentMatch && dateMatch;
    });
  };
  
  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: id => (
        <a onClick={() => showOrderDetails(orders.find(o => o._id === id))}>
          {id.slice(-8).toUpperCase()}
        </a>
      ),
      width: 100,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'shippingAddress',
      key: 'customer',
      render: (shippingAddress, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {shippingAddress?.fullName || (record.user && (typeof record.user === 'object' ? (record.user.name || record.user.email) : 'User: ' + record.user.slice(-6))) || 'Không xác định'}
          </div>
          {shippingAddress?.phone && (
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>
              <PhoneOutlined style={{ marginRight: '5px' }} />
              {shippingAddress.phone}
            </div>
          )}
        </div>
      ),
      width: 180,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => formatOrderDate(date),
      width: 150,
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: price => (
        <div style={{ color: colors.primary, fontWeight: '600' }}>
          {convertPrice(price)}
        </div>
      ),
      width: 120,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method, record) => (
        <div>
          <div>{method === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng'}</div>
          {record.isPaid ? (
            <Tag color="success">Đã thanh toán</Tag>
          ) : (
            <Tag color="warning">Chưa thanh toán</Tag>
          )}
        </div>
      ),
      width: 150,
      filters: [
        { text: 'MoMo', value: 'momo' },
        { text: 'COD', value: 'later_money' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
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
      width: 120,
      filters: [
        { text: 'Chờ xử lý', value: 'pending' },
        { text: 'Đang xử lý', value: 'processing' },
        { text: 'Đang giao hàng', value: 'shipping' },
        { text: 'Đã giao hàng', value: 'delivered' },
        { text: 'Đã hủy', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => showOrderDetails(record)}
            >
              Chi tiết
            </Button>
          </Tooltip>
          <Tooltip title="Cập nhật trạng thái">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => showStatusModal(record)}
            >
              Cập nhật
            </Button>
          </Tooltip>
        </Space>
      ),
      width: 180,
    },
  ];
  
  // Data source cho bảng
  const dataSource = orders ? filterData(orders).map(item => ({
    ...item,
    key: item._id
  })) : [];
  
  // Các option cho filter trạng thái
  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];
  
  // Các option cho filter phương thức thanh toán
  const paymentMethodOptions = [
    { value: 'momo', label: 'Ví MoMo' },
    { value: 'later_money', label: 'Thanh toán khi nhận hàng' }
  ];
  
  return (
    <div>
      <AdminSectionTitle>Quản lý đơn hàng</AdminSectionTitle>
      
      {/* Thống kê đơn hàng */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: colors.info }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đang giao"
              value={stats.shipping}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã giao"
              value={stats.delivered}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: colors.error }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: colors.primary }}
              formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Bộ lọc tìm kiếm */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <AdminSearchContainer>
          <div className="search-item">
            <AdminInput 
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng" 
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>
          <div className="search-item">
            <RangePicker 
              style={{ width: '100%' }}
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="search-item">
            <AdminSelect
              placeholder="Trạng thái"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </AdminSelect>
          </div>
          <div className="search-item">
            <AdminSelect
              placeholder="Phương thức thanh toán"
              style={{ width: '100%' }}
              value={paymentMethodFilter}
              onChange={setPaymentMethodFilter}
              allowClear
            >
              {paymentMethodOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </AdminSelect>
          </div>
          <div className="search-actions">
            <AdminButton type="primary" icon={<FilterOutlined />} onClick={handleSearch} ghost>
              Lọc
            </AdminButton>
            <AdminButton icon={<ReloadOutlined />} onClick={handleResetSearch}>
              Đặt lại
            </AdminButton>
          </div>
        </AdminSearchContainer>
      </AdminCard>
      
      {/* Bảng danh sách đơn hàng */}
      <AdminCard>
        <AdminTable
          columns={columns}
          dataSource={dataSource}
          rowKey="_id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      </AdminCard>
      
      {/* Drawer chi tiết đơn hàng */}
      <Drawer
        title={`Chi tiết đơn hàng #${selectedOrder?._id?.slice(-8).toUpperCase() || ''}`}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={720}
        extra={
          <AdminButton 
            type="primary" 
            onClick={() => {
              setDrawerVisible(false);
              showStatusModal(selectedOrder);
            }}
          >
            Cập nhật trạng thái
          </AdminButton>
        }
      >
        {selectedOrder && (
          <div className="order-details">
            <Row gutter={16}>
              <Col span={12}>
                <AdminCard title="Thông tin đơn hàng" bordered={false}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Mã đơn hàng">
                      {selectedOrder._id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt hàng">
                      {formatOrderDate(selectedOrder.createdAt)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">
                      {selectedOrder.paymentMethod === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                      {selectedOrder.isPaid ? (
                        <Badge status="success" text="Đã thanh toán" />
                      ) : (
                        <Badge status="warning" text="Chưa thanh toán" />
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                      <Tag 
                        color={getStatusInfo(selectedOrder.status).color}
                        icon={getStatusInfo(selectedOrder.status).icon}
                      >
                        {getStatusInfo(selectedOrder.status).text}
                      </Tag>
                    </Descriptions.Item>
                    {selectedOrder.estimatedDeliveryDate && (
                      <Descriptions.Item label="Ngày giao dự kiến">
                        {formatOrderDate(selectedOrder.estimatedDeliveryDate, false)}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </AdminCard>
                
                <AdminCard title="Thông tin khách hàng" bordered={false} style={{ marginTop: '16px' }}>
                  {loadingCustomer ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Spin size="small" />
                    </div>
                  ) : (
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={<><UserOutlined /> Họ tên</>}>
                        {selectedOrder.shippingAddress?.fullName}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                        {selectedOrder.shippingAddress?.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label={<><EnvironmentOutlined /> Địa chỉ</>}>
                        {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                      </Descriptions.Item>
                      {customerInfo && (
                        <Descriptions.Item label={<><MailOutlined /> Email</>}>
                          {customerInfo.email}
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  )}
                </AdminCard>
              </Col>
              
              <Col span={12}>
                <AdminCard title="Lịch sử trạng thái" bordered={false}>
                  {renderStatusTimeline(selectedOrder.statusHistory)}
                </AdminCard>
              </Col>
            </Row>
            
            <AdminCard title="Sản phẩm đã đặt" style={{ marginTop: '16px' }}>
              {renderOrderItems(selectedOrder.orderItems)}
              
              <OrderSummary>
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{convertPrice(selectedOrder.itemsPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{convertPrice(selectedOrder.shippingPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Tổng cộng:</span>
                  <span>{convertPrice(selectedOrder.totalPrice)}</span>
                </div>
              </OrderSummary>
            </AdminCard>
            
            {/* Phần ghi chú hành động */}
            <AdminCard title="Ghi chú quản trị" style={{ marginTop: '16px' }}>
              <Form layout="vertical">
                <Form.Item label="Ghi chú mới">
                  <TextArea 
                    rows={3} 
                    placeholder="Nhập ghi chú cho đơn hàng này..." 
                  />
                </Form.Item>
                <Form.Item>
                  <AdminButton type="primary">Lưu ghi chú</AdminButton>
                </Form.Item>
              </Form>
            </AdminCard>
          </div>
        )}
      </Drawer>
      
      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <AdminSelect>
              <Option value="pending">Chờ xử lý</Option>
              <Option value="processing">Đang xử lý</Option>
              <Option value="shipping">Đang giao hàng</Option>
              <Option value="delivered">Đã giao hàng</Option>
              <Option value="cancelled">Đã hủy</Option>
            </AdminSelect>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <TextArea rows={4} placeholder="Nhập ghi chú về việc thay đổi trạng thái (không bắt buộc)" />
          </Form.Item>
          
          {form.getFieldValue('status') === 'shipping' && (
            <Form.Item
              name="estimatedDelivery"
              label="Ngày giao dự kiến"
            >
              <DatePicker 
                format="DD/MM/YYYY"
                placeholder="Chọn ngày giao dự kiến"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}
          
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button onClick={() => setStatusModalVisible(false)} style={{ marginRight: '10px' }}>
              Hủy
            </Button>
            <AdminButton type="primary" onClick={handleUpdateStatus} loading={loading}>
              Cập nhật trạng thái
            </AdminButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrder;