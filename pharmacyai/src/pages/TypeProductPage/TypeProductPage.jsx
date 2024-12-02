import React, { Fragment, useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent'
import CardComponent from '../../components/CardComponents/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavBar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'

const TypeProductPage = () => {
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const { state } = useLocation()
    const [products, setProducts] = useState([])
    const [isPending, setIsPending] = useState(false)
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })
    console.log('state', state)
    const fetchProductType = async (type, page, limit) => {
        setIsPending(true)
        const res = await ProductService.getProductType(type, page, limit)
        if (res?.status === 'OK') {
            setIsPending(false)
            setProducts(res?.data)
            setPanigate({ ...panigate, total: res?.totalPage })
            console.log('res', res)
        } else {
            setIsPending(false)
        }
    }


    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page,panigate.limit)
        }
    }, [state,  panigate.page, panigate.limit])
    const onChange = (current, pageSize) => {
      setPanigate({...panigate, page: current - 1, limit: pageSize})
     }
    return (
      <Loading isPending={isPending}>
            <div style={{width:'100%', background: '#efefef', height:'calc(100vh - 64px)'}}>
                <div style={{width:'1270px', margin: '0 auto', height: '100%'}}>
                    <Row style={{ flexWrap:'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)'}}>
                        <WrapperNavBar span={4}>
                            <NavBarComponent />
                        </WrapperNavBar>
                        <Col span={20} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <WrapperProducts>
                                {products?.map((product) => {
                                    return (
                                        <CardComponent
                                            
                                                key={product._id}
                                                countInStock={product.countInStock}
                                                description={product.description}
                                                image={product.image}
                                                name={product.name}
                                                price={product.price}
                                                rating={product.rating}
                                                type={product.type}
                                                selled={product.selled}
                                                discount={product.discount}
                                                id={product._id}
                                        />
                                    )
                                })}
                                    
                                    
                            </WrapperProducts>  
                            <Pagination defaultCurrent={panigate.page+1} total={panigate?.total} onChange={onChange} style={{textAlign:'center', marginTop:'10px'}} />
                        </Col>
                    </Row>
                
                </div>
            </div>
            
      </Loading>
  )
}

export default TypeProductPage