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
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useSelector } from 'react-redux';
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

// Màu sắc cho biểu đồ
const COLORS = ['#4cb551', '#1890ff', '#722ed1', '#52c41a', '#ff4d4f', '#faad14', '#13c2c2', '#eb2f96'];

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
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useSelector((state) => state.user);
  
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
  
  // Fetch data from API
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
  
  // Fetch data when dateRange or timeUnit changes
  useEffect(() => {
    if (user?.access_token) {
      fetchData();
    }
  }, [user?.access_token, dateRange, timeUnit]);
  
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
  
  // Custom Tooltip for Revenue Chart
  const RevenueTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ margin: 0 }}>
            <span style={{ color: '#4cb551' }}>Doanh thu: </span>
            {payload[0].value.toLocaleString('vi-VN')}đ
          </p>
          {payload[0].payload.orders && (
            <p style={{ margin: 0 }}>
              <span style={{ color: '#1890ff' }}>Đơn hàng: </span>
              {payload[0].payload.orders}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Custom Tooltip for Pie Chart
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0 }}>
            <span>Doanh thu: </span>
            {payload[0].value.toLocaleString('vi-VN')}đ
          </p>
          {payload[0].payload.quantity && (
            <p style={{ margin: 0 }}>
              <span>Số lượng: </span>
              {payload[0].payload.quantity}
            </p>
          )}
        </div>
      );
    }
    return null;
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
              <ResponsiveContainer width="100%" height={350}>
                <BarChart 
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="displayLabel" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                  />
                  <YAxis />
                  <Tooltip content={<RevenueTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    name="Doanh thu" 
                    fill="#4cb551" 
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={productSalesData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={100}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<RevenueTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="revenue" 
                        name="Doanh thu" 
                        fill="#1890ff" 
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={categorySalesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {categorySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
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