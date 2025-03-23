import React, { useState, useEffect } from 'react';
import { 
  NavBarContainer, CategoryTitle, SectionContainer, FilterList, 
  FilterItem, TextValue, PriceRangeContainer, PriceValue, 
  StyledSlider, StyledCheckbox, StyledRadioGroup, StyledRadio,
  ApplyButton, ResetButton, Divider, Badge, RatingContainer
} from './style';
import { Rate, Collapse, Tooltip } from 'antd';
import { 
  FilterOutlined, 
  StarFilled, 
  PercentageOutlined, 
  ThunderboltOutlined, 
  TagOutlined,
  SortAscendingOutlined,
  GiftOutlined
} from '@ant-design/icons';
import * as ProductService from '../../services/ProductService';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertPrice } from '../../utils';

const { Panel } = Collapse;

const NavBarComponent = ({ onFilterChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [types, setTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [availableFilters, setAvailableFilters] = useState({
    inStock: false,
    hasDiscount: false
  });
  const [sortOption, setSortOption] = useState('');
  
  // Fetch tất cả loại sản phẩm
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
          setTypes(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching product types:', error);
      }
    };
    
    fetchTypes();
  }, []);
  
  // Xử lý click vào loại sản phẩm
  const handleTypeClick = (type) => {
    // Chuyển hướng đến trang loại sản phẩm
    const typeName = typeof type === 'object' && type.name ? 
      type.name : String(type);
    
    const path = typeName.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ /g, '_');
    
    navigate(`/product/${path}`, { state: type });
  };
  
  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (value) => {
    setPriceRange(value);
  };
  
  // Xử lý thay đổi xếp hạng
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };
  
  // Xử lý thay đổi các bộ lọc khả dụng
  const handleAvailableFilterChange = (e) => {
    const { name, checked } = e.target;
    setAvailableFilters(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Xử lý thay đổi tùy chọn sắp xếp
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  // Áp dụng bộ lọc
  const applyFilters = () => {
    if (typeof onFilterChange === 'function') {
      onFilterChange({
        priceRange,
        rating: selectedRating,
        inStock: availableFilters.inStock,
        hasDiscount: availableFilters.hasDiscount,
        sortOption
      });
    }
  };
  
  // Reset các bộ lọc
  const resetFilters = () => {
    setPriceRange([0, 1000000]);
    setSelectedRating(0);
    setAvailableFilters({
      inStock: false,
      hasDiscount: false
    });
    setSortOption('');
    
    if (typeof onFilterChange === 'function') {
      onFilterChange(null);
    }
  };
  
  // Render các mục danh mục
  const renderCategories = () => {
    if (!types || types.length === 0) {
      return <TextValue>Đang tải danh mục...</TextValue>;
    }
    
    return (
      <FilterList>
        <FilterItem onClick={() => handleTypeClick('all')}>
          <TextValue>Tất cả sản phẩm</TextValue>
        </FilterItem>
        {types.map((type, index) => (
          <FilterItem key={type._id || index} onClick={() => handleTypeClick(type)}>
            <TextValue>{type.name}</TextValue>
          </FilterItem>
        ))}
      </FilterList>
    );
  };
  
  // Render các mục xếp hạng
  const renderRatings = () => {
    return (
      <FilterList>
        {[5, 4, 3, 2, 1].map(rating => (
          <RatingContainer key={rating} onClick={() => handleRatingChange(rating)}>
            <Rate 
              disabled 
              defaultValue={rating} 
              className="star-rating"
              style={{ fontSize: '16px' }}
            />
            <TextValue style={{ marginLeft: '8px' }}>
              {rating} {rating === 1 ? 'sao' : 'sao'} trở lên
            </TextValue>
            {selectedRating === rating && (
              <Tooltip title="Đang lọc">
                <Badge>✓</Badge>
              </Tooltip>
            )}
          </RatingContainer>
        ))}
      </FilterList>
    );
  };
  
  return (
    <NavBarContainer>
      <Collapse 
        defaultActiveKey={['1', '2', '3', '4']} 
        expandIconPosition="end"
        ghost
        bordered={false}
      >
        <Panel 
          header={
            <CategoryTitle style={{ margin: 0 }}>
              <TagOutlined style={{ marginRight: '8px', color: '#4cb551' }} />
              Danh mục sản phẩm
            </CategoryTitle>
          } 
          key="1"
        >
          {renderCategories()}
        </Panel>
        
        <Panel 
          header={
            <CategoryTitle style={{ margin: 0 }}>
              <FilterOutlined style={{ marginRight: '8px', color: '#4cb551' }} />
              Lọc theo giá
            </CategoryTitle>
          } 
          key="2"
        >
          <PriceRangeContainer>
            <StyledSlider
              range
              min={0}
              max={1000000}
              step={50000}
              value={priceRange}
              onChange={handlePriceChange}
            />
            <PriceValue>
              <span>{convertPrice(priceRange[0])}</span>
              <span>{convertPrice(priceRange[1])}</span>
            </PriceValue>
          </PriceRangeContainer>
        </Panel>
        
        <Panel 
          header={
            <CategoryTitle style={{ margin: 0 }}>
              <StarFilled style={{ marginRight: '8px', color: '#4cb551' }} />
              Đánh giá
            </CategoryTitle>
          } 
          key="3"
        >
          {renderRatings()}
        </Panel>
        
        <Panel 
          header={
            <CategoryTitle style={{ margin: 0 }}>
              <SortAscendingOutlined style={{ marginRight: '8px', color: '#4cb551' }} />
              Sắp xếp
            </CategoryTitle>
          } 
          key="4"
        >
          <StyledRadioGroup onChange={handleSortChange} value={sortOption}>
            <StyledRadio value="priceAsc">Giá thấp đến cao</StyledRadio>
            <StyledRadio value="priceDesc">Giá cao đến thấp</StyledRadio>
            <StyledRadio value="newest">Mới nhất</StyledRadio>
            <StyledRadio value="popular">Phổ biến nhất</StyledRadio>
          </StyledRadioGroup>
        </Panel>
        
        <Panel 
          header={
            <CategoryTitle style={{ margin: 0 }}>
              <GiftOutlined style={{ marginRight: '8px', color: '#4cb551' }} />
              Khuyến mãi
            </CategoryTitle>
          } 
          key="5"
        >
          <div>
            <StyledCheckbox 
              name="inStock" 
              checked={availableFilters.inStock}
              onChange={handleAvailableFilterChange}
            >
              Còn hàng
            </StyledCheckbox>
          </div>
          <div style={{ marginTop: '8px' }}>
            <StyledCheckbox 
              name="hasDiscount" 
              checked={availableFilters.hasDiscount}
              onChange={handleAvailableFilterChange}
            >
              Đang giảm giá
            </StyledCheckbox>
          </div>
        </Panel>
      </Collapse>
      
      <Divider />
      
      <ApplyButton onClick={applyFilters}>
        Áp dụng bộ lọc
      </ApplyButton>
      
      <ResetButton onClick={resetFilters}>
        Đặt lại
      </ResetButton>
    </NavBarContainer>
  );
};

export default NavBarComponent;