import { Upload } from "antd";
import styled from "styled-components";

export const ProfileContainer = styled.div`
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  padding: 30px 20px;
  background-color: #f7f7f7;
  min-height: calc(100vh - 124px);
`;

export const WrapperHeader = styled.h1`
  color: #333;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
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
`;

export const TabsContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  .ant-tabs-nav {
    margin-bottom: 0;
    padding: 0 20px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #eee;
  }
  
  .ant-tabs-tab {
    padding: 16px 20px;
    font-size: 15px;
    
    .anticon {
      margin-right: 10px;
      color: #4cb551;
    }
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #4cb551;
    font-weight: 600;
  }
  
  .ant-tabs-ink-bar {
    background: #4cb551;
    height: 3px;
  }
  
  .ant-tabs-content {
    padding: 24px;
  }
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  gap: 24px;
`;

export const WrapperLabel = styled.label`
  color: #666;
  font-size: 14px;
  line-height: 30px;
  font-weight: 600;
  width: 120px;
  text-align: left;
`;

export const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const InputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  
  .ant-input {
    border-radius: 6px;
    transition: all 0.3s;
    
    &:hover {
      border-color: #4cb551;
    }
    
    &:focus {
      border-color: #4cb551;
      box-shadow: 0 0 0 2px rgba(76, 181, 81, 0.2);
    }
  }
`;

export const UpdateButton = styled.div`
  margin-left: 12px;
  
  button {
    background-color: #f0f7f0;
    border: 1px solid #4cb551;
    color: #4cb551;
    transition: all 0.3s;
    
    &:hover {
      background-color: #4cb551;
      color: white;
    }
  }
`;

export const WrapperUploadFile = styled(Upload)`
  display: flex;
  align-items: center;
  
  .ant-upload-select {
    margin-right: 16px;
  }
  
  .ant-upload.ant-upload-select {
    margin-bottom: 0;
  }
  
  .ant-upload-list-item-info {
    display: none;
  }
  
  .ant-upload-list-item-name {
    display: none;
  }
  
  .ant-btn {
    border-color: #4cb551;
    color: #4cb551;
    
    &:hover {
      color: white;
      background-color: #4cb551;
      border-color: #4cb551;
    }
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  
  img {
    border-radius: 50%;
    object-fit: cover;
    margin-left: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: 2px solid white;
  }
`;

export const ProfileSection = styled.div`
  margin-bottom: 30px;
  
  h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
    position: relative;
    padding-bottom: 8px;
    display: inline-block;
    
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 2px;
      background-color: #4cb551;
    }
  }
`;

export const AddressesContainer = styled.div`
  padding: 0 20px;
`;

export const NoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
  
  button {
    background-color: #4cb551;
    border-color: #4cb551;
    
    &:hover {
      background-color: #3ca142;
      border-color: #3ca142;
    }
  }
`;