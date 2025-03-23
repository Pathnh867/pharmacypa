import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Typography, Card, Divider, List, Space, Tag } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, HomeOutlined, ShoppingOutlined, SmileOutlined, 
  CreditCardOutlined, DollarOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  const [orderData, setOrderData] = useState(null);
  const [status, setStatus] = useState(''); // 'success', 'error', 'pending'
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  
  // Từ query params hoặc từ location state
  const params = new URLSearchParams(location.search);
  const statusFromQuery = params.get('status');
  const orderIdFromQuery = params.get('orderId');
  const resultCodeFromQuery = params.get('resultCode');
  const messageFromQuery = params.get('message');
  
  // Ưu tiên dữ liệu từ location state, nếu không có thì lấy từ query params
  const statusFromState = location.state?.status;
  const orderIdFromState = location.state?.orderId;
  const orderInfoFromState = location.state?.orderInfo;
  
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        if (statusFromState === 'success' && orderIdFromState) {
          // Đã có thông tin đơn hàng từ state (thanh toán COD)
          setStatus('success');
          setOrderData(orderInfoFromState);
          
          // Xóa sản phẩm khỏi giỏ hàng
          if (orderInfoFromState?.items && orderInfoFromState?.items.length > 0) {
            dispatch(removeAllOrderProduct({
              listChecked: orderInfoFromState.items.map(item => item.product)
            }));
          }
        } 
        else if (statusFromQuery === 'success' && orderIdFromQuery) {
          // Xử lý thanh toán MoMo thành công - cần kiểm tra với backend
          try {
            const orderResult = await OrderService.getOrderStatus(orderIdFromQuery, user?.access_token);
            
            if (orderResult?.status === 'OK' && orderResult?.data) {
              setStatus('success');
              setOrderData({
                items: orderResult.data.orderItems,
                totalPrice: orderResult.data.totalPrice,
                paymentMethod: orderResult.data.paymentMethod
              });
              
              // Xóa sản phẩm đã mua khỏi giỏ hàng
              if (orderResult.data.orderItems && orderResult.data.orderItems.length > 0) {
                dispatch(removeAllOrderProduct({
                  listChecked: orderResult.data.orderItems.map(item => item.product)
                }));
              }
            } else {
              setStatus('pending');
            }
          } catch (error) {
            console.error("Error fetching order details:", error);
            setStatus('pending');
          }
        } 
        else if (statusFromQuery === 'error' || resultCodeFromQuery !== '0') {
          // Thanh toán thất bại 
          setStatus('error');
        } 
        else if (statusFromState === 'error') {
          // Lỗi từ state
          setStatus('error');
        } 
        else {
          // Không có thông tin rõ ràng
          setStatus('pending');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error processing payment result:', error);
        setStatus('error');
        setLoading(false);
      }
    };
    
    processPaymentResult();
  }, [dispatch, statusFromQuery, orderIdFromQuery, resultCodeFromQuery, statusFromState, orderIdFromState, orderInfoFromState, user?.access_token]);
  
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
        subTitle: `Mã đơn hàng: ${orderIdFromState || orderIdFromQuery}. Cảm ơn bạn đã mua hàng!`
      };
    } else if (status === 'pending') {
      return {
        icon: <Spin size="large" style={{ fontSize: 72, color: '#1890ff' }} />,
        color: '#1890ff',
        title: 'Đang xử lý thanh toán',
        subTitle: 'Thanh toán của bạn đang được xử lý. Chúng tôi sẽ thông báo cho bạn khi hoàn tất.'
      };
    } else {
      return {
        icon: <CloseCircleFilled style={{ fontSize: 72, color: '#ff4d4f' }} />,
        color: '#ff4d4f',
        title: 'Thanh toán thất bại',
        subTitle: `Mã lỗi: ${resultCodeFromQuery || 'Không xác định'}. ${messageFromQuery || 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}`
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
          
          {status === 'success' && orderData && (
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
                  <PaymentMethodTag method={orderData.paymentMethod === 'momo' ? 'momo' : 'cod'}>
                    {orderData.paymentMethod === 'momo' ? (
                      <><CreditCardOutlined /> Ví MoMo</>
                    ) : (
                      <><DollarOutlined /> Thanh toán khi nhận hàng</>
                    )}
                  </PaymentMethodTag>
                </div>
                
                <div style={{ marginTop: '12px' }}>
                  <Text strong>Sản phẩm:</Text>
                  <OrderDetailsList>
                    {orderData.items && orderData.items.map((item, index) => (
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
                  <span>{convertPrice(orderData.totalPrice)}</span>
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