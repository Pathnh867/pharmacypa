import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  
  // Xử lý trường hợp name là đối tượng
  const typeName = typeof name === 'object' && name.name ? name.name : name;
  
  const handleNavigatetype = (type) => {
    // Đảm bảo truyền toàn bộ đối tượng type (nếu có) hoặc chuỗi tên
    const typeValue = typeof type === 'object' && type.name ? type.name : type;
    
    navigate(`/product/${typeValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { 
      state: type // Truyền toàn bộ đối tượng type hoặc chuỗi
    });
  }
  
  return (
    <div 
      style={{ 
        padding: '8px 16px', 
        cursor: 'pointer',
        background: '#f5f5f5',
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        border: '1px solid transparent'
      }}
      onClick={() => handleNavigatetype(name)}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#e8f5e9';
        e.currentTarget.style.borderColor = '#4cb551';
        e.currentTarget.style.color = '#4cb551';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = '#f5f5f5';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.color = 'inherit';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {typeName}
    </div>
  )
}

export default TypeProduct