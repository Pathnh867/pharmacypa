import { Badge, Col, Input, Popover } from 'antd'
import React, { useState } from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextCart, WrapperHeaderCart, WrapperTextHeaderSmall, WrapperContentPopup } from './style'
import { UserOutlined, DownCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import {resetUser} from '../../redux/slide/userSlide'
import Loading from '../LoadingComponent/Loading';
import { useMutationHooks } from '../../hooks/useMutationHook';
const HeaderComponent = ({isHiddenSearch = false, isHiddenCart= false}) => {
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const { isPending } = mutation
  const handleLogout = async () => {
    
    await UserService.logoutUser()
    localStorage.removeItem('access_token');
    dispatch(resetUser())
    
  }
  const content = (
    <div>
      <WrapperContentPopup onClick={handleLogout}> Đăng xuất </WrapperContentPopup>
      <WrapperContentPopup> Thông tin người dùng </WrapperContentPopup>
      {user?.isAdmin && (
         <WrapperContentPopup onClick={()=> navigate('/system/admin')}> Quản lý hệ thống </WrapperContentPopup>
      )}
    </div>
  );
  
  const onSearch = (e) => {
    console.log('e', e.target.value)
  }

  return (
    <div style={{width:'100%',background:'#4cb551' , display:'flex', justifyContent:'center',}}>
        <WrapperHeader style={{ justifyContent: isHiddenCart && isHiddenSearch ? 'space-between' : 'unset'}} >
            <Col span={5}>
                <WrapperTextHeader>SMART PHARMACY</WrapperTextHeader>
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
                      {user?.name ? (
                        <>
                          <Popover content = {content} trigger="click" >
                            <div style={{cursor: 'pointer'}}>{user.name}</div>
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
                    <WrapperHeaderCart>
                        <Badge count={4} size='small'>
                          <ShoppingCartOutlined style={{ fontSize: '30px', color:'#fff' }} />
                        </Badge>
                          <WrapperTextCart>Giỏ hàng</WrapperTextCart>
                  </WrapperHeaderCart>
                 )}   
                  
                </Col>
        </WrapperHeader>
    </div>
  )
}

export default HeaderComponent