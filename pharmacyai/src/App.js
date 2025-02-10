import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import {useDispatch, useSelector} from 'react-redux'
import { updateUser } from './redux/slide/userSlide'
import Loading from './components/LoadingComponent/Loading'

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false)
  const user = useSelector((state)=> state.user)

  useEffect(() => {
    setIsPending(true)
    const { storageData, decode } = handleDecode()
    if (decode?.id) {
        handlegetDetailsUser(decode?.id, storageData)
    }
    setIsPending(false)
  }, [])

  const handleDecode = () => {
    let storageData = user?.access_token || localStorage.getItem('access_token')
    let decode = {}
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData)
      decode = jwtDecode(storageData)
    }
    return {decode, storageData}
  }

  // Trong App.js hoặc interceptor
UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decode } = handleDecode()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodeRefreshToken = jwtDecode(refreshToken)
    if (decode?.exp < currentTime.getTime() / 1000) {
      if (decodeRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      } else {
        dispatch(updateUser())
      }
      
    }
    return config;
  },(err) => {
    return Promise.reject(err);
  });


  
  const handlegetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken }))
    
}
  
  return (
    <div>
      <Loading isPending={isPending}>
        <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page
            const ischeckAuth = !route.isPrivate || user.isAdmin
            const Layout = route.isShowHeader ? DefaultComponent : Fragment
            return (
              <Route key={route.path} path={ischeckAuth ? route.path: undefined} element={
                <Layout>
                  <Page />
                </Layout>
              } />
            )
          })}
        </Routes>
        </Router>
      </Loading>
      
    </div>
  )
} 
export default App;