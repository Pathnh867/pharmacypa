import React, { useState, useEffect } from 'react';
import { Col, Image, InputNumber, Rate, Breadcrumb, Tabs, Divider, Card, notification } from 'antd';
import { CheckCircleOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, HeartOutlined, 
  SafetyCertificateOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import { convertPrice } from '../../utils';
import Loading from '../../components/LoadingComponent/Loading';
import ButtonComponent from '../ButtonComponents/ButtonComponent';
import { WrapperStyleHeader, WrapperStyleHeaderSmall, WrapperPriceProduct, WrapperPriceTextProduct, 
  WrapperAddressProduct, WrapperQualityProduct, WrapperInputNumber, WrapperStyleNameProduct, 
  WrapperStyleImageSmall, WrapperStyleColImage, WrapperStyleTextSell, WrapperProductInfo, 
  WrapperFeatureItem, WrapperFeatures, WrapperContainer, WrapperBreadcrumb, WrapperMainContent,
  WrapperActions, WrapperTabs } from './style';

const { TabPane } = Tabs;

const ProductDetailComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
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
      // Đẩy sự kiện add_to_cart vào dataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        ecommerce: null  // Xóa dữ liệu ecommerce trước đó
      });
      
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'VND',
          value: Number(productDetails?.price) * numProduct,
          items: [{
            item_id: productDetails?._id,
            item_name: productDetails?.name,
            price: Number(productDetails?.price),
            item_category: productDetails?.type || '',
            discount: Number(productDetails?.discount || 0),
            quantity: numProduct
          }]
        }
      });
      
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
  
  // Tạo mảng ảnh cho gallery
  const productImages = productDetails?.image ? [productDetails?.image] : [];
  
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
  
  // Push view_item event vào dataLayer
  useEffect(() => {
    if (productDetails) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        ecommerce: null
      });
      
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'VND',
          value: Number(productDetails.price),
          items: [{
            item_id: productDetails._id,
            item_name: productDetails.name,
            price: Number(productDetails.price),
            item_category: productDetails.type || '',
            discount: Number(productDetails.discount || 0),
            quantity: 1
          }]
        }
      });
    }
  }, [productDetails]);

  return (
    <Loading isPending={isPending}>
      <WrapperContainer>
        {/* Breadcrumb */}
        <WrapperBreadcrumb>
          <Breadcrumb>
            <Breadcrumb.Item>
              <a href="/">Trang chủ</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href={`/product/${typeof productDetails?.type === 'object' ? productDetails?.type?.name : productDetails?.type}`}>
                {typeof productDetails?.type === 'object' ? productDetails?.type?.name : productDetails?.type}
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{productDetails?.name}</Breadcrumb.Item>
          </Breadcrumb>
        </WrapperBreadcrumb>
        
        {/* Thông tin sản phẩm */}
        <WrapperMainContent>
          <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight:'8px'}}>
            <Image src={productDetails?.image} alt="Image Product" preview={false} />
            <div style={{paddingTop:'10px', justifyContent:'space-between', display: 'flex'}}>
              {productImages.map((image, index) => (
                <WrapperStyleColImage key={index} span={4} onClick={() => setSelectedImage(index)}>
                  <WrapperStyleImageSmall 
                    src={image} 
                    alt={`Image small ${index}`} 
                    preview={false} 
                    className={selectedImage === index ? 'active' : ''}
                  />
                </WrapperStyleColImage>
              ))}
            </div>
          </Col>
          
          <Col span={14} style={{paddingLeft: '20px'}}>
            <WrapperProductInfo>
              <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0'}}>
                <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                <WrapperStyleTextSell> | Đã bán {productDetails?.selled || 200}+</WrapperStyleTextSell>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', margin: '10px 0'}}>
                <CheckCircleOutlined style={{ fontSize: '16px', color: '#4cb551', marginRight: '8px' }} />
                <span>{productDetails?.countInStock > 0 
                  ? `Còn hàng (${productDetails?.countInStock} sản phẩm)` 
                  : 'Hết hàng'}</span>
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
                <span>Giao đến </span>
                <span className='address' style={{fontWeight: 'bold'}}>Phường 13, Quận Tân Bình, Hồ Chí Minh</span>
                <span className='changeAddress'> Đổi địa chỉ</span>
              </WrapperAddressProduct>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div style={{margin:'10px 0 20px', padding:' 10px 0' }}>
                <div style={{marginBottom: '10px'}}>Số Lượng</div>
                <WrapperQualityProduct>
                  <button 
                    style={{ border:'none', background:'transparent', cursor: 'pointer'}} 
                    onClick={() => handleChangeCount('decrease')}
                    disabled={numProduct <= 1}
                  >
                    <MinusOutlined style={{color:'#000', fontSize:'20px'}} />
                  </button>
                  <WrapperInputNumber onChange={onChange} value={numProduct} size="small" />
                  <button 
                    style={{ border:'none', background:'transparent', cursor: 'pointer'}} 
                    onClick={() => handleChangeCount('increase')}
                    disabled={numProduct >= (productDetails?.countInStock || 999)}
                  >
                    <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
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
                    borderRadius: '4px'
                  }}
                  onClick={handleBuyNow}
                  textButton={'Mua ngay'}
                  styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'700'}}
                  disabled={!productDetails?.countInStock}
                />
                <ButtonComponent
                  size={40}
                  styleButton={{
                    background: '#fff',
                    height: '48px',
                    width: '220px',
                    border: '1px solid #4cb551',
                    borderRadius: '4px'
                  }}
                  icon={<ShoppingCartOutlined style={{fontSize: '20px'}} />}
                  onClick={handleAddOrderProduct}
                  textButton={'Thêm vào giỏ hàng'}
                  styleTextButton={{color:'#4cb551', fontSize:'15px' }}
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
        
        {/* Tabs thông tin chi tiết */}
        <WrapperTabs defaultActiveKey="1">
          <TabPane tab="Mô tả sản phẩm" key="1">
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
          <TabPane tab="Hướng dẫn sử dụng" key="2">
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
          <TabPane tab="Đánh giá" key="3">
            <Card bordered={false} style={{textAlign: 'center', padding: '20px 0'}}>
              <Rate allowHalf disabled value={productDetails?.rating || 0} style={{ fontSize: '36px', marginBottom: '16px' }} />
              <h2>{productDetails?.rating}/5</h2>
              <p style={{ color: '#666' }}>
                Dựa trên đánh giá từ khách hàng
              </p>
              <ButtonComponent
                size={40}
                styleButton={{
                  background: '#4cb551',
                  height: '40px',
                  borderRadius: '4px',
                  marginTop: '16px'
                }}
                textButton={'Viết đánh giá'}
                styleTextButton={{color:'#fff', fontSize:'14px'}}
              />
            </Card>
          </TabPane>
        </WrapperTabs>
        
        {/* Sản phẩm liên quan */}
        <WrapperMainContent style={{marginTop: '20px'}}>
          <h3 style={{position: 'relative', paddingBottom: '10px', marginBottom: '20px'}}>
            Sản phẩm liên quan
            <div style={{position: 'absolute', bottom: 0, left: 0, width: '60px', height: '3px', background: '#4cb551'}}></div>
          </h3>
          
          <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
            Đang tải sản phẩm liên quan...
          </p>
        </WrapperMainContent>
      </WrapperContainer>
    </Loading>
  );
};

export default ProductDetailComponent;