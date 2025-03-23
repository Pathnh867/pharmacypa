import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, 
  WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal, 
  PaymentMethodCard, PaymentIcon, PaymentMethodTitle, PaymentMethodDesc, OrderSummaryTitle, 
  MethodContent, DeliveryInfo, OrderItemsList, PageContainer, PageContent, SectionTitle } from './style';
  import { Alert, Button, Card, Checkbox, Form, Input, message, Modal, Radio, Space, Steps, Tooltip, Empty, Typography } from 'antd';

import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, 
  RightOutlined, InfoCircleOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined,
  HomeOutlined, EditOutlined, PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
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
import * as AddressService from '../../services/AddressService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';

// Import icons
import momoIcon from '../../assets/img/momo_logo.png';

const { Text } = Typography;

// Validate functions
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9]\d{8}$/;
  return phoneRegex.test(phone);
}

const PaymentPage = () => {
  const location = useLocation()
  const { order, user } = location.state || {}
  const [payment, setPayment] = useState('later_money');
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [isOpenModalAddress, setIsOpenModalAddress] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const dispatch = useDispatch()
  
  // Kiểm tra xem có data từ location.state không
  useEffect(() => {
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
  }, [listChecked, location.state, navigate, user?.access_token])

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

  // Tính giá
  const priceMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result || 0
  }, [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.discount * cur.amount) / 100 * cur.price)
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

  // Mutations
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

  // Fetch địa chỉ
  const fetchAddresses = async () => {
    if (!user?.access_token) return;

    try {
      setIsLoadingAddress(true);
      const response = await AddressService.getAllAddresses(user.access_token);
      if (response.status === 'OK') {
        setAddresses(response.data);
        
        // Set initial selected address (default or first)
        if (!selectedAddress) {
          const defaultAddress = response.data.find(addr => addr.isDefault) || 
                              response.data[0];
          
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      message.error('Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.access_token]);

  // Xử lý chọn địa chỉ
  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    const selected = addresses.find(addr => addr._id === addressId);
    setSelectedAddress(selected);
  };

  // Mở modal thêm/sửa địa chỉ
  const showAddressModal = (address = null) => {
    if (address) {
      setIsEditing(true);
      setCurrentAddress(address);
      addressForm.setFieldsValue({
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        label: address.label || 'Nhà'
      });
    } else {
      setIsEditing(false);
      setCurrentAddress(null);
      addressForm.resetFields();
      addressForm.setFieldsValue({
        label: 'Nhà'
      });
    }
    setIsOpenModalAddress(true);
  };

  // Lưu địa chỉ
  const handleSaveAddress = async () => {
    try {
      const values = await addressForm.validateFields();
      
      const addressData = {
        ...values,
        label: values.label || 'Nhà',
        isDefault: false
      };

      setIsLoadingAddress(true);
      
      if (user?.access_token) {
        if (isEditing && currentAddress) {
          // Cập nhật địa chỉ
          await AddressService.updateAddress(
            user.access_token, 
            currentAddress._id, 
            addressData
          );
          message.success('Cập nhật địa chỉ thành công');
        } else {
          // Tạo địa chỉ mới
          await AddressService.createAddress(user.access_token, addressData);
          message.success('Thêm địa chỉ mới thành công');
        }

        fetchAddresses();
        setIsOpenModalAddress(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      message.error('Lỗi khi lưu địa chỉ');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Đặt địa chỉ mặc định
  const handleSetDefaultAddress = async (addressId) => {
    try {
      setIsLoadingAddress(true);
      if (user?.access_token) {
        await AddressService.setDefaultAddress(user.access_token, addressId);
        message.success('Đã đặt địa chỉ này làm mặc định');
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      message.error('Không thể đặt địa chỉ mặc định');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    try {
      setIsLoadingAddress(true);
      if (user?.access_token) {
        await AddressService.deleteAddress(user.access_token, addressId);
        message.success('Xóa địa chỉ thành công');
        
        // Nếu địa chỉ bị xóa đang được chọn, bỏ chọn
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(null);
        }
        
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error('Không thể xóa địa chỉ');
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Phương thức xử lý thanh toán MoMo
  const handleMomoPayment = async () => {
    if (!user?.access_token || !order?.ordersItemSelected?.length) {
      message.error('Có lỗi xảy ra, vui lòng đăng nhập lại');
      return;
    }

    // Kiểm tra địa chỉ
    if (!selectedAddress) {
      message.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Bước 1: Tạo đơn hàng trước với trạng thái chưa thanh toán
      const orderData = {
        token: user?.access_token,
        orderItems: order?.ordersItemSelected,
        fullName: selectedAddress.fullName,
        address: selectedAddress.address,
        phone: selectedAddress.phone,
        city: selectedAddress.city,
        paymentMethod: 'momo',
        itemsPrice: priceMemo,
        shippingPrice: DeliveryPriceMemo,
        totalPrice: TotalPriceMemo,
        user: user?.id,
        // Đánh dấu là chưa thanh toán, sẽ cập nhật khi nhận IPN từ MoMo
        isPaid: false
      };
      
      const orderResponse = await OrderService.createOrder(orderData.token, orderData);
      
      if (orderResponse?.status === 'OK' && orderResponse?.data?._id) {
        const orderId = orderResponse.data._id;
        
        // Bước 2: Tạo giao dịch MoMo với orderId từ database
        const momoData = {
          orderId: orderId,
          amount: TotalPriceMemo,
          orderInfo: `Thanh toán đơn hàng #${orderId} - Nhà thuốc tiện lợi`
        };
        
        mutationMomoPayment.mutate(momoData, {
          onSuccess: (data) => {
            if (data && data.payUrl) {
              // Hiện thông báo trước khi chuyển hướng
              message.success('Đang chuyển đến trang thanh toán MoMo...');
              
              // Chuyển hướng người dùng đến trang thanh toán MoMo
              window.location.href = data.payUrl;
            } else {
              message.error('Không thể tạo thanh toán MoMo');
              setIsSubmitting(false);
            }
          },
          onError: (error) => {
            console.error('Error creating MoMo payment:', error);
            message.error('Đã xảy ra lỗi khi tạo thanh toán MoMo');
            setIsSubmitting(false);
          }
        });
      } else {
        message.error(orderResponse?.message || 'Không thể tạo đơn hàng');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error processing MoMo payment:', error);
      message.error('Đã xảy ra lỗi khi xử lý thanh toán');
      setIsSubmitting(false);
    }
  };

  // Đặt hàng
  const handleAddOrder = () => {
    if (isSubmitting) return;

    // Kiểm tra địa chỉ
    if (!selectedAddress) {
      message.error('Vui lòng chọn địa chỉ giao hàng');
      return;
    }

    // Kiểm tra thông tin người dùng
    if (!user?.access_token || !order?.ordersItemSelected?.length) {
      message.error('Có lỗi xảy ra, vui lòng đăng nhập lại');
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
        fullName: selectedAddress.fullName, 
        address: selectedAddress.address, 
        phone: selectedAddress.phone, 
        city: selectedAddress.city,
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
                  paymentMethod: 'later_money'
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

  const handleUpdateInforUser = () => {
    const { name, phone, address, city } = stateUserDetails;

    // Kiểm tra xem các trường có giá trị và loại bỏ khoảng trắng
    const trimmedData = {
      name: name?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      city: city?.trim()
    };

    // Validate phone number
    if (!validatePhoneNumber(trimmedData.phone)) {
      message.error('Số điện thoại không hợp lệ');
      return;
    }

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
        <Steps current={currentStep} items={steps} style={{ marginBottom: '24px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          <WrapperLeft>
            <WrapperInfo>
              <DeliveryInfo>
                <Label>Địa chỉ giao hàng</Label>
                <div style={{ marginTop: '10px' }}>
                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Empty description="Bạn chưa có địa chỉ nào" />
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => showAddressModal()}
                        style={{ marginTop: '16px' }}
                      >
                        Thêm địa chỉ đầu tiên
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <Text strong>Chọn địa chỉ giao hàng</Text>
                        <Button 
                          type="dashed" 
                          icon={<PlusOutlined />} 
                          onClick={() => showAddressModal()}
                        >
                          Thêm địa chỉ
                        </Button>
                      </div>
                      
                      <Radio.Group 
                        onChange={handleAddressSelect} 
                        value={selectedAddress?._id}
                        style={{ width: '100%' }}
                      >
                        {addresses.map(address => (
                          <Card 
                            key={address._id} 
                            style={{ 
                              marginBottom: 16, 
                              border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9',
                              backgroundColor: selectedAddress?._id === address._id ? '#f0f7f0' : 'white'
                            }}
                            hoverable
                          >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Radio value={address._id} style={{ marginRight: 16 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Text strong>{address.fullName} | {address.phone}</Text>
                                  <div>
                                    <Tooltip title="Chỉnh sửa">
                                      <Button 
                                        type="text" 
                                        icon={<EditOutlined />} 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showAddressModal(address);
                                        }}
                                        style={{ marginRight: '8px' }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                      <Button 
                                        type="text" 
                                        danger
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(address._id);
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                                <div>{address.address}, {address.city}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                  {address.isDefault ? (
                                    <Text type="success">Địa chỉ mặc định</Text>
                                  ) : (
                                    <Button 
                                      type="link" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetDefaultAddress(address._id);
                                      }}
                                      style={{ padding: 0 }}
                                    >
                                      Đặt làm mặc định
                                    </Button>
                                  )}
                                  <Text type="secondary">{address.label}</Text>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </Radio.Group>
                    </>
                  )}
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
                    <WrapperInfospan>-{convertPrice(priceDiscountMemo)}</WrapperInfospan>
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
                disabled={
                  isPendingAddOrder || 
                  isPendingMomoPayment || 
                  isSubmitting || 
                  !selectedAddress
                }
              />
              
              {(isPendingAddOrder || isPendingMomoPayment || isSubmitting) && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  Đang xử lý đơn hàng...
                </div>
              )}
            </div>
          </WrapperRight>
        </div>
      </PageContent>

      {/* Modal cập nhật thông tin người dùng */}
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
              rules={[
                { required: true, message: 'Hãy nhập số điện thoại' },
                {
                  validator: (_, value) => {
                    if (!validatePhoneNumber(value)) {
                      return Promise.reject('Số điện thoại không hợp lệ')
                    }
                    return Promise.resolve()
                  }
                }
              ]}
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

      {/* Modal thêm/sửa địa chỉ */}
      <Modal
        title={isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isOpenModalAddress}
        onOk={handleSaveAddress}
        onCancel={() => setIsOpenModalAddress(false)}
        okText="Lưu địa chỉ"
        cancelText="Hủy"
        confirmLoading={isLoadingAddress}
      >
        <Form 
          form={addressForm} 
          layout="vertical"
          requiredMark={false}
          initialValues={{
            label: 'Nhà'
          }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { 
                pattern: /^(0|\+84)[3|5|7|8|9]\d{8}$/, 
                message: 'Số điện thoại không hợp lệ' 
              }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, đường..." />
          </Form.Item>
          
          <Form.Item
            name="city"
            label="Thành phố/Tỉnh"
            rules={[{ required: true, message: 'Vui lòng nhập thành phố/tỉnh' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Nhập thành phố/tỉnh" />
          </Form.Item>
          
          <Form.Item
            name="label"
            label="Nhãn địa chỉ (tùy chọn)"
            initialValue="Nhà"
          >
            <Input placeholder="VD: Nhà riêng, Công ty..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PaymentPage;