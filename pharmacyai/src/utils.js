

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
    if (arr) {
        results = arr?.map((opt) => {
            return {
                value: opt,
                label: opt
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