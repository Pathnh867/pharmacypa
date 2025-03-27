import React, { useState, useEffect } from 'react';
import { 
  Col, 
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
  Modal,
  Empty,
  Alert,
  Image as AntImage // Đổi tên để tránh xung đột với HTML img tag
} from 'antd';
import { Comment } from '@ant-design/compatible';
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
  UserOutlined,
  LoadingOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import Loading from '../../components/LoadingComponent/Loading';
import ButtonComponent from '../ButtonComponents/ButtonComponent';
import { 
  WrapperStyleHeader, 
  WrapperStyleHeaderSmall, 
  WrapperPriceProduct, 
  WrapperPriceTextProduct, 
  WrapperAddressProduct, 
  WrapperQualityProduct, 
  WrapperInputNumber, 
  WrapperStyleNameProduct, 
  WrapperStyleImageSmall, 
  WrapperStyleColImage, 
  WrapperStyleTextSell, 
  WrapperProductInfo, 
  WrapperFeatureItem, 
  WrapperFeatures, 
  WrapperContainer, 
  WrapperBreadcrumb, 
  WrapperMainContent,
  WrapperActions, 
  WrapperTabs,
  ProductDetailContainer
} from './style';

const { TabPane } = Tabs;
const { TextArea } = Input;

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
      try {
        console.log('Fetching product details for id:', id);
        const res = await ProductService.getDetailsProduct(id);
        console.log('Product details fetched:', res);
        if (res?.status === 'OK') {
          return res.data;
        }
        return null;
      } catch (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }
    }
    return null;
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
    enabled: !!idProduct,
    refetchOnWindowFocus: false
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
      <WrapperContainer>
        <WrapperMainContent>
          <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight:'24px'}}>
            <AntImage 
              src={productDetails?.image} 
              alt={productDetails?.name}
              width="100%"
              preview={false}
              style={{ borderRadius: '8px' }}
            />
            
            <div style={{paddingTop:'16px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              {productImages.map((image, index) => (
                <WrapperStyleColImage key={index} onClick={() => setSelectedImage(index)}>
                  <WrapperStyleImageSmall 
                    src={image} 
                    alt={`Thumbnail ${index}`} 
                    preview={false} 
                    className={selectedImage === index ? 'active' : ''}
                  />
                </WrapperStyleColImage>
              ))}
            </div>
          </Col>
          
          <Col span={14} style={{paddingLeft: '24px'}}>
            <WrapperProductInfo>
              <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0'}}>
                <Rate allowHalf disabled value={productDetails?.rating} />
                <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 200}+</WrapperStyleTextSell>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', margin: '16px 0'}}>
                <CheckCircleOutlined style={{ fontSize: '16px', color: '#4cb551', marginRight: '8px' }} />
                <span style={{ color: '#4cb551', fontWeight: '500' }}>
                  {productDetails?.countInStock > 0 
                    ? `Còn hàng (${productDetails?.countInStock} sản phẩm)` 
                    : 'Hết hàng'}
                </span>
              </div>
              
              <WrapperPriceProduct>
                <WrapperPriceTextProduct>
                  {formatPrice(calculateDiscountPrice(productDetails?.price, productDetails?.discount))}
                </WrapperPriceTextProduct>
                {productDetails?.discount > 0 && (
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{textDecoration: 'line-through', color: '#999', marginLeft: '10px'}}>
                      {formatPrice(productDetails?.price)}
                    </span>
                    <span style={{
                      background: '#ff4d4f', 
                      color: 'white', 
                      padding: '2px 8px', 
                      borderRadius: '4px', 
                      marginLeft: '10px',
                      fontSize: '14px'
                    }}>
                      -{productDetails?.discount}%
                    </span>
                  </div>
                )}
              </WrapperPriceProduct>
              
              <WrapperAddressProduct>
                <div style={{ fontWeight: '500', color: '#333', marginBottom: '8px' }}>Giao hàng đến:</div>
                <span className='address'>Phường 13, Quận Tân Bình, Hồ Chí Minh</span>
                <span className='changeAddress'> Đổi địa chỉ</span>
              </WrapperAddressProduct>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div style={{margin:'20px 0'}}>
                <div style={{marginBottom: '8px', fontWeight: '500', color: '#333'}}>Số Lượng</div>
                <WrapperQualityProduct>
                  <button 
                    style={{ border:'none', background:'transparent', cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
                    onClick={() => handleChangeCount('decrease')}
                    disabled={numProduct <= 1}
                  >
                    <MinusOutlined style={{color: numProduct <= 1 ? '#d9d9d9' : '#333', fontSize:'16px'}} />
                  </button>
                  <WrapperInputNumber 
                    onChange={onChange} 
                    value={numProduct} 
                    size="small" 
                    min={1} 
                    max={productDetails?.countInStock || 999}
                    controls={false}
                  />
                  <button 
                    style={{ border:'none', background:'transparent', cursor: 'pointer', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}} 
                    onClick={() => handleChangeCount('increase')}
                    disabled={numProduct >= (productDetails?.countInStock || 999)}
                  >
                    <PlusOutlined style={{ color: numProduct >= (productDetails?.countInStock || 999) ? '#d9d9d9' : '#333', fontSize: '16px' }} />
                  </button>
                </WrapperQualityProduct>
              </div>
              
              <WrapperActions>
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
                  styleTextButton={{color:'#4cb551', fontSize:'16px', fontWeight: '500'}}
                  disabled={!productDetails?.countInStock}
                />
              </WrapperActions>
              
              <Divider style={{ margin: '24px 0' }} />
              
              <WrapperFeatures>
                <WrapperFeatureItem>
                  <SafetyCertificateOutlined className="feature-icon" />
                  <div>
                    <WrapperStyleHeader>Sản phẩm chính hãng</WrapperStyleHeader>
                    <WrapperStyleHeaderSmall>100% sản phẩm có nguồn gốc rõ ràng</WrapperStyleHeaderSmall>
                  </div>
                </WrapperFeatureItem>
                
                <WrapperFeatureItem>
                  <ClockCircleOutlined className="feature-icon" />
                  <div>
                    <WrapperStyleHeader>Giao nhanh</WrapperStyleHeader>
                    <WrapperStyleHeaderSmall>Nhận hàng trong ngày</WrapperStyleHeaderSmall>
                  </div>
                </WrapperFeatureItem>
                
                <WrapperFeatureItem>
                  <PhoneOutlined className="feature-icon" />
                  <div>
                    <WrapperStyleHeader>Tư vấn miễn phí</WrapperStyleHeader>
                    <WrapperStyleHeaderSmall>Đội ngũ dược sĩ giàu kinh nghiệm</WrapperStyleHeaderSmall>
                  </div>
                </WrapperFeatureItem>
              </WrapperFeatures>
            </WrapperProductInfo>
          </Col>
        </WrapperMainContent>
        
        <WrapperTabs activeKey={activeTab} onChange={setActiveTab}>
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
                <List
                  className="review-list"
                  itemLayout="horizontal"
                  dataSource={reviews}
                  style={{ marginTop: '24px' }}
                  renderItem={item => (
                    <List.Item style={{ padding: '16px', border: '1px solid #f0f0f0', borderRadius: '8px', marginBottom: '16px' }}>
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
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '32px 0'
                }}>
                  <StarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                  <div style={{ fontSize: '18px', color: '#333', marginBottom: '8px' }}>Chưa có đánh giá nào</div>
                  <div style={{ color: '#666', textAlign: 'center', maxWidth: '500px' }}>
                    Hãy là người đầu tiên đánh giá sản phẩm này và chia sẻ trải nghiệm của bạn với những khách hàng khác.
                  </div>
                  <Button 
                    type="primary" 
                    icon={<StarOutlined />} 
                    style={{ marginTop: '16px', background: '#4cb551', borderColor: '#4cb551' }}
                    onClick={showReviewModal}
                  >
                    Viết đánh giá
                  </Button>
                </div>
              )}
            </Card>
          </TabPane>
        </WrapperTabs>
      </WrapperContainer>
      
      {/* Sản phẩm tương tự */}
      <WrapperContainer>
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
      </WrapperContainer>
      
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