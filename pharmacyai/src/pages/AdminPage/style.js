import styled from 'styled-components';
import { Layout } from 'antd';

const { Header, Content, Sider } = Layout;

export const WrapperHeader = styled(Header)`
    background-color: #4cb551;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 20px;
`;

export const WrapperContent = styled.div`
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-height: 100%;
    overflow: hidden;
`;

export const WrapperSider = styled(Sider)`
    height: 100vh;
    overflow: auto;
    position: fixed;
    left: 0;
    z-index: 10;
    
    .ant-layout-sider-children {
        display: flex;
        flex-direction: column;
    }
    
    .ant-menu {
        flex: 1;
        padding: 12px 0;
    }
    
    .ant-menu-item {
        height: 50px;
        display: flex;
        align-items: center;
        margin: 4px 0;
        padding: 0 24px !important;
        
        .anticon {
            font-size: 16px;
        }
    }
    
    .ant-menu-item-selected {
        background-color: #4cb551 !important;
    }
    
    &.ant-layout-sider-collapsed {
        .ant-menu-item {
            padding: 0 calc(50% - 16px) !important;
        }
    }
`;

export const WrapperHeaderAdmin = styled(Header)`
    background: #fff;
    padding: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - ${props => props.collapsed ? '80px' : '260px'});
    transition: width 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .trigger {
        cursor: pointer;
        transition: color 0.3s;
        
        &:hover {
            color: #4cb551;
        }
    }
`;

export const HeaderLogo = styled.div`
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
    padding: 0 ${props => props.collapsed ? '0' : '24px'};
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding-right: 24px;
`;

export const AdminTitle = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 500;
`;

export const NotificationBadge = styled.div`
    padding: 0 8px;
    cursor: pointer;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.03);
    }
`;

export const ContentWrapper = styled(Content)`
    margin: 64px 0 0 ${props => props.collapsed ? '80px' : '260px'};
    transition: margin 0.2s;
    padding: 24px;
    background: #f5f5f5;
    min-height: calc(100vh - 64px);
`;