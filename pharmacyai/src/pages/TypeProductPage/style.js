import { Col } from "antd";
import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  background: #f7f7f7;
  min-height: calc(100vh - 64px);
`;

export const ProductContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

export const WrapperProducts = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const WrapperNavBar = styled(Col)`
  margin-right: 10px;
  height: fit-content;
`;

export const CategoryHeader = styled.div`
  margin-bottom: 20px;
  
  h3 {
    color: #333;
    margin-bottom: 8px;
    position: relative;
    padding-bottom: 12px;
    display: inline-block;
    
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background-color: #4cb551;
    }
  }
  
  .result-count {
    color: #666;
    font-size: 14px;
  }
`;

export const BreadcrumbContainer = styled.div`
  margin-bottom: 20px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a, span {
      color: #666;
      
      &:hover {
        color: #4cb551;
      }
    }
    
    .anticon {
      margin-right: 6px;
    }
    
    .ant-breadcrumb-link {
      display: flex;
      align-items: center;
    }
  }
`;

export const SpinContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  
  .ant-spin-text {
    margin-top: 12px;
    color: #4cb551;
  }
  
  .ant-spin-dot-item {
    background-color: #4cb551;
  }
`;