// pharmacyai/src/pages/AdminPage/AdminPage.jsx

import React, { useState, useEffect } from 'react'
import { Layout, Menu, Typography, Avatar, Dropdown, Badge, Space } from 'antd'
import { UserOutlined, ProductOutlined, DashboardOutlined, 
  LogoutOutlined, BellOutlined, SettingOutlined, OrderedListOutlined,
  AppstoreOutlined, MenuFoldOutlined, MenuUnfoldOutlined, BarChartOutlined,
  ShoppingOutlined, TeamOutlined, NotificationOutlined, HomeOutlined,
  DollarOutlined, FileTextOutlined, FileProtectOutlined } from '@ant-design/icons'
import { getItem } from '../../utils';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminPrescription from '../../components/AdminPrescription/AdminPrescription';
import RevenueManagement from '../../components/RevenueManagement/RevenueManagement';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetUser } from '../../redux/slide/userSlide';
import Dashboard from '../../components/Dashboard/Dashboard';

// Import style mới
import {
  AdminContainer,
  AdminSider,
  AdminLogoContainer,
  AdminHeader,
  AdminTitle,
  AdminHeaderActions,
  AdminContent,
  AdminBadge,
  colors
} from './style';

const { Title } = Typography;

function AdminPage() {
    const [collapsed, setCollapsed] = useState(false);
    const [keySelected, setKeySelected] = useState('dashboard');
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Kiểm tra nếu người dùng không phải là admin, chuyển hướng về trang chủ
    useEffect(() => {
      if (!user?.isAdmin) {
        navigate('/');
      }
    }, [user, navigate]);

    // Menu items for sidebar
    const items = [
        getItem('Dashboard', 'dashboard', <DashboardOutlined />),
        getItem('Người dùng', 'user', <TeamOutlined />),
        getItem('Sản phẩm', 'product', <ProductOutlined />),
        getItem('Đơn hàng', 'order', <ShoppingOutlined />),
        getItem('Đơn thuốc', 'prescription', <FileTextOutlined />),
        getItem('Báo cáo doanh thu', 'revenue', <DollarOutlined />),
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
            label: 'Về trang chủ',
            key: 'home',
            icon: <HomeOutlined />,
            onClick: () => navigate('/')
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
        } else if (key === 'profile') {
            navigate('/profile-user');
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
            case 'order':
                return <AdminOrder />;
            case 'prescription':
                return <AdminPrescription />;
            case 'revenue':
                return <RevenueManagement />;
            case 'dashboard':
            default:
                return (
                    <Dashboard />
                );
        }
    };

    return (
        <AdminContainer>
            <Layout style={{ minHeight: '100vh' }}>
                <AdminSider 
                    width={250} 
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    collapsible
                    trigger={null}
                    theme="dark"
                >
                    <AdminLogoContainer collapsed={collapsed}>
                        {!collapsed ? (
                            <Title level={4} style={{ color: '#fff', margin: 0 }}>
                                <AppstoreOutlined /> Admin Portal
                            </Title>
                        ) : (
                            <AppstoreOutlined style={{ fontSize: '24px', color: '#fff' }} />
                        )}
                    </AdminLogoContainer>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['dashboard']}
                        selectedKeys={[keySelected]}
                        items={items}
                        onClick={handleOnClick}
                    />
                </AdminSider>
                <Layout>
                    <AdminHeader collapsed={collapsed}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {React.createElement(
                                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, 
                                { 
                                    className: 'trigger', 
                                    onClick: toggleCollapsed,
                                }
                            )}
                            <AdminTitle>
                                {keySelected === 'dashboard' && 'Dashboard'}
                                {keySelected === 'user' && 'Quản lý người dùng'}
                                {keySelected === 'product' && 'Quản lý sản phẩm'}
                                {keySelected === 'order' && 'Quản lý đơn hàng'}
                                {keySelected === 'revenue' && 'Báo cáo doanh thu'}
                                {keySelected === 'settings' && 'Cài đặt hệ thống'}
                            </AdminTitle>
                        </div>
                        <AdminHeaderActions>
                            <Dropdown
                                menu={{ items: notificationItems }}
                                placement="bottomRight"
                                arrow
                                trigger={['click']}
                            >
                                <div style={{ cursor: 'pointer', padding: '0 8px' }}>
                                    <AdminBadge count={3}>
                                        <NotificationOutlined style={{ fontSize: '18px' }} />
                                    </AdminBadge>
                                </div>
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
                                        style={{ backgroundColor: colors.primary }}
                                    />
                                    <span style={{ marginLeft: '8px', display: collapsed ? 'none' : 'inline' }}>
                                        {user?.name || user?.email || 'Admin'}
                                    </span>
                                </Space>
                            </Dropdown>
                        </AdminHeaderActions>
                    </AdminHeader>
                    <AdminContent collapsed={collapsed}>
                        {renderPage(keySelected)}
                    </AdminContent>
                </Layout>
            </Layout>
        </AdminContainer>
    );
}

export default AdminPage