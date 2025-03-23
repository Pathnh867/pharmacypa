import { Col, Image, InputNumber, Tabs } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
    border-radius: 4px;
    
    &.active {
        border: 2px solid #4cb551;
    }
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
    cursor: pointer;
    
    &:hover {
        transform: translateY(-2px);
        transition: all 0.3s;
    }
`

export const WrapperStyleNameProduct = styled.h1`
    font-size: 24px;
    font-weight: bold;
    line-height: 28px;
    color: #333;
    margin-bottom: 8px;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: #279c59;
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
    padding: 10px;
    margin: 15px 0;
`

export const WrapperPriceTextProduct = styled.span`
    font-size: 24px;
    line-height: 32px;
    font-weight: 500;
    color: #ff4d4f;
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsisl;
    };
    span.changeAddress {
        color: #279c59;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        cursor: pointer;
        
        &:hover {
            text-decoration: underline;
        }
    }
`

export const WrapperQualityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
    
    button {
        &:hover {
            background: #f1f1f1 !important;
        }
        
        &:disabled {
            cursor: not-allowed !important;
            color: #d9d9d9 !important;
        }
    }
`

export const WrapperInputNumber = styled(InputNumber)`
    &.ant-input-number.ant-input-number-sm {
        width: 40px;
        border-top: none;
        border-bottom: none;
        .ant-input-number-handler-wrap {
            display: none !important;
        }
    }
`

export const WrapperProductInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  p {
    margin-bottom: 16px;
    line-height: 1.6;
  }
  
  ul {
    margin-bottom: 16px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.6;
    }
  }
`

export const WrapperFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`

export const WrapperFeatureItem = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  
  .feature-icon {
    color: #4cb551;
    font-size: 24px;
    margin-right: 12px;
  }
`

export const WrapperContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
`

export const WrapperBreadcrumb = styled.div`
  margin-bottom: 16px;
  
  .ant-breadcrumb {
    font-size: 14px;
    
    a {
      color: #4cb551;
      
      &:hover {
        color: #45a349;
      }
    }
  }
`

export const WrapperMainContent = styled.div`
  display: flex;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
`

export const WrapperActions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`

export const WrapperTabs = styled(Tabs)`
  margin-top: 24px;
  padding: 0 24px;
  
  .ant-tabs-nav {
    margin-bottom: 16px;
  }
  
  .ant-tabs-tab {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4cb551;
    font-weight: 600;
  }
  
  .ant-tabs-ink-bar {
    background: #4cb551;
  }
  
  .ant-card-body {
    padding: 24px;
  }
`

export const WrapperStyleHeader = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
  color: #333;
`

export const WrapperStyleHeaderSmall = styled.div`
  font-size: 12px;
  color: #666;
`