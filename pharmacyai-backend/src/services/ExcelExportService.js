// pharmacyai-backend/src/services/ExcelExportService.js

const XLSX = require('xlsx');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// Đường dẫn lưu file tạm
const TEMP_DIR = path.join(__dirname, '../temp');

// Tạo thư mục temp nếu chưa tồn tại
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Hàm xuất dữ liệu ra file Excel
const exportToExcel = (data, reportType, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        try {
            // Tạo workbook mới
            const workbook = XLSX.utils.book_new();
            
            // Thêm sheet tổng quan
            const summaryData = [{
                'Tổng doanh thu (VNĐ)': data.totalRevenue || 0,
                'Số đơn hàng': data.totalOrders || 0,
                'Giá trị đơn hàng trung bình (VNĐ)': data.averageOrderValue || 0,
                'Tỷ lệ hoàn thành (%)': ((data.totalDeliveredOrders / data.totalOrders) * 100) || 0,
                'Thời gian từ': startDate,
                'Thời gian đến': endDate
            }];
            
            const summarySheet = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');
            
            // Thêm sheet doanh thu theo ngày nếu có dữ liệu
            if (data.dailyRevenue && data.dailyRevenue.length > 0) {
                const revenueData = data.dailyRevenue.map(item => ({
                    'Ngày': moment(item.date).format('DD/MM/YYYY'),
                    'Doanh thu (VNĐ)': item.revenue,
                    'Số đơn hàng': item.orders,
                    'Doanh thu trung bình/đơn (VNĐ)': item.orders > 0 ? Math.round(item.revenue / item.orders) : 0
                }));
                
                const revenueSheet = XLSX.utils.json_to_sheet(revenueData);
                XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Doanh thu theo ngày');
            }
            
            // Thêm sheet thống kê trạng thái đơn hàng
            if (data.ordersByStatus) {
                const statusData = [
                    { 'Trạng thái': 'Chờ xử lý', 'Số lượng': data.ordersByStatus.pending || 0 },
                    { 'Trạng thái': 'Đang xử lý', 'Số lượng': data.ordersByStatus.processing || 0 },
                    { 'Trạng thái': 'Đang giao hàng', 'Số lượng': data.ordersByStatus.shipping || 0 },
                    { 'Trạng thái': 'Đã giao hàng', 'Số lượng': data.ordersByStatus.delivered || 0 },
                    { 'Trạng thái': 'Đã hủy', 'Số lượng': data.ordersByStatus.cancelled || 0 }
                ];
                
                const statusSheet = XLSX.utils.json_to_sheet(statusData);
                XLSX.utils.book_append_sheet(workbook, statusSheet, 'Thống kê trạng thái');
            }
            
            // Nếu có dữ liệu về sản phẩm
            if (reportType === 'products' && data.productStats) {
                const productData = data.productStats.map(item => ({
                    'Sản phẩm': item.name,
                    'Số lượng bán': item.quantity,
                    'Doanh thu (VNĐ)': item.revenue,
                    'Danh mục': item.type || 'Không xác định',
                    'Tỷ lệ đóng góp (%)': data.totalRevenue > 0 ? ((item.revenue / data.totalRevenue) * 100).toFixed(2) : 0
                }));
                
                const productSheet = XLSX.utils.json_to_sheet(productData);
                XLSX.utils.book_append_sheet(workbook, productSheet, 'Doanh thu theo sản phẩm');
            }
            
            // Nếu có dữ liệu về danh mục
            if (reportType === 'categories' && data.categoryStats) {
                const categoryData = data.categoryStats.map(item => ({
                    'Danh mục': item.typeName,
                    'Số lượng bán': item.quantity,
                    'Doanh thu (VNĐ)': item.revenue,
                    'Tỷ lệ đóng góp (%)': data.totalRevenue > 0 ? ((item.revenue / data.totalRevenue) * 100).toFixed(2) : 0
                }));
                
                const categorySheet = XLSX.utils.json_to_sheet(categoryData);
                XLSX.utils.book_append_sheet(workbook, categorySheet, 'Doanh thu theo danh mục');
            }
            
            // Tạo tên file với thời gian hiện tại
            const fileName = `bao_cao_doanh_thu_${moment().format('DDMMYYYY_HHmmss')}.xlsx`;
            const filePath = path.join(TEMP_DIR, fileName);
            
            // Lưu workbook
            XLSX.writeFile(workbook, filePath);
            
            resolve({
                status: 'OK',
                message: 'Xuất file Excel thành công',
                data: {
                    fileName,
                    filePath
                }
            });
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            reject(error);
        }
    });
};

// Hàm lấy file Excel đã tạo
const getExcelFile = (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(TEMP_DIR, fileName);
            
            if (!fs.existsSync(filePath)) {
                resolve({
                    status: 'ERR',
                    message: 'File không tồn tại'
                });
                return;
            }
            
            resolve({
                status: 'OK',
                message: 'Lấy file thành công',
                data: {
                    filePath,
                    fileName
                }
            });
        } catch (error) {
            console.error('Error getting Excel file:', error);
            reject(error);
        }
    });
};

// Hàm xóa file Excel tạm
const deleteExcelFile = (fileName) => {
    return new Promise((resolve, reject) => {
        try {
            const filePath = path.join(TEMP_DIR, fileName);
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            resolve({
                status: 'OK',
                message: 'Xóa file thành công'
            });
        } catch (error) {
            console.error('Error deleting Excel file:', error);
            reject(error);
        }
    });
};

// Hàm tự động dọn dẹp các file Excel cũ (chạy định kỳ hoặc khi khởi động server)
const cleanupOldFiles = (maxAgeHours = 1) => {
    try {
        const files = fs.readdirSync(TEMP_DIR);
        const now = moment();
        
        files.forEach(file => {
            const filePath = path.join(TEMP_DIR, file);
            const stats = fs.statSync(filePath);
            const fileCreationTime = moment(stats.mtime);
            const hoursDiff = now.diff(fileCreationTime, 'hours');
            
            if (hoursDiff >= maxAgeHours) {
                fs.unlinkSync(filePath);
                console.log(`Deleted old file: ${file}`);
            }
        });
    } catch (error) {
        console.error('Error cleaning up old files:', error);
    }
};

module.exports = {
    exportToExcel,
    getExcelFile,
    deleteExcelFile,
    cleanupOldFiles
};