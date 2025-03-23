import React, { useEffect, useState } from 'react'
import { WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slide/userSlide'
import { Button, Upload, Tabs } from 'antd'
import { UploadOutlined, UserOutlined, ContactsOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'
import AddressManagement from '../AddressManagement/AddressManagement'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [phone, setPhone] = useState('')

    const mutation = useMutationHooks(
        (data) => {
            const { id, access_token, ...rests } = data
            return UserService.updateUser(id, access_token, { ...rests })
        }
    )
    const dispatch = useDispatch()
    const {data, isPending, isSuccess, isError} = mutation
    
    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setAddress(user?.address)
        setPhone(user?.phone)
        setAvatar(user?.avatar)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success()
            handlegetDetailsUser(user?.id, user?.access_token)
        } else if (isError) {
            message.error()
        }
    }, [isSuccess, isError, user])

    const handlegetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({...res?.data, access_token: token}))
    }
    
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }

    const handleOnchangeName = (value) => {
        setName(value)
    }

    const handleOnchangePhone = (value) => {
        setPhone(value)
    }

    const handleOnchangeAddress = (value) => {
        setAddress(value)
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }

    const handleUpdate = () => {
        mutation.mutate({
          id: user?.id, 
          email: email || user?.email, 
          name: name || user?.name, 
          phone: phone || user?.phone, 
          address: address || user?.address, 
          avatar: avatar || user?.avatar, 
          access_token: user?.access_token,
          refreshToken: user?.refreshToken // Thêm refresh_token
        })
    }

    const tabItems = [
        {
            key: 'profile',
            label: (
                <span>
                    <UserOutlined />
                    Thông tin cá nhân
                </span>
            ),
            children: (
                <WrapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor='name'>Tên người dùng</WrapperLabel>
                        <InputForm 
                            style={{ width: '300px' }} 
                            id="name" 
                            value={name} 
                            onChange={handleOnchangeName} 
                        />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{
                                color:'#39b54a', 
                                fontSize:'15px', 
                                fontWeight:'700'
                            }}
                        />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                        <InputForm 
                            style={{ width: '300px' }} 
                            id="email" 
                            value={email} 
                            onChange={handleOnchangeEmail} 
                            disabled 
                        />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='phone'>Số điện thoại</WrapperLabel>
                        <InputForm 
                            style={{ width: '300px' }} 
                            id="phone" 
                            value={phone} 
                            onChange={handleOnchangePhone} 
                        />
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{
                                color:'#39b54a', 
                                fontSize:'15px', 
                                fontWeight:'700'
                            }}
                        />
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='avatar'>Ảnh đại diện</WrapperLabel>
                        <WrapperUploadFile 
                            onChange={handleOnchangeAvatar} 
                            maxCount={1}
                            accept="image/*"
                        > 
                            <Button icon={<UploadOutlined />}> Chọn ảnh </Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img 
                                src={avatar} 
                                style={{
                                    height: '60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit:'cover',
                                    marginLeft: '10px'
                                }} 
                                alt="avatar"
                            />
                        )}
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                borderRadius: '4px',
                                padding: '2px 6px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{
                                color:'#39b54a', 
                                fontSize:'15px', 
                                fontWeight:'700'
                            }}
                        />
                    </WrapperInput>
                </WrapperContentProfile>
            )
        },
        {
            key: 'addresses',
            label: (
                <span>
                    <ContactsOutlined />
                    Quản lý địa chỉ
                </span>
            ),
            children: <AddressManagement />
        }
    ];

    return (
        <div style={{width: '1270px', margin:'0 auto', padding: '20px 0'}}>
            <WrapperHeader>Thông tin tài khoản</WrapperHeader>
            <Tabs 
                defaultActiveKey="profile" 
                items={tabItems} 
                style={{ background: 'white', padding: '20px', borderRadius: '8px' }}
            />
        </div>
    )
}

export default ProfilePage