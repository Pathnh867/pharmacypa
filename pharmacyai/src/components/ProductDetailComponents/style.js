import styled from "styled-components";
import { Tabs, InputNumber, Upload } from "antd";
import { Image as AntImage } from 'antd'; // Đổi tên import để tránh xung đột
import { UploadOutlined, FileProtectOutlined } from '@ant-design/icons';
// Thêm style cho container ảnh chính
export const MainImageContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  
  .ant-image {
    width: 100%;
    display: block;
  }
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

// Styling cho tabs
export const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 16px;
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
    transition: all 0.3s;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4cb551;
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background: #4cb551;
  }
`;

// Container chính cho trang chi tiết sản phẩm
export const ProductDetailContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  overflow: hidden;
`;

// Styling cho phần breadcrumb
export const BreadcrumbContainer = styled.div`
  margin-bottom: 20px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #4cb551;
      
      &:hover {
        color: #389e3c;
      }
    }
    
    .anticon {
      margin-right: 8px;
    }
  }
`;

// Button đánh giá sản phẩm
export const ReviewButton = styled.button`
  background-color: #4cb551;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px auto;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3ca349;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Styling cho phần đánh giá sản phẩm
export const ReviewSection = styled.div`
  padding: 24px;
  
  .rating-summary {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 24px;
    
    .rating-average {
      text-align: center;
      
      .rating-value {
        font-size: 48px;
        font-weight: 700;
        color: #faad14;
        line-height: 1;
      }
      
      .rating-count {
        color: #666;
        margin-top: 8px;
      }
    }
    
    .rating-distribution {
      flex: 1;
    }
  }
`;

// Empty state khi chưa có đánh giá
export const EmptyReviewState = styled.div`
  text-align: center;
  padding: 40px 0;
  
  .icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
  }
  
  .subtitle {
    color: #666;
    max-width: 500px;
    margin: 0 auto 24px;
  }
`;

// Card hiển thị thông tin sản phẩm
export const ProductInfoCard = styled.div`
  padding: 24px;
  border-radius: 8px;
  
  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  ul {
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: #666;
    }
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

// Styling cho đánh giá của người dùng
export const UserReview = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  margin-bottom: 16px;
  transition: all 0.2s;
  
  &:hover {
    background: #f9f9f9;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .review-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    
    .avatar {
      margin-right: 12px;
    }
    
    .user-info {
      .name {
        font-weight: 500;
        color: #333;
      }
      
      .date {
        font-size: 12px;
        color: #999;
      }
    }
  }
  
  .review-content {
    color: #666;
    
    .rating {
      margin-bottom: 8px;
    }
  }
`;

// Styling cho modal đánh giá
export const ReviewModal = styled.div`
  .modal-title {
    text-align: center;
    margin-bottom: 24px;
    
    h3 {
      font-size: 20px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }
    
    p {
      color: #666;
    }
  }
  
  .rating-field {
    text-align: center;
    margin-bottom: 24px;
    
    .label {
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
    }
    
    .stars {
      font-size: 32px;
    }
  }
`;

// Animations
export const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const slideIn = `
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Các components tương thích với code cũ
export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;

export const WrapperStyleHeader = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`;

export const WrapperStyleHeaderSmall = styled.div`
  font-size: 12px;
  color: #666;
`;

export const WrapperPriceProduct = styled.div`
  background: rgb(250, 250, 250);
  border-radius: 4px;
  padding: 10px;
  margin: 15px 0;
`;

export const WrapperPriceTextProduct = styled.span`
  font-size: 24px;
  line-height: 32px;
  font-weight: 500;
  color: #ff4d4f;
`;

export const WrapperAddressProduct = styled.div`
  span.address {
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  };
  span.changeAddress {
    color: #279c59;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const WrapperQualityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  width: 120px;
  border: 1px solid #ccc;
  border-radius: 4px;
  
  button {
    &:hover {
      background: #f1f1f1 !important;
    }
    
    &:disabled {
      cursor: not-allowed !important;
      color: #d9d9d9 !important;
    }
  }
`;

export const WrapperStyleNameProduct = styled.h1`
  font-size: 24px;
  font-weight: bold;
  line-height: 28px;
  color: #333;
  margin-bottom: 8px;
`;

export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: #279c59;
`;

export const WrapperProductInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 16px;
    line-height: 1.6;
  }
  
  ul {
    margin-bottom: 16px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
`;

export const WrapperFeatureItem = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  .feature-icon {
    color: #4cb551;
    font-size: 24px;
    margin-right: 12px;
  }
`;

export const WrapperFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

export const WrapperContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const WrapperBreadcrumb = styled.div`
  margin-bottom: 16px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #4cb551;
      
      &:hover {
        color: #45a349;
      }
    }
  }
`;

export const WrapperMainContent = styled.div`
  display: flex;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
`;

export const WrapperActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

export const WrapperTabs = styled(Tabs)`
  margin-top: 24px;
  padding: 0 24px;
  
  .ant-tabs-nav {
    margin-bottom: 16px;
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
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

// Container cho phần sản phẩm liên quan
export const RelatedProductsContainer = styled.div`
  padding: 16px 24px 24px;
  
  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 24px;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 3px;
      background: #4cb551;
      border-radius: 3px;
    }
  }
`;

// Grid hiển thị sản phẩm liên quan
export const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

// Card sản phẩm liên quan
export const RelatedProductCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  .card-image {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background: #f9f9f9;
    overflow: hidden;
    position: relative;
    
    img {
      max-height: 160px;
      max-width: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
    
    .discount-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #ff4d4f;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    
    &:hover img {
      transform: scale(1.05);
    }
  }
  
  .card-content {
    padding: 16px;
    
    .product-name {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      height: 48px;
    }
    
    .product-price {
      display: flex;
      align-items: baseline;
      margin-bottom: 8px;
      
      .discount-price {
        font-size: 18px;
        font-weight: 600;
        color: #ff4d4f;
      }
      
      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        margin-left: 8px;
      }
    }
    
    .product-rating {
      font-size: 12px;
    }
  }
`;

// Component hiển thị khi không có sản phẩm liên quan
export const NoRelatedProducts = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  .icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }
  
  .text {
    font-size: 16px;
    color: #666;
  }
`;

// Component hiển thị trong khi đang tải
export const LoadingRelatedProducts = styled.div`
  text-align: center;
  padding: 40px 0;
  
  .spin-icon {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  .text {
    font-size: 16px;
    color: #666;
  }
`;

// Button xem thêm
export const ViewMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 24px auto 0;
  padding: 8px 24px;
  background: white;
  color: #4cb551;
  border: 1px solid #4cb551;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f6fff7;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .icon {
    margin-left: 8px;
  }
`;
export const WrapperUploadFile = styled(Upload)`
  display: flex;
  align-items: center;
  
  .ant-upload-select {
    margin-right: 16px;
  }
  
  .ant-upload.ant-upload-select {
    margin-bottom: 0;
  }
  
  .ant-upload-list-item-info {
    display: none;
  }
  
  .ant-upload-list-item-name {
    display: none;
  }
  
  .ant-btn {
    border-color: #c41d7f;
    color: #c41d7f;
    
    &:hover {
      color: white;
      background-color: #c41d7f;
      border-color: #c41d7f;
    }
  }
`;
export const PrescriptionPreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    object-fit: contain;
    border: 1px solid #eee;
  }
`;