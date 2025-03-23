import React, { useEffect, useState } from 'react'
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent'
import CardComponent from '../../components/CardComponents/CardComponent'
import { Col, Pagination, Row, Typography } from 'antd'
import { WrapperNavBar, WrapperProducts } from './style'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import Loading from '../../components/LoadingComponent/Loading'
import { useSelector } from 'react-redux'
import { useDebounce } from '../../hooks/useDebounce'
import styled from 'styled-components'

const { Title } = Typography;

const CategoryTitle = styled(Title)`
  position: relative;
  padding-bottom: 15px;
  margin-bottom: 20px !important;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: #4cb551;
  }
`;

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
    
    console.log('TypeProductPage state:', state)
    
    const fetchProductType = async (type, page, limit) => {
        setIsPending(true);
        try {
            // Xử lý type một cách rõ ràng
            let typeParam;
            
            if (typeof type === 'object' && type !== null) {
                // Ưu tiên sử dụng ID nếu có
                typeParam = type._id || type.name;
            } else {
                typeParam = type;
            }
            
            // Đảm bảo typeParam không bị null/undefined
            if (!typeParam) {
                console.error('No valid type parameter');
                setIsPending(false);
                return;
            }
            
            // Gọi API lấy sản phẩm theo type
            const res = await ProductService.getProductType(typeParam, page, limit);
            
            // Xử lý kết quả trả về
            if (res?.status === 'OK') {
                setProducts(res.data);
                setPanigate({
                    page: Number(res.pageCurrent) - 1,
                    limit: limit,
                    total: res.total
                });
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error in fetchProductType:', error);
            setProducts([]);
        } finally {
            setIsPending(false);
        }
    }
    // Trong TypeProductPage.jsx
    useEffect(() => {
        if (state) {
            // Log để debug
            console.log('State from navigation:', state);
            // Nếu state là đối tượng, gọi API với _id
            // Nếu state là chuỗi, gọi API với tên
            fetchProductType(state, panigate.page, panigate.limit)
        } else {
            // Nếu không có state (từ URL trực tiếp), lấy từ params
            const typeFromUrl = window.location.pathname.split('/').pop();
            console.log('Type from URL:', decodeURIComponent(typeFromUrl));
            // Gọi API với tên đã decode
            fetchProductType(decodeURIComponent(typeFromUrl), panigate.page, panigate.limit)
        }
    }, [state, panigate.page, panigate.limit])
    const getTypeName = () => {
        if (!state) return "Sản phẩm";
        
        if (typeof state === 'object' && state.name) {
            return state.name;
        }
        
        return state;
    }
    const onChange = (current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize});
    };
    
    return (
      <Loading isPending={isPending}>
            <div style={{width:'100%', background: '#f7f7f7', minHeight:'calc(100vh - 64px)', padding:'20px 0'}}>
                <div style={{width:'1270px', margin: '0 auto', height: '100%'}}>
                    <CategoryTitle level={3}>{getTypeName()}</CategoryTitle>
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
                            <Pagination 
                                defaultCurrent={panigate.page+1} 
                                total={panigate?.total} 
                                onChange={onChange} 
                                style={{textAlign:'center', marginTop:'20px'}} 
                            />
                            {products?.length === 0 && !isPending && (
                                <div style={{textAlign: 'center', padding: '30px'}}>
                                    <Title level={4} style={{color: '#999'}}>Không tìm thấy sản phẩm nào</Title>
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
      </Loading>
    )
}

export default TypeProductPage