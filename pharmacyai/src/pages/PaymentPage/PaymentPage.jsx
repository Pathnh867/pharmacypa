import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Label, WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { Button, Checkbox, Form, message, Modal, Radio } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailComponents/style';
import { increaseAmount, decreaseAmount, removeOrderProduct, removeAllOrderProduct, selectedOrder } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import InputComponents from '../../components/InputComponents/InputComponents';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as PaymentService from '../../services/PaymentService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';
const PaymentPage = () => {
  const location = useLocation()
  const { order, user } = location.state
  const [payment, setPayment] = useState('later_money');
  const navigate = useNavigate()
  const [sdkReady, setSdkReady] = useState(false)
  console.log('user', user)
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
  
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }))
  }, [listChecked])

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
  }, [isOpenModalUpdateInfo])
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


  
  const handleAddCard = () => {
    if (!order?.ordersItemSelected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user.name || !user.address || !user.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    };

  }


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
      const res = OrderService.createOrder( token, {...rests })
      return res
    }
  )
  console.log('order', order)
  const showConfirmationModal = () => {
    const modal = Modal.info({
      title: 'Đặt hàng thành công!',
      content: (
        <div>
          <p>Cửa hàng xin chân thành cảm ơn bạn <strong>{user?.name}</strong></p>
          <p>Cảm ơn bạn đã mua hàng! Bạn sẽ được chuyển đến trang chủ.</p>
        </div>
      ),
      footer: [
        <Button key="ok" type="primary" onClick={() => {
          modal.destroy();  // Đóng modal
          navigate('/');     // Chuyển hướng về trang chủ
        }}>
          OK
        </Button>
      ]
    });
  };

  const handleAddOrder = () => {
    if (user?.access_token && order?.ordersItemSelected && user?.name && user?.address && user?.phone && user?.city && priceMemo && user?.id) {
      mutationAddOrder.mutate(
        {
          token: user?.access_token, 
          orderItems: order?.ordersItemSelected,
          fullName: user?.name, 
          address: user?.address, 
          phone: user?.phone, 
          city: user?.city,
          paymentMethod: payment ,  // Uncomment this line if 'payment' is defined
          itemsPrice: priceMemo, 
          shippingPrice: DeliveryPriceMemo, 
          totalPrice: TotalPriceMemo,
          user: user?.id,
          email: user?.email
        },
        {
          onSuccess: () => {
            showConfirmationModal();
            dispatch(removeAllOrderProduct());
          }
        }
      );
    }
  }
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
  console.log('data', data)
  const handleUpdateInforUser = () => {
    console.log('stateUse', stateUserDetails)
    const { name, phone, address, city } = stateUserDetails
    if (name && phone && address && city) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
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
  const handlePayment = (e) => {
    setPayment(e.target.value);

  }

 
  return (
    <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
      <div style={{ height: '100vh', width: '100%', margin: '0 auto' }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WrapperLeft>
            <WrapperInfo>
              <Label>Chọn phương thức giao hàng</Label>
              <WrapperRadio onChange={handlePayment} value={payment}>
                <Radio value="later_money">Thanh toán bằng tiền mặt khi nhận hàng</Radio>
              </WrapperRadio>
            </WrapperInfo>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: '100%' }}>
              <WrapperInfo>
                <div>Địa chỉ</div>
                <div style={{ color: 'green' }}>{`${user?.address}`}</div>
                <WrapperInfodiv>
                  <span>Tạm tính</span>
                  <WrapperInfospan>{convertPrice(priceMemo).replace('/hộp', ' ')}</WrapperInfospan>
                </WrapperInfodiv>
                <WrapperInfodiv>
                  <span>Giảm giá</span>
                  <WrapperInfospan>{`${priceDiscountMemo} %`}</WrapperInfospan>
                </WrapperInfodiv>
                <WrapperInfodiv>
                  <span>Phí giao hàng</span>
                  <WrapperInfospan>{convertPrice(DeliveryPriceMemo).replace('/hộp', ' ')}</WrapperInfospan>
                </WrapperInfodiv>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'rgb(254, 56,52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(TotalPriceMemo).replace('/hộp', ' ')}</span>
                  <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
             
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
              <InputComponents value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>

          </Form>
        </Loading>
      </Modal>
    </div>
  )
}

export default PaymentPage