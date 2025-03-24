// pharmacyai/src/components/Dashboard/style.js
import styled from 'styled-components';
import { Card, Typography } from 'antd';

// Các màu chính (đồng bộ với style trong các component khác)
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
export const DashboardContainer = styled.div`
  width: 100%;
`;

export const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    .ant-space {
      margin-top: 16px;
    }
  }
`;

export const StatCard = styled(Card)`
  .ant-card-body {
    padding: 16px;
  }
  
  .ant-statistic-title {
    font-size: 14px;
    color: ${colors.textSecondary};
  }
  
  .ant-statistic-content {
    color: ${props => props.color || colors.primary};
  }
`;

export const OrderStatusStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

export const StatusIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
  font-size: 18px;
  background-color: ${props => {
    switch (props.type) {
      case 'pending':
        return colors.warning;
      case 'delivered':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.info;
    }
  }};
`;

export const StatusContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatusTitle = styled.div`
  font-size: 12px;
  color: ${colors.textSecondary};
`;

export const StatusValue = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

export const ChartContainer = styled.div`
  height: 300px;
`;

export const InventorySummary = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InventoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
  }
`;

export const InventoryLabel = styled.div`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
`;

export default {
  colors,
  DashboardContainer,
  DashboardHeader,
  StatCard,
  OrderStatusStats,
  StatusItem,
  StatusIcon,
  StatusContent,
  StatusTitle,
  StatusValue,
  ChartContainer,
  InventorySummary,
  InventoryItem,
  InventoryLabel
};