// pharmacyai/src/components/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  Progress, 
  Divider, 
  Typography, 
  DatePicker, 
  Space, 
  Select
} from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  DollarOutlined, 
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import * as UserService from '../../services/UserService';
import * as ProductService from '../../services/ProductService';
import { convertPrice } from '../../utils';
import moment from 'moment';

// Import styles
import {
  AdminSectionTitle
} from '../AdminUser/style';

// Import styled components
import {
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
} from './style';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0,
    totalRevenue: 0,
    orderGrowth: 0,
    revenueGrowth: 0
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    growth: 0
  });
  const [productStats, setProductStats] = useState({
    total: 0,
    outOfStock: 0,
    lowStock: 0
  });
  
  const user = useSelector((state) => state.user);
  
  // Queries
  const ordersQuery = useQuery({
    queryKey: ['dashboard-orders'],
    queryFn: () => OrderService.getAllOrders(user?.access_token, 100, 0),
    enabled: !!user?.access_token
  });
  
  const usersQuery = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => UserService.getAllUser(user?.access_token),
    enabled: !!user?.access_token
  });
  
  const productsQuery = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: () => ProductService.getAllProduct('', 100),
    enabled: !!user?.access_token
  });
  
  // Process data and calculate stats
  useEffect(() => {
    if (ordersQuery.data?.data) {
      const allOrders = ordersQuery.data.data;
      
      // Filter orders by date range
      const filteredOrders = allOrders.filter(order => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(dateRange[0], dateRange[1], null, '[]');
      });
      
      // Calculate current period stats
      const totalOrders = filteredOrders.length;
      const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered').length;
      const pendingOrders = filteredOrders.filter(order => ['pending', 'processing', 'shipping'].includes(order.status)).length;
      const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled').length;
      const totalRevenue = filteredOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      
      // Calculate previous period for comparison
      const currentStart = dateRange[0];
      const currentEnd = dateRange[1];
      const periodDuration = currentEnd.diff(currentStart, 'days');
      
      const prevStart = moment(currentStart).subtract(periodDuration + 1, 'days');
      const prevEnd = moment(currentEnd).subtract(periodDuration + 1, 'days');
      
      const prevPeriodOrders = allOrders.filter(order => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(prevStart, prevEnd, null, '[]');
      });
      
      const prevTotalOrders = prevPeriodOrders.length;
      const prevTotalRevenue = prevPeriodOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      
      // Calculate growth rates
      const orderGrowth = prevTotalOrders === 0 
        ? (totalOrders === 0 ? 0 : 100) 
        : ((totalOrders - prevTotalOrders) / prevTotalOrders * 100);
      
      const revenueGrowth = prevTotalRevenue === 0 
        ? (totalRevenue === 0 ? 0 : 100) 
        : ((totalRevenue - prevTotalRevenue) / prevTotalRevenue * 100);
      
      setOrderStats({
        total: totalOrders,
        delivered: deliveredOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
        totalRevenue,
        orderGrowth,
        revenueGrowth
      });
    }
  }, [ordersQuery.data, dateRange]);
  
  // Process user stats
  useEffect(() => {
    if (usersQuery.data?.data) {
      const users = usersQuery.data.data;
      
      // Current count
      const totalUsers = users.length;
      const activeUsers = users.filter(user => user.active).length;
      
      // Calculate recent growth (past 30 days)
      const last30Days = moment().subtract(30, 'days');
      const newUsers = users.filter(user => moment(user.createdAt).isAfter(last30Days)).length;
      const userGrowth = (newUsers / totalUsers) * 100;
      
      setUserStats({
        total: totalUsers,
        active: activeUsers,
        growth: userGrowth
      });
    }
  }, [usersQuery.data]);
  
  // Process product stats
  useEffect(() => {
    if (productsQuery.data?.data) {
      const products = productsQuery.data.data;
      
      const totalProducts = products.length;
      const outOfStockProducts = products.filter(product => product.countInStock === 0).length;
      const lowStockProducts = products.filter(product => product.countInStock > 0 && product.countInStock <= 5).length;
      
      setProductStats({
        total: totalProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts
      });
    }
  }, [productsQuery.data]);
  
  // Handle time range change
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    
    switch (value) {
      case 'week':
        setDateRange([moment().startOf('week'), moment().endOf('week')]);
        break;
      case 'month':
        setDateRange([moment().startOf('month'), moment().endOf('month')]);
        break;
      case 'quarter':
        setDateRange([moment().startOf('quarter'), moment().endOf('quarter')]);
        break;
      case 'year':
        setDateRange([moment().startOf('year'), moment().endOf('year')]);
        break;
      default:
        setDateRange([moment().startOf('month'), moment().endOf('month')]);
    }
  };
  
  // Handle custom date range
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      setTimeRange('custom');
    }
  };
  
  // Prepare data for sales trend chart
  const prepareSalesTrendData = () => {
    if (!ordersQuery.data?.data) return [];
    
    const orders = ordersQuery.data.data;
    const filteredOrders = orders.filter(order => 
      moment(order.createdAt).isBetween(dateRange[0], dateRange[1], null, '[]') &&
      order.status === 'delivered'
    );
    
    // Group by date
    const groupedByDate = {};
    filteredOrders.forEach(order => {
      const date = moment(order.createdAt).format('YYYY-MM-DD');
      if (!groupedByDate[date]) {
        groupedByDate[date] = { sales: 0, orders: 0 };
      }
      groupedByDate[date].sales += order.totalPrice;
      groupedByDate[date].orders += 1;
    });
    
    // Convert to array for chart
    return Object.keys(groupedByDate).map(date => ({
      date,
      sales: groupedByDate[date].sales,
      orders: groupedByDate[date].orders
    })).sort((a, b) => moment(a.date).diff(moment(b.date)));
  };
  
  // Prepare data for order status distribution chart
  const prepareOrderStatusData = () => {
    if (!ordersQuery.data?.data) return [];
    
    const orders = ordersQuery.data.data;
    const filteredOrders = orders.filter(order => 
      moment(order.createdAt).isBetween(dateRange[0], dateRange[1], null, '[]')
    );
    
    // Count by status
    const counts = {
      pending: 0,
      processing: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0
    };
    
    filteredOrders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    
    // Convert to array for chart with labels
    return [
      { type: 'Chờ xử lý', value: counts.pending, color: '#faad14' },
      { type: 'Đang xử lý', value: counts.processing, color: '#1890ff' },
      { type: 'Đang giao hàng', value: counts.shipping, color: '#722ed1' },
      { type: 'Đã giao hàng', value: counts.delivered, color: '#52c41a' },
      { type: 'Đã hủy', value: counts.cancelled, color: '#ff4d4f' },
    ].filter(item => item.value > 0);
  };
  
  // Prepare data for top selling products
  const prepareTopSellingProducts = () => {
    if (!ordersQuery.data?.data || !productsQuery.data?.data) return [];
    
    const orders = ordersQuery.data.data;
    const products = productsQuery.data.data;
    
    const filteredOrders = orders.filter(order => 
      moment(order.createdAt).isBetween(dateRange[0], dateRange[1], null, '[]') &&
      order.status === 'delivered'
    );
    
    // Count product sales
    const productSales = {};
    filteredOrders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          if (!productSales[item.product]) {
            productSales[item.product] = {
              productId: item.product,
              name: item.name,
              quantity: 0,
              revenue: 0
            };
          }
          productSales[item.product].quantity += item.amount;
          productSales[item.product].revenue += item.price * item.amount;
        });
      }
    });
    
    // Convert to array and sort by revenue
    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };
  
  // Prepare recent orders for table
  const prepareRecentOrders = () => {
    if (!ordersQuery.data?.data) return [];
    
    return ordersQuery.data.data
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(order => ({
        ...order,
        key: order._id
      }));
  };
  
  // Chart configurations
  const salesTrendConfig = {
    data: prepareSalesTrendData(),
    xField: 'date',
    yField: 'sales',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: '#4cb551',
    tooltip: {
      formatter: (datum) => {
        return { name: 'Doanh thu', value: convertPrice(datum.sales) };
      },
    },
    xAxis: {
      label: {
        formatter: (text) => {
          return moment(text).format('DD/MM');
        },
      },
    },
  };
  
  const orderStatusConfig = {
    data: prepareOrderStatusData(),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.64,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '18px',
        },
        formatter: () => 'Đơn hàng',
      },
    },
    legend: {
      position: 'bottom',
    },
    colors: ['#faad14', '#1890ff', '#722ed1', '#52c41a', '#ff4d4f']
  };
  
  // Recent orders columns
  const recentOrderColumns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      render: id => <a>{id.slice(-8).toUpperCase()}</a>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'shippingAddress',
      key: 'customer',
      render: shippingAddress => shippingAddress?.fullName || 'Không có tên',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: date => moment(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: price => convertPrice(price),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        let color = 'default';
        let text = 'Không xác định';
        
        switch (status) {
          case 'pending':
            color = 'warning';
            text = 'Chờ xử lý';
            break;
          case 'processing':
            color = 'processing';
            text = 'Đang xử lý';
            break;
          case 'shipping':
            color = 'purple';
            text = 'Đang giao hàng';
            break;
          case 'delivered':
            color = 'success';
            text = 'Đã giao hàng';
            break;
          case 'cancelled':
            color = 'error';
            text = 'Đã hủy';
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];
  
  // Top selling products columns
  const topProductsColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: revenue => convertPrice(revenue),
    },
  ];
  
  // Loading state
  const isLoading = ordersQuery.isLoading || usersQuery.isLoading || productsQuery.isLoading;
  
  return (
    <DashboardContainer>
      <DashboardHeader>
        <AdminSectionTitle>Dashboard</AdminSectionTitle>
        <Space>
          <Select 
            value={timeRange} 
            onChange={handleTimeRangeChange}
            style={{ width: 120 }}
          >
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="quarter">Quý này</Option>
            <Option value="year">Năm nay</Option>
            <Option value="custom">Tùy chỉnh</Option>
          </Select>
          <RangePicker 
            value={dateRange} 
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
          />
        </Space>
      </DashboardHeader>
      
      {/* Thống kê tổng quan */}
      <Row gutter={16} className="stats-cards">
        <Col xs={24} sm={12} md={6}>
          <StatCard loading={isLoading}>
            <Statistic
              title="Tổng đơn hàng"
              value={orderStats.total}
              prefix={<ShoppingCartOutlined />}
              suffix={
                <Text 
                  type={orderStats.orderGrowth >= 0 ? "success" : "danger"}
                  style={{ fontSize: '14px' }}
                >
                  {orderStats.orderGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(orderStats.orderGrowth).toFixed(1)}%
                </Text>
              }
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard loading={isLoading}>
            <Statistic
              title="Doanh thu"
              value={orderStats.totalRevenue}
              precision={0}
              formatter={value => `${value.toLocaleString('vi-VN')}đ`}
              prefix={<DollarOutlined />}
              suffix={
                <Text 
                  type={orderStats.revenueGrowth >= 0 ? "success" : "danger"}
                  style={{ fontSize: '14px' }}
                >
                  {orderStats.revenueGrowth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(orderStats.revenueGrowth).toFixed(1)}%
                </Text>
              }
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard loading={isLoading}>
            <Statistic
              title="Tổng khách hàng"
              value={userStats.total}
              prefix={<UserOutlined />}
              suffix={
                <Text 
                  type={userStats.growth >= 0 ? "success" : "danger"}
                  style={{ fontSize: '14px' }}
                >
                  {userStats.growth >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(userStats.growth).toFixed(1)}%
                </Text>
              }
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard loading={isLoading}>
            <Statistic
              title="Tổng sản phẩm"
              value={productStats.total}
              prefix={<ShoppingOutlined />}
              suffix={
                productStats.outOfStock > 0 ? (
                  <Text type="danger" style={{ fontSize: '14px' }}>
                    {productStats.outOfStock} hết hàng
                  </Text>
                ) : null
              }
            />
          </StatCard>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card 
            title="Trạng thái đơn hàng" 
            loading={isLoading}
          >
            <OrderStatusStats>
              <StatusItem>
                <StatusIcon type="pending">
                  <ClockCircleOutlined />
                </StatusIcon>
                <StatusContent>
                  <StatusTitle>Chờ xử lý</StatusTitle>
                  <StatusValue>{orderStats.pending}</StatusValue>
                </StatusContent>
              </StatusItem>
              <StatusItem>
                <StatusIcon type="delivered">
                  <CheckCircleOutlined />
                </StatusIcon>
                <StatusContent>
                  <StatusTitle>Đã giao</StatusTitle>
                  <StatusValue>{orderStats.delivered}</StatusValue>
                </StatusContent>
              </StatusItem>
              <StatusItem>
                <StatusIcon type="cancelled">
                  <CloseCircleOutlined />
                </StatusIcon>
                <StatusContent>
                  <StatusTitle>Đã hủy</StatusTitle>
                  <StatusValue>{orderStats.cancelled}</StatusValue>
                </StatusContent>
              </StatusItem>
            </OrderStatusStats>
            <Divider style={{ margin: '12px 0' }} />
            <ChartContainer>
              <Pie {...orderStatusConfig} />
            </ChartContainer>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Xu hướng doanh thu" loading={isLoading}>
            <Line {...salesTrendConfig} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Đơn hàng gần đây" loading={isLoading}>
            <Table 
              columns={recentOrderColumns} 
              dataSource={prepareRecentOrders()} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Sản phẩm bán chạy" loading={isLoading}>
            <Table 
              columns={topProductsColumns} 
              dataSource={prepareTopSellingProducts()} 
              pagination={false} 
              size="small"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24}>
          <Card title="Tồn kho sản phẩm" loading={isLoading}>
            <InventorySummary>
              <InventoryItem>
                <Progress 
                  type="circle" 
                  percent={100 - (productStats.outOfStock / productStats.total * 100)} 
                  format={() => `${productStats.total - productStats.outOfStock}/${productStats.total}`} 
                  width={80}
                  strokeColor="#4cb551"
                />
                <InventoryLabel>Còn hàng</InventoryLabel>
              </InventoryItem>
              <InventoryItem>
                <Progress 
                  type="circle" 
                  percent={(productStats.lowStock / productStats.total * 100)} 
                  format={() => productStats.lowStock} 
                  width={80}
                  strokeColor="#faad14"
                />
                <InventoryLabel>Sắp hết</InventoryLabel>
              </InventoryItem>
              <InventoryItem>
                <Progress 
                  type="circle" 
                  percent={(productStats.outOfStock / productStats.total * 100)} 
                  format={() => productStats.outOfStock} 
                  width={80}
                  strokeColor="#ff4d4f"
                />
                <InventoryLabel>Hết hàng</InventoryLabel>
              </InventoryItem>
            </InventorySummary>
          </Card>
        </Col>
      </Row>
    </DashboardContainer>
  );
};

export default Dashboard;