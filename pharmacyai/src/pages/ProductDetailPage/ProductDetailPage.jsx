import React from 'react'
import ProductDetailComponent from '../../components/ProductDetailComponents/ProductDetailComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ height: '100vh', width: '100%', background: '#efefef' }}>
      <div style={{width:'1270px', height:'100%', margin:'0 auto'}}>
        <h5><span style={{ cursor: 'pointer', fontWeight:'bold' }} onClick={()=> {navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h5>
        <ProductDetailComponent idProduct={id} />
        </div>
      </div>
  )
}

export default ProductDetailPage