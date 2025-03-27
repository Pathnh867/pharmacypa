// pharmacyai/src/components/RevenueManagement/style.js
import styled from 'styled-components';
import { Card, Button } from 'antd';

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
export const RevenueContainer = styled.div`
  width: 100%;
`;

export const RevenueHeader = styled.div`
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

export const RevenueSummary = styled.div`
  margin-bottom: 24px;
`;

export const RevenueStatCard = styled(Card)`
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
  
  .ant-statistic-content-prefix {
    margin-right: 8px;
  }
`;

export const ChartContainer = styled.div`
  height: 400px;
  padding: 16px 0;
`;

export const ExportButton = styled(Button)`
  background-color: ${colors.white};
  border-color: ${colors.primary};
  color: ${colors.primary};
  
  &:hover {
    background-color: ${colors.primaryLight};
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

// Media query for print
export const PrintableArea = styled.div`
  @media print {
    .ant-card {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ddd;
    }
    
    .no-print {
      display: none;
    }
    
    .page-break {
      page-break-after: always;
    }
  }
`;

export default {
  colors,
  RevenueContainer,
  RevenueHeader,
  RevenueSummary,
  RevenueStatCard,
  ChartContainer,
  ExportButton,
  PrintableArea
};