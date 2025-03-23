import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Carousel, Input, Button, Typography, Badge, Card, Tabs, Divider } from 'antd';
import { SearchOutlined, HeartOutlined, ShoppingCartOutlined, StarFilled, PhoneFilled, ClockCircleFilled, EnvironmentFilled, BugOutlined } from '@ant-design/icons';
import styled from 'styled-components';

// Import các component và service cần thiết
// Import TypeProduct từ component gốc
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import CardComponent from '../../components/CardComponents/CardComponent';
import Loading from '../../components/LoadingComponent/Loading';
import * as ProductService from '../../services/ProductService';
import { useDebounce } from '../../hooks/useDebounce';

// Import ảnh slide
import slide1 from '../../assets/img/slide1.png';
import slide2 from '../../assets/img/slide2.png';
import slide3 from '../../assets/img/slide3.png';
import slide4 from '../../assets/img/slide4.png';
import slide5 from '../../assets/img/slide5.png';
import slide6 from '../../assets/img/slide6.png';
import slide7 from '../../assets/img/slide7.png';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Styled components cho UI nâng cao
const StyledHero = styled.div`
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StyledCarousel = styled(Carousel)`
  .slick-dots li button {
    background: #fff !important;
    opacity: 0.6;
  }
  .slick-dots li.slick-active button {
    background: #fff !important;
    opacity: 1;
  }
  .slick-prev, .slick-next {
    font-size: 24px;
    color: #fff;
    z-index: 10;
  }
`;

const CategorySection = styled.div`
  margin-bottom: 40px;
  border-radius: 8px;
  background: #fff;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const CategoryTitle = styled(Title)`
  position: relative;
  padding-bottom: 15px;
  margin-bottom: 20px !important;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #4cb551;
  }
`;

const ProductSection = styled.div`
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const StyledTypeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

const ViewMoreButton = styled(Button)`
  border-color: #4cb551;
  color: #4cb551;
  border-radius: 4px;
  height: 40px;
  transition: all 0.3s;
  
  &:hover {
    background: #4cb551 !important;
    color: #fff !important;
    border-color: #4cb551 !important;
  }
`;

const FeatureCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
  
  .ant-card-body {
    padding: 20px;
  }
`;

const FeatureIcon = styled.div`
  font-size: 24px;
  color: #4cb551;
  margin-bottom: 15px;
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav::before {
    border-bottom-color: #eaeaea;
  }
  
  .ant-tabs-tab {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4cb551;
    font-weight: 600;
  }
  
  .ant-tabs-ink-bar {
    background: #4cb551;
    height: 3px;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const HomePage = () => {
  // Lấy location để kiểm tra chuyển hướng
  const location = useLocation();
  console.log("Current location:", location);
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [pending, setPending] = useState(false);
  const [limit, setLimit] = useState(8);
  const [typeProduct, setTypeProduct] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const fetchProductAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[2];
    const limit = context?.queryKey && context?.queryKey[1];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct();
      if (res?.status === 'OK') {  
        // Log để kiểm tra định dạng dữ liệu
        console.log("Type data format:", res?.data);
        setTypeProduct(res?.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  const { isPending, data: products, isPlaceholderData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 50,
  });

  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  const handleViewMore = () => {
    setLimit((prev) => prev + 8);
  };

  const featuresData = [
    {
      icon: <ClockCircleFilled />,
      title: "Mở cửa mỗi ngày",
      description: "8:00 - 22:00, kể cả ngày lễ và chủ nhật"
    },
    {
      icon: <PhoneFilled />,
      title: "Tư vấn miễn phí",
      description: "Đội ngũ dược sĩ chuyên nghiệp"
    },
    {
      icon: <EnvironmentFilled />,
      title: "Giao hàng tận nhà",
      description: "Miễn phí cho đơn hàng từ 100.000đ"
    }
  ];

  return (
    <Loading isPending={isPending || pending}>
      {/* Header Section with Categories */}
      <div style={{ width: '1270px', margin: '0 auto', padding: '15px 0' }}>
        <StyledTypeList>
          {typeProduct.map((item) => {
            // Kiểm tra xem item có phải là đối tượng và có thuộc tính _id không
            const key = typeof item === 'object' && item._id ? item._id : item;
            return <TypeProduct name={item} key={key} />;
          })}
        </StyledTypeList>
      </div>
      
      {/* Main Content Area with Background */}
      <div className='body' style={{ width: '100%', background: '#f7f7f7', paddingTop: '20px', paddingBottom: '40px' }}>
        <div className="container" style={{ width: '1270px', margin: '0 auto' }}>
          
          {/* Hero Carousel */}
          <StyledHero>
            <StyledCarousel autoplay effect="fade">
              <div>
                <img src={slide1} alt="Promotion 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </div>
              <div>
                <img src={slide2} alt="Promotion 2" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </div>
              <div>
                <img src={slide3} alt="Promotion 3" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </div>
              <div>
                <img src={slide4} alt="Promotion 4" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </div>
            </StyledCarousel>
          </StyledHero>

          {/* Features Section */}
          <Row gutter={20} style={{ marginBottom: '40px' }}>
            {featuresData.map((feature, index) => (
              <Col span={8} key={index}>
                <FeatureCard>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <Title level={4} style={{ marginBottom: '10px' }}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                </FeatureCard>
              </Col>
            ))}
          </Row>
          
          {/* Product Categories */}
          <CategorySection>
            <CategoryTitle level={3}>Danh Mục Sản Phẩm</CategoryTitle>
            <StyledTabs defaultActiveKey="all" onChange={(key) => setActiveCategory(key)}>
              <TabPane tab="Tất cả sản phẩm" key="all">
                <ProductGrid>
                  {products?.data?.map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
                </ProductGrid>
              </TabPane>
              <TabPane tab="Dược mỹ phẩm" key="duoc-my-pham">
                <ProductGrid>
                  {products?.data?.filter(product => 
                    typeof product.type === 'object' 
                      ? product.type.name === 'Dược mỹ phẩm'
                      : product.type === 'Dược mỹ phẩm'
                  ).map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
                </ProductGrid>
              </TabPane>
              <TabPane tab="Thực phẩm chức năng" key="thuc-pham-chuc-nang">
                <ProductGrid>
                  {products?.data?.filter(product => 
                    typeof product.type === 'object' 
                      ? product.type.name === 'Thực phẩm chức năng'
                      : product.type === 'Thực phẩm chức năng'
                  ).map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
                </ProductGrid>
              </TabPane>
              <TabPane tab="Thiết bị y tế" key="thiet-bi-y-te">
                <ProductGrid>
                  {products?.data?.filter(product => 
                    typeof product.type === 'object' 
                      ? product.type.name === 'Thiết bị y tế'
                      : product.type === 'Thiết bị y tế'
                  ).map((product) => (
                    <CardComponent
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))}
                </ProductGrid>
              </TabPane>
            </StyledTabs>
            
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <ViewMoreButton onClick={handleViewMore}>
                Xem thêm sản phẩm
              </ViewMoreButton>
            </div>
          </CategorySection>
          
          {/* Featured Products */}
          <ProductSection>
            <CategoryTitle level={3}>Sản Phẩm Nổi Bật</CategoryTitle>
            <Row gutter={[20, 20]}>
              {products?.data?.filter(product => product.rating >= 4.5).slice(0, 4).map((product) => (
                <Col span={6} key={product._id}>
                  <CardComponent
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    rating={product.rating}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                </Col>
              ))}
            </Row>
          </ProductSection>
          
          {/* About Us Section */}
          <CategorySection>
            <CategoryTitle level={3}>Nhà thuốc tiện lợi</CategoryTitle>
            <Row gutter={20}>
              <Col span={16}>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Nhà thuốc tiện lợi là hệ thống nhà thuốc uy tín với lịch sử hoạt động trên 10 năm trong lĩnh vực dược phẩm. 
                  Chúng tôi cung cấp các sản phẩm thuốc, thực phẩm chức năng, dược mỹ phẩm và thiết bị y tế 
                  chất lượng cao, đảm bảo nguồn gốc rõ ràng và giá cả hợp lý.
                </Paragraph>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  Đội ngũ dược sĩ chuyên nghiệp của chúng tôi sẵn sàng tư vấn và hỗ trợ khách hàng 
                  lựa chọn sản phẩm phù hợp với nhu cầu sức khỏe. Với cam kết "Tận tâm phục vụ - Uy tín hàng đầu", 
                  chúng tôi luôn nỗ lực mang đến dịch vụ và sản phẩm tốt nhất cho khách hàng.
                </Paragraph>
              </Col>
              <Col span={8}>
                <img 
                  src={slide7} 
                  alt="About Us" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </Col>
            </Row>
          </CategorySection>
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;