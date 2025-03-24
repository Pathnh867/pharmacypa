// File đầy đủ: pharmacyai/src/pages/OrderHistory/OrderHistory.jsx

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
import './style.css';

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
    );
  };
  
  // Render sản phẩm trong modal chi tiết
  const renderOrderItems = (items) => {
    return (
      <div className="order-items">
        {items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-details">
              <div className="item-name">{item.name}</div>
              <div className="item-quantity">Số lượng: {item.amount}</div>
            </div>
            <div className="item-price">{convertPrice(item.price * item.amount)}</div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <Title level={2}>Lịch sử đơn hàng</Title>
        <Text>Xem thông tin và trạng thái các đơn hàng của bạn</Text>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
          <div>Đang tải dữ liệu đơn hàng...</div>
        </div>
      ) : orders.length > 0 ? (
        <div className="order-table">
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
        <div className="empty-orders">
          <Empty 
            description="Bạn chưa có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/')}
            icon={<ShoppingOutlined />}
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
          <div className="order-details">
            <div className="order-details-grid">
              <div className="order-info">
                <Card title="Thông tin đơn hàng" bordered={false}>
                  <div className="info-row">
                    <span className="info-label">Mã đơn hàng:</span>
                    <span className="info-value">{selectedOrder._id}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ngày đặt:</span>
                    <span className="info-value">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phương thức thanh toán:</span>
                    <span className="info-value">
                      {selectedOrder.paymentMethod === 'momo' ? (
                        <span><DollarOutlined /> Ví MoMo</span>
                      ) : (
                        <span><DollarOutlined /> Thanh toán khi nhận hàng</span>
                      )}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Trạng thái:</span>
                    <span className="info-value">
                      <Tag color={getStatusInfo(selectedOrder.status).color} icon={getStatusInfo(selectedOrder.status).icon}>
                        {getStatusInfo(selectedOrder.status).text}
                      </Tag>
                    </span>
                  </div>
                  {selectedOrder.estimatedDeliveryDate && (
                    <div className="info-row">
                      <span className="info-label">Ngày giao dự kiến:</span>
                      <span className="info-value">
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
                  <div className="info-row">
                    <span className="info-label">Người nhận:</span>
                    <span className="info-value">
                      <UserOutlined /> {selectedOrder.shippingAddress.fullName}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Số điện thoại:</span>
                    <span className="info-value">
                      <PhoneOutlined /> {selectedOrder.shippingAddress.phone}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">
                      <EnvironmentOutlined /> {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                    </span>
                  </div>
                </Card>
              </div>
              
              <div className="order-status">
                <Card title="Lịch sử trạng thái" bordered={false}>
                  {renderStatusTimeline(selectedOrder.statusHistory)}
                </Card>
              </div>
            </div>
            
            <Card title="Sản phẩm" bordered={false} style={{ marginTop: '16px' }}>
              {renderOrderItems(selectedOrder.orderItems)}
              
              <div className="order-summary">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{convertPrice(selectedOrder.itemsPrice)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{convertPrice(selectedOrder.shippingPrice)}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng:</span>
                  <span>{convertPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>
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