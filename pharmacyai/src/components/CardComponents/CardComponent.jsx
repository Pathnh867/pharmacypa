import React from 'react'
import { Card, Image, Typography, Rate, Tag } from 'antd'
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { WrapperCardStyle, StyleNameProduct, WrapperReportText, WrapperPriceText, WrapperDiscountText, WrapperCardContent, OldPriceText, CardActions, ProductBadges } from './style'
import { convertPrice } from '../../utils'
import PrescriptionBadge from '../PrescriptionBadge/PrescriptionBadge'

const { Meta } = Card;
const { Text } = Typography;

const CardComponent = (props) => {
  const { 
    countInStock, 
    description, 
    image, 
    name, 
    price, 
    rating, 
    type, 
    discount, 
    selled, 
    id,
    requiresPrescription 
  } = props;
  
  const navigate = useNavigate()
  
  const handleDetailsProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  
  return (
    <WrapperCardStyle
      hoverable
      headStyle={{ padding: 0 }}
      bodyStyle={{ padding: '10px' }}
      cover={
        <img 
          alt={name} 
          src={image} 
          style={{ height: '240px', width: '100%', objectFit: 'contain', padding: '20px' }}
        />
      }
      onClick={() => handleDetailsProduct(id)}
    >
      <ProductBadges>
        <PrescriptionBadge 
          requiresPrescription={requiresPrescription} 
          size="small"
        />
        {discount > 0 && (
          <Tag color="#f50" style={{ marginLeft: requiresPrescription ? '5px' : '0' }}>
            Giảm {discount}%
          </Tag>
        )}
      </ProductBadges>
      
      <WrapperCardContent>
        <StyleNameProduct>{name}</StyleNameProduct>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Rate 
            allowHalf 
            defaultValue={rating || 4} 
            style={{ fontSize: '14px' }} 
            disabled
          />
          <WrapperReportText>Đã bán {selled || 0}</WrapperReportText>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          {discount ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WrapperPriceText>
                {convertPrice(price - Math.floor((price * discount) / 100))}
              </WrapperPriceText>
              <OldPriceText>{convertPrice(price)}</OldPriceText>
            </div>
          ) : (
            <WrapperPriceText>{convertPrice(price)}</WrapperPriceText>
          )}
        </div>
      </WrapperCardContent>
      
      <CardActions>
        <div className="action-button view">
          <EyeOutlined />
          <span>Chi tiết</span>
        </div>
        <div className="action-button cart">
          <ShoppingCartOutlined />
          <span>{requiresPrescription ? 'Mua có đơn' : 'Thêm vào giỏ'}</span>
        </div>
      </CardActions>
    </WrapperCardStyle>
  )
}

export default CardComponent