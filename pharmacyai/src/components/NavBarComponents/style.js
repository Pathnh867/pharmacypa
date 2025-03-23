import styled from "styled-components";
import { Checkbox, Radio, Slider } from "antd";

export const NavBarContainer = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const CategoryTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 16px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #4cb551;
  }
`;

export const SectionContainer = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FilterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
    padding-left: 8px;
  }
`;

export const TextValue = styled.span`
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
  
  &:hover {
    color: #4cb551;
  }
`;

export const PriceRangeContainer = styled.div`
  padding: 10px 0;
`;

export const PriceValue = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  
  span {
    font-size: 14px;
    color: #666;
  }
`;

export const StyledSlider = styled(Slider)`
  .ant-slider-track {
    background-color: #4cb551;
  }
  
  .ant-slider-handle {
    border-color: #4cb551;
    
    &:focus {
      box-shadow: 0 0 0 5px rgba(76, 181, 81, 0.12);
    }
  }
`;

export const StyledCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #4cb551;
    border-color: #4cb551;
  }
  
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: #4cb551;
  }
  
  span {
    font-size: 14px;
    color: #666;
  }
`;

export const StyledRadioGroup = styled(Radio.Group)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .ant-radio-checked .ant-radio-inner {
    border-color: #4cb551;
    
    &:after {
      background-color: #4cb551;
    }
  }
  
  .ant-radio:hover .ant-radio-inner {
    border-color: #4cb551;
  }
`;

export const StyledRadio = styled(Radio)`
  span {
    font-size: 14px;
    color: #666;
  }
`;

export const ApplyButton = styled.button`
  background-color: #4cb551;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 16px;
  
  &:hover {
    background-color: #3ca142;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

export const ResetButton = styled.button`
  background-color: transparent;
  color: #666;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  margin-top: 8px;
  
  &:hover {
    color: #4cb551;
    border-color: #4cb551;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 16px 0;
`;

export const Badge = styled.span`
  background-color: #f0f7f0;
  color: #4cb551;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: 8px;
`;

export const RatingContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 0;
  
  &:hover {
    .star-icon {
      color: #fadb14;
    }
    
    span {
      color: #4cb551;
    }
  }
  
  .star-icon {
    color: #fadb14;
    font-size: 16px;
    margin-right: 5px;
  }
`;