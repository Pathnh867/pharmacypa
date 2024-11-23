import React, { useState } from 'react'
import { WrapperCotainerSignIn, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import {EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmPassword] = useState('')
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePasswork = (value) => {
    setPassword(value)
  }
  const handleOnchangeConfirmPassword = (value) => {
   setConfirmPassword(value)
  }
  const navigate = useNavigate()
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  const handleSignUp = () => {
    console.log('sign-up', email, password, confirmpassword)
  }
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.53)', height:'100vh'}}>
          <div style={{width: '413px', height:'305px', borderRadius:'6px',background:'#fff', display:'flex'}}>
                <WrapperCotainerSignIn>
                    <h1>Xin Chào!</h1>
                    <p style={{ fontSize: '12px' }}>Tạo tài khoản</p>
                    <InputForm style={{marginBottom:'10px'}} placeholder="Email" value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                      <span
                        onClick = {() => setIsShowPassword(!isShowPassword)}
                        style={{
                          zIndex: 10,
                          position: 'absolute',
                          top: '4px',
                          right: '8px'
                        }}
                      >{
                              isShowPassword ? (
                                  <EyeFilled />
                              ) : (
                                  <EyeInvisibleFilled />
                              )
                      }
                      </span>
                      <InputForm placeholder="Nhập mật khẩu" type={isShowPassword ? "text" : "password"} style={{marginBottom:'10px'}} value={password} onChange={handleOnchangePasswork} /> 
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span onClick = {() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                       style={{
                          zIndex: 10,
                          position: 'absolute',
                          top: '4px',
                          right: '8px'
                        }}
                      >{
                              isShowConfirmPassword ? (
                                  <EyeFilled />
                              ) : (
                                  <EyeInvisibleFilled />
                              )
                      }
                      </span>
                      <InputForm placeholder="Nhập lại mật khẩu" type={isShowConfirmPassword ? "text" : "password"} value={confirmpassword} onChange={handleOnchangeConfirmPassword}/> 
                    </div>
                  
                      <ButtonComponent
                            disabled={!email.length || !password.length|| !confirmpassword.length}
                            onClick={handleSignUp}
                            bordered={false}
                            size={40}
                            styleButton={{
                                background: '#39b54a',
                                height: '48px',
                                width: '100%',
                                border: 'none',
                                borderRadius: '4px',
                                margin: '26px 0 10px'
                            }}
                            textButton={'Đăng ký'}
                            styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'700'}}
                        >
                            
                  </ButtonComponent>
                  <p style={{fontSize:'12px'}}>Bạn đã có tài khoản?<WrapperTextLight onClick={handleNavigateLogin}> Đăng nhập</WrapperTextLight></p>
                </WrapperCotainerSignIn>
          </div>
      </div>
  )
}

export default SignUpPage