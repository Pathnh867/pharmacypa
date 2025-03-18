import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style';
import { Checkbox, Form, message, Modal } from 'antd';
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
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slide/userSlide';
const OrderPage = () => {
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
    dispatch(removeOrderProduct({idProduct}))
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
  },[listChecked])

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
  

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1 ) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }
  // Sửa đổi hàm handleAddCard
const handleAddCard = () => {
  // Log thông tin người dùng để debug
  console.log("User info:", {
    name: user?.name, 
    phone: user?.phone, 
    address: user?.address, 
    city: user?.city
  });

  if (!order?.ordersItemSelected?.length) {
    message.error('Vui lòng chọn sản phẩm');
  } else if (
    !user?.name || String(user?.name).trim() === '' ||
    !user?.phone || String(user?.phone).trim() === '' ||
    !user?.address || String(user?.address).trim() === '' ||
    !user?.city || String(user?.city).trim() === ''
  ) {
    // Trước khi hiện modal, cập nhật state với thông tin hiện có
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
      const res = UserService.updateUser( id, token, {...rests })
      return res
    }
  )
  const{isPending, data} = mutationUpdate
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
            <WrapperStyleHeader>
              <span style={{ display: 'inline-block', width: '390px' }} >
                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></Checkbox>
                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined style={{cursor:'pointer'}} onClick={handleRemoveAllOrder}/>
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                        <WrapperItemOrder>
                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></Checkbox>
                          <img src={order?.image} style={{ width: '77px', height: '79px', objectFit: 'cover' }} />
                          <div style={{width:'260px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}> {order?.name} </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>
                              <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price) }</span>
                          </span>
                          <WrapperCountOrder>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                              <MinusOutlined style={{color:'#000',fontSize:'10px'}}/>
                            </button>
                              <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', order?.product)}>
                              <PlusOutlined style={{color:'#000',fontSize:'10px'}}/>
                            </button>
                          </WrapperCountOrder>
                      <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500 }}>{convertPrice(order?.price * order?.amount).replace('/hộp',' ')}</span>
                      <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOder(order?.product)} />
                        </div>
                      </WrapperItemOrder>
               )
              })}
            </WrapperListOrder>
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
              onClick={() => handleAddCard()}
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
      <Modal 
            title="Cập nhật thông tin người dùng" 
            open={isOpenModalUpdateInfo} 
            onCancel={handleCancelUpdate} 
            onOk={handleUpdateInforUser}
          >
            <Loading isPending={isPending}>
              <div style={{ marginBottom: '15px', color: '#ff4d4f' }}>
                * Vui lòng điền đầy đủ các trường bắt buộc
              </div>
              <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 30 }}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                  label="Tên người dùng"
                  name="name"
                  rules={[{ required: true, message: 'Hãy nhập tên người dùng' }]}
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
                  <InputComponents value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city"/>
                </Form.Item>
              </Form>
            </Loading>
          </Modal>
    </div>
  )
}

export default OrderPage