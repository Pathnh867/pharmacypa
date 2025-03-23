import { Badge, Col, Input, Popover, Avatar, Button, Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { 
  UserOutlined, 
  DownOutlined, 
  ShoppingCartOutlined, 
  SearchOutlined
} from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slide/userSlide'
import Loading from '../LoadingComponent/Loading';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { searchProduct } from '../../redux/slide/productSlide';

import { 
  WrapperHeader, 
  WrapperTextHeader, 
  WrapperHeaderAccount, 
  WrapperTextCart, 
  WrapperHeaderCart, 
  WrapperTextHeaderSmall, 
  WrapperContentPopup,
  ActionGroup
} from './style'

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart= false}) => {
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const order = useSelector((state) => state.order)
  const [search, setSearch] = useState('')
  const { isPending } = mutation

  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  
  const handleLogout = async () => {
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}> Đăng xuất </WrapperContentPopup>
      <WrapperContentPopup onClick={()=> navigate('/profile-user')}> Thông tin người dùng </WrapperContentPopup>
      {user?.isAdmin && (
         <WrapperContentPopup onClick={()=> navigate('/system/admin')}> Quản lý hệ thống </WrapperContentPopup>
      )}
    </div>
  );

  useEffect(() => {
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  return (
    <div style={{width:'100%', background:'#4cb551', display:'flex', justifyContent:'center'}}>
      <WrapperHeader style={{ justifyContent: isHiddenCart && isHiddenSearch ? 'space-between' : 'unset'}} >
        {/* Logo */}
        <Col span={5} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <WrapperTextHeader>NHÀ THUỐC TIỆN LỢI</WrapperTextHeader>
        </Col>
        
        {/* Search */}
        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              textButton="Tìm kiếm"
              bordered={false}
              variant="borderless"
              onChange={onSearch}
              value={search}
            />
          </Col>
        )}
        
        {/* Actions - User & Cart */}
        <Col span={6}>
          <ActionGroup>
            <Loading isPending={isPending}>
              {/* Bọc cả hai phần vào một div flex row */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                gap: '20px'  // Khoảng cách giữa giỏ hàng và user
              }}>
                {/* Phần giỏ hàng */}
                {!isHiddenCart && (
                  <WrapperHeaderCart onClick={() => navigate('/order')}>
                    <Badge count={order?.orderItems?.length} size='small'>
                      <ShoppingCartOutlined style={{ fontSize: '24px', color:'#fff' }} />
                    </Badge>
                    <WrapperTextCart>Giỏ hàng</WrapperTextCart>
                  </WrapperHeaderCart>
                )}
                
                {/* Phần user */}
                {user?.access_token ? (
                  <Popover content={content} trigger="click" placement="bottom">
                    <WrapperHeaderAccount>
                      {userAvatar ? (
                        <Avatar src={userAvatar} size="small" />
                      ) : (
                        <UserOutlined style={{fontSize: '20px', color: '#fff'}} />
                      )}
                      <div style={{ marginLeft: '8px' }}>
                        <span style={{ color: '#fff' }}>
                          {userName?.length ? userName : user?.email}
                        </span>
                        <DownOutlined style={{ fontSize: '12px', marginLeft: '4px', color: '#fff' }} />
                      </div>
                    </WrapperHeaderAccount>
                  </Popover>
                ) : (
                  <WrapperHeaderAccount onClick={handleNavigateLogin}>
                    <UserOutlined style={{fontSize: '20px', color: '#fff'}} />
                    <div style={{ marginLeft: '5px' }}>
                      <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                      <WrapperTextHeaderSmall>Tài khoản <DownOutlined style={{ fontSize: '10px', marginLeft: '2px' }} /></WrapperTextHeaderSmall>
                    </div>
                  </WrapperHeaderAccount>
                )}
              </div>
            </Loading>
          </ActionGroup>
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent