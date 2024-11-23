import { Badge, Col, Input } from 'antd'
import React from 'react'
import { WrapperHeader, WrapperTextHeader, WrapperHeaderAccount, WrapperTextCart, WrapperHeaderCart, WrapperTextHeaderSmall } from './style'
import { UserOutlined, DownCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch'
import { useNavigate } from 'react-router-dom';
const HeaderComponent = () => {
  const navigate = useNavigate()
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  return (
    <div style={{width:'100%',background:'#4cb551' , display:'flex', justifyContent:'center',}}>
        <WrapperHeader >
            <Col span={5}>
                <WrapperTextHeader>SMART PHARMACY</WrapperTextHeader>
            </Col>
            <Col span={13}>
                  <ButtonInputSearch
                      size="large"
                      placeholder="Nhập tên sản phẩm"
                      textButton="Tìm kiếm"
                      bordered ='false'
                      variant ='borderless'
                  />
            </Col>
                <Col span={6} style={{display: 'flex', gap: '54px', alignItems: 'center'}}>
                    <WrapperHeaderAccount>
                      <UserOutlined style={{fontSize: '30px'}}/>
                      <div onClick={handleNavigateLogin} style={{cursor: 'pointer'}}>
                          <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                          <div>
                              <WrapperTextHeaderSmall>Tài khoản   </WrapperTextHeaderSmall>
                              <DownCircleOutlined />
                          </div>
                        
                      </div>
                  </WrapperHeaderAccount>
                  <WrapperHeaderCart>
                    <Badge count={4} size='small'>
                      <ShoppingCartOutlined style={{ fontSize: '30px', color:'#fff' }} />
                    </Badge>
                      <WrapperTextCart>Giỏ hàng</WrapperTextCart>
                  </WrapperHeaderCart>
                </Col>
        </WrapperHeader>
    </div>
  )
}

export default HeaderComponent