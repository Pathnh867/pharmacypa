import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, 
  WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal,
  PageContainer, PageTitle, PageContent, SectionTitle, EmptyCartMessage, StepIndicator, 
  StepItem, StepLabel, StepDescription, ActionButton, ItemImage, ItemDetails, ItemName, 
  ItemPrice, QuantityControl, DeleteButton, CartSummary, SummaryTitle, SummaryRow, 
  DeliveryInfo, TotalAmount, TotalDetail, UserAddressInfo, UpdateAddressButton } from './style';
import { Badge, Alert, Checkbox, Form, message, Modal, Radio, Steps, Empty, Tooltip } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, 
  RightOutlined, InfoCircleOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponents/style';
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents/InputComponents';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })

  const [form] = Form.useForm();
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

  useEffect(() => {
    form.setFieldValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || ''
      });
    }
  }, [isOpenModalUpdateInfo, user]);
  
  useEffect(() => {
    if (form && stateUserDetails) {
      form.setFieldsValue(stateUserDetails);
    }
  }, [form, stateUserDetails]);
  
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

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  
  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }
  
  const handleAddCard = () => {
    if (!order?.ordersItemSelected?.length) {
      message.error('Vui lòng chọn sản phẩm');
    } else if (
      !user?.name || String(user?.name).trim() === '' ||
      !user?.phone || String(user?.phone).trim() === '' ||
      !user?.address || String(user?.address).trim() === '' ||
      !user?.city || String(user?.city).trim() === ''
    ) {
      setStateUserDetails({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || ''
      });

      // Hiển thị thông báo cụ thể về thông tin còn thiếu
      let missingFields = [];
      if (!user?.name || String(user?.name).trim() === '') missingFields.push('tên');
      if (!user?.phone || String(user?.phone).trim() === '') missingFields.push('số điện thoại');
      if (!user?.address || String(user?.address).trim() === '') missingFields.push('địa chỉ');
      if (!user?.city || String(user?.city).trim() === '') missingFields.push('thành phố');

      if (missingFields.length > 0) {
        message.info(`Vui lòng cập nhật ${missingFields.join(', ')} để tiếp tục đặt hàng`);
      }

      setIsOpenModalUpdateInfo(true);
    } else {
      navigate('/payment', { state: { order, user, listChecked } });
    }
  };

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser(id, token, { ...rests })
      return res
    }
  )
  
  const { isPending, data } = mutationUpdate
  
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false
    })
    setIsOpenModalUpdateInfo(false)
  }
  
  
const handleUpdateInforUser = () => {
  const { name, phone, address, city } = stateUserDetails;

  // Chuẩn hóa dữ liệu (xóa khoảng trắng thừa)
  const updateData = {
      name: name?.trim(),
      phone: phone?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      // Quan trọng: Giữ lại giá trị isAdmin từ user hiện tại
      isAdmin: user.isAdmin 
  };

  if (updateData.name && updateData.phone && updateData.address && updateData.city) {
      mutationUpdate.mutate(
          { id: user?.id, token: user?.access_token, ...updateData },
          {
              onSuccess: (data) => {
                  if (data?.status === 'OK') {
                      // Cập nhật Redux store với dữ liệu mới
                      dispatch(updateUser({
                          ...user,
                          name: updateData.name,
                          phone: updateData.phone,
                          address: updateData.address,
                          city: updateData.city,
                          // Đảm bảo giữ nguyên giá trị isAdmin
                          isAdmin: user.isAdmin,
                          // Đảm bảo giữ refreshToken
                          refreshToken: user?.refreshToken
                      }));
                      message.success('Cập nhật thông tin thành công!');
                      setIsOpenModalUpdateInfo(false);
                  } else {
                      message.error(data?.message || 'Cập nhật thông tin thất bại');
                  }
              },
              onError: (error) => {
                  console.error('Lỗi cập nhật:', error);
                  message.error('Có lỗi xảy ra: ' + (error.message || 'Không xác định'));
              }
          }
      );
  } else {
      message.error('Vui lòng điền đầy đủ thông tin');
  }
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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
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
                        <ItemPrice>
                          <span>{convertPrice(orderItem?.price)}</span>
                        </ItemPrice>
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
                          {convertPrice(orderItem?.price * orderItem?.amount)}
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
                    <SummaryTitle>Thông tin giao hàng</SummaryTitle>
                    <UpdateAddressButton onClick={() => setIsOpenModalUpdateInfo(true)}>
                      Cập nhật
                    </UpdateAddressButton>
                  </div>
                  
                  {user?.name && user?.address ? (
                    <UserAddressInfo>
                      <div><UserOutlined /> <strong>{user?.name}</strong></div>
                      <div><PhoneOutlined /> {user?.phone}</div>
                      <div><EnvironmentOutlined /> {user?.address}, {user?.city}</div>
                    </UserAddressInfo>
                  ) : (
                    <Alert
                      message="Thông tin giao hàng chưa đầy đủ"
                      description="Vui lòng cập nhật thông tin giao hàng để tiếp tục đặt hàng."
                      type="info"
                      showIcon
                      style={{ marginBottom: '10px' }}
                    />
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
                  <span>Phí giao hàng</span>
                  <span>{convertPrice(DeliveryPriceMemo)}</span>
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
                  disabled={!order?.ordersItemSelected?.length}
                >
                  Tiến hành thanh toán
                </ActionButton>
              </CartSummary>
            </WrapperRight>
          </div>
        )}
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

export default OrderPage