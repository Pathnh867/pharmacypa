import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Row, Col, Typography, Breadcrumb, Empty, Spin, Alert, Tabs } from 'antd';
import { 
  FileProtectOutlined, 
  SafetyCertificateOutlined, 
  HomeOutlined, 
  AppstoreOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import CardComponent from '../../components/CardComponents/CardComponent';
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Styled components
const PageContainer = styled.div`
  width: 100%;
  background: #f7f7f7;
  min-height: calc(100vh - 64px);
  padding: 20px 0;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`;

const BreadcrumbContainer = styled.div`
  margin-bottom: 20px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #4cb551;
      
      &:hover {
        color: #389e3c;
      }
    }
    
    .anticon {
      margin-right: 8px;
    }
  }
`;

const CategoryHeader = styled.div`
  margin-bottom: 20px;
  
  h2 {
    color: #333;
    margin-bottom: 8px;
    position: relative;
    padding-bottom: 12px;
    display: inline-block;
    
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background-color: #4cb551;
    }
  }
  
  .description {
    color: #666;
    font-size: 14px;
    max-width: 800px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  
  .ant-spin {
    margin-bottom: 20px;
  }
`;

const TabsContainer = styled(Tabs)`
  margin-bottom: 20px;
  
  .ant-tabs-nav {
    margin-bottom: 24px;
  }
  
  .ant-tabs-tab {
    padding: 12px 20px;
    transition: all 0.3s;
    
    .anticon {
      margin-right: 8px;
    }
  }
  
  .ant-tabs-tab-active {
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background-color: #4cb551;
  }
`;

const InfoAlert = styled(Alert)`
  margin-bottom: 24px;
`;

// Component chính
const PrescriptionProductsPage = () => {
  const { type } = useParams(); // type có thể là 'prescription' hoặc 'non-prescription'
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const [filterParams, setFilterParams] = useState({});
  
  useEffect(() => {
    // Xác định tab active dựa vào param
    if (type === 'prescription') {
      setActiveTab('1');
    } else if (type === 'non-prescription') {
      setActiveTab('2');
    }
    
    fetchProducts();
  }, [type]);
  
  // Hàm fetch sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const requiresPrescription = type === 'prescription';
      
      // Gọi API để lấy sản phẩm theo loại kê đơn
      const res = await ProductService.getAllProduct('', 100);
      
      if (res?.status === 'OK') {
        // Lọc sản phẩm theo requiresPrescription
        const filteredProducts = res.data.filter(
          product => product.requiresPrescription === requiresPrescription
        );
        
        // Áp dụng filter nếu có
        let finalProducts = filteredProducts;
        if (Object.keys(filterParams).length > 0) {
          finalProducts = applyFilters(filteredProducts, filterParams);
        }
        
        setProducts(finalProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm áp dụng bộ lọc
  const applyFilters = (products, filters) => {
    return products.filter(product => {
      // Lọc theo khoảng giá
      if (filters.priceRange && 
          (product.price < filters.priceRange[0] || 
           product.price > filters.priceRange[1])) {
        return false;
      }
      
      // Lọc theo đánh giá
      if (filters.rating && product.rating < filters.rating) {
        return false;
      }
      
      // Lọc theo còn hàng
      if (filters.inStock && product.countInStock <= 0) {
        return false;
      }
      
      // Lọc theo giảm giá
      if (filters.hasDiscount && (!product.discount || product.discount <= 0)) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sắp xếp theo các tùy chọn
      if (filters.sortOption === 'priceAsc') {
        return a.price - b.price;
      } else if (filters.sortOption === 'priceDesc') {
        return b.price - a.price;
      } else if (filters.sortOption === 'newest') {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      } else if (filters.sortOption === 'popular') {
        return (b.selled || 0) - (a.selled || 0);
      }
      
      return 0;
    });
  };
  
  // Xử lý thay đổi tab
  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/products/${key === '1' ? 'prescription' : 'non-prescription'}`);
  };
  
  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    setFilterParams(filters);
    
    // Áp dụng bộ lọc vào danh sách sản phẩm hiện tại
    if (products.length > 0) {
      const filteredProducts = applyFilters([...products], filters);
      setProducts(filteredProducts);
    }
  };
  
  // Thông tin cho các loại thuốc
  const getInfo = () => {
    if (type === 'prescription') {
      return {
        title: 'Thuốc kê đơn',
        description: 'Danh sách thuốc kê đơn yêu cầu đơn thuốc của bác sĩ. Khi mua thuốc kê đơn, bạn sẽ cần cung cấp đơn thuốc hợp lệ để được duyệt.',
        icon: <FileProtectOutlined />,
        alertType: 'warning',
        alertMessage: 'Lưu ý về thuốc kê đơn',
        alertDescription: 'Thuốc kê đơn chỉ được bán khi có đơn thuốc hợp lệ từ bác sĩ. Việc sử dụng thuốc kê đơn cần tuân thủ chỉ định của bác sĩ và thông tin về liều dùng, chống chỉ định.',
      };
    }
    
    return {
      title: 'Thuốc không kê đơn',
      description: 'Danh sách thuốc không kê đơn có thể mua trực tiếp không cần đơn thuốc của bác sĩ.',
      icon: <SafetyCertificateOutlined />,
      alertType: 'info',
      alertMessage: 'Thông tin về thuốc không kê đơn',
      alertDescription: 'Thuốc không kê đơn có thể mua trực tiếp mà không cần đơn thuốc. Tuy nhiên, vẫn cần đọc kỹ hướng dẫn sử dụng và tuân thủ liều lượng để đảm bảo an toàn.',
    };
  };
  
  const info = getInfo();
  
  return (
    <PageContainer>
      <ContentContainer>
        <BreadcrumbContainer>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
              <span>Trang chủ</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">
              <AppstoreOutlined />
              <span>Sản phẩm</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {info.icon}
              <span>{info.title}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbContainer>
        
        <TabsContainer activeKey={activeTab} onChange={handleTabChange}>
          <TabPane 
            tab={
              <span>
                <FileProtectOutlined />
                Thuốc kê đơn
              </span>
            } 
            key="1"
          ></TabPane>
          <TabPane 
            tab={
              <span>
                <SafetyCertificateOutlined />
                Thuốc không kê đơn
              </span>
            } 
            key="2"
          ></TabPane>
        </TabsContainer>
        
        <CategoryHeader>
          <Title level={2}>{info.title}</Title>
          <div className="description">{info.description}</div>
        </CategoryHeader>
        
        <InfoAlert
          message={info.alertMessage}
          description={info.alertDescription}
          type={info.alertType}
          showIcon
          icon={<InfoCircleOutlined />}
        />
        
        <Row gutter={[24, 24]}>
          <Col span={5}>
            <NavBarComponent onFilterChange={handleFilterChange} />
          </Col>
          
          <Col span={19}>
            {loading ? (
              <LoadingContainer>
                <Spin size="large" />
                <Text>Đang tải sản phẩm...</Text>
              </LoadingContainer>
            ) : products.length > 0 ? (
              <ProductGrid>
                {products.map(product => (
                  <CardComponent
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    image={product.image}
                    type={product.type}
                    price={product.price}
                    rating={product.rating}
                    discount={product.discount}
                    countInStock={product.countInStock}
                    selled={product.selled}
                    requiresPrescription={product.requiresPrescription}
                  />
                ))}
              </ProductGrid>
            ) : (
              <Empty 
                description={`Không tìm thấy ${info.title.toLowerCase()} nào`}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Col>
        </Row>
      </ContentContainer>
    </PageContainer>
  );
};

export default PrescriptionProductsPage;