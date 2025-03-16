import React from 'react'
import { useNavigate } from 'react-router-dom'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  
  // Xử lý trường hợp name là đối tượng
  const typeName = typeof name === 'object' ? name.name : name;
  
  const handleNavigatetype = (type) => {
    // Đảm bảo type luôn là chuỗi
    const typeValue = typeof type === 'object' ? type.name : type;
    navigate(`/product/${typeValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, { state: typeValue })
  }
  
  return (
    <div style={{ padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigatetype(name)}>
      {typeName}
    </div>
  )
}

export default TypeProduct