import React, { useEffect, useState } from 'react'
import { 
  WrapperContainerAuth, 
  WrapperTextLight, 
  FormTitle, 
  FormSubtitle, 
  AuthContent, 
  AuthForm, 
  FormItem, 
  PasswordWrapper, 
  PasswordToggle, 
  SignUpText, 
  LogoWrapper, 
  ErrorText,
  AuthBackground
} from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import {
  EyeFilled, 
  EyeInvisibleFilled, 
  MedicineBoxOutlined, 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  CheckCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  
  const navigate = useNavigate()
  
  const mutation = useMutationHooks(
    data => UserService.signupUser(data, null)
  )
  
  const { data, isPending, isSuccess, isError } = mutation
  
  useEffect(() => {
    if (isSuccess) {
      message.success('Đăng ký thành công!')
      handleNavigateLogin()
    } else if (isError) {
      message.error('Đăng ký thất bại, vui lòng thử lại')
    }
  }, [isSuccess, isError])
  
  const handleOnchangeEmail = (value) => {
    setEmail(value)
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    setEmailError('')
  }
  
  const handleOnchangePassword = (value) => {
    setPassword(value)
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    setPasswordError('')
  }
  
  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value)
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    setConfirmPasswordError('')
  }
  
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }
  
  const validateInputs = () => {
    let isValid = true
    
    // Validate email
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ')
      isValid = false
    }
    
    // Validate password
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự')
      isValid = false
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu và xác nhận mật khẩu không khớp')
      isValid = false
    }
    
    return isValid
  }
  
  const handleSignUp = () => {
    // Reset error messages
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    
    // Validate inputs before submission
    if (validateInputs()) {
      mutation.mutate({ email, password, confirmPassword })
    }
  }

  return (
    <AuthBackground>
      <WrapperContainerAuth>
        <AuthContent>
          <LogoWrapper>
            <MedicineBoxOutlined />
            <span>NHÀ THUỐC TIỆN LỢI</span>
          </LogoWrapper>
          
          <FormTitle>Đăng ký tài khoản</FormTitle>
          <FormSubtitle>Tạo tài khoản để mua sắm và theo dõi đơn hàng</FormSubtitle>
          
          <AuthForm>
            <FormItem>
              <MailOutlined className="form-icon" />
              <InputForm 
                placeholder="Email" 
                value={email} 
                onChange={handleOnchangeEmail} 
              />
            </FormItem>
            {emailError && <ErrorText>{emailError}</ErrorText>}

            <FormItem>
              <LockOutlined className="form-icon" />
              <PasswordWrapper>
                <InputForm 
                  placeholder="Mật khẩu" 
                  type={isShowPassword ? "text" : "password"} 
                  value={password} 
                  onChange={handleOnchangePassword} 
                />
                <PasswordToggle onClick={() => setIsShowPassword(!isShowPassword)}>
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </PasswordToggle>
              </PasswordWrapper>
            </FormItem>
            {passwordError && <ErrorText>{passwordError}</ErrorText>}
            
            <FormItem>
              <CheckCircleOutlined className="form-icon" />
              <PasswordWrapper>
                <InputForm 
                  placeholder="Xác nhận mật khẩu" 
                  type={isShowConfirmPassword ? "text" : "password"} 
                  value={confirmPassword} 
                  onChange={handleOnchangeConfirmPassword}
                />
                <PasswordToggle onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
                  {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </PasswordToggle>
              </PasswordWrapper>
            </FormItem>
            {confirmPasswordError && <ErrorText>{confirmPasswordError}</ErrorText>}
            
            {data?.status === 'ERR' && <ErrorText>{data.message}</ErrorText>}
            
            <Loading isPending={isPending}>
              <ButtonComponent
                disabled={!email.length || !password.length || !confirmPassword.length}
                onClick={handleSignUp}
                styleButton={{
                  background: '#4cb551',
                  height: '48px',
                  width: '100%',
                  border: 'none',
                  borderRadius: '8px',
                  margin: '20px 0 10px'
                }}
                textButton={'Đăng ký'}
                styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}
              />
            </Loading>
            
            <SignUpText>
              Đã có tài khoản? 
              <WrapperTextLight onClick={handleNavigateLogin}>
                Đăng nhập
              </WrapperTextLight>
            </SignUpText>
          </AuthForm>
        </AuthContent>
      </WrapperContainerAuth>
    </AuthBackground>
  )
}

export default SignUpPage