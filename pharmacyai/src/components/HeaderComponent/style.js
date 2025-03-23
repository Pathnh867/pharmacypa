import styled from 'styled-components';
import { Avatar, Badge } from 'antd';

export const HeaderContainer = styled.div`
  width: 100%;
  background: #4cb551;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
  box-shadow: ${props => props.scrolled ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};
`;

export const HeaderContent = styled.div`
  max-width: 1270px;
  height: 64px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    height: 56px;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

export const LogoText = styled.span`
  color: white;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const SearchContainer = styled.div`
  width: 500px;
  margin: 0 30px;
  
  @media (max-width: 1024px) {
    width: 350px;
    margin: 0 20px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const UserAvatar = styled(Avatar)`
  background-color: #fff;
  color: #4cb551;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  line-height: 1.2;
`;

export const UserName = styled.span`
  color: white;
  font-size: 14px;
  font-weight: 500;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  cursor: pointer;
  color: white;
  border-radius: 4px;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const CartBadge = styled(Badge)`
  .ant-badge-count {
    background-color: #ff4d4f;
  }
`;

export const CartText = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

export const MobileMenuButton = styled.button`
  display: none;
  border: none;
  background: transparent;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  position: absolute;
  left: 16px;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileDrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const MobileUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 4px 0 0;
    color: #666;
    font-size: 13px;
  }
`;

export const MobileSearchContainer = styled.div`
  margin-bottom: 24px;
  
  .ant-input-affix-wrapper {
    border-radius: 4px;
    
    &:hover, &:focus {
      border-color: #4cb551;
    }
  }
`;

export const MobileMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MobileMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 15px;
  color: ${props => props.danger ? '#ff4d4f' : '#333'};
  
  .anticon {
    margin-right: 12px;
    font-size: 16px;
    color: ${props => props.danger ? '#ff4d4f' : '#4cb551'};
  }
  
  &:hover {
    background-color: ${props => props.danger ? '#fff1f0' : '#f0f7f0'};
  }
`;

export const CategoryMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3aa43f;
  padding: 8px 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const CategoryItem = styled.div`
  color: white;
  font-size: 14px;
  padding: 4px 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: white;
    transition: all 0.3s;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 70%;
  }
`;