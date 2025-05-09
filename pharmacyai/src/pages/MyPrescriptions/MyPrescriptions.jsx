import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  Typography, 
  Modal, 
  message, 
  Empty, 
  Spin,
  Card,
  Image,
  Tooltip,
  Divider
} from 'antd';
import { 
  FileProtectOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  InfoCircleOutlined, 
  EyeOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import * as PrescriptionService from '../../services/PrescriptionService';
import { convertPrice, formatOrderDate } from '../../utils';
import { WrapperHeader } from '../OrderHistory/style';

const { Title, Text, Paragraph } = Typography;

const MyPrescriptions = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  
  useEffect(() => {
    // Nếu không có user, redirect đến trang đăng nhập
    if (!user?.access_token) {
      navigate('/sign-in', { state: '/my-prescriptions' });
      return;
    }
    
    fetchPrescriptions();
  }, [user?.access_token, navigate]);
  
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await PrescriptionService.getUserPrescriptions(user?.access_token);
      if (response?.status === 'OK') {
        setPrescriptions(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      message.error('Không thể tải danh sách đơn thuốc');
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm lấy màu sắc và icon cho trạng thái
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          color: 'orange', 
          text: 'Chờ xác minh', 
          icon: <ClockCircleOutlined /> 
        };
      case 'approved':
        return { 
          color: 'green', 
          text: 'Đã phê duyệt', 
          icon: <CheckCircleOutlined /> 
        };
      case 'rejected':
        return { 
          color: 'red', 
          text: 'Đã từ chối', 
          icon: <CloseCircleOutlined /> 
        };
      case 'needs_info':
        return { 
          color: 'blue', 
          text: 'Cần thêm thông tin', 
          icon: <InfoCircleOutlined /> 
        };
      default:
        return { 
          color: 'default', 
          text: 'Không xác định', 
          icon: <InfoCircleOutlined /> 
        };
    }
  };
  
  // Hàm xem chi tiết đơn thuốc
  const showPrescriptionDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setDetailsModalVisible(true);
  };
  
  // Hàm xử lý mua sản phẩm sau khi đơn thuốc được phê duyệt
  const handleBuyProduct = (productId) => {
    navigate(`/product-detail/${productId}`);
  };
  
  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: product => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px', borderRadius: '4px' }}
          />
          <span>{product.name}</span>
        </div>
      ),
    },
    {
      title: 'Ngày tải lên',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => formatOrderDate(date),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const { color, text, icon } = getStatusInfo(status);
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Chờ xác minh', value: 'pending' },
        { text: 'Đã phê duyệt', value: 'approved' },
        { text: 'Đã từ chối', value: 'rejected' },
        { text: 'Cần thêm thông tin', value: 'needs_info' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày duyệt',
      dataIndex: 'verifiedAt',
      key: 'verifiedAt',
      render: date => date ? formatOrderDate(date) : 'Chưa duyệt',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => showPrescriptionDetails(record)}
            ghost
          >
            Chi tiết
          </Button>
          {record.status === 'approved' && (
            <Button 
              type="primary"
              size="small" 
              icon={<ShoppingOutlined />}
              onClick={() => handleBuyProduct(record.product._id)}
            >
              Mua
            </Button>
          )}
        </Space>
      ),
    },
  ];
  
  return (
    <div style={{ width: '1270px', margin: '0 auto', padding: '20px 15px' }}>
      <div style={{ marginBottom: '24px' }}>
        <WrapperHeader>Đơn thuốc của tôi</WrapperHeader>
        <Text>Theo dõi trạng thái xác minh đơn thuốc của bạn</Text>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>Đang tải dữ liệu đơn thuốc...</div>
        </div>
      ) : prescriptions.length > 0 ? (
        <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          <Table 
            columns={columns} 
            dataSource={prescriptions}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showTotal: (total) => `Tổng ${total} đơn thuốc`
            }}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
          <Empty 
            description="Bạn chưa có đơn thuốc nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <Button 
            type="primary" 
            onClick={() => navigate('/products/prescription')}
            icon={<FileProtectOutlined />}
            style={{ marginTop: '16px' }}
          >
            Xem thuốc kê đơn
          </Button>
        </div>
      )}
      
      {/* Modal chi tiết đơn thuốc */}
      <Modal
        title="Chi tiết đơn thuốc"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailsModalVisible(false)}>
            Đóng
          </Button>,
          selectedPrescription?.status === 'approved' && (
            <Button 
              key="buy" 
              type="primary"
              onClick={() => {
                setDetailsModalVisible(false);
                handleBuyProduct(selectedPrescription.product._id);
              }}
              icon={<ShoppingCartOutlined />}
            >
              Mua sản phẩm
            </Button>
          )
        ].filter(Boolean)}
        width={700}
      >
        {selectedPrescription && (
          <div>
            <Card title="Thông tin sản phẩm" bordered={false}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={selectedPrescription.product.image} 
                  alt={selectedPrescription.product.name} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '16px', borderRadius: '4px' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                    {selectedPrescription.product.name}
                  </div>
                  <div>
                    Giá: {convertPrice(selectedPrescription.product.price)}
                  </div>
                </div>
              </div>
            </Card>
            
            <Divider />
            
            <Card title="Thông tin đơn thuốc" bordered={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 500, color: '#666' }}>Trạng thái:</span>
                <Tag color={getStatusInfo(selectedPrescription.status).color} icon={getStatusInfo(selectedPrescription.status).icon}>
                  {getStatusInfo(selectedPrescription.status).text}
                </Tag>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 500, color: '#666' }}>Ngày tải lên:</span>
                <span>{formatOrderDate(selectedPrescription.createdAt)}</span>
              </div>
              
              {selectedPrescription.verifiedAt && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500, color: '#666' }}>Ngày duyệt:</span>
                  <span>{formatOrderDate(selectedPrescription.verifiedAt)}</span>
                </div>
              )}
              
              {selectedPrescription.notes && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500, color: '#666' }}>Ghi chú:</span>
                  <span>{selectedPrescription.notes}</span>
                </div>
              )}
              
              {selectedPrescription.expiryDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 500, color: '#666' }}>Ngày hết hạn:</span>
                  <span>{formatOrderDate(selectedPrescription.expiryDate)}</span>
                </div>
              )}
            </Card>
            
            <Divider />
            
            <Card title="Hình ảnh đơn thuốc" bordered={false}>
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={selectedPrescription.imageUrl}
                  alt="Đơn thuốc"
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </div>
            </Card>
            
            {selectedPrescription.status === 'rejected' && (
              <div style={{ marginTop: '16px' }}>
                <Card 
                  bordered={false} 
                  style={{ backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}
                >
                  <Title level={5} style={{ color: '#cf1322' }}>Lý do từ chối</Title>
                  <Paragraph>{selectedPrescription.rejectReason || 'Đơn thuốc không hợp lệ hoặc không đủ thông tin.'}</Paragraph>
                  <Paragraph>
                    Bạn có thể tải lên đơn thuốc mới hoặc liên hệ với chúng tôi để biết thêm chi tiết.
                  </Paragraph>
                </Card>
              </div>
            )}
            
            {selectedPrescription.status === 'needs_info' && (
              <div style={{ marginTop: '16px' }}>
                <Card 
                  bordered={false} 
                  style={{ backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}
                >
                  <Title level={5} style={{ color: '#1890ff' }}>Yêu cầu thêm thông tin</Title>
                  <Paragraph>{selectedPrescription.notes || 'Chúng tôi cần thêm thông tin về đơn thuốc của bạn.'}</Paragraph>
                  <Paragraph>
                    Vui lòng liên hệ với chúng tôi hoặc tải lên đơn thuốc mới với đầy đủ thông tin hơn.
                  </Paragraph>
                </Card>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyPrescriptions;