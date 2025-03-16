

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
const safeTypeData = typeProduct?.data?.data || [];
export const renderOptions = (arr) => {
    let results = [];
    if (arr && Array.isArray(arr)) {
      results = arr.map((opt) => {
        // Đảm bảo opt có cấu trúc mong đợi
        if (!opt || typeof opt !== 'object') return null;
        
        return {
          value: opt._id || '',
          label: opt.name || 'Unknown Type'
        };
      }).filter(Boolean); // Loại bỏ các giá trị null/undefined
    }
    
    results.push({
      value: 'add_type',
      label: 'Thêm loại mới'
    });
    
    return results;
  };

export const convertPrice = (price) => {
    try {
        const result = price?.toLocaleString().replace(',', '.',)
        return `${result}đ`
    } catch (error) {
        return null
    }
}