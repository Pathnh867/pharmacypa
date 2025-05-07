// Thêm vào NavBarComponent

import React, { useState, useEffect } from 'react';
import { Checkbox, Divider, Radio, Slider, Button, Typography } from 'antd';
import { FileProtectOutlined, SafetyCertificateOutlined, FilterOutlined, UndoOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Text } = Typography;

// Định nghĩa styled components
const FilterSection = styled.div`
  margin-bottom: 24px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const FilterTitle = styled(Title)`
  margin: 0 !important;
  font-size: 16px !important;
  color: #333;
`;

const FilterDivider = styled(Divider)`
  margin: 12px 0;
`;

const PrescriptionFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PrescriptionFilterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
  
  &.selected {
    background: #e6f7ff;
  }
  
  .icon {
    margin-right: 10px;
    font-size: 16px;
  }
  
  .name {
    flex: 1;
  }
  
  .prescription-icon {
    color: #c41d7f;
  }
  
  .non-prescription-icon {
    color: #389e0d;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
`;

// Component NavBar
const NavBarComponent = ({ onFilterChange }) => {
  // State cho các bộ lọc
  const [selectedPrescriptionType, setSelectedPrescriptionType] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [rating, setRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [sortOption, setSortOption] = useState('default');
  
  // Xử lý khi bộ lọc thay đổi
  useEffect(() => {
    // Tạo đối tượng bộ lọc
    const filters = {
      priceRange,
      rating,
      inStock,
      hasDiscount,
      sortOption,
      requiresPrescription: selectedPrescriptionType
    };
    
    // Gọi callback để thông báo thay đổi
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [selectedPrescriptionType, priceRange, rating, inStock, hasDiscount, sortOption]);
  
  // Xử lý khi chọn loại thuốc
  const handlePrescriptionTypeSelect = (type) => {
    if (selectedPrescriptionType === type) {
      // Bỏ chọn nếu click vào loại đã chọn
      setSelectedPrescriptionType(null);
    } else {
      setSelectedPrescriptionType(type);
    }
  };
  
  // Reset tất cả bộ lọc
  const handleResetFilters = () => {
    setSelectedPrescriptionType(null);
    setPriceRange([0, 1000000]);
    setRating(0);
    setInStock(false);
    setHasDiscount(false);
    setSortOption('default');
  };
  
  // Format giá tiền
  const formatCurrency = (value) => {
    return `${value.toLocaleString('vi-VN')}đ`;
  };
  
  return (
    <div>
      <FilterSection>
        <FilterHeader>
          <FilterTitle level={5}>Bộ lọc sản phẩm</FilterTitle>
          <Button 
            type="text"
            icon={<UndoOutlined />} 
            onClick={handleResetFilters}
          >
            Đặt lại
          </Button>
        </FilterHeader>
        
        {/* Lọc theo loại thuốc */}
        <div>
          <Text strong>Loại thuốc</Text>
          <FilterDivider />
          <PrescriptionFilterGroup>
            <PrescriptionFilterItem 
              className={selectedPrescriptionType === true ? 'selected' : ''}
              onClick={() => handlePrescriptionTypeSelect(true)}
            >
              <FileProtectOutlined className="icon prescription-icon" />
              <span className="name">Thuốc kê đơn</span>
              {selectedPrescriptionType === true && (
                <Checkbox checked />
              )}
            </PrescriptionFilterItem>
            
            <PrescriptionFilterItem 
              className={selectedPrescriptionType === false ? 'selected' : ''}
              onClick={() => handlePrescriptionTypeSelect(false)}
            >
              <SafetyCertificateOutlined className="icon non-prescription-icon" />
              <span className="name">Thuốc không kê đơn</span>
              {selectedPrescriptionType === false && (
                <Checkbox checked />
              )}
            </PrescriptionFilterItem>
          </PrescriptionFilterGroup>
        </div>
        
        {/* Lọc theo khoảng giá */}
        <div style={{ marginTop: '24px' }}>
          <Text strong>Khoảng giá</Text>
          <FilterDivider />
          <div style={{ padding: '0 10px' }}>
            <Slider
              range
              min={0}
              max={1000000}
              step={50000}
              value={priceRange}
              onChange={setPriceRange}
              tipFormatter={formatCurrency}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <Text>{formatCurrency(priceRange[0])}</Text>
              <Text>{formatCurrency(priceRange[1])}</Text>
            </div>
          </div>
        </div>
        
        {/* Lọc theo đánh giá */}
        <div style={{ marginTop: '24px' }}>
          <Text strong>Đánh giá</Text>
          <FilterDivider />
          <Radio.Group onChange={(e) => setRating(e.target.value)} value={rating}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Radio value={0}>Tất cả</Radio>
              <Radio value={4}>Từ 4 sao trở lên</Radio>
              <Radio value={3}>Từ 3 sao trở lên</Radio>
              <Radio value={2}>Từ 2 sao trở lên</Radio>
            </div>
          </Radio.Group>
        </div>
        
        {/* Các tùy chọn khác */}
        <div style={{ marginTop: '24px' }}>
          <Text strong>Tùy chọn khác</Text>
          <FilterDivider />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Checkbox checked={inStock} onChange={(e) => setInStock(e.target.checked)}>
              Còn hàng
            </Checkbox>
            <Checkbox checked={hasDiscount} onChange={(e) => setHasDiscount(e.target.checked)}>
              Đang giảm giá
            </Checkbox>
          </div>
        </div>
        
        {/* Sắp xếp theo */}
        <div style={{ marginTop: '24px' }}>
          <Text strong>Sắp xếp theo</Text>
          <FilterDivider />
          <Radio.Group onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Radio value="default">Mặc định</Radio>
              <Radio value="priceAsc">Giá: Thấp đến cao</Radio>
              <Radio value="priceDesc">Giá: Cao đến thấp</Radio>
              <Radio value="newest">Mới nhất</Radio>
              <Radio value="popular">Phổ biến nhất</Radio>
            </div>
          </Radio.Group>
        </div>
        
        {/* Nút áp dụng bộ lọc */}
        <ActionButtons>
          <Button 
            type="primary" 
            icon={<FilterOutlined />} 
            size="large"
            style={{ width: '100%', background: '#4cb551', borderColor: '#4cb551' }}
          >
            Áp dụng bộ lọc
          </Button>
        </ActionButtons>
      </FilterSection>
    </div>
  );
};

export default NavBarComponent;