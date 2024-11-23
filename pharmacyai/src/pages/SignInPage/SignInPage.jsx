import React, { useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperCotainerSignIn, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import {EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as UserService from '../../services/UserService'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: (data) => UserService.loginUser(data),
    onSuccess: (data) => {
      // Handle successful login here
      console.log('Login successful:', data)
      // You can redirect or set user state here
    },
    onError: (error) => {
      // Handle login error here
      console.error('Login failed:', error)
    }
  })
  console.log('mutation', mutation)
  const handleOnchangeEmail = (value) => {
    setEmail(value)
  }
  const handleOnchangePasswork = (value) => {
    setPassword(value)
  }
  const handleNavigateSignUp = () => {
      navigate('/sign-up')
    }
  const handleSignIn = () => {
    mutation.mutate({
      email,
      password
    })
    console.log('sign-in', email, password)
  }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.53)', height: '100vh' }}>
        <div style={{ width: '413px', height: '300px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
          <WrapperCotainerSignIn>
            <h1>Xin Chào!</h1>
            <p>Đăng nhập hoặc tạo tài khoản</p>
            <InputForm style={{ marginBottom: '10px' }} placeholder="Email" value={email} onChange={handleOnchangeEmail} />
            <div style={{ position: 'relative' }}>
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
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
              <InputForm placeholder="Nhập mật khẩu" type={isShowPassword ? "text" : "password"}  value={password} onChange={handleOnchangePasswork} />
            </div>
                    
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
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
              textButton={'Đăng nhập'}
              styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
            >
                            
            </ButtonComponent>
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
            <p style={{ fontSize: '12px' }}>Chưa có tài khoản?<WrapperTextLight onClick={handleNavigateSignUp}>,Tạo tài khoản</WrapperTextLight></p>
          </WrapperCotainerSignIn>
        </div>
      </div>
    )
  }

export default SignInPage