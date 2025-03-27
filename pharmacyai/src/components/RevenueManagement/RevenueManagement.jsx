// pharmacyai/src/components/RevenueManagement/RevenueManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  DatePicker, 
  Button, 
  Space, 
  Statistic, 
  Row, 
  Col, 
  Select, 
  Tag, 
  Typography, 
  Tabs, 
  Divider, 
  message
} from 'antd';
import { 
  DownloadOutlined, 
  DollarOutlined, 
  BarChartOutlined, 
  PieChartOutlined, 
  CalendarOutlined,
  FilterOutlined,
  ReloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/plots';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/OrderService';
import * as ProductService from '../../services/ProductService';
import * as RevenueService from '../../services/RevenueService';
import moment from 'moment';
import { convertPrice } from '../../utils';

// Import styling
import {
  AdminSectionTitle,
  AdminCard,
  AdminButton,
  AdminSelect,
  AdminSearchContainer
} from '../AdminUser/style';

// Import RevenueManagement specific styling
import {
  RevenueContainer,
  RevenueHeader,
  RevenueSummary,
  RevenueStatCard,
  ChartContainer,
  ExportButton
} from './style';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const RevenueManagement = () => {
  // State variables
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);
  const [timeUnit, setTimeUnit] = useState('day');
  const [reportType, setReportType] = useState('revenue');
  const [salesData, setSalesData] = useState([]);
  const [productSalesData, setProductSalesData] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState([]);
  const [revenueSummary, setRevenueSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    completionRate: 0
  });
  
  const user = useSelector((state) => state.user);
  
  // Query hooks for fetching data
  const ordersQuery = useQuery({
    queryKey: ['revenue-orders'],
    queryFn: () => OrderService.getAllOrders(user?.access_token, 1000, 0),
    enabled: !!user?.access_token
  });
  
  const productsQuery = useQuery({
    queryKey: ['revenue-products'],
    queryFn: () => ProductService.getAllProduct('', 1000),
    enabled: !!user?.access_token
  });
  
  const typesQuery = useQuery({
    queryKey: ['revenue-types'],
    queryFn: ProductService.getAllTypeProduct,
    enabled: !!user?.access_token
  });
  
  // Fetch data from API
  const fetchData = async () => {
    try {
      // Fetch revenue stats
      const revenueResponse = await RevenueService.getRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1]
      );
      
      if (revenueResponse?.status === 'OK' && revenueResponse?.data) {
        const data = revenueResponse.data;
        
        // Set revenue summary
        setRevenueSummary({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          averageOrderValue: data.averageOrderValue || 0,
          completionRate: data.totalOrders > 0 ? (data.totalDeliveredOrders / data.totalOrders * 100) : 0
        });
        
        // Process time series data based on timeUnit
        processTimeSeriesData(data.dailyRevenue || []);
      }
      
      // Fetch product stats
      const productResponse = await RevenueService.getProductRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1],
        10 // Limit to top 10
      );
      
      if (productResponse?.status === 'OK' && productResponse?.data) {
        setProductSalesData(productResponse.data || []);
      }
      
      // Fetch category stats
      const categoryResponse = await RevenueService.getCategoryRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1]
      );
      
      if (categoryResponse?.status === 'OK' && categoryResponse?.data) {
        // Transform data format
        const transformedData = categoryResponse.data.map(item => ({
          category: item.typeName,
          typeId: item.typeId,
          quantity: item.quantity,
          revenue: item.revenue
        }));
        
        setCategorySalesData(transformedData || []);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      message.error("Không thể tải dữ liệu doanh thu");
    }
  };
  
  // Fetch data when dateRange or timeUnit changes
  useEffect(() => {
    if (user?.access_token) {
      fetchData();
    }
  }, [user?.access_token, dateRange, timeUnit]);
  
  // Process time series data based on selected timeUnit
  const processTimeSeriesData = (dailyData) => {
    if (!dailyData || dailyData.length === 0) {
      setSalesData([]);
      return;
    }
    
    // If timeUnit is day, we can use dailyData directly
    if (timeUnit === 'day') {
      const mappedData = dailyData.map(item => ({
        timeKey: item.date,
        displayLabel: moment(item.date).format('DD/MM'),
        revenue: item.revenue,
        orders: item.orders
      }));
      
      setSalesData(mappedData);
      return;
    }
    
    // For week or month, we need to group the data
    const groupedData = {};
    
    dailyData.forEach(item => {
      const date = moment(item.date);
      let timeKey;
      
      if (timeUnit === 'week') {
        timeKey = `${date.year()}-W${date.week()}`;
      } else if (timeUnit === 'month') {
        timeKey = date.format('YYYY-MM');
      }
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          timeKey,
          displayLabel: formatTimeLabel(timeKey, timeUnit),
          revenue: 0,
          orders: 0
        };
      }
      
      groupedData[timeKey].revenue += item.revenue;
      groupedData[timeKey].orders += item.orders;
    });
    
    // Convert to array and sort
    const result = Object.values(groupedData).sort((a, b) => {
      return a.timeKey.localeCompare(b.timeKey);
    });
    
    setSalesData(result);
  };
  
  // Generate time series data for revenue chart
  const generateTimeSeriesData = (orders) => {
    // Group orders by time unit (day, week, month)
    const groupedData = {};
    
    orders.forEach(order => {
      let timeKey;
      const orderDate = moment(order.createdAt);
      
      if (timeUnit === 'day') {
        timeKey = orderDate.format('YYYY-MM-DD');
      } else if (timeUnit === 'week') {
        timeKey = `${orderDate.year()}-W${orderDate.week()}`;
      } else if (timeUnit === 'month') {
        timeKey = orderDate.format('YYYY-MM');
      } else {
        timeKey = orderDate.format('YYYY-MM-DD');
      }
      
      if (!groupedData[timeKey]) {
        groupedData[timeKey] = {
          timeKey,
          revenue: 0,
          orders: 0,
          displayLabel: formatTimeLabel(timeKey, timeUnit)
        };
      }
      
      groupedData[timeKey].revenue += order.totalPrice;
      groupedData[timeKey].orders += 1;
    });
    
    // Convert to array and sort by time
    const result = Object.values(groupedData).sort((a, b) => {
      return a.timeKey.localeCompare(b.timeKey);
    });
    
    setSalesData(result);
  };
  
  // Generate product sales data for product performance chart
  const generateProductSalesData = (orders, products) => {
    // Count sales by product
    const productSales = {};
    
    orders.forEach(order => {
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
    const result = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 products
    
    setProductSalesData(result);
  };
  
  // Generate category sales data for category performance chart
  const generateCategorySalesData = (orders, products, types) => {
    // Create type lookup map
    const typeMap = {};
    types.forEach(type => {
      typeMap[type._id] = type.name;
    });
    
    // Create product to type lookup map
    const productTypeMap = {};
    products.forEach(product => {
      const typeId = product.type;
      const typeName = typeMap[typeId] || 'Không xác định';
      productTypeMap[product._id] = typeName;
    });
    
    // Count sales by category
    const categorySales = {};
    
    orders.forEach(order => {
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          const productId = item.product;
          const category = productTypeMap[productId] || 'Không xác định';
          
          if (!categorySales[category]) {
            categorySales[category] = {
              category,
              quantity: 0,
              revenue: 0
            };
          }
          
          categorySales[category].quantity += item.amount;
          categorySales[category].revenue += item.price * item.amount;
        });
      }
    });
    
    // Convert to array and sort by revenue
    const result = Object.values(categorySales)
      .sort((a, b) => b.revenue - a.revenue);
    
    setCategorySalesData(result);
  };
  
  // Format time labels for charts
  const formatTimeLabel = (timeKey, unit) => {
    if (unit === 'day') {
      return moment(timeKey).format('DD/MM');
    } else if (unit === 'week') {
      const [year, week] = timeKey.split('-W');
      return `Tuần ${week}, ${year}`;
    } else if (unit === 'month') {
      return moment(timeKey).format('MM/YYYY');
    }
    return timeKey;
  };
  
  // Handle date range change
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };
  
  // Handle time unit change
  const handleTimeUnitChange = (value) => {
    setTimeUnit(value);
  };
  
  // Handle report type change
  const handleReportTypeChange = (value) => {
    setReportType(value);
  };
  
  // Handle refresh data
  const handleRefresh = () => {
    fetchData();
    message.success('Dữ liệu đã được làm mới');
  };
  
  // Export data to Excel
  const exportToExcel = async () => {
    try {
      message.loading({ content: 'Đang chuẩn bị báo cáo...', key: 'exportExcel' });
      
      const result = await RevenueService.handleExportExcel(
        user?.access_token,
        dateRange[0],
        dateRange[1],
        reportType
      );
      
      if (result.success) {
        message.success({ content: 'Xuất báo cáo thành công', key: 'exportExcel', duration: 2 });
      } else {
        message.error({ content: result.message, key: 'exportExcel', duration: 3 });
      }
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      message.error({ content: 'Có lỗi xảy ra khi xuất báo cáo', key: 'exportExcel', duration: 3 });
    }
  };
  
  // Configuration for revenue chart
  const revenueChartConfig = {
    data: salesData,
    xField: 'displayLabel',
    yField: 'revenue',
    color: '#4cb551',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      revenue: {
        alias: 'Doanh thu (VNĐ)',
        formatter: (v) => `${v.toLocaleString('vi-VN')}đ`,
      },
      displayLabel: {
        alias: 'Thời gian',
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: 'Doanh thu',
          value: `${datum.revenue.toLocaleString('vi-VN')}đ (${datum.orders} đơn hàng)`,
        };
      },
    },
  };
  
  // Configuration for product sales chart
  const productChartConfig = {
    data: productSalesData,
    xField: 'name',
    yField: 'revenue',
    color: '#1890ff',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      revenue: {
        alias: 'Doanh thu (VNĐ)',
        formatter: (v) => `${v.toLocaleString('vi-VN')}đ`,
      },
      name: {
        alias: 'Sản phẩm',
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.name,
          value: `${datum.revenue.toLocaleString('vi-VN')}đ (${datum.quantity} sản phẩm)`,
        };
      },
    },
  };
  
  // Configuration for category sales chart
  const categoryChartConfig = {
    data: categorySalesData,
    angleField: 'revenue',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      formatter: (datum) => `${datum.category}: ${((datum.revenue / revenueSummary.totalRevenue) * 100).toFixed(1)}%`,
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.category,
          value: `${datum.revenue.toLocaleString('vi-VN')}đ (${datum.quantity} sản phẩm)`,
        };
      },
    },
  };
  
  // Columns for product sales table
  const productTableColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString('vi-VN')}đ`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Tỷ lệ đóng góp',
      key: 'contribution',
      render: (_, record) => {
        const contribution = (record.revenue / revenueSummary.totalRevenue) * 100;
        return `${contribution.toFixed(2)}%`;
      },
    },
  ];
  
  // Columns for category sales table
  const categoryTableColumns = [
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Số lượng bán',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => `${revenue.toLocaleString('vi-VN')}đ`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Tỷ lệ đóng góp',
      key: 'contribution',
      render: (_, record) => {
        const contribution = (record.revenue / revenueSummary.totalRevenue) * 100;
        return `${contribution.toFixed(2)}%`;
      },
    },
  ];
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Update fetchData to handle loading state
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch revenue stats
      const revenueResponse = await RevenueService.getRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1]
      );
      
      if (revenueResponse?.status === 'OK' && revenueResponse?.data) {
        const data = revenueResponse.data;
        
        // Set revenue summary
        setRevenueSummary({
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          averageOrderValue: data.averageOrderValue || 0,
          completionRate: data.totalOrders > 0 ? (data.totalDeliveredOrders / data.totalOrders * 100) : 0
        });
        
        // Process time series data based on timeUnit
        processTimeSeriesData(data.dailyRevenue || []);
      }
      
      // Fetch product stats
      const productResponse = await RevenueService.getProductRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1],
        10 // Limit to top 10
      );
      
      if (productResponse?.status === 'OK' && productResponse?.data) {
        setProductSalesData(productResponse.data || []);
      }
      
      // Fetch category stats
      const categoryResponse = await RevenueService.getCategoryRevenueStats(
        user?.access_token,
        dateRange[0],
        dateRange[1]
      );
      
      if (categoryResponse?.status === 'OK' && categoryResponse?.data) {
        // Transform data format
        const transformedData = categoryResponse.data.map(item => ({
          category: item.typeName,
          typeId: item.typeId,
          quantity: item.quantity,
          revenue: item.revenue
        }));
        
        setCategorySalesData(transformedData || []);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      message.error("Không thể tải dữ liệu doanh thu");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <RevenueContainer>
      <RevenueHeader>
        <AdminSectionTitle>Báo cáo doanh thu</AdminSectionTitle>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            allowClear={false}
          />
          <Select 
            value={timeUnit} 
            onChange={handleTimeUnitChange}
            style={{ width: 120 }}
          >
            <Option value="day">Theo ngày</Option>
            <Option value="week">Theo tuần</Option>
            <Option value="month">Theo tháng</Option>
          </Select>
          <Select
            value={reportType}
            onChange={handleReportTypeChange}
            style={{ width: 150 }}
          >
            <Option value="revenue">Doanh thu</Option>
            <Option value="products">Sản phẩm</Option>
            <Option value="categories">Danh mục</Option>
            <Option value="all">Tất cả</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={isLoading}
          >
            Làm mới
          </Button>
          <ExportButton
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToExcel}
            ghost
          >
            Xuất Excel
          </ExportButton>
        </Space>
      </RevenueHeader>
      
      {/* Summary Statistics */}
      <RevenueSummary>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <RevenueStatCard loading={isLoading}>
              <Statistic
                title="Tổng doanh thu"
                value={revenueSummary.totalRevenue}
                precision={0}
                formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                prefix={<DollarOutlined />}
              />
            </RevenueStatCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RevenueStatCard loading={isLoading}>
              <Statistic
                title="Số đơn hàng"
                value={revenueSummary.totalOrders}
                prefix={<BarChartOutlined />}
              />
            </RevenueStatCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RevenueStatCard loading={isLoading}>
              <Statistic
                title="Giá trị đơn hàng trung bình"
                value={revenueSummary.averageOrderValue}
                precision={0}
                formatter={(value) => `${value.toLocaleString('vi-VN')}đ`}
                prefix={<PieChartOutlined />}
              />
            </RevenueStatCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RevenueStatCard loading={isLoading}>
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={revenueSummary.completionRate}
                precision={2}
                suffix="%"
                prefix={<CalendarOutlined />}
              />
            </RevenueStatCard>
          </Col>
        </Row>
      </RevenueSummary>
      
      <Tabs defaultActiveKey="revenue">
        {/* Revenue Tab */}
        <TabPane tab="Doanh thu theo thời gian" key="revenue">
          <AdminCard 
            title={`Doanh thu từ ${dateRange[0].format('DD/MM/YYYY')} đến ${dateRange[1].format('DD/MM/YYYY')}`}
            loading={isLoading}
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => exportToExcel()}
                size="small"
                ghost
              >
                Xuất báo cáo
              </Button>
            }
          >
            <ChartContainer>
              <Column {...revenueChartConfig} />
            </ChartContainer>
          </AdminCard>
        </TabPane>
        
        {/* Products Tab */}
        <TabPane tab="Doanh thu theo sản phẩm" key="products">
          <AdminCard 
            title="Top 10 sản phẩm có doanh thu cao nhất" 
            loading={isLoading}
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => exportToExcel()}
                size="small"
                ghost
              >
                Xuất báo cáo
              </Button>
            }
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <ChartContainer>
                  <Column {...productChartConfig} />
                </ChartContainer>
              </Col>
              <Col xs={24} md={12}>
                <Table 
                  columns={productTableColumns} 
                  dataSource={productSalesData.map((item, index) => ({...item, key: index}))}
                  pagination={false}
                  size="small"
                />
              </Col>
            </Row>
          </AdminCard>
        </TabPane>
        
        {/* Categories Tab */}
        <TabPane tab="Doanh thu theo danh mục" key="categories">
          <AdminCard 
            title="Phân bố doanh thu theo danh mục sản phẩm" 
            loading={isLoading}
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={() => exportToExcel()}
                size="small"
                ghost
              >
                Xuất báo cáo
              </Button>
            }
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <ChartContainer>
                  <Pie {...categoryChartConfig} />
                </ChartContainer>
              </Col>
              <Col xs={24} md={12}>
                <Table 
                  columns={categoryTableColumns} 
                  dataSource={categorySalesData.map((item, index) => ({...item, key: index}))}
                  pagination={false}
                  size="small"
                />
              </Col>
            </Row>
          </AdminCard>
        </TabPane>
      </Tabs>
      
      {/* Print-friendly report */}
      <Divider style={{ margin: '24px 0' }} />
      <AdminCard title="In báo cáo doanh thu">
        <p>Bạn có thể in báo cáo doanh thu này bằng cách nhấp vào nút dưới đây. Báo cáo sẽ được định dạng để in rõ ràng.</p>
        <Button 
          type="primary" 
          icon={<PrinterOutlined />} 
          onClick={() => window.print()}
        >
          In báo cáo
        </Button>
      </AdminCard>
    </RevenueContainer>
  );
};

export default RevenueManagement;