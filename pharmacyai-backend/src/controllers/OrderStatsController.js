// pharmacyai-backend/src/controllers/OrderStatsController.js

const OrderStatsService = require('../services/OrderStatsService');
const moment = require('moment');

// Lấy thống kê tổng hợp về đơn hàng
const getOrderStats = async (req, res) => {
    try {
        // Lấy thời gian từ query parameters
        let { startDate, endDate } = req.query;
        
        // Kiểm tra và thiết lập giá trị mặc định nếu không có
        if (!startDate) {
            startDate = moment().startOf('month').format('YYYY-MM-DD');
        }
        
        if (!endDate) {
            endDate = moment().endOf('month').format('YYYY-MM-DD');
        }
        
        const response = await OrderStatsService.getOrderStats(startDate, endDate);
        return res.status(response.status === 'ERR' ? 400 : 200).json(response);
    } catch (error) {
        console.error('Error in getOrderStats:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Internal server error'
        });
    }
};

// Lấy thống kê doanh thu theo sản phẩm
const getProductRevenueStats = async (req, res) => {
    try {
        // Lấy thời gian từ query parameters
        let { startDate, endDate, limit } = req.query;
        
        // Kiểm tra và thiết lập giá trị mặc định nếu không có
        if (!startDate) {
            startDate = moment().startOf('month').format('YYYY-MM-DD');
        }
        
        if (!endDate) {
            endDate = moment().endOf('month').format('YYYY-MM-DD');
        }
        
        const response = await OrderStatsService.getProductRevenueStats(startDate, endDate, limit);
        return res.status(response.status === 'ERR' ? 400 : 200).json(response);
    } catch (error) {
        console.error('Error in getProductRevenueStats:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Internal server error'
        });
    }
};

// Lấy thống kê doanh thu theo danh mục sản phẩm
const getCategoryRevenueStats = async (req, res) => {
    try {
        // Lấy thời gian từ query parameters
        let { startDate, endDate } = req.query;
        
        // Kiểm tra và thiết lập giá trị mặc định nếu không có
        if (!startDate) {
            startDate = moment().startOf('month').format('YYYY-MM-DD');
        }
        
        if (!endDate) {
            endDate = moment().endOf('month').format('YYYY-MM-DD');
        }
        
        const response = await OrderStatsService.getCategoryRevenueStats(startDate, endDate);
        return res.status(response.status === 'ERR' ? 400 : 200).json(response);
    } catch (error) {
        console.error('Error in getCategoryRevenueStats:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Internal server error'
        });
    }
};

const exportRevenueToExcel = async (req, res) => {
    try {
        // Lấy thời gian từ query parameters
        let { startDate, endDate, reportType } = req.query;
        
        // Kiểm tra và thiết lập giá trị mặc định nếu không có
        if (!startDate) {
            startDate = moment().startOf('month').format('YYYY-MM-DD');
        }
        
        if (!endDate) {
            endDate = moment().endOf('month').format('YYYY-MM-DD');
        }
        
        if (!reportType) {
            reportType = 'all'; // Mặc định xuất tất cả báo cáo
        }
        
        // Lấy dữ liệu thống kê
        const statsResponse = await OrderStatsService.getOrderStats(startDate, endDate);
        
        if (statsResponse.status === 'ERR') {
            return res.status(400).json(statsResponse);
        }
        
        // Lấy dữ liệu sản phẩm nếu cần
        let productStatsResponse = null;
        if (reportType === 'products' || reportType === 'all') {
            productStatsResponse = await OrderStatsService.getProductRevenueStats(startDate, endDate, 50);
            if (productStatsResponse.status === 'OK') {
                statsResponse.data.productStats = productStatsResponse.data;
            }
        }
        
        // Lấy dữ liệu danh mục nếu cần
        let categoryStatsResponse = null;
        if (reportType === 'categories' || reportType === 'all') {
            categoryStatsResponse = await OrderStatsService.getCategoryRevenueStats(startDate, endDate);
            if (categoryStatsResponse.status === 'OK') {
                statsResponse.data.categoryStats = categoryStatsResponse.data;
            }
        }
        
        // Xuất dữ liệu ra Excel
        const ExcelService = require('../services/ExcelExportService');
        const excelResponse = await ExcelService.exportToExcel(statsResponse.data, reportType, startDate, endDate);
        
        if (excelResponse.status === 'ERR') {
            return res.status(500).json(excelResponse);
        }
        
        // Trả về thông tin file Excel
        return res.status(200).json(excelResponse);
    } catch (error) {
        console.error('Error in exportRevenueToExcel:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Internal server error'
        });
    }
};

// Download file Excel
const downloadExcelFile = async (req, res) => {
    try {
        const { fileName } = req.params;
        
        if (!fileName) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Tên file là bắt buộc'
            });
        }
        
        // Lấy thông tin file
        const ExcelService = require('../services/ExcelExportService');
        const fileResponse = await ExcelService.getExcelFile(fileName);
        
        if (fileResponse.status === 'ERR') {
            return res.status(404).json(fileResponse);
        }
        
        // Gửi file về client
        res.download(fileResponse.data.filePath, fileResponse.data.fileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                return res.status(500).json({
                    status: 'ERR',
                    message: 'Lỗi khi tải file'
                });
            }
            
            // Xóa file sau khi đã gửi về client
            setTimeout(() => {
                ExcelService.deleteExcelFile(fileName)
                    .catch(error => console.error('Error deleting file after download:', error));
            }, 1000);
        });
    } catch (error) {
        console.error('Error in downloadExcelFile:', error);
        return res.status(500).json({
            status: 'ERR',
            message: error.message || 'Internal server error'
        });
    }
};

module.exports = {
    getOrderStats,
    getProductRevenueStats,
    getCategoryRevenueStats,
    exportRevenueToExcel,
    downloadExcelFile
};
