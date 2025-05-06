import React from 'react'
import { Card, Image, Button, Typography, Rate, Tag, Tooltip } from 'antd';
import { 
  ShoppingCartOutlined, 
  EyeOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addOrderProduct } from '../../redux/slide/orderSlide';
import PrescriptionBadge from '../PrescriptionBadge/PrescriptionBadge';
import styled from 'styled-components';

const { Meta } = Card;
const { Text } = Typography;

const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  .ant-card-cover {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    padding: 20px;
    position: relative;
    
    img {
      max-height: 160px;
      object-fit: contain;
    }
  }
  
  .ant-card-body {
    padding: 15px;
  }
  
  .product-title {
    font-size: 16px;
    color: #333;
    line-height: 1.4;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 45px;
  }
  
  .price-container {
    display: flex;
    align-items: baseline;
    margin-bottom: 5px;
    
    .discount-price {
      font-size: 18px;
      font-weight: 600;
      color: #ff4d4f;
    }
    
    .original-price {
      text-decoration: line-through;
      color: #999;
      margin-left: 8px;
      font-size: 14px;
    }
    
    .discount-badge {
      margin-left: 8px;
      font-size: 12px;
      padding: 0 6px;
    }
  }
  
  .stock-status {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 13px;
    
    &.in-stock {
      color: #52c41a;
    }
    
    &.out-of-stock {
      color: #ff4d4f;
    }
    
    .anticon {
      margin-right: 5px;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .badge-container {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 1;
  }
  
  .prescription-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
  }
`;

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const calculateDiscountPrice = (price, discount) => {
  if (!discount) return price;
  return price - (price * discount / 100);
};

const CardComponent = ({ 
  countInStock, 
  description, 
  image, 
  name, 
  price, 
  rating, 
  type, 
  discount, 
  selled,
  requiresPrescription,
  id 
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleDetailsProduct = () => {
    navigate(`/product-detail/${id}`);
  };
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Nếu là thuốc kê đơn, hiển thị thông báo và điều hướng đến trang chi tiết
    if (requiresPrescription) {
      navigate(`/product-detail/${id}?prescription=required`);
      return;
    }
    
    dispatch(addOrderProduct({
      orderItem: {
        name: name,
        amount: 1,
        image: image,
        price: price,
        product: id,
        discount: discount,
        countInStock: countInStock
      }
    }));
    
    // Hiển thị thông báo thành công
    message.success(`Đã thêm ${name} vào giỏ hàng`);
  };
  
  return (
    <StyledCard
      hoverable
      cover={
        <div style={{ position: 'relative' }}>
          <Image
            alt={name}
            src={image}
            preview={false}
          />
          
          {/* Badge hiển thị trạng thái kê đơn */}
          <div className="prescription-badge">
            <PrescriptionBadge requiresPrescription={requiresPrescription} />
          </div>
          
          {/* Badge discount nếu có */}
          {discount > 0 && (
            <div className="badge-container">
              <Tag color="#f50" className="discount-badge">-{discount}%</Tag>
            </div>
          )}
        </div>
      }
      onClick={handleDetailsProduct}
    >
      <div className="product-title">{name}</div>
      
      <Rate disabled allowHalf value={rating} style={{ fontSize: 12, marginBottom: 8 }} />
      
      <div className="price-container">
        <span className="discount-price">
          {formatCurrency(calculateDiscountPrice(price, discount))}
        </span>
        {discount > 0 && (
          <span className="original-price">{formatCurrency(price)}</span>
        )}
      </div>
      
      <div className={`stock-status ${countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
        {countInStock > 0 ? (
          <>
            <CheckCircleOutlined /> Còn hàng
          </>
        ) : (
          <>
            <ClockCircleOutlined /> Hết hàng
          </>
        )}
      </div>
      
      <div className="action-buttons">
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={handleDetailsProduct}
          style={{ flex: 1, background: '#4cb551', borderColor: '#4cb551' }}
        >
          Chi tiết
        </Button>
        
        <Button
          type={requiresPrescription ? "default" : "primary"}
          ghost={requiresPrescription}
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          disabled={countInStock === 0}
          style={{ 
            flex: 1, 
            borderColor: '#4cb551', 
            color: requiresPrescription ? '#4cb551' : 'white',
            background: requiresPrescription ? 'white' : '#4cb551'
          }}
        >
          {requiresPrescription ? 'Xem thêm' : 'Thêm vào giỏ'}
        </Button>
      </div>
    </StyledCard>
  );
};

export default CardComponent;