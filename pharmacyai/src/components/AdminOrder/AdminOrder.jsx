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
  Spin,
  Alert
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
  MailOutlined,
  UndoOutlined,
  RollbackOutlined,
  LockOutlined,
  KeyOutlined
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
const { Password } = Input;

// Mã xác nhận hoàn tác - trong môi trường thực tế, đây có thể là một biến môi trường hoặc cấu hình từ backend
const ADMIN_REVERT_CODE = "admin@2024";

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
  const [revertModalVisible, setRevertModalVisible] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [previousStatusOptions, setPreviousStatusOptions] = useState([]);
  const [adminCode, setAdminCode] = useState('');
  const [adminCodeError, setAdminCodeError] = useState('');
  const [revertReason, setRevertReason] = useState('');
  const [form] = Form.useForm();
  const [revertForm] = Form.useForm();
  
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
    returned: 0,
    refunded: 0,
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
        .filter(order => order.status === 'delivered' || order.status === 'returned' || order.status === 'refunded')
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
        returned: orders.filter(order => order.status === 'returned').length,
        refunded: orders.filter(order => order.status === 'refunded').length,
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

  // Hàm lấy các trạng thái hợp lệ dựa trên trạng thái hiện tại
  const getAvailableStatuses = (currentStatus) => {
    // Danh sách đầy đủ các trạng thái
    const allStatuses = [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'processing', label: 'Đang xử lý' },
      { value: 'shipping', label: 'Đang giao hàng' },
      { value: 'delivered', label: 'Đã giao hàng' },
      { value: 'cancelled', label: 'Đã hủy' },
      { value: 'returned', label: 'Đã trả hàng' },
      { value: 'refunded', label: 'Đã hoàn tiền' }
    ];
    
    // Nếu đơn hàng đã giao, chỉ cho phép chuyển sang trạng thái "trả hàng" hoặc "hoàn tiền"
    if (currentStatus === 'delivered') {
      return allStatuses.filter(status => 
        ['delivered', 'returned', 'refunded'].includes(status.value)
      );
    }
    
    // Nếu đơn hàng đã hủy, không cho phép thay đổi
    if (currentStatus === 'cancelled') {
      return allStatuses.filter(status => status.value === 'cancelled');
    }
    
    // Nếu đã hoàn tiền hoặc trả hàng, không cho phép thay đổi
    if (['returned', 'refunded'].includes(currentStatus)) {
      return allStatuses.filter(status => 
        ['returned', 'refunded'].includes(status.value)
      );
    }
    
    // Các trạng thái khác chỉ được chuyển tiếp, không được quay lại
    const statusOrder = ['pending', 'processing', 'shipping', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (currentIndex !== -1) {
      // Cho phép chuyển sang các trạng thái tiếp theo hoặc huỷ
      return allStatuses.filter(status => 
        statusOrder.indexOf(status.value) >= currentIndex || 
        status.value === 'cancelled'
      );
    }
    
    // Mặc định trả về tất cả trạng thái
    return allStatuses;
  };

  // Hàm để lấy các trạng thái trước đó có thể hoàn tác
  const getPreviousAvailableStatuses = (currentStatus) => {
    // Danh sách đầy đủ các trạng thái
    const allStatuses = [
      { value: 'pending', label: 'Chờ xử lý' },
      { value: 'processing', label: 'Đang xử lý' },
      { value: 'shipping', label: 'Đang giao hàng' },
      { value: 'delivered', label: 'Đã giao hàng' }
    ];
    
    const statusOrder = ['pending', 'processing', 'shipping', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (currentIndex > 0) {
      // Chỉ hiển thị trạng thái trước đó
      return allStatuses.filter(status => 
        statusOrder.indexOf(status.value) === currentIndex - 1
      );
    }
    
    return [];
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
      case 'returned':
        return {
          color: '#fa8c16',
          text: 'Đã trả hàng',
          icon: <RollbackOutlined />
        };
      case 'refunded':
        return {
          color: '#eb2f96',
          text: 'Đã hoàn tiền',
          icon: <UndoOutlined />
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
    
    // Lấy các trạng thái hợp lệ dựa trên trạng thái hiện tại
    const availableStatuses = getAvailableStatuses(order.status);
    setStatusOptions(availableStatuses);
    
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

  // Hiển thị modal hoàn tác trạng thái
  const showRevertModal = (order) => {
    setSelectedOrder(order);
    
    // Lấy các trạng thái trước đó có thể hoàn tác
    const previousStatuses = getPreviousAvailableStatuses(order.status);
    setPreviousStatusOptions(previousStatuses);
    
    // Nếu không có trạng thái nào trước đó, hiển thị thông báo và không mở modal
    if (previousStatuses.length === 0) {
      message.info('Không thể hoàn tác trạng thái này');
      return;
    }
    
    setAdminCode('');
    setAdminCodeError('');
    setRevertReason('');
    
    revertForm.setFieldsValue({
      status: previousStatuses[0]?.value,
      note: '',
      adminCode: ''
    });
    
    setRevertModalVisible(true);
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

  // Hoàn tác trạng thái đơn hàng
  const handleRevertStatus = async () => {
    try {
      const values = await revertForm.validateFields();
      
      // Kiểm tra mã xác nhận admin
      if (values.adminCode !== ADMIN_REVERT_CODE) {
        setAdminCodeError('Mã xác nhận không đúng. Vui lòng liên hệ quản trị viên cấp cao.');
        return;
      }
      
      setLoading(true);
      
      // Chuẩn bị data gửi lên server
      const data = {
        status: values.status,
        note: `[HOÀN TÁC] ${values.note} (Admin: ${user?.name || user?.email})`,
        isRevert: true // Thêm cờ đánh dấu đây là hoàn tác
      };
      
      const response = await OrderService.updateOrderStatus(
        selectedOrder._id,
        values.status,
        data.note,
        user?.access_token
      );
      
      if (response?.status === 'OK') {
        message.success('Hoàn tác trạng thái đơn hàng thành công');
        setRevertModalVisible(false);
        
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
        message.error(response?.message || 'Không thể hoàn tác trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Error reverting order status:', error);
      message.error('Đã xảy ra lỗi khi hoàn tác trạng thái đơn hàng');
    } finally {
      setLoading(false);
      setAdminCodeError('');
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
            const isRevert = item.note && item.note.includes('[HOÀN TÁC]');
            
            return (
              <Timeline.Item 
                key={index} 
                color={isRevert ? '#ff7a45' : color} 
                dot={isRevert ? <UndoOutlined /> : icon}
              >
                <div>
                  <Text strong>
                    {isRevert ? `Hoàn tác: ${getStatusInfo(item.status).text}` : getStatusInfo(item.status).text}
                  </Text>
                  <div>
                    <Text type="secondary">
                      {formatOrderDate(item.timestamp)}
                    </Text>
                  </div>
                  {item.note && (
                    <div style={{ 
                      padding: isRevert ? '5px' : '0', 
                      background: isRevert ? 'rgba(255, 122, 69, 0.1)' : 'transparent',
                      borderLeft: isRevert ? '3px solid #ff7a45' : 'none'
                    }}>
                      {item.note}
                    </div>
                  )}
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
        { text: 'Đã trả hàng', value: 'returned' },
        { text: 'Đã hoàn tiền', value: 'refunded' },
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
          {['cancelled', 'refunded', 'returned'].includes(record.status) ? (
            <Tooltip title="Không thể sửa đổi">
              <Button 
                type="default" 
                size="small" 
                icon={<EditOutlined />}
                disabled
              >
                Cập nhật
              </Button>
            </Tooltip>
          ) : (
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
          )}
          {(['delivered', 'shipping'].includes(record.status)) && (
            <Tooltip title="Hoàn tác trạng thái">
              <Button 
                type="dashed" 
                size="small" 
                icon={<UndoOutlined />}
                onClick={() => showRevertModal(record)}
                danger
              >
                Hoàn tác
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
      width: 240,
    },
  ];
  
  // Data source cho bảng
  const dataSource = orders ? filterData(orders).map(item => ({
    ...item,
    key: item._id
  })) : [];
  
  // Các option cho filter trạng thái
  const allStatusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'returned', label: 'Đã trả hàng' },
    { value: 'refunded', label: 'Đã hoàn tiền' }
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
        <Col span={3}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.total}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: colors.info }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Chờ xử lý"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Đang giao"
              value={stats.shipping}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Đã giao"
              value={stats.delivered}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Đã hủy"
              value={stats.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: colors.error }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Đã trả hàng"
              value={stats.returned}
              prefix={<RollbackOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Đã hoàn tiền"
              value={stats.refunded}
              prefix={<UndoOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
        <Col span={3}>
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
              {allStatusOptions.map(option => (
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
          selectedOrder && !['cancelled', 'refunded', 'returned'].includes(selectedOrder.status) ? (
            <Space>
              {(['delivered', 'shipping'].includes(selectedOrder.status)) && (
                <AdminButton 
                  type="dashed" 
                  danger
                  onClick={() => {
                    setDrawerVisible(false);
                    showRevertModal(selectedOrder);
                  }}
                  icon={<UndoOutlined />}
                >
                  Hoàn tác
                </AdminButton>
              )}
              <AdminButton 
                type="primary" 
                onClick={() => {
                  setDrawerVisible(false);
                  showStatusModal(selectedOrder);
                }}
              >
                Cập nhật trạng thái
              </AdminButton>
            </Space>
          ) : null
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
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
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
      
      {/* Modal hoàn tác trạng thái */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
            <UndoOutlined style={{ marginRight: '8px' }} />
            Hoàn tác trạng thái đơn hàng
          </div>
        }
        open={revertModalVisible}
        onCancel={() => setRevertModalVisible(false)}
        footer={null}
        width={500}
      >
        <Alert
          message="Cảnh báo: Hành động hoàn tác"
          description="Hoàn tác trạng thái là hành động đặc biệt, chỉ nên thực hiện khi đã xác nhận lỗi nhập liệu. Mọi hoạt động hoàn tác sẽ được ghi lại và kiểm tra."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        
        <Form
          form={revertForm}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="Hoàn tác về trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <AdminSelect>
              {previousStatusOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </AdminSelect>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="Lý do hoàn tác"
            rules={[{ required: true, message: 'Vui lòng nhập lý do hoàn tác' }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập lý do cụ thể cho việc hoàn tác trạng thái (bắt buộc)" 
              value={revertReason}
              onChange={(e) => setRevertReason(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            name="adminCode"
            label={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LockOutlined style={{ marginRight: '8px' }} />
                <span>Mã xác nhận quản trị viên</span>
              </div>
            }
            rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
            help="Liên hệ quản trị viên cấp cao để lấy mã xác nhận"
            validateStatus={adminCodeError ? 'error' : ''}
          >
            <Password
              prefix={<KeyOutlined />}
              placeholder="Nhập mã xác nhận của quản trị viên cấp cao"
              value={adminCode}
              onChange={(e) => {
                setAdminCode(e.target.value);
                setAdminCodeError('');
              }}
            />
          </Form.Item>
          
          {adminCodeError && (
            <Alert
              message={adminCodeError}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <Button onClick={() => setRevertModalVisible(false)} style={{ marginRight: '10px' }}>
              Hủy
            </Button>
            <AdminButton type="primary" danger onClick={handleRevertStatus} loading={loading}>
              Xác nhận hoàn tác
            </AdminButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrder;