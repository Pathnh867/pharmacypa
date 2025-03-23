import React, { useEffect, useState } from 'react';
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent';
import CardComponent from '../../components/CardComponents/CardComponent';
import { Col, Pagination, Row, Typography, Empty, message } from 'antd';
import { WrapperNavBar, WrapperProducts } from './style';
import { useLocation, useNavigate } from 'react-router-dom';
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
    const { state } = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isPending, setIsPending] = useState(false);
    const [panigate, setPanigate] = useState({
        page: 0,
        limit: 10,
        total: 1,
    });
    const [typeName, setTypeName] = useState('');
    const [availableTypes, setAvailableTypes] = useState([]);
    
    // Lấy danh sách các loại có sẵn
    const fetchAvailableTypes = async () => {
        try {
            const res = await ProductService.getAllTypeProduct();
            if (res?.status === 'OK') {
                setAvailableTypes(res.data || []);
                console.log('Available types:', res.data);
            }
        } catch (error) {
            console.error('Error fetching types:', error);
        }
    };
    
    useEffect(() => {
        fetchAvailableTypes();
    }, []);
    
    // Lấy sản phẩm dựa trên typeId
    const fetchProductsByTypeId = async (typeId, page, limit) => {
        setIsPending(true);
        try {
            const res = await ProductService.getAllProduct('', 100);
            
            if (res?.status === 'OK' && res?.data) {
                // Lọc sản phẩm theo typeId
                const filtered = res.data.filter(product => 
                    product.type === typeId || 
                    (typeof product.type === 'object' && product.type?._id === typeId)
                );
                
                setProducts(filtered);
                setPanigate({
                    page: 0,
                    limit: filtered.length,
                    total: filtered.length
                });
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products by typeId:', error);
            setProducts([]);
        } finally {
            setIsPending(false);
        }
    };
    
    // Lấy sản phẩm dựa trên tên loại
    const fetchProductsByTypeName = async (typeName, page, limit) => {
        setIsPending(true);
        try {
            // Nếu typeName là 'all', lấy tất cả sản phẩm
            if (typeName === 'all') {
                setTypeName('Tất cả sản phẩm');
                const res = await ProductService.getAllProduct('', 100);
                if (res?.status === 'OK') {
                    setProducts(res.data || []);
                    setPanigate({
                        page: 0,
                        limit: res.data.length,
                        total: res.data.length
                    });
                }
                setIsPending(false);
                return;
            }
            
            // Tìm typeId từ tên loại
            const matchedType = availableTypes.find(type => 
                type.name.toLowerCase() === typeName.toLowerCase()
            );
            
            if (matchedType) {
                setTypeName(matchedType.name);
                await fetchProductsByTypeId(matchedType._id, page, limit);
            } else {
                // Nếu không tìm thấy loại chính xác, lấy tất cả sản phẩm
                console.log(`Type "${typeName}" not found. Available types:`, availableTypes.map(t => t.name));
                
                const res = await ProductService.getAllProduct('', 100);
                // Lọc sản phẩm tương đối theo tên loại
                const filtered = res.data.filter(product => {
                    const productTypeName = typeof product.type === 'object' ? 
                        product.type?.name : String(product.type);
                    
                    return productTypeName && productTypeName.toLowerCase().includes(typeName.toLowerCase());
                });
                
                setTypeName(typeName || 'Sản phẩm');
                setProducts(filtered);
                setPanigate({
                    page: 0,
                    limit: filtered.length,
                    total: filtered.length
                });
            }
        } catch (error) {
            console.error('Error in fetchProductsByTypeName:', error);
            setProducts([]);
            message.error('Có lỗi xảy ra khi tải sản phẩm');
        } finally {
            setIsPending(false);
        }
    };
    
    // Xử lý type từ URL hoặc state
    useEffect(() => {
        if (!availableTypes.length) return; // Đợi cho đến khi có danh sách loại
        
        if (state) {
            console.log('Using state from navigation:', state);
            
            if (typeof state === 'object' && state._id) {
                // Nếu có _id, lấy sản phẩm theo id
                setTypeName(state.name || 'Sản phẩm');
                fetchProductsByTypeId(state._id, panigate.page, panigate.limit);
            } else if (typeof state === 'object' && state.name) {
                // Nếu có name, lấy sản phẩm theo tên
                fetchProductsByTypeName(state.name, panigate.page, panigate.limit);
            } else {
                // Nếu state là chuỗi
                fetchProductsByTypeName(state, panigate.page, panigate.limit);
            }
        } else {
            // Lấy từ URL
            const path = window.location.pathname;
            const parts = path.split('/');
            const lastPart = parts[parts.length - 1];
            
            // Chuẩn hóa URL (thay thế _ bằng dấu cách)
            let decodedType = decodeURIComponent(lastPart);
            decodedType = decodedType.replace(/_/g, ' ');
            
            console.log('Type from URL:', decodedType);
            fetchProductsByTypeName(decodedType, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit, availableTypes]);
    
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
                                    <Empty 
                                        description={
                                            <span>
                                                Không tìm thấy sản phẩm thuộc loại "{typeName}".<br/>
                                                <a onClick={() => navigate('/')}>Xem tất cả sản phẩm</a>
                                            </span>
                                        }
                                        style={{margin: '40px auto'}}
                                    />
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