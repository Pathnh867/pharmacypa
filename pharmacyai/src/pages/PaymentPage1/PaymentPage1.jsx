import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { Checkbox, Form, message, Modal, Radio } from 'antd';
import nuoc1 from '../../assets/img/nuoc1.jpg'
import {CheckCircleOutlined, DeleteOutlined, MinusOutlined, PlusOutlined, StarFilled} from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponents/style';
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents/InputComponents';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'

import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';
const PaymentPage1
 = () => {
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  console.log('user',user)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city:''
  })
  const [payment, setPayment] = useState('');
  const handlePaymentMethodChange = (selectedPayment) => {
    setPayment(selectedPayment);
  };
  const [form] = Form.useForm();
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  },[listChecked])

  useEffect(() => {
    form.setFieldValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  },[isOpenModalUpdateInfo, user])
  const priceMemo = useMemo(() => {
    const result = order?.ordersItemSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    }, 0)
    return result
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
  

  
  const handleAddOrder = () => {
    if (user?.access_token && order?.ordersItemSelected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token, 
          ordersItem: order?.ordersItemSelected,
          fullName: user?.name, 
          address: user?.address, 
          phone: user?.phone, 
          city: user?.city,
          PaymentMethod: payment  ,  // Uncomment this line if 'payment' is defined
          itemPrice: priceMemo, 
          shippingPrice: DeliveryPriceMemo, 
          totalPrice: TotalPriceMemo,
          user: user?.id
        },
        {
          onSuccess: () => {
            message.success('Đặt hàng thành công');
          }
        }
      );
    }
  }

  const handleAddCard = () => {
    if (!order?.ordersItemSelected?.length) {
     message.error('Vui lòng chọn sản phẩm')
  } else if(!user?.phone || !user.name || !user.address || !user.city) {
   setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
  }
 }
  
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser( id, token, {...rests })
      return res
    }
  )
  const mutationAddOrder = useMutationHooks(
    (data) => {
      const { token, ...rests } = data
      const res = OrderService.createOrder( token, {...rests })
      return res
    }
  )
  const { isPending, data } = mutationUpdate
  const {isPending: isPendingAddOrder} = mutationAddOrder
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false
    })
    setIsOpenModalUpdateInfo(false)
  }
  console.log('data',data)
  const handleUpdateInforUser = () => {
    console.log('stateUse',stateUserDetails)
    const { name, phone , address, city } = stateUserDetails
    if (name && phone && address && city) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({name, address, city, phone}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  
  }

  return (
    <div style= {{background:'#f5f5fa', width:'100%', height:'100vh'}}>
      <div style= {{height:'100vh', width:'100%', margin:'0 auto'}}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
          <Form.Item label="Phương thức thanh toán">
                <Radio.Group 
                  onChange={(e) => handlePaymentMethodChange(e.target.value)}
                  value={payment}
                >
                  <Radio value="COD">Thanh toán khi nhận hàng</Radio>
                  <Radio value="Banking">Chuyển khoản ngân hàng</Radio>
                  <Radio value="Momo">Ví điện tử Momo</Radio>
              </Radio.Group>
            </Form.Item>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width:'100%'}}>
              <WrapperInfo>
                <div>Địa chỉ</div>
                <div style={{color:'green'}}>{`${user?.address}`}</div>
                <WrapperInfodiv>
                  <span>Tạm tính</span>
                  <WrapperInfospan>{convertPrice(priceMemo).replace('/hộp',' ')}</WrapperInfospan>
                </WrapperInfodiv>
                <WrapperInfodiv>
                  <span>Giảm giá</span>
                  <WrapperInfospan>{`${priceDiscountMemo } %`}</WrapperInfospan>
                </WrapperInfodiv>
                <WrapperInfodiv>
                  <span>Phí giao hàng</span>
                  <WrapperInfospan>{ convertPrice(DeliveryPriceMemo).replace('/hộp',' ')}</WrapperInfospan>
                </WrapperInfodiv>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection:'column'}}>
                  <span style={{ color: 'rgb(254, 56,52)', fontSize: '24px', fontWeight: 'bold' }}>{ convertPrice(TotalPriceMemo).replace('/hộp',' ') }</span>
                  <span style={{color:'#000', fontSize:'11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddOrder()}
              size={40}
              styleButton={{
                background: '#4cb551',
                height: '48px',
                width: '310px',
                border: 'none',
                borderRadius: '4px',
                marginTop:'20px'
              }}
              textButton={'Đặt hàng'}
              styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'700'}}
            >
            </ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <Modal title="Cập nhật thông tin người dùng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInforUser}>
            <Loading isPending={isPending}>
              <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 30 }}
                // onFinish={onFinish}
                autoComplete="on"
                form={form}
              >
                    <Form.Item
                        label="Tên người dùng"
                        name="name"
                        rules={[{ required: true, message: 'Hãy nhập tên sản phẩm' }]}
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
                        <InputComponents  value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city"/>
                      </Form.Item>
                      
                  </Form>
              </Loading>
      </Modal>
    </div>
  )
}

export default PaymentPage1
