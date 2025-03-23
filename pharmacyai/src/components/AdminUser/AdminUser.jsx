import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal, Radio, Select } from 'antd'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponents/TableComponent'
import InputComponents from '../InputComponents/InputComponents'
import { WrapperUploadFile } from './style'
import { getBase64 } from '../../utils'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/Message'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DrawerComponents from '../DrawerComponents/DrawerComponents'
import { useSelector } from 'react-redux'

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isPendingUpdate, setIsPendingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const queryClient = useQueryClient();
  
  const user = useSelector((state) => state?.user)
  
  const [stateUser, setStateUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    avatar: '',
    isAdmin: false
  })
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    isAdmin: false
  })

  const [form] = Form.useForm()
  
  // Mutation hook để tạo người dùng mới
  const mutation = useMutationHooks(
  (data) => {
    const { name, email, password, confirmPassword, phone, address, avatar, isAdmin } = data
    // Nếu đang tạo user là admin thì cần gửi token
    return UserService.signupUser(
      { name, email, password, confirmPassword, phone, address, avatar, isAdmin },
      isAdmin ? user?.access_token : null
    );
  }
)
  // Mutation hook để cập nhật thông tin người dùng
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = UserService.updateUser(id, token, { ...rests })
      return res
    },
  )

  // Mutation hook để xóa người dùng
  const mutationDelete = useMutationHooks(
    (data) => {
      const { id, token } = data
      const res = UserService.deleteUser(id, token)
      return res
    },
  )

  // Lấy tất cả người dùng
  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }

  // Lấy chi tiết người dùng
  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected, user?.access_token)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        address: res?.data?.address,
        avatar: res?.data?.avatar,
        isAdmin: res?.data?.isAdmin
      })
    }
    setIsPendingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])
  
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected])

  const handleDetailsUser = () => {
    setIsOpenDrawer(true)
  }

  // Trạng thái và data từ các mutation hooks
  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDelete, isPending: isPendingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete
  
  // Query để lấy danh sách người dùng
  const queryUsers = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })
  
  const { isPending: isPendingUsers, data: users } = queryUsers

  // Render các nút hành động
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: '#4cb551', fontSize: '30px', cursor: 'pointer' }} onClick={handleDetailsUser} />
      </div>
    )
  }

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
      sorter: (a, b) => a.name?.length - b.name?.length
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email?.length - b.email?.length
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      render: (isAdmin) => (isAdmin ? 'Có' : 'Không')
    },
    {
      title: 'Hành động',
      dataIndex: 'actions',
      render: renderAction
    },
  ]

  // Format dữ liệu cho bảng
  const dataTable = users?.data?.length && users?.data?.map((user) => {
    return { ...user, key: user._id }
  })

  // Xử lý xóa người dùng
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDelete) {
      message.error()
    }
  }, [isSuccessDelete])

  // Đóng drawer chi tiết
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false)
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      address: '',
      avatar: '',
      isAdmin: false
    })
    form.resetFields()
  }

  // Xử lý tạo người dùng thành công
  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  // Xử lý cập nhật người dùng thành công
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  // Đóng modal xóa
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  
  // Xác nhận xóa người dùng
  const handleDeleteUser = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUsers.refetch()
      }
    })
  }

  // Đóng modal tạo
  const handleCancel = () => {
    setIsModalOpen(false)
    setStateUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      address: '',
      avatar: '',
      isAdmin: false
    })
    form.resetFields()
  }
 
  // Submit form tạo người dùng
  const onFinish = () => {
    if (!stateUser.email || !stateUser.password || !stateUser.confirmPassword) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    const params = {
      name: stateUser.name,
      email: stateUser.email,
      password: stateUser.password,
      confirmPassword: stateUser.confirmPassword,
      phone: stateUser.phone,
      address: stateUser.address,
      avatar: stateUser.avatar,
      isAdmin: stateUser.isAdmin
    }
    
    mutation.mutate(params, {
      onSuccess: (data) => {
        if (data.status === 'OK') {
          message.success('Tạo người dùng thành công');
          handleCancel();
          queryUsers.refetch();
        } else {
          message.error(data.message || 'Tạo người dùng thất bại');
        }
      },
      onError: (error) => {
        console.error('Error creating user:', error);
        message.error('Lỗi khi tạo người dùng: ' + (error.message || 'Không xác định'));
      }
    });
  }
  // Xử lý thay đổi input trong form tạo
  const handleOnchange = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value
    })
  }

  // Xử lý thay đổi input trong form cập nhật
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  // Xử lý thay đổi avatar
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateUser({
      ...stateUser,
      avatar: file.preview
    })
  }

  // Xử lý thay đổi avatar trong form cập nhật
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
  }

  // Xử lý thay đổi trạng thái admin
  const handleChangeSelect = (value) => {
    setStateUser({
      ...stateUser,
      isAdmin: value === 'admin'
    })
  }

  // Xử lý thay đổi trạng thái admin trong form cập nhật
  const handleChangeSelectDetails = (value) => {
    setStateUserDetails({
      ...stateUserDetails,
      isAdmin: value === 'admin'
    })
  }

  // Submit form cập nhật
  // Submit form cập nhật
  const onUpdateUser = () => {
    // Chuẩn bị dữ liệu trước khi gửi
    const dataToUpdate = {
      name: stateUserDetails.name?.trim() || undefined,
      phone: stateUserDetails.phone ? String(stateUserDetails.phone).trim() : undefined,
      address: stateUserDetails.address?.trim() || undefined,
      city: stateUserDetails.city?.trim() || undefined,
      avatar: stateUserDetails.avatar || undefined,
      isAdmin: stateUserDetails.isAdmin
    };
    
    const handleOnchangeDetails = (e) => {
      setStateUserDetails({
        ...stateUserDetails,
        [e.target.name]: e.target.value
      })
    }
    // Đảm bảo không gửi các thông tin xác thực
    console.log('Dữ liệu sẽ gửi:', dataToUpdate);
    
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...dataToUpdate },
      {
        onSuccess: (data) => {
          console.log('Kết quả cập nhật:', data);
          if (data?.status === 'OK') {
            message.success('Cập nhật thành công!');
            
            // Cập nhật cache
            queryClient.setQueryData(['users'], (oldData) => {
              if (!oldData || !oldData.data) return oldData;
              
              return {
                ...oldData,
                data: oldData.data.map(item => 
                  item._id === rowSelected ? { ...item, ...dataToUpdate } : item
                )
              };
            });
            
            // Đóng drawer
            handleCloseDrawer();
          } else {
            message.error(data?.message || 'Cập nhật không thành công');
          }
        },
        onError: (error) => {
          console.error('Update error:', error);
          message.error('Lỗi khi cập nhật: ' + (error.message || 'Không rõ lỗi'));
        }
      }
    );
  };
  


  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>
      <div style={{ marginTop: '10px' }}>
        <Button 
          style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} 
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleOutlined style={{ fontSize: '60px' }} />
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <TableComponent 
          columns={columns} 
          isPending={isPendingUsers} 
          data={dataTable} 
          onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record._id)
              }
            }
          }} 
        />
      </div>
      
      {/* Modal tạo người dùng */}
      <Modal 
        forceRender 
        title="Tạo người dùng" 
        open={isModalOpen} 
        onCancel={handleCancel} 
        footer={null}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên người dùng"
              name="name"
              rules={[{ required: true, message: 'Hãy nhập tên người dùng' }]}
            >
              <InputComponents value={stateUser.name} onChange={handleOnchange} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Hãy nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <InputComponents value={stateUser.email} onChange={handleOnchange} name="email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Hãy nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <InputComponents 
                value={stateUser.password} 
                onChange={handleOnchange} 
                name="password" 
                type="password"
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Hãy xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                  },
                }),
              ]}
            >
              <InputComponents 
                value={stateUser.confirmPassword} 
                onChange={handleOnchange} 
                name="confirmPassword" 
                type="password"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
            >
              <InputComponents value={stateUser.phone} onChange={handleOnchange} name="phone" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
            >
              <InputComponents value={stateUser.address} onChange={handleOnchange} name="address" />
            </Form.Item>

            <Form.Item
                label="Quyền hạn"
                name="isAdmin"
              >
                <Radio.Group 
                  value={stateUser.isAdmin ? "admin" : "user"}
                  onChange={(e) => handleChangeSelect(e.target.value)}
                >
                  <Radio value="user">Người dùng</Radio>
                  <Radio value="admin">Quản trị viên</Radio>
                </Radio.Group>
              </Form.Item>

            <Form.Item
              label="Hình ảnh"
              name="avatar"
            >
              <WrapperUploadFile 
                  onChange={handleOnchangeAvatar} 
                  maxCount={1}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)} // Ngăn upload tự động
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('Bạn chỉ có thể tải lên file hình ảnh!');
                      return false;
                    }
                    return true;
                  }}
                >
                  <Button>Chọn ảnh</Button>
                  {stateUser?.avatar && (
                    <img 
                      src={stateUser?.avatar} 
                      style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                      }} 
                      alt="avatar" 
                    />
                  )}
                </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Tạo
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
      
      {/* Drawer chi tiết người dùng */}
      <DrawerComponents 
        title='Chi tiết người dùng' 
        isOpen={isOpenDrawer} 
        onClose={() => setIsOpenDrawer(false)} 
        width='90%'
      >
        <Loading isPending={isPendingUpdated || isPendingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 15 }}
            onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên người dùng"
              name="name"
              rules={[{ required: true, message: 'Hãy nhập tên người dùng' }]}
            >
              <InputComponents value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Hãy nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <InputComponents value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" disabled />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
            >
              <InputComponents value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
            >
              <InputComponents value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>

            <Form.Item label="Quyền hạn" name="isAdmin">
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                  <input 
                    type="radio" 
                    id="user-role" 
                    name="role-radio" 
                    checked={!stateUserDetails.isAdmin} 
                    onChange={() => {
                      console.log('Setting isAdmin to false');
                      setStateUserDetails({
                        ...stateUserDetails,
                        isAdmin: false
                      });
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="user-role">Người dùng</label>
                </div>
                
                <div>
                  <input 
                    type="radio" 
                    id="admin-role" 
                    name="role-radio" 
                    checked={stateUserDetails.isAdmin} 
                    onChange={() => {
                      console.log('Setting isAdmin to true');
                      setStateUserDetails({
                        ...stateUserDetails,
                        isAdmin: true
                      });
                    }}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor="admin-role">Quản trị viên</label>
                </div>
              </div>
            </Form.Item>

            <Form.Item
              label="Hình ảnh"
              name="avatar"
            >
              <WrapperUploadFile 
                  onChange={handleOnchangeAvatarDetails} 
                  maxCount={1}
                  customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)} // Ngăn upload tự động
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    if (!isImage) {
                      message.error('Bạn chỉ có thể tải lên file hình ảnh!');
                      return false;
                    }
                    return true;
                  }}
                >
                  <Button>Chọn ảnh</Button>
                  {stateUserDetails?.avatar && (
                    <img 
                      src={stateUserDetails?.avatar} 
                      style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                      }} 
                      alt="avatar" 
                    />
                  )}
                </WrapperUploadFile>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button 
                type="primary"
                onClick={() => {
                  // Kiểm tra giá trị form
                  console.log('Form values before submit:', form.getFieldsValue());
                  console.log('Current user details:', stateUserDetails);
                  console.log('Selected row ID:', rowSelected);
                  
                  // Gọi trực tiếp hàm cập nhật
                  onUpdateUser();
                }}
              >
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        </Loading>
      </DrawerComponents>
      
      {/* Modal xác nhận xóa */}
      <Modal 
        title="Xóa người dùng" 
        open={isModalOpenDelete} 
        onCancel={handleCancelDelete} 
        onOk={handleDeleteUser}
      >
        <Loading isPending={isPendingDelete}>
          <div>Bạn có chắc muốn xóa người dùng này?</div>
        </Loading>
      </Modal>
    </div>
  )
}

export default AdminUser