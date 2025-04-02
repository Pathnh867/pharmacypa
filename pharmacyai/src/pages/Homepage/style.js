import styled from "styled-components";
import { Card, Button, Carousel } from 'antd';

export const PageContainer = styled.div`
  width: 100%;
  background: linear-gradient(to bottom, #f0f5f0, #f7f7f7);
  min-height: 100vh;
  padding-bottom: 60px;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const HeroSection = styled.div`
  margin: 25px 0 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(76, 181, 81, 0.15);
  position: relative;
`;

export const StyledCarousel = styled(Carousel)`
  .slick-dots {
    z-index: 1;
    bottom: 16px !important;
    
    li {
      margin: 0 5px;
      
      button {
        background: rgba(255, 255, 255, 0.7) !important;
        width: 10px !important;
        height: 10px !important;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      
      &.slick-active {
        button {
          background: #4cb551 !important;
          width: 24px !important;
          height: 10px !important;
          border-radius: 5px;
        }
      }
    }
  }
  
  .slick-prev, 
  .slick-next {
    z-index: 1;
    width: 45px;
    height: 45px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    
    &:hover {
      background: rgba(255, 255, 255, 0.95);
    }
    
    &::before {
      font-size: 18px;
      color: #4cb551;
    }
  }
  
  .slick-prev {
    left: 20px;
  }
  
  .slick-next {
    right: 20px;
  }
  
  &:hover {
    .slick-prev, .slick-next {
      opacity: 1;
    }
  }
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.7s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 12px;
  display: inline-block;
  
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70px;
    height: 4px;
    background: linear-gradient(90deg, #4cb551, #2a9134);
    border-radius: 2px;
  }
`;

export const FeatureCard = styled(Card)`
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(76, 181, 81, 0.15);
  }
  
  .ant-card-body {
    padding: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .feature-icon {
    font-size: 40px;
    color: #4cb551;
    margin-bottom: 20px;
    background: rgba(76, 181, 81, 0.1);
    padding: 16px;
    border-radius: 50%;
    transition: all 0.3s;
  }
  
  .feature-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 14px;
    color: #333;
  }
  
  .feature-description {
    color: #666;
    line-height: 1.7;
    font-size: 15px;
  }
  
  &:hover .feature-icon {
    transform: rotate(10deg);
    background: rgba(76, 181, 81, 0.2);
  }
`;

export const CategoryContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

export const TabsWrapper = styled.div`
  .ant-tabs-nav {
    margin-bottom: 30px;
    
    &::before {
      border-bottom-color: #f0f0f0;
    }
  }
  
  .ant-tabs-tab {
    padding: 12px 20px;
    font-size: 16px;
    margin-right: 10px;
    transition: all 0.3s;
    
    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #4cb551;
      font-weight: 600;
    }
    
    &:hover {
      color: #4cb551;
    }
  }
  
  .ant-tabs-ink-bar {
    background: linear-gradient(90deg, #4cb551, #2a9134);
    height: 3px;
    border-radius: 3px 3px 0 0;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 25px;
  margin-top: 25px;
`;

export const ViewMoreButton = styled(Button)`
  border-color: #4cb551;
  color: #4cb551;
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  padding: 0 32px;
  margin: 40px auto 10px;
  display: block;
  border-radius: 8px;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background: linear-gradient(90deg, #4cb551, #2a9134);
    color: white;
    border-color: #4cb551;
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(76, 181, 81, 0.2);
  }
`;

export const AboutSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  p {
    color: #555;
    line-height: 1.9;
    margin-bottom: 18px;
    font-size: 16px;
  }
  
  img {
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    transition: all 0.4s;
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-height: 320px;
    
    &:hover {
      transform: scale(1.03);
      box-shadow: 0 12px 24px rgba(76, 181, 81, 0.2);
    }
  }
`;

export const EmptyWrapper = styled.div`
  padding: 60px 0;
  text-align: center;
  
  .ant-empty-description {
    color: #888;
    font-size: 16px;
  }
`;

export const SpinContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  
  .ant-spin-text {
    margin-top: 16px;
    color: #4cb551;
    font-size: 15px;
    font-weight: 500;
  }
  
  .ant-spin-dot-item {
    background-color: #4cb551;
  }
`;

export const CategoryBadge = styled.div`
  display: inline-block;
  padding: 3px 12px;
  border-radius: 20px;
  background: rgba(76, 181, 81, 0.1);
  color: #4cb551;
  font-weight: 500;
  font-size: 14px;
  margin-right: 10px;
  transition: all 0.3s;
  border: 1px solid transparent;
  
  &:hover, &.active {
    background: #4cb551;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(76, 181, 81, 0.2);
  }
`;

// Thêm vào file style.js

export const ProductCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  border: none;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
  }
  
  .product-image {
    height: 200px;
    object-fit: contain;
    background: #f9f9f9;
    padding: 12px;
    transition: all 0.3s;
  }
  
  .ant-card-cover {
    overflow: hidden;
    position: relative;
  }
  
  &:hover .product-image {
    transform: scale(1.08);
  }
  
  .product-discount-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #ff4d4f;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: 600;
    z-index: 1;
    box-shadow: 0 2px 6px rgba(255, 77, 79, 0.3);
  }
  
  .product-out-of-stock {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    z-index: 2;
  }
  
  .product-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 48px;
    cursor: pointer;
    
    &:hover {
      color: #4cb551;
    }
  }
  
  .product-price {
    font-size: 18px;
    font-weight: 600;
    color: #4cb551;
  }
  
  .product-original-price {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
    margin-left: 8px;
  }
  
  .product-sold {
    color: #888;
    font-size: 13px;
  }
  
  .product-rating {
    margin-top: 8px;
  }
  
  .ant-card-body {
    padding: 16px;
  }
  
  .product-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }
  
  .add-to-cart-btn {
    color: #4cb551;
    border-color: #4cb551;
    
    &:hover {
      color: white;
      background: #4cb551;
      border-color: #4cb551;
    }
    
    &.disabled {
      color: #d9d9d9;
      background: #f5f5f5;
      border-color: #d9d9d9;
      cursor: not-allowed;
      
      &:hover {
        color: #d9d9d9;
        background: #f5f5f5;
        border-color: #d9d9d9;
      }
    }
  }
  
  .product-details-btn {
    color: #666;
    
    &:hover {
      color: #333;
    }
  }
  
  .product-content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;