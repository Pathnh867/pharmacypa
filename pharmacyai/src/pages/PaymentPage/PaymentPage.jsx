import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label, WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, 
  WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal, 
  PaymentMethodCard, PaymentIcon, PaymentMethodTitle, PaymentMethodDesc, OrderSummaryTitle, 
  MethodContent, DeliveryInfo, OrderItemsList, PageContainer, PageContent, SectionTitle } from './style';
import { Alert, Button, Checkbox, Form, message, Modal, Radio, Space, Steps } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponents/style';
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents/InputComponents';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';

// Import icons
import momoIcon from '../../assets/img/momo_logo.png'; // Hãy đảm bảo bạn có file này

const PaymentPage = () => {
  const location = useLocation()
  const { order, user } = location.state || {}
  const [payment, setPayment] = useState('later_money');
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Kiểm tra xem có data từ location.state không
    if (!location.state) {
      message.error('Không có thông tin đơn hàng')
      navigate('/')
      return
    }
    
    // Nếu không có ordersItemSelected, chuyển hướng về trang Order
    if (!order?.ordersItemSelected?.length) {
      message.error('Bạn chưa chọn sản phẩm nào')
      navigate('/order')
      return
    }
    
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked, location.state, navigate])

  useEffect(() => {
    if (form && stateUserDetails) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city || '',
        name: user?.name || '',
        address: user?.address || '',
        phone: user?.phone || ''
      })
    }
  }, [isOpenModalUpdateInfo, user])

  const priceMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result || 0
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount))
    }, 0)
    if (Number(result)) {
      return result
    }
    return 0
  }, [order])

  const DeliveryPriceMemo = useMemo(() => {
    if (priceMemo > 100000) {
      return 10000
    } else if (priceMemo === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])

  const TotalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(DeliveryPriceMemo) - Number(priceDiscountMemo)
  }, [priceMemo, DeliveryPriceMemo, priceDiscountMemo])

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser(id, token, { ...rests })
      return res
    }
  )

  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { token, ...rests } = data
      const res = OrderService.createOrder(token, {...rests })
      return res
    }
  )

  const mutationMomoPayment = useMutationHooks(
    (data) => {
      return PaymentService.createMomoPayment(data);
    }
  )

  const showConfirmationModal = () => {
    const modal = Modal.success({
      title: 'Đặt hàng thành công!',
      content: (
        <div>
          <p>Cửa hàng xin chân thành cảm ơn bạn <strong>{user?.name}</strong></p>
          <p>Cảm ơn bạn đã mua hàng! Bạn sẽ được chuyển đến trang chủ.</p>
        </div>
      ),
      onOk: () => {
        navigate('/');
      }
    });
  };

  // Trong PaymentPage.jsx
const handleMomoPayment = async () => {
  try {
      setIsSubmitting(true);
      
      // Tạo đơn hàng với trạng thái "chờ thanh toán"
      const orderData = {
          token: user?.access_token,
          orderItems: order?.ordersItemSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: 'momo',
          itemsPrice: priceMemo,
          shippingPrice: DeliveryPriceMemo,
          totalPrice: TotalPriceMemo,
          user: user?.id,
          isPaid: false // Đánh dấu là chưa thanh toán
      };
      
      // Lưu đơn hàng vào database và lấy orderId
      const orderResponse = await OrderService.createOrder(orderData.token, orderData);
      
      if (orderResponse?.status === 'OK') {
          const orderId = orderResponse.data._id;
          
          // Gọi API tạo giao dịch MoMo với orderId thực tế từ database
          const momoData = {
              orderId: orderId, // Sử dụng ID đơn hàng thực từ database
              amount: TotalPriceMemo,
              orderInfo: `Thanh toán đơn hàng #${orderId} - Nhà thuốc tiện lợi`
          };
          
          mutationMomoPayment.mutate(momoData, {
              onSuccess: (data) => {
                  if (data && data.payUrl) {
                      window.location.href = data.payUrl;
                  } else {
                      message.error('Không thể tạo thanh toán MoMo');
                      setIsSubmitting(false);
                  }
              }
          });
      } else {
          message.error('Không thể tạo đơn hàng');
          setIsSubmitting(false);
      }
  } catch (error) {
      console.error('Error processing MoMo payment:', error);
      message.error('Đã xảy ra lỗi khi xử lý thanh toán');
      setIsSubmitting(false);
  }
};


const handleAddOrder = () => {
  if (isSubmitting) return;

  // Kiểm tra thông tin người dùng
  if (!user?.access_token || !order?.ordersItemSelected?.length) {
    message.error('Có lỗi xảy ra, vui lòng đăng nhập lại');
    return;
  }

  if (!user?.name || !user?.address || !user?.phone || !user?.city) {
    message.error('Vui lòng cập nhật thông tin giao hàng');
    setIsOpenModalUpdateInfo(true);
    return;
  }
  
  // Nếu phương thức thanh toán là MoMo, xử lý thanh toán MoMo
  if (payment === 'momo') {
    handleMomoPayment();
    return;
  }

  setIsSubmitting(true);

  // Tạo mã đơn hàng ngẫu nhiên cho COD
  const orderCode = `ORDER_${Date.now()}`;

  mutationAddOrder.mutate(
    {
      token: user?.access_token, 
      orderItems: order?.ordersItemSelected,
      fullName: user?.name, 
      address: user?.address, 
      phone: user?.phone, 
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo, 
      shippingPrice: DeliveryPriceMemo, 
      totalPrice: TotalPriceMemo,
      user: user?.id,
      email: user?.email
    },
    {
      onSuccess: (data) => {
        if (data?.status === 'OK') {
          // Chuẩn bị dữ liệu chi tiết sản phẩm cho tracking
          const items = order?.ordersItemSelected?.map(item => ({
            item_id: item.product,
            item_name: item.name,
            price: Number(item.price),
            quantity: Number(item.amount),
          }));
          
          // Gửi sự kiện purchase vào dataLayer cho GTM
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            ecommerce: null
          });
          
          window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
              transaction_id: data?.data?._id || orderCode,
              value: Number(TotalPriceMemo),
              tax: 0,
              shipping: Number(DeliveryPriceMemo),
              currency: 'VND',
              items: items
            }
          });
          
          // Xóa sản phẩm khỏi giỏ hàng
          dispatch(removeAllOrderProduct({ 
            listChecked: order?.ordersItemSelected.map(item => item.product) 
          }));
          
          // Chuyển hướng đến trang kết quả thanh toán với status success
          navigate('/payment-result', { 
            state: { 
              status: 'success', 
              orderId: data?.data?._id || orderCode,
              orderInfo: {
                items: order?.ordersItemSelected,
                totalPrice: TotalPriceMemo,
                paymentMethod: 'Thanh toán khi nhận hàng'
              }
            } 
          });
        } else {
          // Chuyển hướng đến trang kết quả với status error nếu API trả về lỗi
          navigate('/payment-result', { 
            state: { 
              status: 'error', 
              resultCode: 'ERR_CREATE_ORDER',
              message: data?.message || 'Đặt hàng thất bại' 
            } 
          });
        }
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error('Error placing order:', error);
        // Chuyển hướng đến trang kết quả với status error nếu có lỗi
        navigate('/payment-result', { 
          state: { 
            status: 'error', 
            resultCode: 'ERR_SYSTEM',
            message: 'Đã xảy ra lỗi khi đặt hàng' 
          } 
        });
        setIsSubmitting(false);
      }
    }
  );
}

  const { isPending, data } = mutationUpdate
  const { isPending: isPendingAddOrder } = mutationAddOrder
  const { isPending: isPendingMomoPayment } = mutationMomoPayment

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      phone: '',
      address: '',
      city: ''
    })
    setIsOpenModalUpdateInfo(false)
  }

  // Phần cần cập nhật trong PaymentPage.jsx
const handleUpdateInforUser = () => {
  const { name, phone, address, city } = stateUserDetails;

  // Kiểm tra xem các trường có giá trị và loại bỏ khoảng trắng
  const trimmedData = {
      name: name?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      city: city?.trim()
  };

  if (!trimmedData.name || !trimmedData.phone || !trimmedData.address || !trimmedData.city) {
      message.error('Vui lòng điền đầy đủ thông tin');
      return;
  }

  mutationUpdate.mutate({ 
      id: user?.id, 
      token: user?.access_token, 
      ...trimmedData 
  }, {
      onSuccess: (data) => {
          if (data?.status === 'OK') {
              // Đảm bảo giữ lại refreshToken khi cập nhật
              dispatch(updateUser({ 
                  ...user,
                  name: trimmedData.name, 
                  address: trimmedData.address, 
                  city: trimmedData.city, 
                  phone: trimmedData.phone,
                  refreshToken: user?.refreshToken
              }));
              message.success('Cập nhật thông tin thành công');
              setIsOpenModalUpdateInfo(false);
          } else {
              message.error(data?.message || 'Cập nhật thông tin thất bại');
          }
      },
      onError: (error) => {
          console.error('Error updating user:', error);
          if (error.response?.status === 401) {
              message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          } else {
              message.error('Đã xảy ra lỗi khi cập nhật thông tin');
          }
      }
  });
};
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handlePayment = (e) => {
    setPayment(e.target.value);
  }

  // Hiển thị danh sách sản phẩm đã chọn
  const renderOrderItems = () => {
    return order?.ordersItemSelected?.map((item, index) => (
      <WrapperItemOrder key={index}>
        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <img src={item?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} alt={item?.name} />
          <div style={{ width: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div>{item?.name}</div>
            <div>Số lượng: {item?.amount}</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(item?.price * item?.amount)}</span>
        </div>
      </WrapperItemOrder>
    ))
  }

  const steps = [
    {
      title: 'Giỏ hàng',
      description: 'Chọn sản phẩm',
    },
    {
      title: 'Thanh toán',
      description: 'Chọn phương thức',
    },
    {
      title: 'Hoàn tất',
      description: 'Đặt hàng thành công',
    },
  ];

  return (
    <PageContainer>
      <PageContent>
        <SectionTitle>Thanh toán</SectionTitle>
        <Steps current={1} items={steps} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <WrapperLeft>
            <WrapperInfo>
              <DeliveryInfo>
                <Label>Thông tin giao hàng</Label>
                <div style={{ marginTop: '10px' }}>
                  <div style={{ marginBottom: '5px' }}><strong>Người nhận:</strong> {user?.name}</div>
                  <div style={{ marginBottom: '5px' }}><strong>Số điện thoại:</strong> {user?.phone}</div>
                  <div style={{ marginBottom: '5px' }}><strong>Địa chỉ:</strong> {user?.address}, {user?.city}</div>
                  <Button 
                    type="link" 
                    onClick={() => setIsOpenModalUpdateInfo(true)}
                    style={{ padding: 0 }}
                  >
                    Thay đổi
                  </Button>
                </div>
              </DeliveryInfo>
            </WrapperInfo>

            <WrapperInfo style={{ marginTop: '20px' }}>
              <Label>Danh sách sản phẩm</Label>
              <OrderItemsList>
                {renderOrderItems()}
              </OrderItemsList>
            </WrapperInfo>

            <WrapperInfo style={{ marginTop: '20px' }}>
              <Label>Phương thức thanh toán</Label>
              <div style={{ marginTop: '16px' }}>
                <Radio.Group onChange={handlePayment} value={payment} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <PaymentMethodCard isSelected={payment === 'later_money'}>
                      <Radio value="later_money">
                        <MethodContent>
                          <PaymentMethodTitle>Thanh toán khi nhận hàng (COD)</PaymentMethodTitle>
                          <PaymentMethodDesc>Thanh toán bằng tiền mặt khi nhận hàng tại nhà</PaymentMethodDesc>
                        </MethodContent>
                      </Radio>
                    </PaymentMethodCard>

                    <PaymentMethodCard isSelected={payment === 'momo'}>
                      <Radio value="momo">
                        <MethodContent>
                          <PaymentIcon src={momoIcon || 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'} alt="MoMo" />
                          <div>
                            <PaymentMethodTitle>Ví MoMo</PaymentMethodTitle>
                            <PaymentMethodDesc>Thanh toán qua ứng dụng MoMo</PaymentMethodDesc>
                          </div>
                        </MethodContent>
                      </Radio>
                    </PaymentMethodCard>
                  </Space>
                </Radio.Group>
              </div>
            </WrapperInfo>
          </WrapperLeft>
          
          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <OrderSummaryTitle>Thông tin đơn hàng</OrderSummaryTitle>
                <WrapperInfodiv>
                  <span>Tạm tính ({order?.ordersItemSelected?.length || 0} sản phẩm)</span>
                  <WrapperInfospan>{convertPrice(priceMemo)}</WrapperInfospan>
                </WrapperInfodiv>
                {priceDiscountMemo > 0 && (
                  <WrapperInfodiv>
                    <span>Giảm giá</span>
                    <WrapperInfospan>-{priceDiscountMemo}%</WrapperInfospan>
                  </WrapperInfodiv>
                )}
                <WrapperInfodiv>
                  <span>Phí giao hàng</span>
                  <WrapperInfospan>{convertPrice(DeliveryPriceMemo)}</WrapperInfospan>
                </WrapperInfodiv>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>
                    {convertPrice(TotalPriceMemo)}
                  </span>
                  <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>

              {payment === 'momo' && (
                <Alert
                  message="Thanh toán MoMo"
                  description="Bạn sẽ được chuyển đến trang thanh toán MoMo để hoàn tất giao dịch."
                  type="info"
                  showIcon
                  style={{ marginTop: '16px', marginBottom: '16px' }}
                />
              )}

              <ButtonComponent
                onClick={handleAddOrder}
                size={40}
                styleButton={{
                  background: '#4cb551',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '4px',
                  marginTop: '20px'
                }}
                textButton={payment === 'momo' ? 'Thanh toán MoMo' : 'Đặt hàng'}
                styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                disabled={isPendingAddOrder || isPendingMomoPayment || isSubmitting}
              />
              
              {(isPendingAddOrder || isPendingMomoPayment || isSubmitting) && <div style={{ textAlign: 'center', marginTop: '10px' }}>Đang xử lý đơn hàng...</div>}
            </div>
          </WrapperRight>
        </div>
      </PageContent>

      <Modal 
        title="Cập nhật thông tin giao hàng" 
        open={isOpenModalUpdateInfo} 
        onCancel={handleCancelUpdate} 
        onOk={handleUpdateInforUser}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Loading isPending={isPending}>
          <div style={{ marginBottom: '15px', color: '#ff4d4f' }}>
            * Vui lòng điền đầy đủ các trường bắt buộc
          </div>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên người nhận"
              name="name"
              rules={[{ required: true, message: 'Hãy nhập tên người nhận' }]}
            >
              <InputComponents value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Hãy nhập số điện thoại' }]}
            >
              <InputComponents value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Hãy nhập địa chỉ' }]}
            >
              <InputComponents value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: 'Hãy nhập thành phố của bạn' }]}
            >
              <InputComponents value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </PageContainer>
  )
}

export default PaymentPage