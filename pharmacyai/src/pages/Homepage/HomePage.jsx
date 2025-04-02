import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Typography, 
  Badge, 
  Tabs, 
  Divider, 
  Empty, 
  Spin,
  Rate,
  Button,
  Tag,
  Tooltip,
  message
} from 'antd';
import { 
  ClockCircleFilled, 
  PhoneFilled, 
  EnvironmentFilled, 
  StarFilled,
  FireFilled,
  TagFilled,
  AppstoreOutlined,
  GiftFilled,
  ThunderboltFilled,
  ShoppingCartOutlined,
  EyeOutlined,
  HeartOutlined,
  CheckCircleFilled,
  SafetyCertificateFilled,
  RocketFilled,
  MedicineBoxFilled
} from '@ant-design/icons';

// Import các component và service cần thiết
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import CardComponent from '../../components/CardComponents/CardComponent';
import * as ProductService from '../../services/ProductService';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import { useDebounce } from '../../hooks/useDebounce';

// Import ảnh slide
import slide1 from '../../assets/img/slide1.png';
import slide2 from '../../assets/img/slide2.png';
import slide3 from '../../assets/img/slide3.png';
import slide4 from '../../assets/img/slide4.png';
import slide5 from '../../assets/img/slide5.png';
import slide6 from '../../assets/img/slide6.png';
import slide7 from '../../assets/img/slide7.png';

// Import các styled components 
import { 
  PageContainer, 
  ContentContainer, 
  HeroSection, 
  StyledCarousel, 
  SectionTitle,
  FeatureCard, 
  CategoryContainer, 
  TabsWrapper, 
  ProductGrid, 
  ViewMoreButton,
  AboutSection, 
  EmptyWrapper, 
  SpinContainer,
  CarouselImage,
  CategoryBadge,
  ProductCard
} from './style';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const searchProduct = useSelector((state) => state?.product?.search);
  const user = useSelector((state) => state?.user);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState(12);
  const [typeProducts, setTypeProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Lấy tất cả sản phẩm từ API
  const fetchProductAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[2];
    const limit = context?.queryKey && context?.queryKey[1];
    const res = await ProductService.getAllProduct(search, limit);
    return res;
  };

  // Lấy danh sách loại sản phẩm từ API
  const fetchAllTypeProduct = async () => {
    try {
      const res = await ProductService.getAllTypeProduct();
      if (res?.status === 'OK') {  
        setTypeProducts(res?.data || []);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  // Query sản phẩm
  const { isPending, data: products, isSuccess } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
  });

  // Tải loại sản phẩm khi component mount
  useEffect(() => {
    fetchAllTypeProduct();
  }, []);

  // Lọc sản phẩm theo loại được chọn
  const filterProductsByType = (typeId) => {
    if (!products?.data || !typeId || typeId === 'all') return products?.data;
    
    return products?.data.filter(product => {
      if (typeof product.type === 'object' && product.type !== null) {
        return product.type._id === typeId;
      }
      return product.type === typeId;
    });
  };

  // Xử lý nút "Xem thêm"
  const handleViewMore = () => {
    setLimit(prev => prev + 12);
  };

  // Xử lý khi click vào sản phẩm
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };
  
  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    if (!user?.id) {
      messageApi.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    
    // Nếu sản phẩm hết hàng
    if (product.countInStock <= 0) {
      messageApi.error('Sản phẩm hiện đã hết hàng');
      return;
    }

    // Tính giá sau giảm giá nếu có
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    
    // Dispatch action thêm sản phẩm vào giỏ hàng
    dispatch(addOrderProduct({ 
      orderItem: {
        name: product.name,
        amount: 1, 
        image: product.image,
        price: discountedPrice,
        product: product._id,
        discount: product.discount,
        countInStock: product.countInStock
      }
    }));
    
    messageApi.success('Đã thêm sản phẩm vào giỏ hàng');
  };
  
  // Dữ liệu Feature Cards
  const features = [
    {
      icon: <ClockCircleFilled className="feature-icon" />,
      title: "Hoạt động mỗi ngày",
      description: "Phục vụ từ 8:00 - 22:00, kể cả ngày lễ và chủ nhật"
    },
    {
      icon: <PhoneFilled className="feature-icon" />,
      title: "Tư vấn miễn phí",
      description: "Đội ngũ dược sĩ chuyên nghiệp, tận tình hỗ trợ 24/7"
    },
    {
      icon: <EnvironmentFilled className="feature-icon" />,
      title: "Giao hàng tận nhà",
      description: "Miễn phí giao hàng cho đơn từ 100.000đ trở lên"
    }
  ];
  
  // Dữ liệu các slide
  const slides = [slide1, slide2, slide3, slide4, slide5];
  
  // Lấy sản phẩm nổi bật (rating ≥ 4.5)
  const getFeaturedProducts = () => {
    if (!products?.data) return [];
    
    return products.data
      .filter(product => product.rating >= 4.5)
      .slice(0, 8);
  };
  
  // Lấy sản phẩm mới nhất (dựa vào ID MongoDB mới nhất)
  const getNewestProducts = () => {
    if (!products?.data) return [];
    
    return [...products.data]
      .sort((a, b) => b._id.localeCompare(a._id))
      .slice(0, 8);
  };
  
  // Lấy sản phẩm bán chạy
  const getBestSellingProducts = () => {
    if (!products?.data) return [];
    
    return [...products.data]
      .sort((a, b) => (b.selled || 0) - (a.selled || 0))
      .slice(0, 8);
  };

  // Lọc sản phẩm có giảm giá
  const getDiscountProducts = () => {
    if (!products?.data) return [];
    
    return products.data
      .filter(product => product.discount && product.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 8);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Tính giá sau khi giảm
  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  // Custom Card Component
  const CustomProductCard = ({ product }) => {
    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const isOutOfStock = product.countInStock <= 0;
    
    return (
      <ProductCard
        hoverable
        cover={
          <div style={{ position: 'relative' }}>
            <img 
              alt={product.name} 
              src={product.image} 
              className="product-image"
              onClick={() => handleProductClick(product._id)}
            />
            {product.discount > 0 && (
              <div className="product-discount-badge">
                -{product.discount}%
              </div>
            )}
            {isOutOfStock && (
              <div className="product-out-of-stock">
                Hết hàng
              </div>
            )}
          </div>
        }
      >
        <div className="product-content">
          <div className="product-title" onClick={() => handleProductClick(product._id)}>
            {product.name}
          </div>
          <div>
            <span className="product-price">{formatPrice(discountedPrice)}</span>
            {product.discount > 0 && (
              <span className="product-original-price">{formatPrice(product.price)}</span>
            )}
          </div>
          <div className="product-rating">
            <Rate disabled defaultValue={product.rating} allowHalf style={{ fontSize: 14 }} />
            <span className="product-sold"> | Đã bán: {product.selled || 0}</span>
          </div>
          <div className="product-actions">
            <Tooltip title={isOutOfStock ? "Sản phẩm đã hết hàng" : "Thêm vào giỏ hàng"}>
              <Button 
                icon={<ShoppingCartOutlined />} 
                className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`}
                size="small" 
                onClick={() => handleAddToCart(product)}
                disabled={isOutOfStock}
              />
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <Button 
                icon={<EyeOutlined />} 
                className="product-details-btn" 
                size="small" 
                onClick={() => handleProductClick(product._id)}
              />
            </Tooltip>
          </div>
        </div>
      </ProductCard>
    );
  };

  return (
    <PageContainer>
      {contextHolder} {/* Để hiển thị thông báo */}
      <ContentContainer>
        {/* Hero Carousel Section */}
        <HeroSection>
          <StyledCarousel autoplay effect="fade">
            {slides.map((slide, index) => (
              <div key={index}>
                <CarouselImage src={slide} alt={`Promotion ${index + 1}`} />
              </div>
            ))}
          </StyledCarousel>
        </HeroSection>

        {/* Features Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '50px' }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={8} key={index}>
              <FeatureCard>
                {feature.icon}
                <div className="feature-title">{feature.title}</div>
                <div className="feature-description">{feature.description}</div>
              </FeatureCard>
            </Col>
          ))}
        </Row>
        
        {/* Product Categories */}
        <CategoryContainer>
          <SectionTitle>Danh Mục Sản Phẩm</SectionTitle>
          
          <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
            <Col>
              <CategoryBadge 
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >
                Tất cả
              </CategoryBadge>
            </Col>
            {typeProducts.map((type) => (
              <Col key={type._id}>
                <CategoryBadge 
                  className={activeCategory === type._id ? 'active' : ''}
                  onClick={() => setActiveCategory(type._id)}
                >
                  {typeof type === 'object' ? type.name : type}
                </CategoryBadge>
              </Col>
            ))}
          </Row>
          
          <TabsWrapper>
            <Tabs 
              defaultActiveKey="featured" 
              onChange={(key) => setActiveCategory(key)}
            >
              <TabPane 
                tab={
                  <span>
                    <StarFilled style={{ color: '#faad14' }} /> Nổi bật
                  </span>
                } 
                key="featured"
              >
                {isPending ? (
                  <SpinContainer>
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                  </SpinContainer>
                ) : getFeaturedProducts().length > 0 ? (
                  <ProductGrid>
                    {getFeaturedProducts().map(product => (
                      <CustomProductCard key={product._id} product={product} />
                    ))}
                  </ProductGrid>
                ) : (
                  <EmptyWrapper>
                    <Empty description="Không tìm thấy sản phẩm nổi bật" />
                  </EmptyWrapper>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <FireFilled style={{ color: '#ff4d4f' }} /> Bán chạy
                  </span>
                } 
                key="bestselling"
              >
                {isPending ? (
                  <SpinContainer>
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                  </SpinContainer>
                ) : getBestSellingProducts().length > 0 ? (
                  <ProductGrid>
                    {getBestSellingProducts().map(product => (
                      <CustomProductCard key={product._id} product={product} />
                    ))}
                  </ProductGrid>
                ) : (
                  <EmptyWrapper>
                    <Empty description="Không tìm thấy sản phẩm bán chạy" />
                  </EmptyWrapper>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <ThunderboltFilled style={{ color: '#faad14' }} /> Mới nhất
                  </span>
                } 
                key="newest"
              >
                {isPending ? (
                  <SpinContainer>
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                  </SpinContainer>
                ) : getNewestProducts().length > 0 ? (
                  <ProductGrid>
                    {getNewestProducts().map(product => (
                      <CustomProductCard key={product._id} product={product} />
                    ))}
                  </ProductGrid>
                ) : (
                  <EmptyWrapper>
                    <Empty description="Không tìm thấy sản phẩm mới" />
                  </EmptyWrapper>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <GiftFilled style={{ color: '#ff4d4f' }} /> Giảm giá
                  </span>
                } 
                key="discount"
              >
                {isPending ? (
                  <SpinContainer>
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                  </SpinContainer>
                ) : getDiscountProducts().length > 0 ? (
                  <ProductGrid>
                    {getDiscountProducts().map(product => (
                      <CustomProductCard key={product._id} product={product} />
                    ))}
                  </ProductGrid>
                ) : (
                  <EmptyWrapper>
                    <Empty description="Không tìm thấy sản phẩm giảm giá" />
                  </EmptyWrapper>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <AppstoreOutlined /> Tất cả
                  </span>
                } 
                key="all"
              >
                {isPending ? (
                  <SpinContainer>
                    <Spin size="large" tip="Đang tải sản phẩm..." />
                  </SpinContainer>
                ) : products?.data?.length > 0 ? (
                  <>
                    <ProductGrid>
                      {products.data.slice(0, limit).map(product => (
                        <CustomProductCard key={product._id} product={product} />
                      ))}
                    </ProductGrid>
                    
                    {limit < products.data.length && (
                      <ViewMoreButton onClick={handleViewMore}>
                        Xem thêm sản phẩm
                      </ViewMoreButton>
                    )}
                  </>
                ) : (
                  <EmptyWrapper>
                    <Empty description="Không tìm thấy sản phẩm nào" />
                  </EmptyWrapper>
                )}
              </TabPane>
            </Tabs>
          </TabsWrapper>
        </CategoryContainer>
        
        {/* About Us Section */}
        <AboutSection>
          <SectionTitle>Nhà thuốc tiện lợi</SectionTitle>
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} md={16}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <div style={{ display: 'flex', marginBottom: '15px' }}>
                    <SafetyCertificateFilled style={{ color: '#4cb551', fontSize: '24px', marginRight: '15px' }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '5px', fontSize: '18px' }}>
                        Sản phẩm chính hãng
                      </div>
                      <div style={{ color: '#666' }}>
                        Cam kết 100% sản phẩm chính hãng, nguồn gốc rõ ràng
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', marginBottom: '15px' }}>
                    <MedicineBoxFilled style={{ color: '#4cb551', fontSize: '24px', marginRight: '15px' }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '5px', fontSize: '18px' }}>
                        Đội ngũ dược sĩ chuyên nghiệp
                      </div>
                      <div style={{ color: '#666' }}>
                        Tư vấn tận tình, chuyên môn cao, nhiều năm kinh nghiệm
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ display: 'flex', marginBottom: '15px' }}>
                    <RocketFilled style={{ color: '#4cb551', fontSize: '24px', marginRight: '15px' }} />
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '5px', fontSize: '18px' }}>
                        Giao hàng nhanh chóng
                      </div>
                      <div style={{ color: '#666' }}>
                        Giao hàng trong vòng 2 giờ trong nội thành, đóng gói cẩn thận
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '20px' }}>
                Nhà thuốc tiện lợi tự hào là hệ thống nhà thuốc uy tín với lịch sử hoạt động trên 10 năm trong lĩnh vực dược phẩm. 
                Chúng tôi cung cấp các sản phẩm thuốc, thực phẩm chức năng, dược mỹ phẩm và thiết bị y tế 
                chất lượng cao, đảm bảo nguồn gốc rõ ràng với giá cả hợp lý nhất thị trường.
              </Paragraph>
              
              <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                <Col span={12}>
                  <Tag color="#4cb551" style={{ padding: '5px 10px', borderRadius: '4px' }}>
                    <CheckCircleFilled /> Sản phẩm đa dạng
                  </Tag>
                </Col>
                <Col span={12}>
                  <Tag color="#4cb551" style={{ padding: '5px 10px', borderRadius: '4px' }}>
                    <CheckCircleFilled /> Giá cả cạnh tranh
                  </Tag>
                </Col>
                <Col span={12}>
                  <Tag color="#4cb551" style={{ padding: '5px 10px', borderRadius: '4px' }}>
                    <CheckCircleFilled /> Tư vấn sức khỏe miễn phí
                  </Tag>
                </Col>
                <Col span={12}>
                  <Tag color="#4cb551" style={{ padding: '5px 10px', borderRadius: '4px' }}>
                    <CheckCircleFilled /> Đổi trả dễ dàng
                  </Tag>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={8}>
              <img 
                src={slide7} 
                alt="About Us" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '12px'
                }} 
              />
            </Col>
          </Row>
        </AboutSection>
      </ContentContainer>
    </PageContainer>
  );
};

export default HomePage;