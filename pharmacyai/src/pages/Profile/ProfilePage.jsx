import React, { useEffect, useState } from 'react'
import { 
  ProfileContainer, WrapperHeader, TabsContainer, WrapperContentProfile, 
  WrapperInput, WrapperLabel, InputContainer, UpdateButton,
  WrapperUploadFile, AvatarContainer, ProfileSection, AddressesContainer, NoContent
} from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../redux/slide/userSlide'
import { Button, Upload, Tabs, Typography, Avatar, Divider, Alert, Tooltip } from 'antd';
import { 
  UploadOutlined, 
  UserOutlined, 
  ContactsOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  HomeOutlined, 
  EditOutlined, 
  CheckOutlined
} from '@ant-design/icons'
import { getBase64 } from '../../utils'
import AddressManagement from '../AddressManagement/AddressManagement'

const { Title, Text } = Typography;

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [editingField, setEditingField] = useState(null)

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
        setCity(user?.city)
    }, [user])

    useEffect(() => {
        if (isSuccess) {
            message.success('Cập nhật thông tin thành công!')
            handlegetDetailsUser(user?.id, user?.access_token)
            setEditingField(null)
        } else if (isError) {
            message.error('Cập nhật thông tin thất bại. Vui lòng thử lại!')
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
    
    const handleOnchangeCity = (value) => {
        setCity(value)
    }

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setAvatar(file.preview)
    }

    const handleUpdate = (field) => {
        const updateData = {}
        
        if (field === 'name' && name !== user?.name) {
            updateData.name = name
        } else if (field === 'phone' && phone !== user?.phone) {
            updateData.phone = phone
        } else if (field === 'address' && (address !== user?.address || city !== user?.city)) {
            updateData.address = address
            updateData.city = city
        } else if (field === 'avatar' && avatar !== user?.avatar) {
            updateData.avatar = avatar
        } else {
            message.info('Không có thông tin thay đổi')
            return
        }
        
        if (Object.keys(updateData).length > 0) {
            mutation.mutate({
                id: user?.id,
                access_token: user?.access_token,
                refreshToken: user?.refreshToken,
                ...updateData
            })
        }
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
                    <ProfileSection>
                        <Title level={4}>Thông tin cơ bản</Title>
                        <Divider />
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='name'>Họ và tên</WrapperLabel>
                            <InputContainer>
                                <InputForm 
                                    id="name" 
                                    value={name} 
                                    onChange={handleOnchangeName} 
                                    disabled={editingField !== 'name'}
                                />
                            </InputContainer>
                            {editingField === 'name' ? (
                                <UpdateButton>
                                    <Button 
                                        type="primary" 
                                        icon={<CheckOutlined />} 
                                        onClick={() => handleUpdate('name')}
                                        loading={isPending}
                                    >
                                        Lưu
                                    </Button>
                                </UpdateButton>
                            ) : (
                                <UpdateButton>
                                    <Button 
                                        icon={<EditOutlined />} 
                                        onClick={() => setEditingField('name')}
                                    >
                                        Sửa
                                    </Button>
                                </UpdateButton>
                            )}
                        </WrapperInput>
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='email'>Email</WrapperLabel>
                            <InputContainer>
                                <InputForm 
                                    id="email" 
                                    value={email} 
                                    onChange={handleOnchangeEmail} 
                                    disabled
                                    prefix={<MailOutlined style={{ color: '#bbb' }} />}
                                />
                            </InputContainer>
                            <Tooltip title="Email không thể thay đổi">
                                <UpdateButton>
                                    <Button icon={<EditOutlined />} disabled>
                                        Sửa
                                    </Button>
                                </UpdateButton>
                            </Tooltip>
                        </WrapperInput>
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='phone'>Số điện thoại</WrapperLabel>
                            <InputContainer>
                                <InputForm 
                                    id="phone" 
                                    value={phone} 
                                    onChange={handleOnchangePhone} 
                                    disabled={editingField !== 'phone'}
                                    prefix={<PhoneOutlined style={{ color: editingField === 'phone' ? '#4cb551' : '#bbb' }} />}
                                />
                            </InputContainer>
                            {editingField === 'phone' ? (
                                <UpdateButton>
                                    <Button 
                                        type="primary" 
                                        icon={<CheckOutlined />} 
                                        onClick={() => handleUpdate('phone')}
                                        loading={isPending}
                                    >
                                        Lưu
                                    </Button>
                                </UpdateButton>
                            ) : (
                                <UpdateButton>
                                    <Button 
                                        icon={<EditOutlined />} 
                                        onClick={() => setEditingField('phone')}
                                    >
                                        Sửa
                                    </Button>
                                </UpdateButton>
                            )}
                        </WrapperInput>
                    </ProfileSection>
                    
                    <ProfileSection>
                        <Title level={4}>Địa chỉ mặc định</Title>
                        <Divider />
                        
                        {!user?.address && !editingField === 'address' ? (
                            <Alert
                                message="Địa chỉ mặc định chưa được thiết lập"
                                description="Cập nhật địa chỉ để thuận tiện cho việc mua sắm và giao hàng."
                                type="info"
                                showIcon
                                action={
                                    <Button 
                                        size="small" 
                                        type="primary"
                                        onClick={() => setEditingField('address')}
                                    >
                                        Thêm ngay
                                    </Button>
                                }
                                style={{ marginBottom: 16 }}
                            />
                        ) : null}
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='address'>Địa chỉ</WrapperLabel>
                            <InputContainer>
                                <InputForm 
                                    id="address" 
                                    value={address} 
                                    onChange={handleOnchangeAddress} 
                                    disabled={editingField !== 'address'}
                                    prefix={<HomeOutlined style={{ color: editingField === 'address' ? '#4cb551' : '#bbb' }} />}
                                />
                            </InputContainer>
                        </WrapperInput>
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='city'>Thành phố</WrapperLabel>
                            <InputContainer>
                                <InputForm 
                                    id="city" 
                                    value={city} 
                                    onChange={handleOnchangeCity} 
                                    disabled={editingField !== 'address'}
                                    prefix={<EnvironmentOutlined style={{ color: editingField === 'address' ? '#4cb551' : '#bbb' }} />}
                                />
                            </InputContainer>
                            {editingField === 'address' ? (
                                <UpdateButton>
                                    <Button 
                                        type="primary" 
                                        icon={<CheckOutlined />} 
                                        onClick={() => handleUpdate('address')}
                                        loading={isPending}
                                    >
                                        Lưu
                                    </Button>
                                </UpdateButton>
                            ) : (
                                <UpdateButton>
                                    <Button 
                                        icon={<EditOutlined />} 
                                        onClick={() => setEditingField('address')}
                                    >
                                        Sửa
                                    </Button>
                                </UpdateButton>
                            )}
                        </WrapperInput>
                    </ProfileSection>
                    
                    <ProfileSection>
                        <Title level={4}>Ảnh đại diện</Title>
                        <Divider />
                        
                        <WrapperInput>
                            <WrapperLabel htmlFor='avatar'>Hình ảnh</WrapperLabel>
                            <AvatarContainer>
                                <WrapperUploadFile 
                                    onChange={handleOnchangeAvatar} 
                                    maxCount={1}
                                    showUploadList={false}
                                    accept="image/*"
                                > 
                                    <Button icon={<UploadOutlined />}>
                                        {avatar ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                                    </Button>
                                </WrapperUploadFile>
                                
                                {avatar ? (
                                    <img 
                                        src={avatar} 
                                        style={{
                                            height: '80px',
                                            width: '80px',
                                        }} 
                                        alt="avatar"
                                    />
                                ) : (
                                    <Avatar 
                                        icon={<UserOutlined />} 
                                        size={80} 
                                        style={{ backgroundColor: '#4cb551', marginLeft: '16px' }} 
                                    />
                                )}
                            </AvatarContainer>
                            
                            {avatar !== user?.avatar && (
                                <UpdateButton>
                                    <Button 
                                        type="primary" 
                                        icon={<CheckOutlined />} 
                                        onClick={() => handleUpdate('avatar')}
                                        loading={isPending}
                                    >
                                        Lưu
                                    </Button>
                                </UpdateButton>
                            )}
                        </WrapperInput>
                    </ProfileSection>
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
            children: <AddressesContainer><AddressManagement /></AddressesContainer>
        }
    ];

    return (
        <ProfileContainer>
            <WrapperHeader>Thông tin tài khoản</WrapperHeader>
            <TabsContainer>
                <Tabs 
                    defaultActiveKey="profile" 
                    items={tabItems}
                />
            </TabsContainer>
        </ProfileContainer>
    )
}

export default ProfilePage