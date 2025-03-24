// Tạo file pharmacyai/src/components/AdminOrder/style.js

import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
    position: relative;
    
    &:after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 50px;
        height: 3px;
        background-color: #4cb551;
    }
`;

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    margin-right: 16px;
    border-radius: 4px;
    overflow: hidden;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .item-info {
    flex: 1;
    
    .item-name {
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .item-price {
      color: #666;
      font-size: 14px;
    }
  }
`;

export const OrderItemsList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const StatusBadge = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &.pending {
    background-color: #fff7e6;
    color: #faad14;
    border: 1px solid #ffd591;
  }
  
  &.processing {
    background-color: #e6f7ff;
    color: #1890ff;
    border: 1px solid #91d5ff;
  }
  
  &.shipping {
    background-color: #f9f0ff;
    color: #722ed1;
    border: 1px solid #d3adf7;
  }
  
  &.delivered {
    background-color: #f6ffed;
    color: #52c41a;
    border: 1px solid #b7eb8f;
  }
  
  &.cancelled {
    background-color: #fff1f0;
    color: #ff4d4f;
    border: 1px solid #ffa39e;
  }
`;

export const StatsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  .stats-title {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .stats-value {
    font-size: 24px;
    font-weight: 700;
  }
  
  .stats-icon {
    margin-bottom: 12px;
    font-size: 24px;
  }
  
  &.total .stats-icon {
    color: #1890ff;
  }
  
  &.pending .stats-icon {
    color: #faad14;
  }
  
  &.processing .stats-icon {
    color: #1890ff;
  }
  
  &.shipping .stats-icon {
    color: #722ed1;
  }
  
  &.delivered .stats-icon {
    color: #52c41a;
  }
  
  &.cancelled .stats-icon {
    color: #ff4d4f;
  }
`;

export const TimelineContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 16px;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export const OrderSummary = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #f0f0f0;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
      padding-top: 8px;
      border-top: 1px solid #f0f0f0;
      font-weight: 700;
      
      span:last-child {
        color: #ff4d4f;
        font-size: 18px;
      }
    }
  }
`;