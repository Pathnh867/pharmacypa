import React, { useEffect, useState } from 'react';
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent';
import CardComponent from '../../components/CardComponents/CardComponent';
import { Col, Pagination, Row, Typography, Empty, message, Spin, Breadcrumb } from 'antd';
import { 
  WrapperNavBar, 
  WrapperProducts, 
  PageContainer, 
  ProductContainer, 
  CategoryHeader, 
  BreadcrumbContainer, 
  SpinContainer 
} from './style';
import { useLocation, useNavigate } from 'react-router-dom';
import * as ProductService from '../../services/ProductService';
import Loading from '../../components/LoadingComponent/Loading';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';
import { HomeOutlined, AppstoreOutlined, TagOutlined } from '@ant-design/icons';

const { Title } = Typography;

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
    const [currentFilters, setCurrentFilters] = useState(null);
    
    // Lấy danh sách các loại có sẵn
    const fetchAvailableTypes = async () => {
        try {
            const res = await ProductService.getAllTypeProduct();
            if (res?.status === 'OK') {
                setAvailableTypes(res.data || []);
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
                
                // Áp dụng bộ lọc nếu có
                let filteredProducts = [...filtered];
                
                if (currentFilters) {
                    filteredProducts = applyFiltersToProducts(filteredProducts, currentFilters);
                }
                
                setProducts(filteredProducts);
                setPanigate({
                    page: 0,
                    limit: filteredProducts.length,
                    total: filteredProducts.length
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
                    let allProducts = res.data || [];
                    
                    // Áp dụng bộ lọc nếu có
                    if (currentFilters) {
                        allProducts = applyFiltersToProducts(allProducts, currentFilters);
                    }
                    
                    setProducts(allProducts);
                    setPanigate({
                        page: 0,
                        limit: allProducts.length,
                        total: allProducts.length
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
                let filtered = res.data.filter(product => {
                    const productTypeName = typeof product.type === 'object' ? 
                        product.type?.name : String(product.type);
                    
                    return productTypeName && productTypeName.toLowerCase().includes(typeName.toLowerCase());
                });
                
                // Áp dụng bộ lọc nếu có
                if (currentFilters) {
                    filtered = applyFiltersToProducts(filtered, currentFilters);
                }
                
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
    
    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (filters) => {
        setCurrentFilters(filters);
        
        if (!filters) {
            // Nếu reset bộ lọc, tải lại sản phẩm
            if (state && typeof state === 'object' && state._id) {
                fetchProductsByTypeId(state._id, panigate.page, panigate.limit);
            } else if (state) {
                fetchProductsByTypeName(typeof state === 'object' ? state.name : state, panigate.page, panigate.limit);
            } else {
                const path = window.location.pathname;
                const parts = path.split('/');
                const lastPart = parts[parts.length - 1];
                let decodedType = decodeURIComponent(lastPart).replace(/_/g, ' ');
                fetchProductsByTypeName(decodedType, panigate.page, panigate.limit);
            }
            return;
        }
        
        // Nếu có sản phẩm, áp dụng bộ lọc
        if (products.length > 0) {
            const filteredProducts = applyFiltersToProducts(products, filters);
            setProducts(filteredProducts);
        }
    };
    
    // Hàm áp dụng bộ lọc cho sản phẩm
    const applyFiltersToProducts = (products, filters) => {
        if (!filters) return products;
        
        return products.filter(product => {
            // Lọc theo khoảng giá
            if (filters.priceRange && product.price) {
                if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
                    return false;
                }
            }
            
            // Lọc theo xếp hạng
            if (filters.rating && product.rating) {
                if (product.rating < filters.rating) {
                    return false;
                }
            }
            
            // Lọc theo hàng có sẵn
            if (filters.inStock && product.countInStock !== undefined) {
                if (product.countInStock <= 0) {
                    return false;
                }
            }
            
            // Lọc theo giảm giá
            if (filters.hasDiscount && product.discount !== undefined) {
                if (!product.discount || product.discount <= 0) {
                    return false;
                }
            }
            
            return true;
        }).sort((a, b) => {
            // Sắp xếp theo các tùy chọn
            if (filters.sortOption === 'priceAsc') {
                return a.price - b.price;
            } else if (filters.sortOption === 'priceDesc') {
                return b.price - a.price;
            } else if (filters.sortOption === 'newest') {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            } else if (filters.sortOption === 'popular') {
                return (b.selled || 0) - (a.selled || 0);
            }
            
            return 0;
        });
    };
    
    const onChange = (current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize});
    };
    
    return (
        <PageContainer>
            <div style={{ width: '1270px', margin: '0 auto', padding: '20px 0' }}>
                <BreadcrumbContainer>
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">
                            <HomeOutlined />
                            <span>Trang chủ</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <AppstoreOutlined />
                            <span>Sản phẩm</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <TagOutlined />
                            <span>{typeName}</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </BreadcrumbContainer>
                
                <CategoryHeader>
                    <Title level={3}>{typeName}</Title>
                    <div className="result-count">
                        {products.length > 0 && (
                            <span>Tìm thấy {products.length} sản phẩm</span>
                        )}
                    </div>
                </CategoryHeader>
                
                <ProductContainer>
                    <WrapperNavBar span={5}>
                        <NavBarComponent onFilterChange={handleFilterChange} />
                    </WrapperNavBar>
                    
                    <Col span={19} style={{ paddingLeft: '20px' }}>
                        {isPending ? (
                            <SpinContainer>
                                <Spin size="large" tip="Đang tải sản phẩm..." />
                            </SpinContainer>
                        ) : products?.length > 0 ? (
                            <>
                                <WrapperProducts>
                                    {products.map((product) => (
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
                                    ))}
                                </WrapperProducts>
                                
                                {products.length > 10 && (
                                    <Pagination 
                                        current={panigate.page + 1} 
                                        total={panigate.total} 
                                        pageSize={panigate.limit}
                                        onChange={onChange} 
                                        style={{ textAlign: 'center', marginTop: '20px' }} 
                                    />
                                )}
                            </>
                        ) : (
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
                    </Col>
                </ProductContainer>
            </div>
        </PageContainer>
    );
};

export default TypeProductPage;