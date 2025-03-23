import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'antd';
import * as AddressService from '../../services/AddressService';

// Tự tạo component quản lý địa chỉ trong file này thay vì import từ bên ngoài
const AddressManagement = () => {
  const user = useSelector((state) => state.user);

  // Component quản lý địa chỉ đơn giản
  return (
    <div>
      <Card 
        title="Địa chỉ của tôi"
        bordered={false}
      >
        {/* Nội dung quản lý địa chỉ */}
        <AddressSelectionInline user={user} />
      </Card>
    </div>
  );
};

// Tạo component AddressSelection nội bộ (giống như component bạn đã định nghĩa trước đó)
const AddressSelectionInline = ({ user }) => {
  // Triển khai component quản lý địa chỉ nội bộ
  const [addresses, setAddresses] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentAddress, setCurrentAddress] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [form] = React.useState({});

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
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAddresses();
  }, [user?.access_token]);

  return (
    <div>
      {isLoading ? (
        <p>Đang tải danh sách địa chỉ...</p>
      ) : addresses.length === 0 ? (
        <p>Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
      ) : (
        <div>
          {addresses.map(address => (
            <div key={address._id} style={{ 
              padding: '16px', 
              border: '1px solid #eee', 
              borderRadius: '8px', 
              marginBottom: '16px',
              backgroundColor: address.isDefault ? '#f0f7f0' : 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{address.fullName} | {address.phone}</strong>
                {address.isDefault && (
                  <span style={{ color: '#4cb551' }}>Địa chỉ mặc định</span>
                )}
              </div>
              <div>{address.address}, {address.city}</div>
              <div style={{ marginTop: '8px', color: '#888' }}>{address.label || 'Nhà'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;