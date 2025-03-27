import React, { useState, useEffect } from 'react';
import { 
  Col, 
  Image, 
  InputNumber, 
  Rate, 
  Tabs, 
  Divider, 
  Card, 
  notification, 
  Button, 
  Form, 
  Input, 
  Avatar, 
  List, 
  Comment,
  Modal,
  Empty
} from 'antd';
import { 
  CheckCircleOutlined, 
  MinusOutlined, 
  PlusOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined, 
  SafetyCertificateOutlined, 
  ClockCircleOutlined, 
  PhoneOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import * as ProductService from '../../services/ProductService';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import Loading from '../../components/LoadingComponent/Loading';
import ButtonComponent from '../ButtonComponents/ButtonComponent';

const { TabPane } = Tabs;
const { TextArea } = Input;

// Styled Components
const ProductContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  overflow: hidden;
`

const MainContent = styled.div`
  display: flex;
  padding: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ImageColumn = styled(Col)`
  border-right: 1px solid #e8e8e8;
  padding-right: 24px;
  
  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
    padding-right: 0;
    padding-bottom: 24px;
    margin-bottom: 24px;
  }
`

const ImageGallery = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const ThumbnailImage = styled(Image)`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: ${props => props.active ? '2px solid #4cb551' : '2px solid transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    border: 2px solid #4cb551;
    transform: translateY(-2px);
  }
`

const ProductInfo = styled(Col)`
  padding-left: 24px;
  
  @media (max-width: 768px) {
    padding-left: 0;
  }
`

const ProductName = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
`

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const SellingInfo = styled.div`
  color: #666;
  font-size: 14px;
  
  span {
    margin-left: 8px;
    color: #4cb551;
    font-weight: 500;
  }
`

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  margin: 16px 0;
  
  .icon {
    color: ${props => props.inStock ? '#4cb551' : '#ff4d4f'};
    font-size: 16px;
    margin-right: 8px;
  }
  
  .text {
    color: ${props => props.inStock ? '#4cb551' : '#ff4d4f'};
    font-weight: 500;
  }
`

const PriceContainer = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
`

const MainPrice = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: #ff4d4f;
`

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  margin-left: 12px;
  font-size: 16px;
`

const DiscountBadge = styled.span`
  background: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 12px;
  font-weight: 500;
  font-size: 14px;
`

const ShippingInfo = styled.div`
  margin: 16px 0;
  
  .heading {
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
  
  .address {
    font-weight: 500;
    text-decoration: underline;
    cursor: pointer;
  }
  
  .change {
    color: #4cb551;
    margin-left: 8px;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const QuantityWrapper = styled.div`
  margin: 24px 0;
  
  .label {
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
`

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  width: 140px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  
  button {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #f5f5f5;
    }
    
    &:disabled {
      cursor: not-allowed;
      color: #d9d9d9;
    }
  }
  
  .ant-input-number {
    width: 60px;
    border-left: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-top: none;
    border-bottom: none;
    
    .ant-input-number-handler-wrap {
      display: none;
    }
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`

const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
`

const FeatureItem = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  .icon {
    color: #4cb551;
    font-size: 24px;
    margin-right: 16px;
  }
  
  .content {
    .title {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }
    
    .description {
      color: #666;
      font-size: 13px;
    }
  }
`

const StyledTabs = styled(Tabs)`
  padding: 0 24px 24px;
  
  .ant-tabs-nav {
    margin-bottom: 16px;
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4cb551;
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background: #4cb551;
  }
`

const ReviewFormWrapper = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 24px;
  margin-top: 24px;
`

const ReviewList = styled(List)`
  margin-top: 24px;
  
  .ant-list-item {
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px;
    
    &:hover {
      background: #f9f9f9;
    }
  }
  
  .ant-comment-content-author-name {
    color: #333;
    font-weight: 500;
  }
  
  .ant-comment-content-detail {
    color: #666;
  }
`

const EmptyStateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  
  .icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    color: #333;
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: #666;
    text-align: center;
    max-width: 500px;
  }
`

// Demo data for reviews
const demoReviews = [
  {
    id: 1,
    author: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content: 'Sản phẩm rất tốt, giao hàng nhanh. Tôi đã sử dụng và thấy hiệu quả ngay sau 1 tuần.',
    rating: 5,
    date: '2023-09-15',
  },
  {
    id: 2,
    author: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content: 'Chất lượng sản phẩm ổn, đóng gói cẩn thận. Tuy nhiên giá hơi cao so với các sản phẩm cùng loại.',
    rating: 4,
    date: '2023-08-22',
  },
  {
    id: 3,
    author: 'Lê Văn C',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content: 'Sản phẩm đúng như mô tả, nhân viên tư vấn nhiệt tình. Sẽ mua lại lần sau.',
    rating: 5,
    date: '2023-07-10',
  },
];

const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState(demoReviews);
  const [reviewForm] = Form.useForm();
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Thay đổi số lượng sản phẩm
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  
  // Xử lý tăng/giảm số lượng
  const handleChangeCount = (type) => {
    if (type === 'increase') {
      // Không cho phép vượt quá tồn kho
      if (numProduct < productDetails?.countInStock) {
        setNumProduct(numProduct + 1);
      } else {
        notification.warning({
          message: 'Số lượng đã đạt tối đa',
          description: `Chỉ còn ${productDetails?.countInStock} sản phẩm trong kho.`
        });
      }
    } else {
      if (numProduct > 1) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  // Fetch dữ liệu chi tiết sản phẩm
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };
  
  // Thêm vào giỏ hàng
  const handleAddOrderProduct = () => {
    if (!user?.access_token) {
      navigate('/sign-in', { state: location?.pathname });
    } else {
      dispatch(addOrderProduct({
        orderItem: {
          name: productDetails?.name,
          amount: numProduct,
          image: productDetails?.image,
          price: productDetails?.price,
          discount: productDetails?.discount,
          product: productDetails?._id,
        }
      }));
      
      notification.success({
        message: 'Thêm vào giỏ hàng thành công',
        description: `Đã thêm ${numProduct} ${productDetails?.name} vào giỏ hàng.`
      });
    }
  };
  
  // Mua ngay
  const handleBuyNow = () => {
    handleAddOrderProduct();
    navigate('/order');
  };

  const {isPending, data: productDetails} = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct
  });
  
  // Tạo mảng ảnh cho gallery (hiện tại chỉ có 1 ảnh, nên nhân bản để demo)
  const productImages = productDetails?.image ? 
    [
      productDetails?.image,
      productDetails?.image, 
      productDetails?.image, 
      productDetails?.image
    ] : [];
  
  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Tính giá sau giảm giá
  const calculateDiscountPrice = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };
  
  // Xử lý mở form đánh giá
  const showReviewModal = () => {
    if (!user?.access_token) {
      notification.info({
        message: 'Đăng nhập để đánh giá',
        description: 'Vui lòng đăng nhập để gửi đánh giá sản phẩm.',
        btn: (
          <Button type="primary" onClick={() => navigate('/sign-in', { state: location?.pathname })}>
            Đăng nhập ngay
          </Button>
        )
      });
      return;
    }
    
    setIsReviewModalVisible(true);
  };
  
  // Xử lý đóng form đánh giá
  const handleCancelReview = () => {
    setIsReviewModalVisible(false);
    reviewForm.resetFields();
  };
  
  // Xử lý gửi đánh giá
  const handleSubmitReview = (values) => {
    // Trong thực tế, đây là nơi gọi API để lưu đánh giá
    console.log('Review values:', values);
    
    // Demo: Thêm đánh giá mới vào state
    const newReview = {
      id: Date.now(),
      author: user?.name || 'Người dùng',
      avatar: user?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      content: values.content,
      rating: values.rating,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([newReview, ...reviews]);
    
    reviewForm.resetFields();
    setIsReviewModalVisible(false);
    
    notification.success({
      message: 'Gửi đánh giá thành công',
      description: 'Cảm ơn bạn đã đánh giá sản phẩm!'
    });
    
    // Chuyển tab đến phần đánh giá
    setActiveTab('3');
  };

  return (
    <Loading isPending={isPending}>
      <ProductContainer>
        <MainContent>
          <ImageColumn span={10}>
            <Image
              src={productDetails?.image}
              alt={productDetails?.name}
              width="100%"
              height="auto"
              preview={false}
              style={{ borderRadius: '8px' }}
            />
            
            <ImageGallery>
              {productImages.map((image, index) => (
                <ThumbnailImage
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index}`}
                  preview={false}
                  active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </ImageGallery>
          </ImageColumn>
          
          <ProductInfo span={14}>
            <ProductName>{productDetails?.name}</ProductName>
            
            <RatingWrapper>
              <Rate disabled value={productDetails?.rating} allowHalf />
              <SellingInfo>
                Đã bán:<span>{productDetails?.selled || 200}+</span>
              </SellingInfo>
            </RatingWrapper>
            
            <StockInfo inStock={productDetails?.countInStock > 0}>
              <CheckCircleOutlined className="icon" />
              <span className="text">
                {productDetails?.countInStock > 0 
                  ? `Còn hàng (${productDetails?.countInStock} sản phẩm)` 
                  : 'Hết hàng'}
              </span>
            </StockInfo>
            
            <PriceContainer>
              <MainPrice>
                {formatPrice(calculateDiscountPrice(productDetails?.price, productDetails?.discount))}
              </MainPrice>
              
              {productDetails?.discount > 0 && (
                <>
                  <OriginalPrice>
                    {formatPrice(productDetails?.price)}
                  </OriginalPrice>
                  <DiscountBadge>
                    -{productDetails?.discount}%
                  </DiscountBadge>
                </>
              )}
            </PriceContainer>
            
            <ShippingInfo>
              <div className="heading">Giao hàng đến:</div>
              <span className="address">Phường 13, Quận Tân Bình, TP. Hồ Chí Minh</span>
              <span className="change">Đổi địa chỉ</span>
            </ShippingInfo>
            
            <Divider />
            
            <QuantityWrapper>
              <div className="label">Số lượng</div>
              <QuantityControls>
                <button 
                  onClick={() => handleChangeCount('decrease')}
                  disabled={numProduct <= 1}
                >
                  <MinusOutlined />
                </button>
                <InputNumber
                  min={1}
                  max={productDetails?.countInStock || 999}
                  value={numProduct}
                  onChange={onChange}
                  controls={false}
                />
                <button 
                  onClick={() => handleChangeCount('increase')}
                  disabled={numProduct >= (productDetails?.countInStock || 999)}
                >
                  <PlusOutlined />
                </button>
              </QuantityControls>
            </QuantityWrapper>
            
            <ActionButtons>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#4cb551',
                  height: '48px',
                  width: '220px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                onClick={handleBuyNow}
                textButton={'Mua ngay'}
                styleTextButton={{color:'#fff', fontSize:'16px', fontWeight:'600'}}
                disabled={!productDetails?.countInStock}
              />
              
              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#fff',
                  height: '48px',
                  width: '220px',
                  border: '1px solid #4cb551',
                  borderRadius: '8px'
                }}
                icon={<ShoppingCartOutlined style={{fontSize: '20px'}} />}
                onClick={handleAddOrderProduct}
                textButton={'Thêm vào giỏ hàng'}
                styleTextButton={{color:'#4cb551', fontSize:'16px', fontWeight:'500'}}
                disabled={!productDetails?.countInStock}
              />
            </ActionButtons>
            
            <Divider />
            
            <FeatureList>
              <FeatureItem>
                <SafetyCertificateOutlined className="icon" />
                <div className="content">
                  <div className="title">Sản phẩm chính hãng</div>
                  <div className="description">100% sản phẩm có nguồn gốc rõ ràng</div>
                </div>
              </FeatureItem>
              
              <FeatureItem>
                <ClockCircleOutlined className="icon" />
                <div className="content">
                  <div className="title">Giao hàng nhanh</div>
                  <div className="description">Nhận hàng trong ngày</div>
                </div>
              </FeatureItem>
              
              <FeatureItem>
                <PhoneOutlined className="icon" />
                <div className="content">
                  <div className="title">Tư vấn miễn phí</div>
                  <div className="description">Đội ngũ dược sĩ giàu kinh nghiệm</div>
                </div>
              </FeatureItem>
            </FeatureList>
          </ProductInfo>
        </MainContent>
        
        <StyledTabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane 
            tab={
              <span>
                <MessageOutlined style={{ marginRight: 8 }} />
                Mô tả sản phẩm
              </span>
            } 
            key="1"
          >
            <Card bordered={false}>
              <div style={{ whiteSpace: 'pre-line' }}>
                <h3>Thông tin sản phẩm:</h3>
                <p>{productDetails?.description || 'Đang cập nhật thông tin sản phẩm...'}</p>
                
                <Divider />
                
                <h3>Thông số kỹ thuật:</h3>
                <ul>
                  <li>Tên sản phẩm: {productDetails?.name}</li>
                  <li>Loại: {typeof productDetails?.type === 'object' ? productDetails?.type?.name : productDetails?.type}</li>
                  <li>Xuất xứ: Việt Nam</li>
                  <li>Hạn sử dụng: 36 tháng kể từ ngày sản xuất</li>
                  <li>Bảo quản: Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp</li>
                </ul>
              </div>
            </Card>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                Hướng dẫn sử dụng
              </span>
            } 
            key="2"
          >
            <Card bordered={false}>
              <h3>Chỉ định:</h3>
              <p>Sản phẩm được chỉ định để hỗ trợ điều trị các triệu chứng như...</p>
              
              <h3>Liều dùng và cách dùng:</h3>
              <p>
                Người lớn: Uống 1 viên/ngày, sau bữa ăn.<br />
                Trẻ em trên 12 tuổi: Uống 1/2 viên/ngày, sau bữa ăn.<br />
                Hoặc theo chỉ định của bác sĩ.
              </p>
              
              <h3>Thận trọng:</h3>
              <p>
                Không dùng cho người mẫn cảm với bất kỳ thành phần nào của sản phẩm.<br />
                Không dùng cho phụ nữ có thai hoặc đang cho con bú nếu không có chỉ định của bác sĩ.<br />
                Ngừng sử dụng và tham khảo ý kiến bác sĩ nếu có bất kỳ phản ứng bất thường nào.
              </p>
            </Card>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <StarOutlined style={{ marginRight: 8 }} />
                Đánh giá ({reviews.length})
              </span>
            } 
            key="3"
          >
            <Card bordered={false}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ marginBottom: 16 }}>Đánh giá từ khách hàng</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 36, fontWeight: 600, color: '#faad14' }}>
                        {productDetails?.rating || 0}
                      </div>
                      <Rate disabled value={productDetails?.rating || 0} style={{ fontSize: 18 }} />
                      <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                        Trên tổng số {reviews.length} đánh giá
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="primary" 
                  icon={<StarOutlined />} 
                  size="large"
                  onClick={showReviewModal}
                  style={{ background: '#4cb551', borderColor: '#4cb551' }}
                >
                  Viết đánh giá
                </Button>
              </div>
              
              {reviews.length > 0 ? (
                <ReviewList
                  itemLayout="horizontal"
                  dataSource={reviews}
                  renderItem={item => (
                    <Comment
                      author={<a>{item.author}</a>}
                      avatar={<Avatar src={item.avatar} alt={item.author} />}
                      content={
                        <div>
                          <Rate disabled value={item.rating} style={{ fontSize: 14, marginBottom: 8 }} />
                          <p>{item.content}</p>
                        </div>
                      }
                      datetime={<span>{item.date}</span>}
                    />
                  )}
                />
              ) : (
                <EmptyStateWrapper>
                  <StarOutlined className="icon" />
                  <div className="title">Chưa có đánh giá nào</div>
                  <div className="subtitle">
                    Hãy là người đầu tiên đánh giá sản phẩm này và chia sẻ trải nghiệm của bạn với những khách hàng khác.
                  </div>
                  <Button 
                    type="primary" 
                    icon={<StarOutlined />} 
                    style={{ marginTop: 16, background: '#4cb551', borderColor: '#4cb551' }}
                    onClick={showReviewModal}
                  >
                    Viết đánh giá
                  </Button>
                </EmptyStateWrapper>
              )}
            </Card>
          </TabPane>
        </StyledTabs>
      </ProductContainer>
      
      {/* Sản phẩm tương tự */}
      <ProductContainer>
        <div style={{ padding: '16px 24px' }}>
          <h3 style={{ 
            borderBottom: '3px solid #4cb551', 
            paddingBottom: '8px', 
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            Sản phẩm tương tự
          </h3>
          
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Đang tải sản phẩm tương tự..." 
          />
        </div>
      </ProductContainer>
      
      {/* Modal đánh giá sản phẩm */}
      <Modal
        title="Đánh giá sản phẩm"
        open={isReviewModalVisible}
        onCancel={handleCancelReview}
        footer={null}
      >
        <Form
          form={reviewForm}
          layout="vertical"
          onFinish={handleSubmitReview}
        >
          <Form.Item
            name="rating"
            label="Đánh giá sao"
            rules={[{ required: true, message: 'Vui lòng chọn số sao đánh giá!' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nhận xét của bạn"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét!' }]}
          >
            <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: '#4cb551', borderColor: '#4cb551' }}>
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Loading>
  );
};

export default ProductDetailComponent;