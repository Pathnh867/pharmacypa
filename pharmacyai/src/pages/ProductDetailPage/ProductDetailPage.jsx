import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Breadcrumb } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ProductDetailComponent from '../../components/ProductDetailComponents/ProductDetailComponent'

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f7f7f7;
  padding: 20px 0;
`

const ContentContainer = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 0 15px;
`

const BreadcrumbContainer = styled.div`
  margin-bottom: 20px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #4cb551;
      
      &:hover {
        color: #389e3c;
      }
    }
    
    .anticon {
      margin-right: 8px;
    }
  }
`

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <PageContainer>
      <ContentContainer>
        <BreadcrumbContainer>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
              <span>Trang chủ</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/products">
              <AppstoreOutlined />
              <span>Sản phẩm</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              Chi tiết sản phẩm
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbContainer>
        
        <ProductDetailComponent idProduct={id} />
      </ContentContainer>
    </PageContainer>
  )
}

export default ProductDetailPage