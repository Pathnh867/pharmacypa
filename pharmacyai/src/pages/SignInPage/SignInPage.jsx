import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
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
  ForgotPassword, 
  SignUpText, 
  LogoWrapper, 
  ErrorText,
  AuthBackground
} from './style'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import {EyeFilled, EyeInvisibleFilled, MedicineBoxOutlined, UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/slide/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate()
  const mutation = useMutationHooks(
    data => UserService.loginUser(data)
  )
  const { data, isPending, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess) {
      if (location?.state) {
       navigate(location?.state)
      } else {
        navigate('/');
      }
      
      // Lưu token vào localStorage với xử lý lỗi
      try {
        if (data?.access_token) {
          localStorage.setItem('access_token', JSON.stringify(data?.access_token));
        }
        if (data?.refresh_token) {
          localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));
        }
        
        // Giải mã token để lấy thông tin người dùng
        if (data?.access_token) {
          const decode = jwtDecode(data?.access_token);
          if (decode?.id) {
            handlegetDetailsUser(decode?.id, data?.access_token);
          }
        }
      } catch (error) {
        console.error("Error processing tokens:", error);
      }
    }
  }, [isSuccess, data])
  
  const handlegetDetailsUser = async (id, token) => {
    try {
      const refreshToken = data?.refresh_token;
      // Lưu dữ liệu refresh_token trước khi gọi API
      const res = await UserService.getDetailsUser(id, token);
      
      // Cập nhật thông tin người dùng vào Redux, bao gồm cả token
      dispatch(updateUser({
        ...res?.data, 
        access_token: token, 
        refreshToken: refreshToken
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }
  
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
    setErrorMessage('');
    mutation.mutate({
        email,
        password
      })
    console.log('sign-in', email, password)
  }
  useEffect(() => {
    if (data?.status === 'ERR') {
      setErrorMessage(data?.message || 'Đăng nhập thất bại, vui lòng thử lại');
    }
  }, [data]);

  return (
    <AuthBackground>
      <WrapperContainerAuth>
        <AuthContent>
          <LogoWrapper>
            <MedicineBoxOutlined />
            <span>NHÀ THUỐC TIỆN LỢI</span>
          </LogoWrapper>
          
          <FormTitle>Đăng nhập</FormTitle>
          <FormSubtitle>Chào mừng bạn trở lại! Đăng nhập để tiếp tục.</FormSubtitle>
          
          <AuthForm>
            <FormItem>
              <UserOutlined className="form-icon" />
              <InputForm 
                placeholder="Email" 
                value={email} 
                onChange={handleOnchangeEmail} 
              />
            </FormItem>

            <FormItem>
              <LockOutlined className="form-icon" />
              <PasswordWrapper>
                <InputForm 
                  placeholder="Mật khẩu" 
                  type={isShowPassword ? "text" : "password"} 
                  value={password} 
                  onChange={handleOnchangePasswork} 
                />
                <PasswordToggle onClick={() => setIsShowPassword(!isShowPassword)}>
                  {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                </PasswordToggle>
              </PasswordWrapper>
            </FormItem>
            
            {data?.status === 'ERR' && <ErrorText>{data?.message}</ErrorText>}
            
            <ForgotPassword>Quên mật khẩu?</ForgotPassword>
            
            <Loading isPending={isPending}>
              <ButtonComponent
                disabled={!email.length || !password.length}
                onClick={handleSignIn}
                styleButton={{
                    background: '#4cb551',
                    height: '48px',
                    width: '100%',
                    border: 'none',
                    borderRadius: '8px',
                    margin: '20px 0 10px'
                  }}
                textButton={'Đăng nhập'}
                styleTextButton={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}
              />
            </Loading>
            
            <SignUpText>
              Chưa có tài khoản? 
              <WrapperTextLight onClick={handleNavigateSignUp}>
                Đăng ký ngay
              </WrapperTextLight>
            </SignUpText>
          </AuthForm>
        </AuthContent>
      </WrapperContainerAuth>
    </AuthBackground>
  )
}

export default SignInPage