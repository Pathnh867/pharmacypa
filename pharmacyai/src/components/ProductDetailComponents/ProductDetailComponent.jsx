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
  Image as AntImage,
  Spin,
  Tag,
  Tooltip,
  Upload,
  message
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
  WarningOutlined,
  RightOutlined,
  FileProtectOutlined,  
  UploadOutlined, 
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import Loading from '../../components/LoadingComponent/Loading';
import ButtonComponent from '../ButtonComponents/ButtonComponent';
import PrescriptionBadge from '../PrescriptionBadge/PrescriptionBadge';
import { 
  WrapperStyleHeader, 
  WrapperStyleHeaderSmall, 
  WrapperPriceProduct, 
  WrapperPriceTextProduct, 
  WrapperAddressProduct, 
  WrapperQualityProduct, 
  WrapperInputNumber, 
  WrapperStyleNameProduct, 
  WrapperStyleTextSell, 
  WrapperProductInfo, 
  WrapperFeatureItem, 
  WrapperFeatures, 
  WrapperContainer, 
  WrapperBreadcrumb, 
  WrapperMainContent,
  WrapperActions, 
  WrapperTabs,
  ProductDetailContainer,
  MainImageContainer,
  RelatedProductsContainer,
  RelatedProductsGrid,
  RelatedProductCard,
  NoRelatedProducts,
  LoadingRelatedProducts,
  ViewMoreButton,
  WrapperUploadFile,
  PrescriptionPreview
} from './style';
import * as PrescriptionService from '../../services/PrescriptionService';
import { getBase64 } from '../../utils';

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
  const [reviews, setReviews] = useState(demoReviews);
  const [reviewForm] = Form.useForm();
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState(null);
  const [prescriptionForm] = Form.useForm();  
  

  
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Thay đổi số lượng sản phẩm
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const handleOnchangePrescription = async ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPrescriptionFile(file.originFileObj);
      setPrescriptionPreview(file.preview);
      console.log('Đã lưu file:', file.originFileObj);
    } else {
      setPrescriptionFile(null);
      setPrescriptionPreview(null);
    }
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
  
  // Mua ngay - Đã sửa để kiểm tra đăng nhập
  const handleBuyNow = () => {
    if (!user?.access_token) {
      navigate('/sign-in', { state: location?.pathname });
    } else {
      handleAddOrderProduct();
      navigate('/order');
    }
  };

  const {isPending, data: productDetails} = useQuery({
    queryKey: ['product-details', idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
    refetchOnWindowFocus: false
  });
  
  // Hàm lấy các sản phẩm tương tự
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (productDetails?.type) {
        setLoadingSimilar(true);
        try {
          // Lấy typeId từ đối tượng type hoặc chuỗi
          const typeId = typeof productDetails.type === 'object' 
            ? productDetails.type._id 
            : productDetails.type;
            
          const res = await ProductService.getAllProduct('', 100);
          if (res?.status === 'OK') {
            // Lọc sản phẩm cùng loại, nhưng không phải sản phẩm hiện tại
            let filtered = res.data.filter(product => 
              (product.type === typeId || 
              (typeof product.type === 'object' && product.type?._id === typeId)) && 
              product._id !== productDetails._id
            );
            
            // Giới hạn số lượng hiển thị
            filtered = filtered.slice(0, 4);
            setSimilarProducts(filtered);
          }
        } catch (error) {
          console.error('Lỗi khi tải sản phẩm tương tự:', error);
        } finally {
          setLoadingSimilar(false);
        }
      }
    };
    
    fetchSimilarProducts();
  }, [productDetails]);
  
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
  // Hàm hiển thị modal tải lên đơn thuốc
    const showPrescriptionModal = () => {
      setIsModalVisible(true);
  };
  const handlePrescriptionUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} tải lên thành công`);
      setPrescriptionFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} tải lên thất bại.`);
    }
  };
  const handleSubmitPrescription = async () => {
    try {
        await prescriptionForm.validateFields();
        
        if (!prescriptionFile) {
            message.error('Vui lòng tải lên đơn thuốc');
            return;
        }
        
        message.loading({ content: 'Đang gửi đơn thuốc...', key: 'prescriptionUpload' });
        
        // Tạo FormData 
        const formData = new FormData();
        formData.append('prescription', prescriptionFile);
        
        if (prescriptionForm.getFieldValue('note')) {
            formData.append('note', prescriptionForm.getFieldValue('note'));
        }
        
        // Gọi API với ID sản phẩm thay vì ID đơn hàng
        const response = await PrescriptionService.uploadPrescription(
            productDetails._id, // ID sản phẩm
            formData,
            user?.access_token
        );
        
        if (response?.status === 'OK') {
            message.success({ 
                content: 'Tải lên đơn thuốc thành công. Quản trị viên sẽ xem xét và xác nhận đơn thuốc của bạn.', 
                key: 'prescriptionUpload' 
            });
            setIsModalVisible(false);
            // Thêm sản phẩm vào giỏ hàng với trạng thái đặc biệt
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    discount: productDetails?.discount,
                    product: productDetails?._id,
                    requiresVerification: true,
                    prescriptionId: response.data.prescriptionId
                }
            }));
            
            navigate('/order');
        } else {
            message.error({ 
                content: response?.message || 'Có lỗi xảy ra khi tải lên đơn thuốc', 
                key: 'prescriptionUpload' 
            });
        }
    } catch (error) {
        console.error('Error uploading prescription:', error);
        message.error('Có lỗi xảy ra khi tải lên đơn thuốc');
    }
};
  const renderPrescriptionInfo = () => {
    if (!productDetails?.requiresPrescription) return null;
    
    return (
      <div style={{ 
        marginTop: '16px', 
        padding: '16px', 
        background: '#fff1f0', 
        border: '1px solid #ffccc7',
        borderRadius: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <FileProtectOutlined style={{ fontSize: '24px', color: '#cf1322', marginRight: '12px', marginTop: '2px' }} />
          <div>
            <h3 style={{ margin: '0 0 8px 0', color: '#cf1322' }}>Thuốc kê đơn</h3>
            <p style={{ margin: '0 0 8px 0' }}>
              Sản phẩm này yêu cầu đơn thuốc của bác sĩ để mua. Bạn sẽ cần tải lên đơn thuốc hợp lệ sau khi đặt hàng.
            </p>
            
            {productDetails.prescriptionDetails && (
              <div>
                {productDetails.prescriptionDetails.activeIngredients && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Thành phần hoạt chất:</strong> {productDetails.prescriptionDetails.activeIngredients}
                  </div>
                )}
                
                {productDetails.prescriptionDetails.dosage && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Liều dùng:</strong> {productDetails.prescriptionDetails.dosage}
                  </div>
                )}
                
                {productDetails.prescriptionDetails.interactions && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Tương tác thuốc:</strong> {productDetails.prescriptionDetails.interactions}
                  </div>
                )}
                
                {productDetails.prescriptionDetails.sideEffects && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Tác dụng phụ:</strong> {productDetails.prescriptionDetails.sideEffects}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  return (
    <Loading isPending={isPending}>
      <WrapperContainer>
        <WrapperMainContent>
          <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight:'24px'}}>
            <MainImageContainer>
              <AntImage 
                src={productDetails?.image} 
                alt={productDetails?.name}
                width="100%"
                preview={true}
                style={{ borderRadius: '8px' }}
              />
            </MainImageContainer>
            {/* Đã loại bỏ phần thumbnails */}
          </Col>
          
          <Col span={14} style={{paddingLeft: '24px'}}>
            <WrapperProductInfo>
              <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                  <PrescriptionBadge requiresPrescription={productDetails?.requiresPrescription} />
                  {productDetails?.requiresPrescription && (
                    <span style={{ color: '#c41d7f', fontSize: '14px' }}>
                      Sản phẩm này yêu cầu đơn thuốc của bác sĩ
                    </span>
                  )}
                </div>
              
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
                {productDetails?.requiresPrescription ? (
                  <>
                    <ButtonComponent
                      size={40}
                      styleButton={{
                        background: '#c41d7f',
                        height: '48px',
                        width: '220px',
                        border: 'none',
                        borderRadius: '8px'
                      }}
                      onClick={showPrescriptionModal}
                      textButton={'Tải lên đơn thuốc'}
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
                      icon={<InfoCircleOutlined style={{fontSize: '20px'}} />}
                      onClick={() => setActiveTab('4')}
                      textButton={'Xem thông tin kê đơn'}
                      styleTextButton={{color:'#4cb551', fontSize:'16px', fontWeight: '500'}}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
          {productDetails?.requiresPrescription && (
            <TabPane 
              tab={
                <span>
                  <FileProtectOutlined style={{ marginRight: 8 }} />
                  Thông tin kê đơn
                </span>
              } 
              key="4"
            >
              <Card bordered={false}>
                <Alert
                  message="Thông tin quan trọng về thuốc kê đơn"
                  description="Thuốc này yêu cầu đơn thuốc của bác sĩ. Khi mua, bạn sẽ cần cung cấp đơn thuốc hợp lệ."
                  type="warning"
                  showIcon
                  style={{ marginBottom: '20px' }}
                />
                
                {productDetails?.prescriptionDetails ? (
                  <>
                    <h3>Thành phần hoạt chất:</h3>
                    <p>{productDetails.prescriptionDetails.activeIngredients || 'Chưa có thông tin'}</p>
                    
                    <h3>Liều dùng:</h3>
                    <p>{productDetails.prescriptionDetails.dosage || 'Theo chỉ định của bác sĩ'}</p>
                    
                    <h3>Tương tác thuốc:</h3>
                    <p>{productDetails.prescriptionDetails.interactions || 'Vui lòng tham khảo ý kiến bác sĩ về các tương tác thuốc có thể xảy ra'}</p>
                    
                    <h3>Tác dụng phụ:</h3>
                    <p>{productDetails.prescriptionDetails.sideEffects || 'Vui lòng tham khảo tờ hướng dẫn sử dụng hoặc ý kiến bác sĩ'}</p>
                  </>
                ) : (
                  <Empty 
                    description="Chưa có thông tin chi tiết về thuốc này" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </TabPane>
          )}
        </WrapperTabs>
      </WrapperContainer>
      
      {/* Sản phẩm tương tự - Phần đã được cải tiến */}
      <WrapperContainer>
        <RelatedProductsContainer>
          <h3>Sản phẩm tương tự</h3>
          
          {loadingSimilar ? (
            <LoadingRelatedProducts>
              <div className="spin-icon">
                <LoadingOutlined style={{ fontSize: 36, color: '#4cb551' }} spin />
              </div>
              <div className="text">Đang tải sản phẩm tương tự...</div>
            </LoadingRelatedProducts>
          ) : similarProducts.length > 0 ? (
            <>
              <RelatedProductsGrid>
                {similarProducts.map((product) => (
                  <RelatedProductCard 
                    key={product._id}
                    onClick={() => navigate(`/product-detail/${product._id}`)}
                  >
                    <div className="card-image">
                      <img alt={product.name} src={product.image} />
                      {product.discount > 0 && (
                        <span className="discount-badge">-{product.discount}%</span>
                      )}
                    </div>
                    <div className="card-content">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">
                        <span className="discount-price">
                          {formatPrice(calculateDiscountPrice(product.price, product.discount))}
                        </span>
                        {product.discount > 0 && (
                          <span className="original-price">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                      <div className="product-rating">
                        <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                      </div>
                    </div>
                  </RelatedProductCard>
                ))}
              </RelatedProductsGrid>
              
              {similarProducts.length >= 4 && (
                <ViewMoreButton onClick={() => navigate('/product-category', { state: { type: productDetails?.type?._id || productDetails?.type } })}>
                  Xem thêm sản phẩm tương tự
                  <RightOutlined className="icon" />
                </ViewMoreButton>
              )}
            </>
          ) : (
            <NoRelatedProducts>
              <div className="icon">
                <WarningOutlined style={{ color: '#d9d9d9' }} />
              </div>
              <div className="text">Không tìm thấy sản phẩm tương tự</div>
            </NoRelatedProducts>
          )}
        </RelatedProductsContainer>
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
      <Modal
        title="Tải lên đơn thuốc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={prescriptionForm}
          layout="vertical"
          onFinish={handleSubmitPrescription}
        >
          <Alert
            message="Thuốc kê đơn yêu cầu đơn thuốc của bác sĩ"
            description="Vui lòng tải lên hình ảnh hoặc file PDF đơn thuốc của bác sĩ. Chúng tôi sẽ xác minh đơn thuốc trước khi xác nhận đơn hàng của bạn."
            type="info"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <Form.Item
            name="prescription"
            label="Đơn thuốc"
            rules={[{ required: true, message: 'Vui lòng tải lên đơn thuốc' }]}
          >
            <div>
              <WrapperUploadFile 
                onChange={handleOnchangePrescription} 
                maxCount={1}
                showUploadList={false}
                accept=".jpg,.jpeg,.png,.pdf"
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>
                  {prescriptionFile ? 'Thay đổi đơn thuốc' : 'Tải đơn thuốc lên'}
                </Button>
              </WrapperUploadFile>
              
              {prescriptionFile && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ color: '#52c41a', marginBottom: '8px' }}>
                    <CheckCircleOutlined /> Đã tải lên: {prescriptionFile.name}
                  </div>
                  
                  {prescriptionPreview && (
                    <PrescriptionPreview>
                      <img 
                        src={prescriptionPreview} 
                        alt="Đơn thuốc" 
                      />
                    </PrescriptionPreview>
                  )}
                </div>
              )}
            </div>
          </Form.Item>
          
          <Form.Item
            name="note"
            label="Ghi chú (tùy chọn)"
          >
            <TextArea
              rows={3}
              placeholder="Nhập ghi chú về đơn thuốc hoặc yêu cầu khác (nếu có)"
            />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={() => setIsModalVisible(false)}>
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                style={{ background: '#c41d7f', borderColor: '#c41d7f' }}
                icon={<FileProtectOutlined />}
                disabled={!prescriptionFile}
              >
                Gửi đơn thuốc và thêm vào giỏ hàng
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Loading>
  );
};

export default ProductDetailComponent;