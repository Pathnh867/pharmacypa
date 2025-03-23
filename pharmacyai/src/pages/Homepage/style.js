import styled from "styled-components";
import { Card, Button, Carousel } from 'antd';

export const PageContainer = styled.div`
  width: 100%;
  background: #f7f7f7;
  min-height: 100vh;
  padding-bottom: 40px;
`;

export const ContentContainer = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const HeroSection = styled.div`
  margin: 20px 0 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

export const StyledCarousel = styled(Carousel)`
  .slick-dots {
    z-index: 1;
    bottom: 12px !important;
    
    li {
      button {
        background: rgba(255, 255, 255, 0.7) !important;
        width: 12px !important;
        height: 12px !important;
        border-radius: 50%;
      }
      
      &.slick-active {
        button {
          background: #fff !important;
          width: 14px !important;
          height: 14px !important;
        }
      }
    }
  }
  
  .slick-prev, 
  .slick-next {
    z-index: 1;
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    
    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
    
    &::before {
      font-size: 20px;
    }
  }
  
  .slick-prev {
    left: 20px;
  }
  
  .slick-next {
    right: 20px;
  }
`;

export const CarouselImage = styled.img`
  width: 100%;
  height: 450px;
  object-fit: cover;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
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
`;

export const FeatureCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .ant-card-body {
    padding: 24px;
  }
  
  .feature-icon {
    font-size: 32px;
    color: #4cb551;
    margin-bottom: 16px;
  }
  
  .feature-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #333;
  }
  
  .feature-description {
    color: #666;
    line-height: 1.6;
  }
`;

export const CategoryContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const TabsWrapper = styled.div`
  .ant-tabs-nav {
    margin-bottom: 24px;
    
    &::before {
      border-bottom-color: #eee;
    }
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
    
    &.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #4cb551;
      font-weight: 600;
    }
  }
  
  .ant-tabs-ink-bar {
    background-color: #4cb551;
    height: 3px;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

export const ViewMoreButton = styled(Button)`
  border-color: #4cb551;
  color: #4cb551;
  height: 40px;
  font-size: 15px;
  margin: 30px auto 0;
  display: block;
  
  &:hover, &:focus {
    background: #4cb551;
    color: white;
    border-color: #4cb551;
  }
`;

export const AboutSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  p {
    color: #666;
    line-height: 1.8;
    margin-bottom: 16px;
  }
  
  img {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

export const EmptyWrapper = styled.div`
  padding: 40px 0;
  text-align: center;
  
  .ant-empty-description {
    color: #666;
  }
`;

export const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  
  .ant-spin-text {
    margin-top: 12px;
    color: #4cb551;
  }
  
  .ant-spin-dot-item {
    background-color: #4cb551;
  }
`;