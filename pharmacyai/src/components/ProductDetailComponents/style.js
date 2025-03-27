import styled from "styled-components";
import { Tabs } from "antd";

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