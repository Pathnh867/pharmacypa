import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Modal, Form, Input, message, Popconfirm, Tag, Avatar } from 'antd';
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
import ButtonComponent from '../ButtonComponents/ButtonComponent';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm();

  // Fetch user's addresses
  const fetchAddresses = async () => {
    if (!user?.access_token) return;

    try {
      const response = await AddressService.getAllAddresses(user.access_token);
      if (response.status === 'OK') {
        setAddresses(response.data);
      }
    } catch (error) {
      message.error('Không thể tải danh sách địa chỉ');
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
        label: address.label
      });
    } else {
      setIsEditing(false);
      form.resetFields();
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
      message.error('Lỗi khi lưu địa chỉ');
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      if (user?.access_token) {
        await AddressService.deleteAddress(user.access_token, addressId);
        message.success('Xóa địa chỉ thành công');
        fetchAddresses();
      }
    } catch (error) {
      message.error('Không thể xóa địa chỉ');
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      if (user?.access_token) {
        await AddressService.setDefaultAddress(user.access_token, addressId);
        message.success('Đã đặt địa chỉ này làm mặc định');
        fetchAddresses();
      }
    } catch (error) {
      message.error('Không thể đặt địa chỉ mặc định');
    }
  };

  return (
    <div>
      <Card 
        title="Địa chỉ của tôi"
        extra={
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={() => showAddressModal()}
          >
            Thêm địa chỉ mới
          </Button>
        }
      >
        {addresses.length === 0 ? (
          <p>Bạn chưa có địa chỉ nào</p>
        ) : (
          addresses.map(address => (
            <Card 
              key={address._id} 
              style={{ 
                marginBottom: 16, 
                border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9' 
              }}
              actions={[
                <EditOutlined key="edit" onClick={() => showAddressModal(address)} />,
                <Popconfirm
                  title="Bạn có chắc muốn xóa địa chỉ này?"
                  onConfirm={() => handleDeleteAddress(address._id)}
                >
                  <DeleteOutlined key="delete" />
                </Popconfirm>
              ]}
            >
              <Card.Meta 
                avatar={
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: address.isDefault ? '#4cb551' : '#1890ff' 
                    }} 
                  />
                }
                title={
                  <div>
                    {address.fullName} | {address.phone}
                    {address.isDefault && (
                      <Tag color="green" style={{ marginLeft: 8 }}>Mặc định</Tag>
                    )}
                  </div>
                }
                description={`${address.address}, ${address.city}`}
              />
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                {address.label && (
                  <Tag style={{ marginRight: 8 }}>
                    {address.label}
                  </Tag>
                )}
                {!address.isDefault && (
                  <Button 
                    type="link" 
                    onClick={() => handleSetDefaultAddress(address._id)}
                  >
                    Đặt làm địa chỉ mặc định
                  </Button>
                )}
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
      >
        <Form 
          form={form} 
          layout="vertical"
          requiredMark={false}
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
          >
            <Input placeholder="VD: Nhà riêng, Công ty..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressManagement;