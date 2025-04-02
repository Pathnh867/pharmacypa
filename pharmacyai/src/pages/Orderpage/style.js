import styled from "styled-components";
import { InputNumber } from "antd";

// Layout container
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

export const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
`;

// Step indicators
export const StepIndicator = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const StepItem = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
  
  .step-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.active ? '#4cb551' : '#e0e0e0'};
    color: ${props => props.active ? '#fff' : '#999'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 2;
    transition: all 0.3s;
  }
  
  .step-content {
    margin-left: 12px;
  }
  
  .step-connector {
    position: absolute;
    height: 2px;
    background-color: #e0e0e0;
    top: 20px;
    left: 40px;
    right: 0;
    z-index: 1;
  }
  
  &:last-child .step-connector {
    display: none;
  }
`;

export const StepLabel = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #333;
`;

export const StepDescription = styled.div`
  font-size: 12px;
  color: #999;
  margin-top: 4px;
`;

// Cart components
export const EmptyCartMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  font-weight: 500;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  
  span {
    color: #333;
    font-size: 14px;
  }
`;

export const WrapperLeft = styled.div`
  width: 66%;
`;

export const WrapperListOrder = styled.div`
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  padding: 0;
  margin-bottom: 16px;
  
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

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  margin-top: 1px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  transition: all 0.2s;
  
  &:hover {
    background: #fafafa;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
    border-bottom: 1px solid #f0f0f0;
  }
`;

export const WrapperPriceDiscount = styled.div`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  transition: transform 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const ItemDetails = styled.div`
  padding-left: 8px;
  overflow: hidden;
`;

export const ItemName = styled.div`
  font-weight: 500;
  width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
`;

export const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 100px;
`;

export const OriginalPrice = styled.div`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
`;

export const DiscountedPrice = styled.div`
  color: #ff4d4f;
  font-size: 14px;
  font-weight: 500;
`;

export const ItemPrice = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
  text-align: right;
`;

export const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 100px;
  
  button {
    width: 30px;
    height: 30px;
    background: #fff;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #f5f5f5;
    }
    
    &:disabled {
      cursor: not-allowed;
      color: #ccc;
      
      &:hover {
        background: #fff;
      }
    }
  }
`;

export const DeleteButton = styled.button`
  border: none;
  background: transparent;
  color: #ff4d4f;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(255, 77, 79, 0.1);
    border-radius: 4px;
  }
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
    border: none;
    border-radius: 0;
    
    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`;

export const WrapperRight = styled.div`
  width: 32%;
`;

export const CartSummary = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

export const DeliveryInfo = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const UserAddressInfo = styled.div`
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
  
  div {
    margin-bottom: 8px;
    color: #666;
    
    strong {
      color: #333;
    }
  }
  
  div:last-child {
    margin-bottom: 0;
  }
`;

export const UpdateAddressButton = styled.button`
  background: transparent;
  border: none;
  color: #4cb551;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  
  &:hover {
    text-decoration: underline;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  font-size: 14px;
  color: #666;
`;

export const TotalAmount = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px 20px;
  background: #f8f8f8;
  color: #333;
  font-weight: 500;
  border-top: 1px dashed #e0e0e0;
  margin-top: 10px;
`;

export const TotalDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  span:first-child {
    font-size: 20px;
    font-weight: 700;
    color: #ff4d4f;
  }
  
  span:last-child {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

export const ActionButton = styled.button`
  width: calc(100% - 40px);
  padding: 14px;
  background: #4cb551;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 20px;
  transition: all 0.3s;
  
  &:hover {
    background: #3ca142;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

export const WrapperInfo = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const WrapperInfodiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const WrapperInfospan = styled.span`
  font-weight: 500;
  color: #333;
`;

export const WrapperTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;