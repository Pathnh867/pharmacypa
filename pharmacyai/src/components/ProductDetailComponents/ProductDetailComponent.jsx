import { Col, Image, InputNumber, Row } from 'antd'
import React from 'react'
import imageProduct from '../../assets/img/thuoc.jpg'
import imageProductSmall from '../../assets/img/thuoc1.jpg'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {CheckCircleOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'
import ButtonComponent from '../ButtonComponents/ButtonComponent'


const ProductDetailComponent = () => {
  
  return (
      <Row style={{padding: '16px', background: '#fff', borderRadius:'4px' }}>
          <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight:'8px'}}>
              <Image src={imageProduct} alt="Image Product" preview={false} />
              <Row style={{paddingTop:'10px', justifyContent:'space-between'}}>
                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>

                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>

                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>

                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>

                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>

                  <WrapperStyleColImage span={4}>
                      <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                  </WrapperStyleColImage>
              </Row>
          </Col>
            
          <Col span={14} style={{paddingLeft: '10px'}}>
              <WrapperStyleNameProduct>Panadol Cảm Cúm giảm các triệu chứng sốt, đau, sung huyết mũi (15 vỉ x 12 viên)</WrapperStyleNameProduct>
              <div>
                  <CheckCircleOutlined style={{ fontSize: '15px', color: '#279c59' }} />
                  <WrapperStyleTextSell> Còn Hàng</WrapperStyleTextSell>
              </div>
              <WrapperPriceProduct>
                  <WrapperPriceTextProduct>250.000đ</WrapperPriceTextProduct>
              </WrapperPriceProduct>
              <WrapperAddressProduct>
                  <span>Giao đến </span>
                  <span className='address'>Phường 13, Quận Tân Bình, Hồ Chí Minh </span>
                  <span className='changeAddress'>Đổi địa chỉ</span>
              </WrapperAddressProduct>
              <div style={{margin:'10px 0 20px', padding:' 10px 0', borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5' }}>
                  <div style={{marginBottom: '10px'}}>Số Lượng</div>
                  <WrapperQualityProduct>
                      <button style={{ border:'none', background:'transparent'}}>
                          <MinusOutlined  style={{color:'#000', fontSize:'20px'}} />
                      </button>
                      <WrapperInputNumber defaultValue={3} onChange={onchange} size="small" />
                      <button style={{ border:'none', background:'transparent'}}>
                          <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                      </button>

                </WrapperQualityProduct>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ButtonComponent
                      bordered={false}
                      size={40}
                      styleButton={{
                          background: '#39b54a',
                          height: '48px',
                          width: '220px',
                          border: 'none',
                          borderRadius: '4px'
                      }}
                      textButton={'Mua 1 viên'}
                      styleTextButton={{color:'#fff', fontSize:'15px', fontWeight:'700'}}
                  >
                      
                  </ButtonComponent>
                  <ButtonComponent
                      size={40}
                      styleButton={{
                          background: '#fff',
                          height: '48px',
                          width: '220px',
                          border: '1px solid #39b54a',
                          borderRadius: '4px'
                      }}
                      textButton={'Mua 1 hộp'}
                      styleTextButton={{color:'#39b54a', fontSize:'15px', }}
                  >
                      
                  </ButtonComponent>
                  
              </div>
          </Col>
      </Row>
  )
}

export default ProductDetailComponent