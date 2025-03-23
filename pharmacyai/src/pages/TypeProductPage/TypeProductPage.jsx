import React, { useEffect, useState } from 'react';
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent';
import CardComponent from '../../components/CardComponents/CardComponent';
import { Col, Pagination, Row, Typography, message } from 'antd';
import { WrapperNavBar, WrapperProducts } from './style';
import { useLocation } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import styled from 'styled-components';

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
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const { state } = useLocation();
    const [products, setProducts] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const [typeName, setTypeName] = useState('');
    
    console.log('TypeProductPage state:', state);
    
    const fetchProductType = async (type, page, limit) => {
        setIsPending(true);
        try {
            console.log('fetchProductType with:', { type, page, limit });
            
            // Xác định tên hiển thị
            if (typeof type === 'object' && type !== null) {
                setTypeName(type.name || 'Sản phẩm');
            } else {
                setTypeName(type || 'Sản phẩm');
            }
            
            // Trường hợp là "all" hoặc không có type
            if (type === 'all' || !type) {
                const res = await ProductService.getAllProduct('', limit);
                if (res?.status === 'OK') {
                    setProducts(res.data || []);
                    setPanigate({
                        page: Number(res.pageCurrent || 1) - 1,
                        limit: limit,
                        total: res.total || 0
                    });
                }
                setIsPending(false);
                return;
            }
            
            // Gọi API với type
            const res = await ProductService.getProductType(type, page, limit);
            console.log('API response:', res);
            
            if (res?.status === 'OK') {
                setProducts(res.data || []);
                setPanigate({
                    page: Number(res.pageCurrent || 1) - 1,
                    limit: limit,
                    total: res.total || 0
                });
            } else {
                setProducts([]);
                message.warning(res?.message || 'Không tìm thấy sản phẩm nào');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
            message.error('Có lỗi xảy ra khi tải sản phẩm');
        } finally {
            setIsPending(false);
        }
    };

    // Xử lý type từ URL
    const getTypeFromUrl = () => {
        const path = window.location.pathname;
        const parts = path.split('/');
        const lastPart = parts[parts.length - 1];
        
        // Chuẩn hóa URL (thay thế _ bằng dấu cách)
        let decodedType = decodeURIComponent(lastPart);
        decodedType = decodedType.replace(/_/g, ' ');
        
        console.log('Type from URL:', decodedType);
        return decodedType;
    };
    
    // Trong useEffect
    useEffect(() => {
        if (state) {
            console.log('Using state from navigation:', state);
            fetchProductType(state, panigate.page, panigate.limit);
        } else {
            const typeFromUrl = getTypeFromUrl();
            console.log('Using type from URL:', typeFromUrl);
            fetchProductType(typeFromUrl, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit]);
    
    // Xử lý khi thay đổi trang
    const onChange = (current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize});
    };
    
    return (
        <Loading isPending={isPending}>
            <div style={{width:'100%', background: '#f7f7f7', minHeight:'calc(100vh - 64px)', padding:'20px 0'}}>
                <div style={{width:'1270px', margin: '0 auto', height: '100%'}}>
                    <CategoryTitle level={3}>{typeName}</CategoryTitle>
                    <Row style={{ flexWrap:'nowrap', paddingTop: '10px', height: 'calc(100% - 20px)'}}>
                        <WrapperNavBar span={4}>
                            <NavBarComponent />
                        </WrapperNavBar>
                        <Col span={20} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <WrapperProducts>
                                {products?.length > 0 ? (
                                    products.map((product) => (
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
                                    ))
                                ) : !isPending && (
                                    <div style={{textAlign: 'center', padding: '30px', width: '100%'}}>
                                        <Title level={4} style={{color: '#999'}}>Không tìm thấy sản phẩm nào</Title>
                                    </div>
                                )}
                            </WrapperProducts>  
                            {products?.length > 0 && (
                                <Pagination 
                                    current={panigate.page + 1} 
                                    total={panigate.total} 
                                    pageSize={panigate.limit}
                                    onChange={onChange} 
                                    style={{textAlign:'center', marginTop:'20px'}} 
                                />
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </Loading>
    );
};

export default TypeProductPage;