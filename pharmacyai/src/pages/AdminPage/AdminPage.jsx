import React, { useState } from 'react'
import { Layout, Menu, Typography, Avatar, Dropdown, Badge, Space } from 'antd'
import { UserOutlined, ProductOutlined, DashboardOutlined, 
  LogoutOutlined, BellOutlined, SettingOutlined, OrderedListOutlined,
  AppstoreOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { getItem } from '../../utils';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../redux/slide/userSlide';
import { WrapperHeader, WrapperContent, WrapperSider, WrapperHeaderAdmin, 
  HeaderLogo, HeaderActions, AdminTitle, NotificationBadge, ContentWrapper } from './style';

const { Content, Sider } = Layout;
const { Title } = Typography;

function AdminPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [keySelected, setKeySelected] = useState('dashboard');
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Menu items for sidebar
    const items = [
        getItem('Dashboard', 'dashboard', <DashboardOutlined />),
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <ProductOutlined />),
        getItem('Đơn hàng', 'order', <OrderedListOutlined />),
        getItem('Cài đặt', 'settings', <SettingOutlined />),
    ];

    // Notification menu items
    const notificationItems = [
        {
            label: 'Đơn hàng mới #1234',
            key: 'notification-1',
        },
        {
            label: 'Sản phẩm sắp hết hàng',
            key: 'notification-2',
        },
        {
            label: 'Bình luận mới cần duyệt',
            key: 'notification-3',
        },
        {
            type: 'divider',
        },
        {
            label: 'Xem tất cả thông báo',
            key: 'all-notifications',
        },
    ];

    // User profile menu items
    const userMenuItems = [
        {
            label: 'Thông tin tài khoản',
            key: 'profile',
            icon: <UserOutlined />,
        },
        {
            label: 'Cài đặt',
            key: 'settings',
            icon: <SettingOutlined />,
        },
        {
            type: 'divider',
        },
        {
            label: 'Đăng xuất',
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    // Toggle sidebar
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    // Handle menu click
    const handleOnClick = ({ key }) => {
        setKeySelected(key);
    };

    // Handle user menu click
    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleLogout();
        }
    };

    // Handle logout
    const handleLogout = () => {
        dispatch(resetUser());
        navigate('/sign-in');
    };

    // Render content based on selected key
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'dashboard':
                return (
                    <div style={{ padding: '24px' }}>
                        <Title level={4}>Dashboard</Title>
                        <p>Chào mừng đến với trang quản trị hệ thống Nhà thuốc Tiện lợi!</p>
                        <p>Sử dụng menu bên trái để điều hướng đến các phần quản lý khác nhau.</p>
                    </div>
                );
            default:
                return (
                    <div style={{ padding: '24px' }}>
                        <Title level={4}>Tính năng đang phát triển</Title>
                        <p>Chức năng này đang được phát triển và sẽ sớm được cập nhật.</p>
                    </div>
                );
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <WrapperSider 
                width={260} 
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                collapsible
                trigger={null}
            >
                <HeaderLogo collapsed={collapsed}>
                    {!collapsed ? (
                        <Title level={4} style={{ color: '#fff', margin: 0 }}>
                            <AppstoreOutlined /> Admin Portal
                        </Title>
                    ) : (
                        <AppstoreOutlined style={{ fontSize: '24px', color: '#fff' }} />
                    )}
                </HeaderLogo>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[keySelected]}
                    items={items}
                    onClick={handleOnClick}
                />
            </WrapperSider>
            <Layout>
                <WrapperHeaderAdmin>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {React.createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, 
                            { 
                                className: 'trigger', 
                                onClick: toggleCollapsed,
                                style: { fontSize: '18px', padding: '0 24px' }
                            }
                        )}
                        <AdminTitle>
                            {keySelected === 'dashboard' && 'Dashboard'}
                            {keySelected === 'user' && 'Quản lý người dùng'}
                            {keySelected === 'product' && 'Quản lý sản phẩm'}
                            {keySelected === 'order' && 'Quản lý đơn hàng'}
                            {keySelected === 'settings' && 'Cài đặt hệ thống'}
                        </AdminTitle>
                    </div>
                    <HeaderActions>
                        <Dropdown
                            menu={{ items: notificationItems }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <NotificationBadge>
                                <Badge count={3}>
                                    <BellOutlined style={{ fontSize: '18px' }} />
                                </Badge>
                            </NotificationBadge>
                        </Dropdown>
                        <Dropdown
                            menu={{ 
                                items: userMenuItems,
                                onClick: handleMenuClick
                            }}
                            placement="bottomRight"
                            arrow
                            trigger={['click']}
                        >
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar 
                                    src={user?.avatar} 
                                    icon={!user?.avatar && <UserOutlined />} 
                                    size="small"
                                    style={{ backgroundColor: '#4cb551' }}
                                />
                                <span style={{ marginLeft: '8px', display: collapsed ? 'none' : 'inline' }}>
                                    {user?.name || user?.email || 'Admin'}
                                </span>
                            </Space>
                        </Dropdown>
                    </HeaderActions>
                </WrapperHeaderAdmin>
                <ContentWrapper>
                    <WrapperContent>
                        {renderPage(keySelected)}
                    </WrapperContent>
                </ContentWrapper>
            </Layout>
        </Layout>
    );
}

export default AdminPage;