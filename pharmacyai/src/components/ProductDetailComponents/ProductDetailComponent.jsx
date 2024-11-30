import { Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useState } from 'react'
import imageProduct from '../../assets/img/thuoc.jpg'
import imageProductSmall from '../../assets/img/thuoc1.jpg'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {CheckCircleOutlined, MinusOutlined, PlusOutlined, StarFilled} from '@ant-design/icons'
import ButtonComponent from '../ButtonComponents/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'


const ProductDetailComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    
    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            setNumProduct(numProduct - 1)
        }
    }

    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }
        
    }

    const renderStar = (num) => {
        for ( const i = 0; i < num; i++) {
            return (
                <StarFilled style={{fontSize: '12px', color:'rgb(235, 216,54)'}} />
            )
        }
    }

    const {isPending, data: productDetails, isPlaceholderData } = useQuery({
        queryKey: ['product-details', idProduct],
        queryFn: fetchGetDetailsProduct,
        enabled: !!idProduct
        // placeholderData: keepPreviousData(true) 
    });
    console.log('productDetails', productDetails)
    return (
      <Loading isPending={isPending}>
            <Row style={{padding: '16px', background: '#fff', borderRadius:'4px' }}>
                <Col span={10} style={{borderRight: '1px solid #e5e5e5', paddingRight:'8px'}}>
                    <Image src={productDetails?.image} alt="Image Product" preview={false} />
                    <Row style={{paddingTop:'10px', justifyContent:'space-between'}}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={productDetails?.image} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                    </Row>
                </Col>
                    
                <Col span={14} style={{paddingLeft: '10px'}}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Đã bán 200 +</WrapperStyleTextSell>
                    </div>
                    <div>
                        <CheckCircleOutlined style={{ fontSize: '13px', color: '#279c59' }} />
                        <WrapperStyleTextSell> Còn Hàng</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{productDetails?.price }</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address' style={{fontWeight: 'bold'}}>Phường 13, Quận Tân Bình, Hồ Chí Minh</span>
                        <span className='changeAddress'> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{margin:'10px 0 20px', padding:' 10px 0', borderTop:'1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5' }}>
                        <div style={{marginBottom: '10px'}}>Số Lượng</div>
                        <WrapperQualityProduct>
                            <button style={{ border:'none', background:'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined  style={{color:'#000', fontSize:'20px'}} />
                            </button>
                            <WrapperInputNumber onChange={onChange} value={numProduct} size="small" />
                            <button style={{ border:'none', background:'transparent', cursor: 'pointer'}} onClick={() => handleChangeCount('increase')}>
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
      </Loading>
  )
}

export default ProductDetailComponent