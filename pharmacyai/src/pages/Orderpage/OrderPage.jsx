import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, 
  WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal,
  PageContainer, PageTitle, PageContent, SectionTitle, EmptyCartMessage, StepIndicator, 
  StepItem, StepLabel, StepDescription, ActionButton, ItemImage, ItemDetails, ItemName, 
  ItemPrice, QuantityControl, DeleteButton, CartSummary, SummaryTitle, SummaryRow, 
  DeliveryInfo, TotalAmount, TotalDetail, UserAddressInfo, UpdateAddressButton,
  OriginalPrice, DiscountedPrice, PriceContainer } from './style';
import { Badge, Alert, Checkbox, Form, message, Modal, Radio, Steps, Empty, Tooltip, Card, Button, Typography } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, 
  RightOutlined, InfoCircleOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined,
  HomeOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponents/style';
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents/InputComponents';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as AddressService from '../../services/AddressService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';

const { Text } = Typography;

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [isOpenModalAddress, setIsOpenModalAddress] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)

  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const dispatch = useDispatch()
  
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  };
  
  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    } else {
      dispatch(decreaseAmount({ idProduct }))
    }
  }

  const handleDeleteOder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  }

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked, dispatch])

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
  
  const priceMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
  }, [order])
  
  const priceDiscountMemo = useMemo(() => {
    // Tính tổng số tiền giảm giá từ tất cả sản phẩm được chọn
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      // Tính số tiền giảm giá cho từng sản phẩm: giá * số lượng * phần trăm giảm giá / 100
      const discountAmount = (cur.price * cur.amount * cur.discount) / 100;
      return total + discountAmount;
    }, 0);
    
    if (Number(result)) {
      return Number(result);
    }
    return 0;
  }, [order])
  
  const DeliveryPriceMemo = useMemo(() => {
    if (priceMemo > 100000) {
      return 0  // Miễn phí vận chuyển khi đơn hàng trên 100.000đ
    } else if (priceMemo === 0) {
      return 0
    } else {
      return 20000
    }
  }, [priceMemo])
  
  const TotalPriceMemo = useMemo(() => {
    return Number(priceMemo) + Number(DeliveryPriceMemo) - Number(priceDiscountMemo)
  }, [priceMemo, DeliveryPriceMemo, priceDiscountMemo])

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }
  
  const handleAddCard = () => {
    if (!order?.ordersItemSelected?.length) {
      message.error('Vui lòng chọn sản phẩm');
      return;
    } 
    
    if (!selectedAddress) {
      message.info('Vui lòng chọn địa chỉ giao hàng để tiếp tục');
      return;
    }
    
    navigate('/payment', { state: { order, user, listChecked } });
  };

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

  // Tính giá sau khi giảm giá
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  // Bước hiện tại trong quy trình thanh toán
  const steps = [
    {
      title: 'Giỏ hàng',
      description: 'Chọn sản phẩm',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Thanh toán',
      description: 'Chọn phương thức',
      icon: <RightOutlined />
    },
    {
      title: 'Hoàn tất',
      description: 'Đặt hàng thành công',
      icon: <RightOutlined />
    }
  ];

  return (
    <PageContainer>
      <PageContent>
        <PageTitle>Giỏ hàng</PageTitle>
        
        {/* Chỉ báo bước */}
        <StepIndicator>
          {steps.map((step, index) => (
            <StepItem key={index} active={index === 0}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <StepLabel>{step.title}</StepLabel>
                <StepDescription>{step.description}</StepDescription>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </StepItem>
          ))}
        </StepIndicator>
        
        {/* Kiểm tra giỏ hàng trống */}
        {(!order?.orderItems || order.orderItems.length === 0) ? (
          <EmptyCartMessage>
            <Empty 
              description="Giỏ hàng của bạn đang trống" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
            <ButtonComponent
              onClick={() => navigate('/')}
              size={40}
              styleButton={{
                background: '#4cb551',
                height: '40px',
                width: '200px',
                border: 'none',
                borderRadius: '4px',
                marginTop: '20px'
              }}
              textButton={'Tiếp tục mua sắm'}
              styleTextButton={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}
            />
          </EmptyCartMessage>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '20px' }}>
            <WrapperLeft>
              <WrapperStyleHeader>
                <span style={{ display: 'inline-block', width: '390px' }}>
                  <Checkbox 
                    onChange={handleOnchangeCheckAll} 
                    checked={listChecked?.length === order?.orderItems?.length && order?.orderItems?.length !== 0}
                  />
                  <span style={{ marginLeft: '8px' }}>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  {order?.orderItems?.length > 0 && (
                    <Tooltip title="Xóa tất cả sản phẩm đã chọn">
                      <DeleteButton onClick={handleRemoveAllOrder}>
                        <DeleteOutlined />
                      </DeleteButton>
                    </Tooltip>
                  )}
                </div>
              </WrapperStyleHeader>
              
              <WrapperListOrder>
                {order?.orderItems?.map((orderItem) => {
                  const discountedPrice = calculateDiscountedPrice(orderItem?.price, orderItem?.discount || 0);
                  const hasDiscount = orderItem?.discount && orderItem?.discount > 0;
                  
                  return (
                    <WrapperItemOrder key={orderItem?.product}>
                      <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Checkbox 
                          onChange={onChange} 
                          value={orderItem?.product} 
                          checked={listChecked.includes(orderItem?.product)}
                        />
                        <ItemImage src={orderItem?.image} alt={orderItem?.name} />
                        <ItemDetails>
                          <ItemName>{orderItem?.name}</ItemName>
                        </ItemDetails>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <PriceContainer>
                          {hasDiscount ? (
                            <>
                              <OriginalPrice>{convertPrice(orderItem?.price)}</OriginalPrice>
                              <DiscountedPrice>{convertPrice(discountedPrice)}</DiscountedPrice>
                            </>
                          ) : (
                            <DiscountedPrice>{convertPrice(orderItem?.price)}</DiscountedPrice>
                          )}
                        </PriceContainer>
                        <QuantityControl>
                          <button 
                            disabled={orderItem?.amount <= 1}
                            onClick={() => handleChangeCount('decrease', orderItem?.product)}
                          >
                            <MinusOutlined />
                          </button>
                          <WrapperInputNumber defaultValue={orderItem?.amount} value={orderItem?.amount} size="small" readOnly />
                          <button onClick={() => handleChangeCount('increase', orderItem?.product)}>
                            <PlusOutlined />
                          </button>
                        </QuantityControl>
                        <ItemPrice>
                          {hasDiscount ? (
                            <>
                              <OriginalPrice>{convertPrice(orderItem?.price * orderItem?.amount)}</OriginalPrice>
                              <DiscountedPrice>{convertPrice(discountedPrice * orderItem?.amount)}</DiscountedPrice>
                            </>
                          ) : (
                            <DiscountedPrice>{convertPrice(orderItem?.price * orderItem?.amount)}</DiscountedPrice>
                          )}
                        </ItemPrice>
                        <DeleteButton onClick={() => handleDeleteOder(orderItem?.product)}>
                          <DeleteOutlined />
                        </DeleteButton>
                      </div>
                    </WrapperItemOrder>
                  )
                })}
              </WrapperListOrder>
            </WrapperLeft>
            
            <WrapperRight>
              <CartSummary>
                {/* Thông tin địa chỉ giao hàng */}
                <DeliveryInfo>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <SummaryTitle>Địa chỉ giao hàng</SummaryTitle>
                    <Button 
                      type="primary" 
                      size="small"
                      icon={<PlusOutlined />} 
                      onClick={() => showAddressModal()}
                      style={{ background: '#4cb551', borderColor: '#4cb551' }}
                    >
                      Thêm địa chỉ
                    </Button>
                  </div>
                  
                  {isLoadingAddress ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <Loading isPending={true} />
                    </div>
                  ) : addresses.length === 0 ? (
                    <Alert
                      message="Bạn chưa có địa chỉ giao hàng"
                      description="Vui lòng thêm địa chỉ giao hàng để tiếp tục đặt hàng."
                      type="info"
                      showIcon
                      style={{ marginBottom: '10px' }}
                    />
                  ) : (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <Radio.Group 
                        onChange={handleAddressSelect} 
                        value={selectedAddress?._id}
                        style={{ width: '100%' }}
                      >
                        {addresses.map(address => (
                          <Card 
                            key={address._id} 
                            size="small"
                            style={{ 
                              marginBottom: 12, 
                              border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9',
                              backgroundColor: selectedAddress?._id === address._id ? '#f0f7f0' : 'white'
                            }}
                            hoverable
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <Radio value={address._id} style={{ marginRight: 12, marginTop: 4 }} />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Text strong>{address.fullName}</Text>
                                  <div>
                                    <Tooltip title="Chỉnh sửa">
                                      <Button 
                                        type="text" 
                                        size="small"
                                        icon={<EditOutlined />} 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showAddressModal(address);
                                        }}
                                        style={{ marginRight: '4px' }}
                                      />
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                      <Button 
                                        type="text" 
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAddress(address._id);
                                        }}
                                      />
                                    </Tooltip>
                                  </div>
                                </div>
                                <div style={{ fontSize: '13px', color: '#666' }}>{address.phone}</div>
                                <div style={{ fontSize: '13px', marginTop: '4px' }}>{address.address}, {address.city}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                  {address.isDefault ? (
                                    <Text type="success" style={{ fontSize: '12px' }}>Địa chỉ mặc định</Text>
                                  ) : (
                                    <Button 
                                      type="link" 
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetDefaultAddress(address._id);
                                      }}
                                      style={{ padding: 0, height: 'auto', fontSize: '12px' }}
                                    >
                                      Đặt làm mặc định
                                    </Button>
                                  )}
                                  <Text type="secondary" style={{ fontSize: '12px' }}>{address.label}</Text>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </Radio.Group>
                    </div>
                  )}
                </DeliveryInfo>
                
                {/* Thông tin đơn hàng */}
                <SummaryTitle>Thông tin đơn hàng</SummaryTitle>
                <SummaryRow>
                  <span>Tạm tính ({order?.ordersItemSelected?.length || 0} sản phẩm)</span>
                  <span>{convertPrice(priceMemo)}</span>
                </SummaryRow>
                
                {priceDiscountMemo > 0 && (
                  <SummaryRow>
                    <span>
                      <Tooltip title="Tổng số tiền giảm giá từ tất cả sản phẩm đã chọn">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          Tổng tiền giảm giá <InfoCircleOutlined style={{ marginLeft: '5px' }} />
                        </span>
                      </Tooltip>
                    </span>
                    <span style={{ color: '#ff4d4f' }}>-{convertPrice(priceDiscountMemo)}</span>
                  </SummaryRow>
                )}
                
                <SummaryRow>
                  <span>
                    {priceMemo > 100000 ? (
                      <Tooltip title="Miễn phí vận chuyển cho đơn hàng trên 100.000đ">
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          Phí giao hàng <InfoCircleOutlined style={{ marginLeft: '5px', color: '#4cb551' }} />
                        </span>
                      </Tooltip>
                    ) : (
                      "Phí giao hàng"
                    )}
                  </span>
                  <span>
                    {priceMemo > 100000 ? (
                      <span style={{ color: '#4cb551' }}>Miễn phí</span>
                    ) : (
                      convertPrice(DeliveryPriceMemo)
                    )}
                  </span>
                </SummaryRow>
                
                <TotalAmount>
                  <span>Tổng tiền</span>
                  <TotalDetail>
                    <span>{convertPrice(TotalPriceMemo)}</span>
                    <span>(Đã bao gồm VAT)</span>
                  </TotalDetail>
                </TotalAmount>
                
                <ActionButton 
                  onClick={handleAddCard}
                  disabled={!order?.ordersItemSelected?.length || !selectedAddress}
                >
                  Tiến hành thanh toán
                </ActionButton>
                
                {!selectedAddress && order?.ordersItemSelected?.length > 0 && (
                  <div style={{ color: '#ff4d4f', fontSize: '13px', textAlign: 'center', marginTop: '10px' }}>
                    Vui lòng chọn địa chỉ giao hàng
                  </div>
                )}
              </CartSummary>
            </WrapperRight>
          </div>
        )}
      </PageContent>
      
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
            <InputComponents placeholder="Nhập họ và tên" />
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
            <InputComponents placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
          >
            <InputComponents placeholder="Số nhà, đường..." />
          </Form.Item>
          
          <Form.Item
            name="city"
            label="Thành phố/Tỉnh"
            rules={[{ required: true, message: 'Vui lòng nhập thành phố/tỉnh' }]}
          >
            <InputComponents placeholder="Nhập thành phố/tỉnh" />
          </Form.Item>
          
          <Form.Item
            name="label"
            label="Nhãn địa chỉ (tùy chọn)"
            initialValue="Nhà"
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Nhà">Nhà</Radio.Button>
              <Radio.Button value="Công ty">Công ty</Radio.Button>
              <Radio.Button value="Khác">Khác</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}

export default OrderPage