

export const isJsonString = (data) => {
    // Kiểm tra kiểu dữ liệu là chuỗi
    if (typeof data !== 'string') {
        return false;
    }

    try {
        JSON.parse(data);
        return true;
    } catch (error) {
        return false;
    }
}

export const getBase64 = async (file) => 
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });



export function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
export const renderOptions = (arr) => {
    let results = []
    if (arr && Array.isArray(arr)) {
      results = arr.map((opt) => {
        // Kiểm tra nếu opt là object
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: opt._id || opt.id,
            label: opt.name
          }
        }
        // Nếu opt là string hoặc primitive
        return {
          value: opt,
          label: String(opt)
        }
      })
    }
    results.push({
      label: 'Thêm loại sản phẩm',
      value: 'add_type'
    })
    return results
  }
export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replace(',', '.',)
        return `${result}đ`
    } catch (error) {
        return null
    }
}
export const formatOrderDate = (dateString, includeTime = true) => {
  try {
    if (!dateString) return 'N/A';
    
    const dateObj = new Date(dateString);
    
    // Kiểm tra nếu ngày hợp lệ
    if (isNaN(dateObj.getTime())) return 'Ngày không hợp lệ';
    
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString('vi-VN', options);
  } catch (error) {
    console.error("Lỗi định dạng ngày tháng:", error);
    return 'Lỗi';
  }
};