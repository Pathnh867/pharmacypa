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
  Tooltip,
  Empty
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

const { Text } = Typography;

const AddressSelection = ({ 
  user, 
  onSelectAddress, 
  initialSelectedAddress = null
}) => {
  const [addresses, setAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
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
        
        // Set initial selected address (priority: initialSelectedAddress, default address, first address)
        if (initialSelectedAddress) {
          setSelectedAddress(initialSelectedAddress);
          onSelectAddress(initialSelectedAddress);
        } else {
          const defaultAddress = response.data.find(addr => addr.isDefault) || 
                               response.data[0];
          
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
            onSelectAddress(defaultAddress);
          }
        }
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
        label: address.label || 'Nhà'
      });
    } else {
      setIsEditing(false);
      setCurrentAddress(null);
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
        
        // If deleted address was selected, select default one
        if (selectedAddress?._id === addressId) {
          setSelectedAddress(null);
        }
        
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
      {addresses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Empty description="Bạn chưa có địa chỉ nào" />
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showAddressModal()}
            style={{ marginTop: '16px' }}
          >
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Text strong>Chọn địa chỉ giao hàng</Text>
            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              onClick={() => showAddressModal()}
            >
              Thêm địa chỉ
            </Button>
          </div>
          
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
                  border: address.isDefault ? '1px solid #4cb551' : '1px solid #d9d9d9',
                  backgroundColor: selectedAddress?._id === address._id ? '#f0f7f0' : 'white'
                }}
                hoverable
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Radio value={address._id} style={{ marginRight: 16 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong>{address.fullName} | {address.phone}</Text>
                      <div>
                        <Tooltip title="Chỉnh sửa">
                          <Button 
                            type="text" 
                            icon={<EditOutlined />} 
                            onClick={(e) => {
                              e.stopPropagation();
                              showAddressModal(address);
                            }}
                            style={{ marginRight: '8px' }}
                          />
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <Button 
                            type="text" 
                            danger
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address._id);
                            }}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div>{address.address}, {address.city}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      {address.isDefault ? (
                        <Text type="success">Địa chỉ mặc định</Text>
                      ) : (
                        <Button 
                          type="link" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefaultAddress(address._id);
                          }}
                          style={{ padding: 0 }}
                        >
                          Đặt làm mặc định
                        </Button>
                      )}
                      <Text type="secondary">{address.label}</Text>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Radio.Group>
        </>
      )}

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

export default AddressSelection;