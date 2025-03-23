import { Badge, Col, Input, Popover, Avatar, Button, Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import { 
  UserOutlined, 
  DownOutlined, 
  ShoppingCartOutlined, 
  SearchOutlined, 
  BellOutlined, 
  HeartOutlined,
  LogoutOutlined, 
  SettingOutlined, 
  UserSwitchOutlined
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
  Logo,
  HeaderSearch,
  HeaderActions,
  SearchIconWrapper,
  UserActionGroup,
  CartBadge,
  HeaderContainer,
  LogoText
} from './style'

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart= false}) => {
  // Hooks
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

  // Event handlers
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
  }

  const handleNavigateProfile = () => {
    navigate('/profile-user')
  }

  const handleNavigateAdmin = () => {
    navigate('/system/admin')
  }

  const handleNavigateCart = () => {
    navigate('/order')
  }

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin người dùng',
      icon: <UserOutlined />,
      onClick: handleNavigateProfile
    },
    {
      key: 'divider',
      type: 'divider'
    },
    ...(user?.isAdmin ? [
      {
        key: 'admin',
        label: 'Quản lý hệ thống',
        icon: <SettingOutlined />,
        onClick: handleNavigateAdmin
      }
    ] : []),
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true
    }
  ];

  // Effects
  useEffect(() => {
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  return (
    <div style={{width:'100%', background:'#4cb551', display:'flex', justifyContent:'center'}}>
      <HeaderContainer style={{ justifyContent: isHiddenCart && isHiddenSearch ? 'space-between' : 'unset'}} >
        {/* Logo */}
        <Col span={5} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Logo>
            <WrapperTextHeader>
              <LogoText>NHÀ THUỐC TIỆN LỢI</LogoText>
            </WrapperTextHeader>
          </Logo>
        </Col>
        
        {/* Search */}
        {!isHiddenSearch && (
          <Col span={13}>
            <HeaderSearch>
              <ButtonInputSearch
                size="large"
                placeholder="Tìm kiếm sản phẩm..."
                textButton="Tìm kiếm"
                bordered={false}
                variant="borderless"
                onChange={onSearch}
                value={search}
              />
            </HeaderSearch>
          </Col>
        )}
        
        {/* User & Cart */}
        <Col span={6}>
          <HeaderActions>
            <Loading isPending={isPending}>
              {user?.access_token ? (
                <UserActionGroup>
                  <Dropdown 
                    menu={{ items: userMenuItems }} 
                    placement="bottomRight" 
                    arrow
                  >
                    <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      {userAvatar ? (
                        <Avatar src={userAvatar} size="small" />
                      ) : (
                        <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: '#fff', color: '#4cb551' }} />
                      )}
                      <span style={{ marginLeft: '8px', color: '#fff' }}>
                        {userName?.length ? userName : user?.email}
                      </span>
                      <DownOutlined style={{ fontSize: '12px', marginLeft: '6px', color: '#fff' }} />
                    </div>
                  </Dropdown>
                </UserActionGroup>
              ) : (
                <WrapperHeaderAccount onClick={handleNavigateLogin}>
                  <UserOutlined style={{fontSize: '20px', color: '#fff'}} />
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                    <div>
                      <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                      <DownOutlined style={{ fontSize: '10px', marginLeft: '2px', color: '#fff' }} />
                    </div>
                  </div>
                </WrapperHeaderAccount>
              )}
              
              {!isHiddenCart && (
                <CartBadge onClick={handleNavigateCart}>
                  <Badge count={order?.orderItems?.length} size='small'>
                    <ShoppingCartOutlined style={{ fontSize: '24px', color:'#fff' }} />
                  </Badge>
                  <WrapperTextCart>Giỏ hàng</WrapperTextCart>
                </CartBadge>
              )}
            </Loading>
          </HeaderActions>
        </Col>
      </HeaderContainer>
    </div>
  )
}

export default HeaderComponent