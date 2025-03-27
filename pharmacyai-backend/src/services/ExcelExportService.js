// Trong ExcelExportService.js
const exportToExcel = (data, reportType, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        try {
            // Tạo workbook mới
            const workbook = XLSX.utils.book_new();
            
            // Thêm metadata cho file Excel
            workbook.Props = {
                Title: "Báo cáo doanh thu",
                Subject: `Từ ${startDate} đến ${endDate}`,
                Author: "Pharmacy AI System",
                CreatedDate: new Date()
            };
            
            // Thêm sheet tổng quan với định dạng phù hợp
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
            
            // Thêm các sheet khác như trước...
            
            // Tạo tên file với timestamp hiện tại
            const fileName = `bao_cao_doanh_thu_${moment().format('DDMMYYYY_HHmmss')}.xlsx`;
            const filePath = path.join(TEMP_DIR, fileName);
            
            // Sử dụng try-catch cụ thể cho thao tác ghi file
            try {
                // Sử dụng writeFileSync thay vì writeFile để tạo file đáng tin cậy hơn
                XLSX.writeFileSync(workbook, filePath, { bookType: 'xlsx', type: 'file' });
                
                resolve({
                    status: 'OK',
                    message: 'Xuất file Excel thành công',
                    data: {
                        fileName,
                        filePath
                    }
                });
            } catch (writeError) {
                console.error('Lỗi khi ghi file Excel:', writeError);
                reject(writeError);
            }
        } catch (error) {
            console.error('Lỗi khi tạo workbook Excel:', error);
            reject(error);
        }
    });
};