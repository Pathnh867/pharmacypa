import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Radio, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Tooltip 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  HomeOutlined 
} from '@ant-design/icons';
import * as AddressService from '../../services/AddressService';

const AddressSelection = ({ 
  user, 
  onSelectAddress, 
  initialSelectedAddress 
}) => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [form] = Form.useForm();

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user?.access_token) return;

    try {
      const response = await AddressService.getAllAddresses(user.access_token);
      if (response.status === 'OK') {
        setAddresses(response.data);
        
        // Set initial selected address
        const defaultAddress = response.data.find(addr => addr.isDefault) || 
                                response.data[0];
        
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          onSelectAddress(defaultAddress);
        }
      }
    } catch (error) {
      message.error('Không thể tải danh sách địa chỉ');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user?.access_token]);

  // Address selection handler
  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    const selected = addresses.find(addr => addr._id === addressId);
    setSelectedAddress(selected);
    onSelectAddress(selected);
  };

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
    <Card 
      title="Địa chỉ giao hàng" 
      extra={
        <Tooltip title="Thêm địa chỉ mới">
          <Button 
            type="dashed" 
            icon={<PlusOutlined />} 
            onClick={() => showAddressModal()}
          >
            Thêm địa chỉ
          </Button>
        </Tooltip>
      }
    >
      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Bạn chưa có địa chỉ nào</p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showAddressModal()}
          >
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <Radio.Group 
          onChange={handleAddressSelect} 
          value={selectedAddress?._id}
          style={{ width: '100%' }}
        >
          {addresses.map(address => (
            <Card 
              key={address._id} 
              style={{ 
                marginBottom: 16, 
                border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9' 
              }}
              extra={
                !address.isDefault && (
                  <Button 
                    type="link" 
                    onClick={() => handleSetDefaultAddress(address._id)}
                  >
                    Đặt mặc định
                  </Button>
                )
              }
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Radio value={address._id} style={{ marginRight: 16 }} />
                <div>
                  <Typography.Text strong>
                    {address.fullName} | {address.phone}
                  </Typography.Text>
                  <div>
                    {address.address}, {address.city}
                  </div>
                  {address.isDefault && (
                    <Typography.Text type="success" style={{ marginTop: 8 }}>
                      Địa chỉ mặc định
                    </Typography.Text>
                  )}
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Tooltip title="Chỉnh sửa địa chỉ">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => showAddressModal(address)}
                    />
                  </Tooltip>
                </div>
              </div>
            </Card>
          ))}
        </Radio.Group>
      )}

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
    </Card>
  );
};

export default AddressSelection;