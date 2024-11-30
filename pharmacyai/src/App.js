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
    let storageData = localStorage.getItem('access_token')
    let decode = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decode = jwtDecode(storageData)
    }
    return {decode, storageData}
  }

  // Trong App.js hoặc interceptor
UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date()
    const { decode } = handleDecode()
    if (decode?.exp < currentTime.getTime() / 1000) {
      const data = await UserService.refreshToken()
      config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  },(err) => {
    return Promise.reject(err);
  });


  
const handlegetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
    
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