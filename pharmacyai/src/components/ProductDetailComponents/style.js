import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;

`
export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;

`
export const WrapperStyleNameProduct = styled.h1`
    font-size: 24px;
    font-weight: bold;
    line-height: 28px;
    color: #333;
`
export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: #279c59;
`
export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
`
export const WrapperPriceTextProduct = styled.h1`
    font-size: 32px;
    line-height: 40px;
    font-weight: 500px;
    padding: 10px;
    margin-top: 10px;
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
    }
`
export const WrapperQualityProduct = styled.h1`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
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