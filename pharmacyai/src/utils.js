

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