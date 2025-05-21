import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperCountOrder, WrapperInfo, WrapperInfodiv, WrapperInfospan, WrapperItemOrder, WrapperLeft, 
  WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal,
  PageContainer, PageTitle, PageContent, SectionTitle, EmptyCartMessage, StepIndicator, 
  StepItem, StepLabel, StepDescription, ActionButton, ItemImage, ItemDetails, ItemName, 
  ItemPrice, QuantityControl, DeleteButton, CartSummary, SummaryTitle, SummaryRow, 
  DeliveryInfo, TotalAmount, TotalDetail, UserAddressInfo, UpdateAddressButton,
  OriginalPrice, DiscountedPrice, PriceContainer } from './style';
<<<<<<< HEAD
import { Badge, Alert, Checkbox, Form, message, Modal, Radio, Steps, Empty, Tooltip, Card, Button, Typography, Upload, Input } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, 
  RightOutlined, InfoCircleOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined,
  HomeOutlined, EditOutlined, PlusCircleOutlined, FileProtectOutlined } from '@ant-design/icons'
=======
import { Badge, Alert, Checkbox, Form, message, Modal, Radio, Steps, Empty, Tooltip } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, 
  RightOutlined, InfoCircleOutlined, EnvironmentOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons'
>>>>>>> parent of dd4e1c8f (Update OrderPage.jsx)
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
<<<<<<< HEAD
import * as PrescriptionService from '../../services/PrescriptionService';
import PrescriptionBadge from '../../components/PrescriptionBadge/PrescriptionBadge';
const { Text } = Typography;
const { TextArea } = Input;
=======

>>>>>>> parent of dd4e1c8f (Update OrderPage.jsx)
const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [listChecked, setListChecked] = useState([])
<<<<<<< HEAD
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentAddress, setCurrentAddress] = useState(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [activePrescriptionItem, setActivePrescriptionItem] = useState(null);
  const [prescriptionModal, setPrescriptionModal] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [prescriptionForm] = Form.useForm();
=======
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
>>>>>>> parent of dd4e1c8f (Update OrderPage.jsx)

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
<<<<<<< HEAD
  useEffect(() => {
    // Lọc ra các sản phẩm cần đơn thuốc từ danh sách giỏ hàng
    if (order?.orderItems?.length > 0) {
      const prescItems = order.orderItems.filter(item => item.requiresPrescription);
      setPrescriptionItems(prescItems);
    }
  }, [order?.orderItems]);
  const handlePrescriptionUpload = info => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} tải lên thành công`);
      setPrescriptionFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };
  const handleSubmitPrescription = async () => {
    try {
      await prescriptionForm.validateFields();
      setPrescriptionLoading(true);
      
      // Chuẩn bị form data để gửi lên server
      const formData = new FormData();
      if (prescriptionFile) {
        formData.append('prescription', prescriptionFile);
      }
      
      const note = prescriptionForm.getFieldValue('note');
      if (note) {
        formData.append('note', note);
      }
      
      // Giả sử đây là mã đơn hàng hiện tại hoặc mã đơn hàng tạm thời
      const orderId = 'temp_' + Date.now();
      formData.append('orderId', orderId);
      
      try {
        // Gọi API để tải lên đơn thuốc
        const response = await PrescriptionService.uploadPrescription(
          orderId, 
          formData, 
          user?.access_token
        );
        
        if (response?.status === 'OK') {
          message.success(`Đơn thuốc cho ${activePrescriptionItem?.name} đã được gửi thành công!`);
          
          // Cập nhật trạng thái thuốc đã có đơn
          const updatedItems = prescriptionItems.map(item => {
            if (item.product === activePrescriptionItem?.product) {
              return {...item, hasPrescription: true};
            }
            return item;
          });
          
          setPrescriptionItems(updatedItems);
          
          // Cập nhật trạng thái trong giỏ hàng
          const updatedOrderItems = [...order.orderItems];
          const itemIndex = updatedOrderItems.findIndex(item => 
            item.product === activePrescriptionItem?.product
          );
          
          if (itemIndex !== -1) {
            updatedOrderItems[itemIndex] = {
              ...updatedOrderItems[itemIndex],
              hasPrescription: true
            };
            
            // Cập nhật state với các sản phẩm đã cập nhật
            // (Trong một ứng dụng thực tế, bạn có thể muốn dispatch một action redux ở đây)
          }
        } else {
          message.error(response?.message || 'Không thể tải lên đơn thuốc');
        }
      } catch (error) {
        console.error('Error uploading prescription:', error);  
        message.error('Đã xảy ra lỗi khi tải lên đơn thuốc');
      } finally {
        setPrescriptionModal(false);
        setPrescriptionFile(null);
        prescriptionForm.resetFields();
        setPrescriptionLoading(false);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };
  const validateBeforeCheckout = () => {
    // Kiểm tra nếu có sản phẩm kê đơn chưa có đơn thuốc
    const prescriptionRequired = prescriptionItems.filter(item => 
      listChecked.includes(item.product) && !item.hasPrescription
    );
    
    if (prescriptionRequired.length > 0) {
      const itemNames = prescriptionRequired.map(item => item.name).join(', ');
      
      Modal.confirm({
        title: 'Sản phẩm cần đơn thuốc',
        content: `Các sản phẩm sau cần đơn thuốc: ${itemNames}. Bạn cần tải lên đơn thuốc trước khi tiếp tục.`,
        okText: 'Tải lên đơn thuốc',
        cancelText: 'Hủy',
        onOk: () => {
          setActivePrescriptionItem(prescriptionRequired[0]);
          setPrescriptionModal(true);
        }
      });
      
      return false;
    }
    
    return true;
  };
  
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
=======

  useEffect(() => {
    form.setFieldValue(stateUserDetails)
  }, [form, stateUserDetails])
>>>>>>> parent of dd4e1c8f (Update OrderPage.jsx)

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
<<<<<<< HEAD
      return;
    } 
    
    if (!selectedAddress) {
      message.info('Vui lòng chọn địa chỉ giao hàng để tiếp tục');
      return;
    }
    
    // Kiểm tra thuốc kê đơn
    if (!validateBeforeCheckout()) {
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
=======
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
>>>>>>> parent of dd4e1c8f (Update OrderPage.jsx)
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

  // Tính giá sau khi giảm giá
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

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
                          {orderItem?.requiresPrescription && (
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                              <PrescriptionBadge requiresPrescription={true} size="small" />
                              {orderItem.hasPrescription ? (
                                <span style={{ color: '#389e0d', fontSize: '12px', marginLeft: '5px' }}>
                                  Đã có đơn thuốc
                                </span>
                              ) : (
                                <Button 
                                  type="link" 
                                  size="small" 
                                  style={{ padding: '0', height: 'auto', fontSize: '12px', color: '#c41d7f' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePrescriptionItem(orderItem);
                                    setPrescriptionModal(true);
                                  }}
                                >
                                  Tải lên đơn thuốc
                                </Button>
                              )}
                            </div>
                          )}
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
      <Modal
        title={`Tải lên đơn thuốc cho ${activePrescriptionItem?.name || 'sản phẩm'}`}
        open={prescriptionModal}
        onCancel={() => setPrescriptionModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={prescriptionForm}
          layout="vertical"
          onFinish={handleSubmitPrescription}
        >
          <Alert
            message="Thuốc kê đơn yêu cầu đơn thuốc của bác sĩ"
            description="Vui lòng tải lên hình ảnh hoặc file PDF đơn thuốc của bác sĩ. Chúng tôi sẽ xác minh đơn thuốc trước khi xác nhận đơn hàng của bạn."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Form.Item
            name="prescription"
            label="Đơn thuốc"
            rules={[{ required: true, message: 'Vui lòng tải lên đơn thuốc' }]}
          >
            <Upload.Dragger
              name="prescription"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple={false}
              maxCount={1}
              onChange={handlePrescriptionUpload}
              beforeUpload={() => false}
            >
              <p className="ant-upload-drag-icon">
                <FileProtectOutlined style={{ color: '#c41d7f', fontSize: '32px' }} />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo thả file đơn thuốc vào đây</p>
              <p className="ant-upload-hint">
                Hỗ trợ định dạng: JPG, PNG, PDF. Tối đa 5MB.
              </p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="Ghi chú (tùy chọn)"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về đơn thuốc hoặc yêu cầu khác (nếu có)"
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setPrescriptionModal(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={prescriptionLoading}
                style={{ background: '#c41d7f', borderColor: '#c41d7f' }}
              >
                Gửi đơn thuốc
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}

export default OrderPage