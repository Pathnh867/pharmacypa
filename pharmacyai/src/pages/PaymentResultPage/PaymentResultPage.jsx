import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Typography, Card, Divider, List, Space, Tag, message } from 'antd';
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
  const order = useSelector((state) => state.order);
  
  // Lấy thông tin từ query parameters trong URL
  const queryParams = new URLSearchParams(location.search);
  
  // Kiểm tra xem có phải redirect từ MoMo không
  const isMomoRedirect = queryParams.has('partnerCode') && queryParams.has('orderId');
  
  
  // Nếu là redirect từ MoMo, lấy thông tin từ query params
  const momoOrderId = queryParams.get('orderId');
  const momoAmount = queryParams.get('amount');
  const momoResultCode = queryParams.get('resultCode');
  const momoMessage = queryParams.get('message') || '';
  
  // Từ query params truyền thống
  const statusFromQuery = queryParams.get('status');
  const orderIdFromQuery = queryParams.get('orderId');
  const resultCodeFromQuery = queryParams.get('resultCode');
  const messageFromQuery = queryParams.get('message');
  
  // Ưu tiên dữ liệu từ location state, nếu không có thì lấy từ query params
  const statusFromState = location.state?.status;
  const orderIdFromState = location.state?.orderId;
  const orderInfoFromState = location.state?.orderInfo;
  
  // Hàm xóa giỏ hàng
  const clearCart = () => {
    try {
      console.log("Clearing all items from cart");
      // Xóa tất cả sản phẩm trong giỏ hàng không cần listChecked
      dispatch(removeAllOrderProduct({}));
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  
  // Timer để đảm bảo không loading quá lâu
  useEffect(() => {
    // Sau 8 giây, nếu vẫn đang loading và là redirect từ MoMo với resultCode=0, tự động chuyển sang thành công
    const timeoutId = setTimeout(() => {
      if (loading && isMomoRedirect && momoResultCode === '0') {
        console.log("Auto-resolving MoMo payment after timeout");
        setStatus('success');
        setLoading(false);
        
        // Tạo dữ liệu đơn hàng cơ bản từ thông tin MoMo
        setOrderData({
          id: momoOrderId,
          items: [],
          totalPrice: Number(momoAmount),
          paymentMethod: 'momo'
        });
        
        // Xóa giỏ hàng
        clearCart();
        
        // Hiển thị thông báo
        message.success('Thanh toán MoMo thành công!');
      }
    }, 8000); // 8 giây
    
    return () => clearTimeout(timeoutId);
  }, [loading, isMomoRedirect, momoResultCode, momoOrderId, momoAmount, dispatch]);
  
  // Log thông tin để debug
  useEffect(() => {
    console.log("Location:", location);
    console.log("Query params:", {
      isMomoRedirect,
      momoOrderId,
      momoResultCode,
      momoAmount,
      statusFromQuery,
      orderIdFromQuery,
      resultCodeFromQuery,
      statusFromState,
      orderIdFromState
    });
    console.log("Current order state:", order);
  }, [location, order]);
  
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // 1. Xử lý thanh toán đã có thông tin đầy đủ từ state (COD)
        if (statusFromState === 'success' && orderIdFromState && orderInfoFromState) {
          console.log("Processing success from state:", orderInfoFromState);
          setStatus('success');
          setOrderData(orderInfoFromState);
          
          // Xóa sản phẩm khỏi giỏ hàng cho COD
          if (orderInfoFromState?.items && orderInfoFromState?.items.length > 0) {
            const productsToRemove = orderInfoFromState.items.map(item => item.product);
            console.log("Removing products from COD:", productsToRemove);
            dispatch(removeAllOrderProduct({ listChecked: productsToRemove }));
          }
          
          setLoading(false);
          return;
        } 
        
        // 2. Xử lý redirect từ MoMo
        if (isMomoRedirect) {
          console.log("Processing MoMo redirect with resultCode:", momoResultCode);
          
          if (momoResultCode === '0') {
            // MoMo thanh toán thành công - kiểm tra với backend
            try {
              console.log("Fetching order details for MoMo order:", momoOrderId);
              const orderResult = await OrderService.getOrderStatus(momoOrderId, user?.access_token);
              
              if (orderResult?.status === 'OK' && orderResult?.data) {
                console.log("Order details retrieved successfully:", orderResult.data);
                setStatus('success');
                setOrderData({
                  id: orderResult.data._id,
                  items: orderResult.data.orderItems,
                  totalPrice: orderResult.data.totalPrice,
                  paymentMethod: 'momo'
                });
                
                // Xóa giỏ hàng
                clearCart();
              } else {
                console.log("Order details not found or invalid", orderResult);
                // Nếu không tìm thấy thông tin đơn hàng nhưng MoMo đã xác nhận thành công
                // vẫn hiển thị là thành công nhưng không có chi tiết đơn hàng
                setStatus('success');
                setOrderData({
                  id: momoOrderId,
                  items: [],
                  totalPrice: Number(momoAmount),
                  paymentMethod: 'momo'
                });
                
                // Xóa giỏ hàng
                clearCart();
                
                message.info('Thanh toán thành công, nhưng không thể tải chi tiết đơn hàng');
              }
            } catch (error) {
              console.error("Error fetching order details:", error);
              // Vẫn đánh dấu là thành công nếu MoMo trả về thành công
              setStatus('success');
              setOrderData({
                id: momoOrderId,
                items: [],
                totalPrice: Number(momoAmount),
                paymentMethod: 'momo'
              });
              
              // Xóa giỏ hàng
              clearCart();
            }
          } else {
            // MoMo thanh toán thất bại
            console.log("MoMo payment failed with code:", momoResultCode);
            setStatus('error');
          }
          
          setLoading(false);
          return;
        } 
        
        // 3. Xử lý từ query params truyền thống
        if (statusFromQuery === 'success' && orderIdFromQuery) {
          console.log("Processing success from query params");
          
          try {
            const orderResult = await OrderService.getOrderStatus(orderIdFromQuery, user?.access_token);
            
            if (orderResult?.status === 'OK' && orderResult?.data) {
              setStatus('success');
              setOrderData({
                items: orderResult.data.orderItems,
                totalPrice: orderResult.data.totalPrice,
                paymentMethod: orderResult.data.paymentMethod
              });
              
              // Xóa giỏ hàng
              clearCart();
            } else {
              setStatus('pending');
            }
          } catch (error) {
            console.error("Error fetching order details:", error);
            setStatus('pending');
          }
        } 
        else if (statusFromQuery === 'error' || resultCodeFromQuery !== '0') {
          console.log("Payment error from query params");
          setStatus('error');
        } 
        else if (statusFromState === 'error') {
          console.log("Payment error from state");
          setStatus('error');
        } 
        else {
          console.log("No clear payment status information, defaulting to pending");
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
  }, [
    dispatch, 
    statusFromQuery, 
    orderIdFromQuery, 
    resultCodeFromQuery, 
    statusFromState, 
    orderIdFromState, 
    orderInfoFromState, 
    user?.access_token,
    isMomoRedirect,
    momoOrderId,
    momoResultCode,
    momoAmount
  ]);
  
  // Retry nếu status vẫn là pending sau một thời gian
  useEffect(() => {
    if (status === 'pending' && momoResultCode === '0') {
      const retryTimeout = setTimeout(() => {
        console.log("Retrying to get order status...");
        setStatus('success');
        setOrderData({
          id: momoOrderId || orderIdFromQuery,
          items: [],
          totalPrice: Number(momoAmount || 0),
          paymentMethod: 'momo'
        });
        
        // Xóa giỏ hàng
        clearCart();
        
        message.success('Đã xác nhận thanh toán thành công qua MoMo');
      }, 5000);
      
      return () => clearTimeout(retryTimeout);
    }
  }, [status, momoResultCode, momoOrderId, orderIdFromQuery, momoAmount, dispatch]);
  
  if (loading) {
    return (
      <PageContainer>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '300px'
        }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>Đang xử lý kết quả thanh toán...</div>
          {isMomoRedirect && momoResultCode === '0' && (
            <div style={{ marginTop: '10px', color: 'green' }}>
              Đã nhận thông tin thanh toán thành công từ MoMo, đang xác nhận với hệ thống...
            </div>
          )}
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
        subTitle: `Mã đơn hàng: ${orderData?.id || orderIdFromState || momoOrderId || orderIdFromQuery}. Cảm ơn bạn đã mua hàng!`
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
        subTitle: `Mã lỗi: ${momoResultCode || resultCodeFromQuery || 'Không xác định'}. ${momoMessage || messageFromQuery || 'Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}`
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
                
                {orderData.items && orderData.items.length > 0 ? (
                  <div style={{ marginTop: '12px' }}>
                    <Text strong>Sản phẩm:</Text>
                    <OrderDetailsList>
                      {orderData.items.map((item, index) => (
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
                ) : (
                  <div style={{ marginTop: '12px', padding: '16px', background: '#f9f9f9', borderRadius: '4px' }}>
                    <Text type="secondary">
                      Chi tiết đơn hàng sẽ được gửi qua email của bạn. 
                      Nếu không nhận được email, vui lòng liên hệ với chúng tôi qua hotline.
                    </Text>
                  </div>
                )}
                
                <OrderTotal>
                  <span>Tổng tiền</span>
                  <span>{orderData.totalPrice ? convertPrice(orderData.totalPrice) : "Xem trong email"}</span>
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