import React, { useEffect, useState } from 'react';
import { Result, Button, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import { removeAllOrderProduct } from '../../redux/slide/orderSlide';

const PaymentResultPage = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Lấy query parameters
  const params = new URLSearchParams(location.search);
  const status = params.get('status');
  const orderId = params.get('orderId');
  const resultCode = params.get('resultCode');
  
  useEffect(() => {
    const processMomoPayment = async () => {
      try {
        // Lấy thông tin đơn hàng từ localStorage
        const pendingOrderStr = localStorage.getItem('pendingMomoOrder');
        
        if (pendingOrderStr && status === 'success') {
          const pendingOrder = JSON.parse(pendingOrderStr);
          
          // Tạo đơn hàng khi thanh toán thành công
          const orderData = {
            token: localStorage.getItem('access_token')?.replace(/"/g, ''),
            orderItems: pendingOrder.orderItems,
            fullName: pendingOrder.fullName,
            address: pendingOrder.address,
            phone: pendingOrder.phone,
            city: pendingOrder.city,
            paymentMethod: 'momo',
            itemsPrice: pendingOrder.itemsPrice,
            shippingPrice: pendingOrder.shippingPrice,
            totalPrice: pendingOrder.totalPrice,
            user: pendingOrder.user,
            isPaid: true,
            paidAt: new Date().toISOString()
          };
          
          // Gọi API tạo đơn hàng
          await OrderService.createOrder(orderData);
          
          // Xóa sản phẩm khỏi giỏ hàng
          if (pendingOrder.orderItems && pendingOrder.orderItems.length > 0) {
            dispatch(removeAllOrderProduct({ 
              listChecked: pendingOrder.orderItems.map(item => item.product) 
            }));
          }
          
          // Xóa đơn hàng chờ
          localStorage.removeItem('pendingMomoOrder');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error processing MoMo payment result:', error);
        setLoading(false);
      }
    };
    
    processMomoPayment();
  }, [dispatch, status]);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
      </div>
    );
  }
  
  return (
    <div style={{ 
      padding: '50px 0', 
      background: '#f5f5f5', 
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '600px',
        background: '#fff',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {status === 'success' ? (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Mã đơn hàng: ${orderId}. Cảm ơn bạn đã mua hàng!`}
            extra={[
              <Button 
                type="primary" 
                key="home" 
                onClick={() => navigate('/')}
                style={{ background: '#4cb551', borderColor: '#4cb551' }}
              >
                Về trang chủ
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle={`Mã lỗi: ${resultCode}. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.`}
            extra={[
              <Button 
                type="primary" 
                key="try-again" 
                onClick={() => navigate('/payment')}
                style={{ background: '#4cb551', borderColor: '#4cb551' }}
              >
                Thử lại
              </Button>,
              <Button key="home" onClick={() => navigate('/')}>
                Về trang chủ
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentResultPage;