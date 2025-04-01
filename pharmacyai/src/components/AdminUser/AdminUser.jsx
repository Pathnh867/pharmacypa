// pharmacyai/src/components/AdminUser/AdminUser.jsx

import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Switch, 
  Tag, 
  Tooltip, 
  Avatar, 
  Popconfirm, 
  Upload, 
  message,
  Divider,
  Card,
  Row,
  Col,
  Statistic
} from 'antd'
import { 
  UserOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined, 
  UploadOutlined, 
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  UserAddOutlined 
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import { getBase64 } from '../../utils'
import moment from 'moment'

// Import shared styles
import {
  AdminSectionTitle,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSearchContainer,
  colors
} from './style';

const { Option } = Select;

const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const user = useSelector((state) => state?.user);
  
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    admin: 0,
    customer: 0,
    active: 0,
    inactive: 0
  });
  
  // State for new user
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: '',
    address: '',
    isAdmin: false,
    active: true
  });
  
  // Queries
  const queryUsers = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getAllUser(user?.access_token),
  });
  
  // Mutations
  const createMutation = useMutationHooks(
    (data) => {
      return UserService.createUserByAdmin(data.userData, data.token);
    }
  );
  
  
  const updateMutation = useMutationHooks(
    (data) => {
      return UserService.updateUser(data.id, data.userData, data.token);
    }
  );
  
  const deleteMutation = useMutationHooks(
    (data) => {
      return UserService.deleteUser(data.id, data.token);
    }
  );
  
  // Fetch users on mount
  useEffect(() => {
    if (user?.access_token) {
      queryUsers.refetch();
    }
  }, [user?.access_token]);
  
  // Calculate stats from user data
  useEffect(() => {
    if (queryUsers.data?.data) {
      const userData = queryUsers.data.data;
      setStats({
        total: userData.length,
        admin: userData.filter(u => u.isAdmin).length,
        customer: userData.filter(u => !u.isAdmin).length,
        active: userData.filter(u => u.active).length,
        inactive: userData.filter(u => !u.active).length
      });
    }
  }, [queryUsers.data]);
  
  // Handle mutations responses
  useEffect(() => {
    if (createMutation.isSuccess) {
      message.success('Tạo người dùng thành công');
      setIsModalOpen(false);
      queryUsers.refetch();
      resetForm();
      setConfirmLoading(false);
    } else if (createMutation.isError) {
      message.error('Tạo người dùng thất bại');
      setConfirmLoading(false);
    }
  }, [createMutation.isSuccess, createMutation.isError]);
  
  useEffect(() => {
    if (updateMutation.isSuccess) {
      message.success('Cập nhật người dùng thành công');
      setIsModalOpen(false);
      queryUsers.refetch();
      resetForm();
      setConfirmLoading(false);
    } else if (updateMutation.isError) {
      message.error('Cập nhật người dùng thất bại');
      setConfirmLoading(false);
    }
  }, [updateMutation.isSuccess, updateMutation.isError]);
  
  useEffect(() => {
    if (deleteMutation.isSuccess) {
      message.success('Xóa người dùng thành công');
      queryUsers.refetch();
    } else if (deleteMutation.isError) {
      message.error('Xóa người dùng thất bại');
    }
  }, [deleteMutation.isSuccess, deleteMutation.isError]);
  
  // Reset form data
  const resetForm = () => {
    setNewUser({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      avatar: '',
      address: '',
      isAdmin: false,
      active: true
    });
    userForm.resetFields();
  };
  
  // Handle modal actions
  const showCreateModal = () => {
    setIsEditMode(false);
    resetForm();
    setIsModalOpen(true);
  };
  
  const showEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    
    // Set form values
    userForm.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      isAdmin: user.isAdmin,
      active: user.active
    });
    
    setNewUser({
      ...newUser,
      avatar: user.avatar || '',
      isAdmin: user.isAdmin,
      active: user.active
    });
    
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    resetForm();
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };
  
  const handleSwitchChange = (field, value) => {
    setNewUser({
      ...newUser,
      [field]: value
    });
  };
  
  const handleAvatarChange = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      
      setNewUser({
        ...newUser,
        avatar: file.preview
      });
    }
  };
  
  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value);
  };
  
  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };
  
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };
  
  const resetFilters = () => {
    setSearchText('');
    setRoleFilter(null);
    setStatusFilter(null);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);
      const values = await userForm.validateFields();
      
      // Prepare data for API
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        isAdmin: values.isAdmin === true, // Đảm bảo là boolean
        active: values.active
      };
      
      // Add password for new users
      if (!isEditMode) {
        if (values.password !== values.confirmPassword) {
          message.error('Mật khẩu và xác nhận mật khẩu không khớp');
          setConfirmLoading(false);
          return;
        }
        userData.password = values.password;
        userData.confirmPassword = values.confirmPassword;
      }
      
      // Add avatar if exists
      if (newUser.avatar) {
        userData.avatar = newUser.avatar;
      }
      
      if (isEditMode) {
        updateMutation.mutate({
          id: selectedUser._id,
          userData,
          token: user.access_token
        });
      } else {
        createMutation.mutate({
          userData,
          token: user.access_token
        }, {
          onSettled: () => {
            queryUsers.refetch();
          }
        });
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setConfirmLoading(false);
    }
  };
  
  // Handle delete user
  const handleDeleteUser = (userId) => {
    deleteMutation.mutate({
      id: userId,
      token: user.access_token
    });
  };
  
  // Filter data
  const filterData = (data) => {
    if (!data) return [];
    
    return data.filter(item => {
      const nameMatch = item.name?.toLowerCase().includes(searchText.toLowerCase()) || 
                       item.email?.toLowerCase().includes(searchText.toLowerCase());
      const roleMatch = roleFilter === null || 
                       (roleFilter === 'admin' ? item.isAdmin : !item.isAdmin);
      const statusMatch = statusFilter === null || 
                         (statusFilter === 'active' ? item.active : !item.active);
      
      return nameMatch && roleMatch && statusMatch;
    });
  };
  
  // Table columns
  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={record.avatar} 
            icon={!record.avatar && <UserOutlined />} 
            style={{ marginRight: '12px', backgroundColor: record.isAdmin ? colors.primary : '#1890ff' }}
            size="large"
          />
          <div>
            <div style={{ fontWeight: '500' }}>{text || 'Không có tên'}</div>
            <div style={{ fontSize: '12px', color: colors.textSecondary }}>{record.email}</div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name?.localeCompare(b.name)
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: 'phone',
      key: 'contact',
      render: (phone, record) => (
        <div>
          {phone && <div><PhoneOutlined /> {phone}</div>}
          {record.address && <div style={{ marginTop: '4px' }}>{record.address}</div>}
        </div>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'isAdmin',
      key: 'role',
      render: isAdmin => (
        <Tag color={isAdmin ? colors.primary : colors.info}>
          {isAdmin ? 'Quản trị viên' : 'Khách hàng'}
        </Tag>
      ),
      filters: [
        { text: 'Quản trị viên', value: true },
        { text: 'Khách hàng', value: false }
      ],
      onFilter: (value, record) => record.isAdmin === value
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'status',
      render: active => (
        <Tag color={active ? 'success' : 'error'}>
          {active ? 'Hoạt động' : 'Vô hiệu hóa'}
        </Tag>
      ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Vô hiệu hóa', value: false }
      ],
      onFilter: (value, record) => record.active === value
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              type="primary"
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                icon={<DeleteOutlined />} 
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];
  
  // Data source
  const dataSource = queryUsers.data?.data ? filterData(queryUsers.data.data).map(item => ({
    ...item,
    key: item._id
  })) : [];
  
  // Upload props
  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: false
  };
  
  return (
    <div>
      <AdminSectionTitle>Quản lý người dùng</AdminSectionTitle>
      
      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: colors.info }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Quản trị viên"
              value={stats.admin}
              prefix={<UserSwitchOutlined />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={stats.customer}
              prefix={<UserOutlined />}
              valueStyle={{ color: colors.secondary }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Hoạt động"
              value={stats.active}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic
              title="Vô hiệu hóa"
              value={stats.inactive}
              prefix={<DeleteOutlined />}
              valueStyle={{ color: colors.error }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Tìm kiếm và lọc */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <AdminSearchContainer>
          <div className="search-item">
            <AdminInput
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>
          
          <div className="search-item">
            <AdminSelect
              placeholder="Lọc theo vai trò"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="admin">Quản trị viên</Option>
              <Option value="customer">Khách hàng</Option>
            </AdminSelect>
          </div>
          
          <div className="search-item">
            <AdminSelect
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Vô hiệu hóa</Option>
            </AdminSelect>
          </div>
          
          <div className="search-actions">
            <AdminButton
              icon={<FilterOutlined />}
              onClick={() => queryUsers.refetch()}
              type="primary"
              ghost
            >
              Lọc
            </AdminButton>
            
            <AdminButton
              icon={<ReloadOutlined />}
              onClick={resetFilters}
            >
              Đặt lại
            </AdminButton>
            
            <AdminButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={showCreateModal}
            >
              Thêm người dùng
            </AdminButton>
          </div>
        </AdminSearchContainer>
      </AdminCard>
      
      {/* Bảng dữ liệu */}
      <AdminCard>
        <AdminTable
          columns={columns}
          dataSource={dataSource}
          loading={queryUsers.isLoading}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </AdminCard>
      
      {/* Modal thêm/sửa người dùng */}
      <Modal
        title={isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
        confirmLoading={confirmLoading}
      >
        <Form
          form={userForm}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isAdmin: newUser.isAdmin,
            active: newUser.active
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '200px', textAlign: 'center' }}>
              <div style={{ 
                width: '200px', 
                height: '200px', 
                border: '1px dashed #d9d9d9',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                overflow: 'hidden'
              }}>
                {newUser.avatar ? (
                  <img 
                    src={newUser.avatar} 
                    alt="Avatar" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#999' }}>
                    <UserOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                    <div>Tải lên ảnh đại diện</div>
                  </div>
                )}
              </div>
              
              <Upload
                {...uploadProps}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>
                  {newUser.avatar ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                </Button>
              </Upload>
            </div>
            
            <div style={{ flex: 1 }}>
              <Form.Item
                label="Họ tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <AdminInput 
                  name="name"
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên"
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <AdminInput 
                  name="email"
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  prefix={<MailOutlined />}
                  disabled={isEditMode}
                />
              </Form.Item>
              
              {!isEditMode && (
                <>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: !isEditMode, message: 'Vui lòng nhập mật khẩu' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                  >
                    <Input.Password
                      name="password"
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: !isEditMode, message: 'Vui lòng xác nhận mật khẩu' },
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
                    <Input.Password
                      name="confirmPassword"
                      onChange={handleInputChange}
                      placeholder="Xác nhận mật khẩu"
                      prefix={<LockOutlined />}
                    />
                  </Form.Item>
                </>
              )}
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  style={{ width: '50%' }}
                >
                  <AdminInput
                    name="phone"
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>
                
                <Form.Item 
                  label="Địa chỉ"
                  name="address"
                  style={{ width: '50%' }}
                >
                  <AdminInput
                    name="address"
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                  />
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item
                  label="Vai trò"
                  name="isAdmin"
                  valuePropName="checked"
                  style={{ width: '50%' }}
                >
                  <Switch
                    checkedChildren="Quản trị viên"
                    unCheckedChildren="Khách hàng"
                    onChange={(checked) => handleSwitchChange('isAdmin', checked)}
                  />
                </Form.Item>
                
                <Form.Item
                  label="Trạng thái"
                  name="active"
                  valuePropName="checked"
                  style={{ width: '50%' }}
                >
                  <Switch
                    checkedChildren="Hoạt động"
                    unCheckedChildren="Vô hiệu hóa"
                    onChange={(checked) => handleSwitchChange('active', checked)}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          
          <Divider />
          
          <div style={{ textAlign: 'right' }}>
            <Button onClick={handleCancel} style={{ marginRight: '10px' }}>
              Hủy
            </Button>
            <AdminButton 
              type="primary" 
              htmlType="submit"
              loading={confirmLoading}
            >
              {isEditMode ? 'Cập nhật' : 'Tạo người dùng'}
            </AdminButton>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminUser;