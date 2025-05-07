import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img{
        height: 176.4px;
        width: 176.4px;
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgb(56,56,61);
    font-weight: 400;

`
export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 6px 0 0;
`
export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 73);
    font-size: 16px;
    font-weight: 500;
`
export const WrapperDiscountText = styled.span`
    color: rgb(255, 66, 73);
    font-size: 12px;
    font-weight: 500;
`

export const ProductBadges = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
  z-index: 1;
`;

export const WrapperCardContent = styled.div`
  padding: 8px 0;
`;

export const OldPriceText = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 12px;
  margin-left: 8px;
`;

export const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  gap: 8px;
  
  .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
    font-size: 13px;
    
    &.view {
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #e0e0e0;
      }
    }
    
    &.cart {
      background: #e8f5e9;
      color: #4cb551;
      
      &:hover {
        background: #c8e6c9;
      }
    }
  }
`;