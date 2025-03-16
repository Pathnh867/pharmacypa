import { Badge, Col, Input, Popover } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextCart, WrapperHeaderCart, WrapperTextHeaderSmall, WrapperContentPopup } from './style'
import { UserOutlined, DownCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import {resetUser} from '../../redux/slide/userSlide'
import Loading from '../LoadingComponent/Loading';
import { useMutationHooks } from '../../hooks/useMutationHook';
import { searchProduct } from '../../redux/slide/productSlide';
const HeaderComponent = ({isHiddenSearch = false, isHiddenCart= false}) => {
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const order = useSelector((state) => state.order)
  const [search, setSearch] = useState('')
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const { isPending } = mutation
  const handleLogout = async () => {
    
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
    
  }

  useEffect(() => {
    setUserName(user?.name)
  }, [user?.name])
  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}> Đăng xuất </WrapperContentPopup>
      <WrapperContentPopup onClick={()=> navigate('/profile-user')}> Thông tin người dùng </WrapperContentPopup>
      {user?.isAdmin && (
         <WrapperContentPopup onClick={()=> navigate('/system/admin')}> Quản lý hệ thống </WrapperContentPopup>
      )}
    </div>
  );
  
  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{width:'100%',background:'#4cb551' , display:'flex', justifyContent:'center',}}>
        <WrapperHeader style={{ justifyContent: isHiddenCart && isHiddenSearch ? 'space-between' : 'unset'}} >
            <Col span={5}>
                <WrapperTextHeader>NHÀ THUỐC TIỆN LỢI</WrapperTextHeader>
            </Col>
            {!isHiddenSearch && (
              
                  <Col span={13}>
                      <ButtonInputSearch
                          size="large"
                          placeholder="Nhập tên sản phẩm"
                          textButton="Tìm kiếm"
                          bordered ='false'
                          variant ='borderless'
                          onChange={onSearch}
                      />
                 </Col>
              )}
            
            <Col span={6} style={{display: 'flex', gap: '54px', alignItems: 'center'}}>
                  <Loading isPending={isPending}>
                    <WrapperHeaderAccount>
                      <UserOutlined style={{fontSize: '30px'}}/>
                      {user?.access_token ? (
                        <>
                          <Popover content = {content} trigger="click" >
                            <div style={{cursor: 'pointer'}}>{userName?.length ? userName : user?.email}</div>
                          </Popover>
                        </>
                      ) : (
                          <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                          <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                          <div>
                              <WrapperTextHeaderSmall>Tài khoản   </WrapperTextHeaderSmall>
                              <DownCircleOutlined />
                          </div>
                        
                      </div>
                      )}
                      
                  </WrapperHeaderAccount>
                  </Loading>
                 {!isHiddenCart && (
                    <div onClick={() => navigate('/order')} style={{cursor:'pointer'}}>
                      <WrapperHeaderCart>
                        <Badge count={order?.orderItems?.length} size='small'>
                          <ShoppingCartOutlined style={{ fontSize: '30px', color:'#fff' }} />
                        </Badge>
                          <WrapperTextCart>Giỏ hàng</WrapperTextCart>
                        </WrapperHeaderCart>
                    </div>
                 )}   
                  
                </Col>
        </WrapperHeader>
    </div>
  )
}

export default HeaderComponent