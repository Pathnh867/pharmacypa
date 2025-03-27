import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { Breadcrumb, Spin, Alert } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ProductDetailComponent from '../../components/ProductDetailComponents/ProductDetailComponent'
import * as ProductService from '../../services/ProductService'

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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
  
  .ant-spin {
    margin-bottom: 20px;
  }
`

const ErrorContainer = styled.div`
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  margin-top: 16px;
`

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        setError('Không tìm thấy ID sản phẩm')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        console.log('Đang tải chi tiết sản phẩm với ID:', id)
        const response = await ProductService.getDetailsProduct(id)
        
        if (response?.status === 'OK' && response?.data) {
          console.log('Chi tiết sản phẩm:', response.data)
          setProduct(response.data)
        } else {
          console.error('Không lấy được dữ liệu sản phẩm:', response)
          setError('Không thể tải thông tin sản phẩm')
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err)
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin sản phẩm')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  if (loading) {
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
          
          <LoadingContainer>
            <Spin size="large" />
            <div>Đang tải thông tin sản phẩm...</div>
          </LoadingContainer>
        </ContentContainer>
      </PageContainer>
    )
  }

  if (error) {
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
          
          <ErrorContainer>
            <Alert
              message="Lỗi"
              description={error}
              type="error"
              showIcon
              action={
                <div style={{ marginTop: '12px' }}>
                  <a onClick={() => navigate('/')}>Quay về trang chủ</a>
                </div>
              }
            />
          </ErrorContainer>
        </ContentContainer>
      </PageContainer>
    )
  }

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
              {product?.name || 'Chi tiết sản phẩm'}
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbContainer>
        
        <ProductDetailComponent idProduct={id} />
      </ContentContainer>
    </PageContainer>
  )
}

export default ProductDetailPage