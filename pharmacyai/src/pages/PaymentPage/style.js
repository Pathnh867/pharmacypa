import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    background: rgb(255,255,255);
    padding: 9px 16px;
    border-radius: 4px;
    align-items: center;
    display: flex;
    span {
        color: rgb(36, 36,36);
        font-weight: 400;
        font-size: 13px;
    };
`
export const WrapperLeft = styled.div`
    width: 910px;
`
export const WrapperListOrder = styled.div`

`
export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;

`
export const WrapperPriceDiscount = styled.div`
    color: #999;
    font-size: 12px;
    text-decoration: line-through;
    margin-left: 4px;

`
export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 84px;
    border: 1px solid #ccc;
    border-radius: 4px;
`
export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`
export const WrapperInfo = styled.div`
    padding: 17px 20px;
    border-bottom: 1px solid #f5f5f5;
    background: #fff;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    width: 100%;

`

export const WrapperTotal = styled.div`
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 17px 20px;
    background: #fff;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
`
export const WrapperInfodiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
export const WrapperInfospan = styled.span`
    color: #000;
    font-size: 14px;
    font-weight: bold;
`
export const Label = styled.label`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px; /* Khoảng cách giữa label và các radio buttons */
    display: block; /* Đảm bảo label chiếm dòng mới */
`
export const WrapperRadio = styled.div`
    display: flex;
    flex-direction: column; /* Các radio button xếp theo cột */
    gap: 8px; /* Khoảng cách giữa các radio buttons */
    .ant-radio-wrapper {
        font-size: 14px;
        font-weight: 400;
        color: #666; /* Màu sắc cho văn bản radio */
        padding-left: 10px; /* Khoảng cách giữa radio và văn bản */
        display: flex;
        align-items: center;
        }
    .ant-radio-wrapper:hover {
        background-color: #f1f1f1; /* Màu nền khi hover */
        cursor: pointer;
        }
    .ant-radio-checked .ant-radio-inner {
        border-color: #4cb551; /* Màu viền khi radio button được chọn */
        background-color: #4cb551; /* Màu nền khi radio được chọn */
        }

`
