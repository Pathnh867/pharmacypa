// pharmacyai/src/components/AdminOrder/style.js
import styled from 'styled-components';
import { Card, Timeline, Typography } from 'antd';

const { Text } = Typography;

// Các màu chính
export const colors = {
  primary: '#4cb551', // Màu chủ đạo
  primaryLight: '#e8f5e9', // Màu chủ đạo nhạt
  primaryDark: '#3ca142', // Màu chủ đạo đậm
  secondary: '#1890ff', // Màu phụ
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
  dark: '#333333',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#e8e8e8',
  borderDark: '#d9d9d9',
  background: '#f5f5f5',
  backgroundDark: '#f0f0f0',
  white: '#ffffff',
  black: '#000000',
};

// Component styles
export const WrapperHeader = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background-color: ${colors.primary};
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

export const OrderItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.border};
  
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
      color: ${colors.textPrimary};
    }
    
    .item-price {
      color: ${colors.textSecondary};
      font-size: 14px;
    }
  }
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: ${props => 
    props.status === 'pending' ? colors.warning + '20' :
    props.status === 'processing' ? colors.info + '20' :
    props.status === 'shipping' ? '#722ed1' + '20' :
    props.status === 'delivered' ? colors.success + '20' :
    props.status === 'cancelled' ? colors.error + '20' : 
    colors.border};
  color: ${props => 
    props.status === 'pending' ? colors.warning :
    props.status === 'processing' ? colors.info :
    props.status === 'shipping' ? '#722ed1' :
    props.status === 'delivered' ? colors.success :
    props.status === 'cancelled' ? colors.error : 
    colors.textSecondary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  .anticon {
    margin-right: 4px;
  }
`;

export const StatsCard = styled(Card)`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  
  .ant-statistic-title {
    font-size: 14px;
    color: ${colors.textSecondary};
  }
  
  .ant-statistic-content {
    color: ${props => props.color || colors.primary};
  }
  
  .ant-statistic-content-value {
    font-weight: 600;
  }
`;

export const TimelineContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  .ant-timeline-item-content {
    padding-bottom: 20px;
  }
`;

export const OrderSummary = styled.div`
  margin-top: 24px;
  border-top: 1px dashed ${colors.border};
  padding-top: 16px;
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    &:last-child {
      margin-top: 16px;
      font-weight: 700;
      font-size: 16px;
      border-top: 1px solid ${colors.border};
      padding-top: 16px;
    }
  }
`;

export default {
  colors,
  WrapperHeader,
  OrderItemsList,
  OrderItem,
  StatusBadge,
  StatsCard,
  TimelineContainer,
  OrderSummary
};