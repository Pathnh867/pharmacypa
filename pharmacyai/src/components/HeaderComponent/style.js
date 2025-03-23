import { Row } from "antd";
import styled from "styled-components";

export const HeaderContainer = styled(Row)`
    padding: 12px 0;
    background-color: #4cb551;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`;

export const WrapperHeader = styled(Row)`
    padding: 10px 0;
    background-color:#4cb551;
    align-items: center;
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`

export const Logo = styled.div`
    display: flex;
    align-items: center;
    transition: all 0.3s;
    
    &:hover {
        transform: scale(1.02);
    }
`;

export const LogoText = styled.span`
    font-size: 22px;
    letter-spacing: 0.5px;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
`;

export const WrapperTextHeader = styled.span`
   font-size: 20px;
   color: #fff;
   font-weight: bold;
   text-align: left;
`

export const HeaderSearch = styled.div`
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover, &:focus-within {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .ant-input {
        background: transparent;
        color: white;
        
        &::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
    }
    
    .ant-btn {
        background: #fff;
        color: #4cb551;
        border: none;
        
        &:hover {
            background: #f0f0f0;
        }
    }
`;

export const SearchIconWrapper = styled.div`
    padding: 0 12px;
    height: 100%;
    display: flex;
    align-items: center;
    color: white;
`;

export const HeaderActions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 24px;
`;

export const WrapperHeaderAccount = styled.div`
   display: flex;
   align-items: center;
   color: #fff;
   gap: 10px;
   cursor: pointer;
   padding: 6px 12px;
   border-radius: 8px;
   transition: all 0.3s;
   
   &:hover {
      background: rgba(255,255,255,0.1);
   }
`

export const UserActionGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    
    .anticon {
        color: #fff;
    }
`;

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
`

export const WrapperTextCart = styled.span`
   font-size: 16px;
   color: #fff;
`

export const CartBadge = styled.div`
   display: flex;
   align-items: center;
   color: #fff;
   gap: 10px;
   cursor: pointer;
   padding: 6px 12px;
   border-radius: 8px;
   transition: all 0.3s;
   
   &:hover {
      background: rgba(255,255,255,0.1);
   }
`

export const WrapperHeaderCart = styled.span`
   display: flex;
   align-items: center;
   color: #fff;
   gap: 10px;
`

export const WrapperContentPopup = styled.p`
   cursor: pointer;
   padding: 8px 16px;
   margin: 0;
   transition: all 0.2s;
   border-radius: 4px;
   
   &:hover {
      color: #4cb551;
      background: #f0f0f0;
   }
`