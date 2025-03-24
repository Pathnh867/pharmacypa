// pharmacyai/src/components/AdminUser/style.js
import styled from 'styled-components';
import { Layout, Typography, Button, Card, Input, Select, Table, Tabs, Badge } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

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

// Các kích thước chung
export const sizes = {
  borderRadius: '8px',
  borderRadiusSmall: '4px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  boxShadowHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

// Component styles
export const AdminContainer = styled.div`
  min-height: 100vh;
  background: ${colors.background};
`;

export const AdminSider = styled(Sider)`
  height: 100vh;
  position: fixed;
  left: 0;
  overflow: auto;
  box-shadow: ${sizes.boxShadow};
  z-index: 10;
  
  .ant-menu {
    background-color: ${colors.dark};
  }
  
  .ant-menu-item-selected {
    background-color: ${colors.primary} !important;
    font-weight: 500;
  }
  
  .ant-menu-item:hover:not(.ant-menu-item-selected) {
    background-color: rgba(76, 181, 81, 0.1) !important;
    color: ${colors.primary} !important;
  }
  
  .ant-menu-item {
    height: 50px;
    display: flex;
    align-items: center;
    
    .anticon {
      font-size: 16px;
    }
  }
`;

export const AdminLogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  padding: 0 ${props => props.collapsed ? '0' : '24px'};
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  
  h4 {
    color: white !important;
    margin: 0;
  }
  
  .anticon {
    font-size: 24px;
    color: white;
  }
`;

export const AdminHeader = styled(Header)`
  background: ${colors.white};
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - ${props => props.collapsed ? '80px' : '250px'});
  transition: width 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .trigger {
    cursor: pointer;
    transition: color 0.3s;
    padding: 0 24px;
    font-size: 18px;
    
    &:hover {
      color: ${colors.primary};
    }
  }
`;

export const AdminTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${colors.dark};
`;

export const AdminHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-right: 24px;
`;

export const AdminContent = styled(Content)`
  margin: 64px 0 0 ${props => props.collapsed ? '80px' : '250px'};
  transition: margin 0.2s;
  padding: 24px;
  min-height: calc(100vh - 64px);
`;

export const AdminCard = styled(Card)`
  border-radius: ${sizes.borderRadius};
  box-shadow: ${sizes.boxShadow};
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: ${sizes.boxShadowHover};
  }
  
  .ant-card-head {
    border-bottom: 1px solid ${colors.border};
    background: ${colors.white};
    
    .ant-card-head-title {
      font-size: 16px;
      font-weight: 600;
      color: ${colors.textPrimary};
    }
  }
  
  .ant-card-body {
    padding: 24px;
  }
`;

export const AdminTable = styled(Table)`
  .ant-table {
    background: ${colors.white};
    border-radius: ${sizes.borderRadius};
  }
  
  .ant-table-thead > tr > th {
    background: ${colors.primaryLight};
    color: ${colors.textPrimary};
    font-weight: 600;
    padding: 12px 16px;
  }
  
  .ant-table-tbody > tr:hover > td {
    background: ${colors.primaryLight} !important;
  }
  
  .ant-table-row-selected > td {
    background: ${colors.primaryLight} !important;
  }
  
  .ant-pagination-item-active {
    border-color: ${colors.primary};
    
    a {
      color: ${colors.primary};
    }
  }
`;

export const AdminButton = styled(Button)`
  &.ant-btn-primary {
    background: ${colors.primary};
    border-color: ${colors.primary};
    
    &:hover, &:focus {
      background: ${colors.primaryDark};
      border-color: ${colors.primaryDark};
    }
  }
  
  &.ant-btn-default {
    &:hover, &:focus {
      color: ${colors.primary};
      border-color: ${colors.primary};
    }
  }
`;

export const AdminInput = styled(Input)`
  &:hover {
    border-color: ${colors.primary};
  }
  
  &:focus, &.ant-input-focused {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(76, 181, 81, 0.2);
  }
`;

export const AdminSelect = styled(Select)`
  &:hover .ant-select-selector {
    border-color: ${colors.primary} !important;
  }
  
  &.ant-select-focused .ant-select-selector {
    border-color: ${colors.primary} !important;
    box-shadow: 0 0 0 2px rgba(76, 181, 81, 0.2) !important;
  }
  
  .ant-select-item-option-selected {
    background-color: ${colors.primaryLight} !important;
  }
`;

export const AdminTabs = styled(Tabs)`
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${colors.primary};
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background-color: ${colors.primary};
  }
  
  .ant-tabs-tab:hover {
    color: ${colors.primary};
  }
`;

export const AdminBadge = styled(Badge)`
  .ant-badge-count {
    background: ${props => props.color || colors.primary};
  }
`;

export const AdminSectionTitle = styled.h3`
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

export const AdminSearchContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
  
  .search-item {
    flex: 1;
    min-width: 200px;
  }
  
  .search-actions {
    display: flex;
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    .search-item, .search-actions {
      width: 100%;
    }
  }
`;

export const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: ${colors.white};
  border-radius: ${sizes.borderRadius};
  box-shadow: ${sizes.boxShadow};
  transition: all 0.3s;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${sizes.boxShadowHover};
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  
  .user-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    text-align: center;
  }
  
  .user-email {
    font-size: 14px;
    color: ${colors.textSecondary};
    margin-bottom: 16px;
    text-align: center;
  }
  
  .user-role {
    margin-bottom: 16px;
  }
  
  .user-actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
`;

// Export các status tag với màu đã được xác định trước
export const statusColors = {
  pending: '#faad14',
  processing: '#1890ff',
  shipping: '#722ed1',
  delivered: '#52c41a',
  cancelled: '#ff4d4f',
  draft: '#bfbfbf',
  active: '#4cb551',
  inactive: '#f5222d',
};

export default {
  colors,
  sizes,
  AdminContainer,
  AdminSider,
  AdminLogoContainer,
  AdminHeader,
  AdminTitle,
  AdminHeaderActions,
  AdminContent,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminTabs,
  AdminBadge,
  AdminSectionTitle,
  AdminSearchContainer,
  UserCard,
  statusColors
};