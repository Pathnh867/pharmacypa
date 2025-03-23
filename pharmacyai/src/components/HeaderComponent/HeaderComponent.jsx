import { Badge, Col, Input, Popover, Avatar, Button, Dropdown, Drawer, Tooltip } from 'antd'
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
  UserSwitchOutlined,
  MenuOutlined,
  CloseOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  PhoneOutlined
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
  HeaderContainer,
  HeaderContent,
  LogoContainer,
  LogoText,
  SearchContainer,
  ActionContainer,
  UserContainer,
  CartContainer,
  UserAvatar,
  UserInfo,
  UserName,
  CartBadge,
  CartText,
  MobileMenuButton,
  MobileDrawerContent,
  MobileMenuList,
  MobileMenuItem,
  MobileSearchContainer,
  MobileUserInfo,
  CategoryMenu,
  CategoryItem
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Theo dõi scroll để thêm shadow cho header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Event handlers
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(resetUser())
    setMobileMenuOpen(false)
  }

  const handleNavigateProfile = () => {
    navigate('/profile-user')
    setMobileMenuOpen(false)
  }

  const handleNavigateAdmin = () => {
    navigate('/system/admin')
    setMobileMenuOpen(false)
  }

  const handleNavigateCart = () => {
    navigate('/order')
    setMobileMenuOpen(false)
  }
  
  const handleNavigateHome = () => {
    navigate('/')
    setMobileMenuOpen(false)
  }

  const handleNavigateCategory = (category) => {
    navigate(`/product/${category}`)
    setMobileMenuOpen(false)
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

  // Categories
  const categories = [
    {
      key: 'all',
      label: 'Tất cả sản phẩm',
      onClick: () => handleNavigateCategory('all')
    },
    {
      key: 'medicine',
      label: 'Dược phẩm',
      onClick: () => handleNavigateCategory('Dược phẩm')
    },
    {
      key: 'supplement',
      label: 'Thực phẩm chức năng',
      onClick: () => handleNavigateCategory('Thực phẩm chức năng')
    },
    {
      key: 'equipment',
      label: 'Thiết bị y tế',
      onClick: () => handleNavigateCategory('Thiết bị y tế')
    },
    {
      key: 'cosmetic',
      label: 'Dược mỹ phẩm',
      onClick: () => handleNavigateCategory('Dược mỹ phẩm')
    }
  ]

  // Effects
  useEffect(() => {
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  return (
    <HeaderContainer scrolled={isScrolled}>
      <HeaderContent>
        {/* Logo */}
        <LogoContainer onClick={handleNavigateHome}>
          <MedicineBoxOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
          <LogoText>NHÀ THUỐC TIỆN LỢI</LogoText>
        </LogoContainer>
        
        {/* Mobile menu button */}
        <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
          <MenuOutlined />
        </MobileMenuButton>
        
        {/* Desktop Search */}
        {!isHiddenSearch && (
          <SearchContainer>
            <ButtonInputSearch
              size="large"
              placeholder="Tìm kiếm sản phẩm..."
              textButton="Tìm kiếm"
              bordered={false}
              variant="borderless"
              onChange={onSearch}
              value={search}
            />
          </SearchContainer>
        )}
        
        {/* Desktop Actions */}
        <ActionContainer>
          <Loading isPending={isPending}>
            {/* User section */}
            <UserContainer>
              {user?.access_token ? (
                <Dropdown 
                  menu={{ items: userMenuItems }} 
                  placement="bottomRight" 
                  arrow
                >
                  <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {userAvatar ? (
                      <UserAvatar src={userAvatar} />
                    ) : (
                      <UserAvatar icon={<UserOutlined />} />
                    )}
                    <UserInfo>
                      <UserName>
                        {userName?.length ? userName : user?.email?.split('@')[0]}
                      </UserName>
                      <DownOutlined style={{ fontSize: '10px', color: '#fff', opacity: 0.8 }} />
                    </UserInfo>
                  </div>
                </Dropdown>
              ) : (
                <Button 
                  type="text" 
                  onClick={handleNavigateLogin}
                  icon={<UserOutlined style={{ fontSize: '18px' }} />}
                  style={{ color: '#fff', display: 'flex', alignItems: 'center' }}
                >
                  Đăng nhập
                </Button>
              )}
            </UserContainer>
            
            {/* Cart section */}
            {!isHiddenCart && (
              <CartContainer onClick={handleNavigateCart}>
                <Badge count={order?.orderItems?.length} size='small' style={{ backgroundColor: '#ff4d4f' }}>
                  <ShoppingCartOutlined style={{ fontSize: '22px' }} />
                </Badge>
                <CartText>Giỏ hàng</CartText>
              </CartContainer>
            )}
          </Loading>
        </ActionContainer>
      </HeaderContent>
      
      {/* Category navigation - desktop */}
      <CategoryMenu>
        {categories.map(category => (
          <CategoryItem key={category.key} onClick={category.onClick}>
            {category.label}
          </CategoryItem>
        ))}
      </CategoryMenu>
      
      {/* Mobile menu drawer */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Menu</span>
            <Button type="text" onClick={() => setMobileMenuOpen(false)} icon={<CloseOutlined />} />
          </div>
        }
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <MobileDrawerContent>
          {/* Mobile user info */}
          {user?.access_token ? (
            <MobileUserInfo>
              {userAvatar ? (
                <Avatar src={userAvatar} size={64} />
              ) : (
                <Avatar icon={<UserOutlined />} size={64} style={{ backgroundColor: '#4cb551' }} />
              )}
              <div>
                <h3>{userName?.length ? userName : user?.email?.split('@')[0]}</h3>
                <p>{user?.email}</p>
              </div>
            </MobileUserInfo>
          ) : (
            <Button 
              block 
              type="primary" 
              size="large" 
              onClick={handleNavigateLogin} 
              style={{ marginBottom: '16px', backgroundColor: '#4cb551', borderColor: '#4cb551' }}
            >
              Đăng nhập / Đăng ký
            </Button>
          )}
          
          {/* Mobile search */}
          <MobileSearchContainer>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              onChange={onSearch}
              value={search}
            />
          </MobileSearchContainer>
          
          {/* Mobile menu */}
          <MobileMenuList>
            <MobileMenuItem onClick={handleNavigateHome}>
              <HomeOutlined /> Trang chủ
            </MobileMenuItem>
            
            {categories.map(category => (
              <MobileMenuItem key={category.key} onClick={category.onClick}>
                <MedicineBoxOutlined /> {category.label}
              </MobileMenuItem>
            ))}
            
            <MobileMenuItem onClick={handleNavigateCart}>
              <ShoppingCartOutlined /> Giỏ hàng 
              {order?.orderItems?.length > 0 && (
                <Badge count={order?.orderItems?.length} size="small" style={{ marginLeft: '8px' }} />
              )}
            </MobileMenuItem>
            
            {user?.access_token && (
              <MobileMenuItem onClick={handleNavigateProfile}>
                <UserOutlined /> Tài khoản của tôi
              </MobileMenuItem>
            )}
            
            {user?.isAdmin && (
              <MobileMenuItem onClick={handleNavigateAdmin}>
                <SettingOutlined /> Quản lý hệ thống
              </MobileMenuItem>
            )}
            
            {user?.access_token && (
              <MobileMenuItem onClick={handleLogout} danger>
                <LogoutOutlined /> Đăng xuất
              </MobileMenuItem>
            )}
            
            <MobileMenuItem>
              <PhoneOutlined /> Hotline: 1900-6868
            </MobileMenuItem>
          </MobileMenuList>
        </MobileDrawerContent>
      </Drawer>
    </HeaderContainer>
  )
}

export default HeaderComponent