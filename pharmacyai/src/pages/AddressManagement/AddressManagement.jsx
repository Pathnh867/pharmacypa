import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Modal, Form, Input, message, Popconfirm, Tag, Avatar, Empty } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined 
} from '@ant-design/icons';
import * as AddressService from '../../services/AddressService';

const AddressManagement = () => {
  const user = useSelector((state) => state.user);
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user?.access_token) return;

    try {
      setIsLoading(true);
      const response = await AddressService.getAllAddresses(user.access_token);
      if (response.status === 'OK') {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      message.error('Không thể tải danh sách địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.access_token]);

  // Open modal for adding/editing address
  const showAddressModal = (address = null) => {
    if (address) {
      setIsEditing(true);
      setCurrentAddress(address);
      form.setFieldsValue({
        fullName: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        label: address.label || 'Nhà'
      });
    } else {
      setIsEditing(false);
      setCurrentAddress(null);
      form.resetFields();
      form.setFieldsValue({
        label: 'Nhà'
      });
    }
    setIsModalVisible(true);
  };

  // Save address (create or update)
  const handleSaveAddress = async () => {
    try {
      const values = await form.validateFields();
      
      const addressData = {
        ...values,
        label: values.label || 'Nhà',
        isDefault: false
      };

      setIsLoading(true);
      
      if (user?.access_token) {
        if (isEditing && currentAddress) {
          // Update existing address
          await AddressService.updateAddress(
            user.access_token, 
            currentAddress._id, 
            addressData
          );
          message.success('Cập nhật địa chỉ thành công');
        } else {
          // Create new address
          await AddressService.createAddress(user.access_token, addressData);
          message.success('Thêm địa chỉ mới thành công');
        }

        fetchAddresses();
        setIsModalVisible(false);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      message.error('Lỗi khi lưu địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      setIsLoading(true);
      if (user?.access_token) {
        await AddressService.setDefaultAddress(user.access_token, addressId);
        message.success('Đã đặt địa chỉ này làm mặc định');
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      message.error('Không thể đặt địa chỉ mặc định');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      setIsLoading(true);
      if (user?.access_token) {
        await AddressService.deleteAddress(user.access_token, addressId);
        message.success('Xóa địa chỉ thành công');
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error('Không thể xóa địa chỉ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card 
        title="Địa chỉ của tôi"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showAddressModal()}
          >
            Thêm địa chỉ mới
          </Button>
        }
        loading={isLoading}
      >
        {addresses.length === 0 ? (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ mới."
          />
        ) : (
          addresses.map(address => (
            <Card 
              key={address._id} 
              style={{ 
                marginBottom: 16, 
                border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9',
                background: address.isDefault ? '#f9fff9' : '#fff'
              }}
              bodyStyle={{ padding: '16px' }}
              actions={[
                <Button 
                  key="edit" 
                  type="text" 
                  icon={<EditOutlined />} 
                  onClick={() => showAddressModal(address)}
                >
                  Sửa
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Bạn có chắc muốn xóa địa chỉ này?"
                  onConfirm={() => handleDeleteAddress(address._id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>,
                !address.isDefault && (
                  <Button 
                    key="default" 
                    type="link" 
                    onClick={() => handleSetDefaultAddress(address._id)}
                  >
                    Đặt làm mặc định
                  </Button>
                )
              ].filter(Boolean)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: address.isDefault ? '#4cb551' : '#1890ff',
                    flexShrink: 0
                  }}
                  size={48}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{address.fullName}</span>
                    {address.isDefault && (
                      <Tag color="success">Mặc định</Tag>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <PhoneOutlined style={{ marginRight: '8px', color: '#666' }} />
                    <span>{address.phone}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px', color: '#666', marginTop: '3px' }} />
                    <span>{address.address}, {address.city}</span>
                  </div>
                  
                  {address.label && (
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="blue">{address.label}</Tag>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </Card>

      <Modal
        title={isEditing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isModalVisible}
        onOk={handleSaveAddress}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu địa chỉ"
        cancelText="Hủy"
        confirmLoading={isLoading}
      >
        <Form 
          form={form} 
          layout="vertical"
          requiredMark={false}
          initialValues={{
            label: 'Nhà'
          }}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { 
                pattern: /^(0|\+84)[3|5|7|8|9]\d{8}$/, 
                message: 'Số điện thoại không hợp lệ' 
              }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Địa chỉ chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Số nhà, đường..." />
          </Form.Item>
          
          <Form.Item
            name="city"
            label="Thành phố/Tỉnh"
            rules={[{ required: true, message: 'Vui lòng nhập thành phố/tỉnh' }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Nhập thành phố/tỉnh" />
          </Form.Item>
          
          <Form.Item
            name="label"
            label="Nhãn địa chỉ (tùy chọn)"
            initialValue="Nhà"
          >
            <Input placeholder="VD: Nhà riêng, Công ty..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressManagement;