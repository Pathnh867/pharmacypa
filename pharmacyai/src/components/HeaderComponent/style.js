import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    padding: 10px 0;
    background-color: #4cb551;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`

export const WrapperTextHeader = styled.span`
   font-size: 22px;
   color: #fff;
   font-weight: bold;
   text-align: left;
   text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
   letter-spacing: 0.5px;
   transition: transform 0.2s;
   
   &:hover {
     transform: scale(1.02);
   }
`

export const ActionGroup = styled.div`
   display: flex;
   align-items: center;
   justify-content: flex-end;
   height: 100%;
`

export const WrapperHeaderAccount = styled.div`
   display: flex;
   align-items: center;
   color: #fff;
   cursor: pointer;
   padding: 6px 10px;
   border-radius: 6px;
   white-space: nowrap;
   
   &:hover {
      background: rgba(255,255,255,0.1);
   }
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const WrapperTextCart = styled.span`
   font-size: 15px;
   color: #fff;
   margin-left: 5px;
`

export const WrapperHeaderCart = styled.div`
   display: flex;
   align-items: center;
   color: #fff;
   cursor: pointer;
   padding: 6px 10px;
   border-radius: 6px;
   white-space: nowrap;
   
   &:hover {
      background: rgba(255,255,255,0.1);
   }
`

export const WrapperContentPopup = styled.div`
   cursor: pointer;
   padding: 8px 16px;
   transition: all 0.2s;
   border-radius: 4px;
   font-size: 14px;
   
   &:hover {
      color: #4cb551;
      background: #f0f0f0;
   }
`