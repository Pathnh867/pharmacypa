import styled from "styled-components";

export const PageContainer = styled.div`
  background: #f5f5fa;
  width: 100%;
  min-height: 100vh;
  padding: 30px 0;
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const ResultCard = styled.div`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  .ant-result {
    padding: 48px 32px 24px;
  }
  
  .ant-result-title {
    font-size: 28px;
    line-height: 1.4;
  }
  
  .ant-result-subtitle {
    font-size: 16px;
    margin-top: 8px;
  }
`;

export const OrderSummary = styled.div`
  padding: 0 32px 32px;
  
  .ant-divider {
    font-size: 16px;
    color: #333;
    margin: 0 0 24px;
    
    .anticon {
      color: #4cb551;
    }
  }
`;

export const OrderInfo = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
`;

export const PaymentMethodTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  background: ${props => props.method === 'momo' ? '#d82d8b11' : '#108ee929'};
  color: ${props => props.method === 'momo' ? '#d82d8b' : '#1890ff'};
  border: 1px solid ${props => props.method === 'momo' ? '#d82d8b33' : '#1890ff33'};
`;

export const OrderDetailsList = styled.div`
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;

export const OrderDetailsItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  .item-info {
    display: flex;
    align-items: center;
    gap: 12px;
    
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    div {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
  }
`;

export const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
  font-size: 18px;
  font-weight: bold;
  
  span:last-child {
    color: #ff4d4f;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
  
  button {
    min-width: 150px;
  }
`;

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: 0;
  }
  
  .product-info {
    display: flex;
    align-items: center;
    
    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
      margin-right: 12px;
    }
    
    .product-details {
      h4 {
        margin: 0 0 4px;
        font-size: 16px;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  }
  
  .product-price {
    font-weight: 600;
    color: #ff4d4f;
  }
`;