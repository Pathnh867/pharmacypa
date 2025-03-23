import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Typography, Card, Divider, List, Space, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, HomeOutlined, ShoppingOutlined, SmileOutlined, 
  CreditCardOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import { removeAllOrderProduct } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import { 
  PageContainer, PageContent, ResultCard, OrderSummary, OrderInfo, OrderItem, 
  OrderTotal, ActionButtons, PaymentMethodTag, OrderDetailsList, OrderDetailsItem
} from './style';

const { Title, Text, Paragraph } = Typography;

const PaymentResultPage = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Từ query params hoặc từ location state
  const params = new URLSearchParams(location.search);
  const statusFromQuery = params.get('status');
  const orderIdFromQuery = params.get('orderId');
  const resultCodeFromQuery = params.get('resultCode');
  const messageFromQuery = params.get('message');
  
  // Ưu tiên dữ liệu từ location state, nếu không có thì lấy từ query params
  const status = location.state?.status || statusFromQuery;
  const orderId = location.state?.orderId || orderIdFromQuery;
  const resultCode = location.state?.resultCode || resultCodeFromQuery;
  const message = location.state?.message || messageFromQuery;
  const orderInfo = location.state?.orderInfo;
  
  // Trong PaymentResultPage.jsx - useEffect
  useEffect(() => {
    const processPaymentResult = async () => {
        try {
            if (statusFromQuery === 'success' && orderIdFromQuery) {
                // Kiểm tra trạng thái đơn hàng từ backend
                const orderStatus = await OrderService.getOrderStatus(orderIdFromQuery);
                
                if (orderStatus.isPaid) {
                    // Đơn hàng đã thanh toán thành công
                    // Xóa sản phẩm khỏi giỏ hàng
                    if (orderStatus.orderItems && orderStatus.orderItems.length > 0) {
                        dispatch(removeAllOrderProduct({
                            listChecked: orderStatus.orderItems.map(item => item.product)
                        }));
                    }
                    
                    // Cập nhật trạng thái hiển thị
                    setStatus('success');
                    setOrderInfo(orderStatus);
                } else {
                    // Đơn hàng chưa được cập nhật thanh toán
                    setStatus('pending');
                }
            } else if (statusFromQuery === 'error') {
                // Thanh toán thất bại
                setStatus('error');
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error processing payment result:', error);
            setStatus('error');
            setLoading(false);
        }
    };
    
    processPaymentResult();
  }, [dispatch, statusFromQuery, orderIdFromQuery]);
  
  if (loading) {
    return (
      <PageContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px'
        }}>
          <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
        </div>
      </PageContainer>
    );
  }
  
  // Xác định loại icon và màu sắc dựa trên trạng thái
  const getStatusInfo = () => {
    if (status === 'success') {
      return {
        icon: <CheckCircleFilled style={{ fontSize: 72, color: '#52c41a' }} />,
        color: '#52c41a',
        title: 'Đặt hàng thành công!',
        subTitle: `Mã đơn hàng: ${orderId}. Cảm ơn bạn đã mua hàng!`
      };
    } else {
      return {
        icon: <CloseCircleFilled style={{ fontSize: 72, color: '#ff4d4f' }} />,
        color: '#ff4d4f',
        title: 'Thanh toán thất bại',
        subTitle: `Mã lỗi: ${resultCode || 'Không xác định'}. ${message || 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}`
      };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <PageContainer>
      <PageContent>
        <ResultCard>
          <Result
            icon={statusInfo.icon}
            title={<Title level={2} style={{ color: statusInfo.color }}>{statusInfo.title}</Title>}
            subTitle={<Paragraph>{statusInfo.subTitle}</Paragraph>}
            extra={
              <ActionButtons>
                <Button 
                  type="primary" 
                  icon={<HomeOutlined />}
                  onClick={() => navigate('/')}
                  size="large"
                >
                  Về trang chủ
                </Button>
                
                {status === 'success' && (
                  <Button 
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate('/products')}
                    size="large"
                  >
                    Tiếp tục mua sắm
                  </Button>
                )}
                
                {status !== 'success' && (
                  <Button 
                    type="default" 
                    danger
                    icon={<ShoppingCartOutlined />}
                    onClick={() => navigate('/order')}
                    size="large"
                  >
                    Quay lại giỏ hàng
                  </Button>
                )}
              </ActionButtons>
            }
          />
          
          {status === 'success' && orderInfo && (
            <OrderSummary>
              <Divider>
                <Space>
                  <ShoppingCartOutlined />
                  <span>Chi tiết đơn hàng</span>
                </Space>
              </Divider>
              
              <OrderInfo>
                <div>
                  <Text strong>Phương thức thanh toán:</Text>
                  <PaymentMethodTag method={orderInfo.paymentMethod === 'momo' ? 'momo' : 'cod'}>
                    {orderInfo.paymentMethod === 'momo' ? (
                      <><CreditCardOutlined /> Ví MoMo</>
                    ) : (
                      <><DollarOutlined /> Thanh toán khi nhận hàng</>
                    )}
                  </PaymentMethodTag>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <Text strong>Sản phẩm:</Text>
                  <OrderDetailsList>
                    {orderInfo.items && orderInfo.items.map((item, index) => (
                      <OrderDetailsItem key={index}>
                        <div className="item-info">
                          <img src={item.image} alt={item.name} />
                          <div>
                            <Text strong>{item.name}</Text>
                            <Text>Số lượng: {item.amount}</Text>
                          </div>
                        </div>
                        <Text strong>{convertPrice(item.price * item.amount)}</Text>
                      </OrderDetailsItem>
                    ))}
                  </OrderDetailsList>
                </div>
                
                <OrderTotal>
                  <span>Tổng tiền</span>
                  <span>{convertPrice(orderInfo.totalPrice)}</span>
                </OrderTotal>
              </OrderInfo>
              
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <Space align="center">
                  <SmileOutlined style={{ color: '#52c41a' }} />
                  <Text>Nhà thuốc tiện lợi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng</Text>
                </Space>
              </div>
            </OrderSummary>
          )}
        </ResultCard>
      </PageContent>
    </PageContainer>
  );
};

export default PaymentResultPage;