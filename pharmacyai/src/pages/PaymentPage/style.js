import styled from "styled-components";
import { Radio } from "antd";

export const PageContainer = styled.div`
  background: #f5f5fa;
  width: 100%;
  min-height: 100vh;
  padding: 20px 0;
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
`;

export const WrapperStyleHeader = styled.div`
  background: rgb(255,255,255);
  padding: 9px 16px;
  border-radius: 4px;
  align-items: center;
  display: flex;
  span {
    color: rgb(36, 36,36);
    font-weight: 400;
    font-size: 13px;
  };
`;

export const WrapperLeft = styled.div`
  flex: 1;
  max-width: 65%;
`;

export const WrapperListOrder = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  margin-top: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  }
`;

export const WrapperPriceDiscount = styled.div`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const WrapperRight = styled.div`
  width: 32%;
  display: flex;
  flex-direction: column;
`;

export const WrapperInfo = styled.div`
  padding: 20px;
  background: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const DeliveryInfo = styled.div`
  padding-bottom: 10px;
  
  strong {
    color: #333;
  }
  
  div {
    line-height: 1.6;
  }
`;

export const OrderItemsList = styled.div`
  margin-top: 10px;
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
    background: #888;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px;
  background: #fff;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border-top: 1px dashed #eaeaea;
`;

export const WrapperInfodiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #666;
`;

export const WrapperInfospan = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

export const OrderSummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
`;

export const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  display: block;
`;

export const WrapperRadio = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .ant-radio-wrapper {
    font-size: 14px;
    font-weight: 400;
    color: #666;
    padding-left: 10px;
    display: flex;
    align-items: center;
  }
  
  .ant-radio-wrapper:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
  
  .ant-radio-checked .ant-radio-inner {
    border-color: #4cb551;
    background-color: #4cb551;
  }
`;

export const PaymentMethodCard = styled.div`
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${props => props.isSelected ? '#4cb551' : '#e5e5e5'};
  background-color: ${props => props.isSelected ? 'rgba(76, 181, 81, 0.05)' : '#fff'};
  margin-bottom: 12px;
  transition: all 0.3s;
  
  &:hover {
    border-color: #4cb551;
    box-shadow: 0 2px 8px rgba(76, 181, 81, 0.15);
  }
  
  .ant-radio-wrapper {
    padding: 0;
    width: 100%;
  }
`;

export const PaymentIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-right: 12px;
  border-radius: 4px;
`;

export const PaymentMethodTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

export const PaymentMethodDesc = styled.div`
  font-size: 13px;
  color: #888;
`;

export const MethodContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

// Additional styles for enhanced UI

export const PaymentOptionsContainer = styled.div`
  margin-top: 16px;
`;

export const StepsContainer = styled.div`
  margin-bottom: 24px;
`;

export const ActionButton = styled.button`
  background: #4cb551;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 20px;
  
  &:hover {
    background: #3ca142;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

export const InfoAlert = styled.div`
  padding: 12px 16px;
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 4px;
  margin-top: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  
  .alert-icon {
    color: #1890ff;
    margin-right: 12px;
    font-size: 16px;
    margin-top: 2px;
  }
  
  .alert-content {
    flex: 1;
    
    .alert-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .alert-description {
      color: #666;
      font-size: 13px;
    }
  }
`;

export const LoadingText = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

export const ProductImage = styled.img`
  width: 77px;
  height: 79px;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const ProductInfo = styled.div`
  width: 260px;
  overflow: hidden;
  
  .product-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-quantity {
    color: #666;
    font-size: 13px;
    margin-top: 4px;
  }
`;

export const ProductPrice = styled.span`
  color: rgb(255, 66, 78);
  font-size: 14px;
  font-weight: 500;
`;

export const TotalPriceHighlight = styled.span`
  color: rgb(254, 56, 52);
  font-size: 24px;
  font-weight: bold;
`;

export const TotalPriceNote = styled.span`
  color: #000;
  font-size: 11px;
`;

export const ChangeButton = styled.button`
  background: none;
  border: none;
  color: #4cb551;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const ShippingInfoRow = styled.div`
  margin-bottom: 5px;
  display: flex;
  
  strong {
    margin-right: 4px;
    min-width: 100px;
  }
`;

export const RequiredNote = styled.div`
  margin-bottom: 15px;
  color: #ff4d4f;
  font-size: 13px;
`;

export const FormSection = styled.div`
  margin-bottom: 16px;
`;