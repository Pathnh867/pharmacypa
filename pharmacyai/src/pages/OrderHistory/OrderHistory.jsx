import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Modal, 
  message, 
  Empty, 
  Timeline, 
  Tooltip, 
  Card,
  Alert,
  Spin,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  InfoCircleOutlined, 
  ShoppingOutlined, 
  CarOutlined,
  HomeOutlined,
  EyeOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import * as OrderService from '../../services/OrderService';
import { convertPrice } from '../../utils';
import { 
  WrapperHeader, 
  OrderItem, 
  OrderItemsList, 
  StatusBadge, 
  StatsCard, 
  TimelineContainer,
  OrderSummary 
} from './style';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const OrderHistory = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  useEffect(() => {
    // Nếu không có user, redirect đến trang đăng nhập
    if (!user?.access_token) {
      navigate('/sign-in', { state: '/order-history' });
      return;
    }
    
    fetchOrders();
  }, [user?.access_token, navigate]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.getUserOrders(user?.access_token);
      if (response?.status === 'OK') {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm lấy màu sắc và icon cho trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: 'orange', 
          text: 'Chờ xử lý', 
          icon: <ClockCircleOutlined /> 
        };
      case 'processing':
        return { 
          color: 'blue', 
          text: 'Đang xử lý', 
          icon: <ShoppingOutlined /> 
        };
      case 'shipping':
        return { 
          color: 'purple', 
          text: 'Đang giao hàng', 
          icon: <CarOutlined /> 
        };
      case 'delivered':
        return { 
          color: 'green', 
          text: 'Đã giao hàng', 
          icon: <CheckCircleOutlined /> 
        };
      case 'cancelled':
        return { 
          color: 'red', 
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
  
  // Hàm hiển thị modal xác nhận hủy đơn
  const showCancelConfirm = (order) => {
    confirm({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Sau khi hủy, bạn không thể khôi phục lại đơn hàng này.',
      okText: 'Hủy đơn hàng',
      okType: 'danger',
      cancelText: 'Không',
      onOk: () => handleCancelOrder(order._id),
    });
  };
  
  // Hàm xử lý hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await OrderService.cancelOrder(
        orderId, 
        'Khách hàng yêu cầu hủy đơn hàng', 
        user?.access_token
      );
      
      if (response?.status === 'OK') {
        message.success('Hủy đơn hàng thành công');
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error(response?.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      message.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xem chi tiết đơn hàng
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };
  
  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: id => <a onClick={() => showOrderDetails(orders.find(o => o._id === id))}>{id.slice(-8).toUpperCase()}</a>,
      width: 120,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      width: 180,
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: price => convertPrice(price),
      width: 120,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: method => method === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng',
      width: 180,
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
      width: 150,
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
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          >
            Chi tiết
          </Button>
          {(['pending', 'processing'].includes(record.status)) && (
            <Button 
              danger
              size="small" 
              onClick={() => showCancelConfirm(record)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
      width: 180,
    },
  ];
  
  // Render lịch sử trạng thái trong modal chi tiết
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
                      {new Date(item.timestamp).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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
  
  // Render sản phẩm trong modal chi tiết
  const renderOrderItems = (items) => {
    return (
      <OrderItemsList>
        {items.map((item, index) => (
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
  
  return (
    <div style={{ width: '1270px', margin: '0 auto', padding: '20px 15px' }}>
      <div style={{ marginBottom: '24px' }}>
        <WrapperHeader>Lịch sử đơn hàng</WrapperHeader>
        <Text>Xem thông tin và trạng thái các đơn hàng của bạn</Text>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Đang tải dữ liệu đơn hàng...</div>
        </div>
      ) : orders.length > 0 ? (
        <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Table 
            columns={columns} 
            dataSource={orders}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `Tổng ${total} đơn hàng`
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <Empty 
            description="Bạn chưa có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            icon={<ShoppingOutlined />}
            style={{ marginTop: '16px' }}
          >
            Mua sắm ngay
          </Button>
        </div>
      )}
      
      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id?.slice(-8).toUpperCase() || ''}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailsModalVisible(false)}>
            Đóng
          </Button>,
          (['pending', 'processing'].includes(selectedOrder?.status)) && (
            <Button 
              key="cancel" 
              danger
              onClick={() => {
                setDetailsModalVisible(false);
                showCancelConfirm(selectedOrder);
              }}
            >
              Hủy đơn hàng
            </Button>
          )
        ].filter(Boolean)}
        width={800}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Card title="Thông tin đơn hàng" bordered={false}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Mã đơn hàng:</span>
                    <span>{selectedOrder._id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Ngày đặt:</span>
                    <span>
                      {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Phương thức thanh toán:</span>
                    <span>
                      {selectedOrder.paymentMethod === 'momo' ? (
                        <span><DollarOutlined /> Ví MoMo</span>
                      ) : (
                        <span><DollarOutlined /> Thanh toán khi nhận hàng</span>
                      )}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Trạng thái:</span>
                    <span>
                      <Tag color={getStatusInfo(selectedOrder.status).color} icon={getStatusInfo(selectedOrder.status).icon}>
                        {getStatusInfo(selectedOrder.status).text}
                      </Tag>
                    </span>
                  </div>
                  {selectedOrder.estimatedDeliveryDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500, color: '#666' }}>Ngày giao dự kiến:</span>
                      <span>
                        {new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </Card>
                
                <Card title="Địa chỉ giao hàng" bordered={false} style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Người nhận:</span>
                    <span>
                      <UserOutlined /> {selectedOrder.shippingAddress.fullName}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Số điện thoại:</span>
                    <span>
                      <PhoneOutlined /> {selectedOrder.shippingAddress.phone}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 500, color: '#666' }}>Địa chỉ:</span>
                    <span>
                      <EnvironmentOutlined /> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                    </span>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card title="Lịch sử trạng thái" bordered={false}>
                  {renderStatusTimeline(selectedOrder.statusHistory)}
                </Card>
              </div>
            </div>
            
            <Card title="Sản phẩm" bordered={false}>
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
            </Card>
            
            {/* Hướng dẫn theo dõi đơn hàng */}
            {['processing', 'shipping'].includes(selectedOrder.status) && (
              <Alert
                message="Theo dõi đơn hàng"
                description={
                  <div>
                    <p>Đơn hàng của bạn đang được xử lý. Bạn có thể theo dõi trạng thái đơn hàng tại đây.</p>
                    {selectedOrder.status === 'shipping' && (
                      <p>Đơn hàng đang được vận chuyển. Dự kiến sẽ giao hàng vào ngày {selectedOrder.estimatedDeliveryDate ? new Date(selectedOrder.estimatedDeliveryDate).toLocaleDateString('vi-VN') : 'trong vài ngày tới'}.</p>
                    )}
                  </div>
                }
                type="info"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
            
            {/* Hướng dẫn khi đơn hàng bị hủy */}
            {selectedOrder.status === 'cancelled' && (
              <Alert
                message="Đơn hàng đã bị hủy"
                description={
                  <div>
                    <p>Đơn hàng này đã bị hủy. Nếu bạn đã thanh toán, số tiền sẽ được hoàn trả trong 3-5 ngày làm việc.</p>
                    <p>Nếu có thắc mắc, vui lòng liên hệ hotline: 1900-8686.</p>
                  </div>
                }
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
            
            {/* Hướng dẫn khi đơn hàng đã giao */}
            {selectedOrder.status === 'delivered' && (
              <Alert
                message="Đơn hàng đã giao thành công"
                description={
                  <div>
                    <p>Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm tại Nhà thuốc Tiện lợi!</p>
                    <p>Nếu bạn có bất kỳ vấn đề gì với đơn hàng, vui lòng liên hệ hotline: 1900-8686.</p>
                  </div>
                }
                type="success"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;