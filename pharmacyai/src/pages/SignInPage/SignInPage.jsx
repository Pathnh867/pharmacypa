import React, { useEffect, useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperCotainerSignIn, WrapperTextLight } from './style'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import {EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
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
      localStorage.setItem('access_token', JSON.stringify(data?.access_token));
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token));
     if (data?.access_token) {
      const decode = jwtDecode(data?.access_token);
      if (decode?.id) {
        handlegetDetailsUser(decode?.id, data?.access_token);
      }
    }
    }
  }, [isSuccess, data])
  
  const handlegetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken}))
  }
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
            {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message }</span>}       
            <Loading isPending={isPending}>
              <ButtonComponent
                disabled={!email.length || !password.length}
                onClick={handleSignIn}
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
            </Loading>
            
            <WrapperTextLight>Quên mật khẩu</WrapperTextLight>
            <p style={{ fontSize: '12px' }}>Chưa có tài khoản?<WrapperTextLight onClick={handleNavigateSignUp}>,Tạo tài khoản</WrapperTextLight></p>
          </WrapperCotainerSignIn>
        </div>
      </div>
    )
  }

export default SignInPage