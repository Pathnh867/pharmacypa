import { Row } from "antd";
import styled from "styled-components";


export const WrapperHeader = styled(Row)`
    padding: 10px 0;
    background-color:#4cb551;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`

export const WrapperTextHeader = styled.span`
   font-size: 20px;
   color: #fff;
   font-weight: bold;
   text-align: left;
`
export const WrapperHeaderAccount = styled.span`
   display: flex;
   align-items: center;
   color: #fff;
   gap: 10px;

  
`
export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff
    white-space: nowrap
`
export const WrapperTextCart = styled.span`
   font-size: 16px;
   color: #fff;
`
export const WrapperHeaderCart = styled.span`
   display: flex;
   align-items: center;
   color: #fff;
   gap: 10px;
`
export const WrapperContentPopup = styled.p`
   cursor: pointer;
   &:hover {
      background:#4cb551;
   }
`
