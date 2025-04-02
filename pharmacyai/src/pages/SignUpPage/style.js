import styled from "styled-components";

export const AuthBackground = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(76, 181, 81, 0.8) 0%, rgba(58, 164, 63, 0.9) 100%);
  padding: 20px;
`;

export const WrapperContainerAuth = styled.div`
  width: 900px;
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
  
  @media (max-width: 992px) {
    width: 100%;
    max-width: 800px;
    flex-direction: column-reverse;
  }
`;

export const AuthContent = styled.div`
  padding: 40px;
  flex: 1;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

export const AuthImageSection = styled.div`
  flex: 1;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(76, 181, 81, 0.05) 0%, rgba(58, 164, 63, 0.1) 100%);
    z-index: 1;
  }
  
  @media (max-width: 992px) {
    padding: 30px 20px;
    min-height: 250px;
  }
  
  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

export const ImageContainer = styled.div`
  width: 220px;
  height: 220px;
  margin-bottom: 30px;
  z-index: 2;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 992px) {
    width: 180px;
    height: 180px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 768px) {
    width: 160px;
    height: 160px;
    margin-bottom: 15px;
  }
`;

export const ImageTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const ImageSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  max-width: 80%;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  
  .anticon {
    font-size: 30px;
    color: #4cb551;
    margin-right: 10px;
  }
  
  span {
    font-size: 18px;
    font-weight: 700;
    color: #4cb551;
    letter-spacing: 0.5px;
  }
`;

export const FormTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

export const FormSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
`;

export const AuthForm = styled.div`
  width: 100%;
`;

export const FormItem = styled.div`
  position: relative;
  margin-bottom: 20px;
  
  .form-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #4cb551;
    font-size: 16px;
    z-index: 1;
  }
  
  input {
    padding-left: 40px !important;
    height: 48px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    transition: all 0.3s;
    
    &:focus {
      border-color: #4cb551;
      box-shadow: 0 0 0 2px rgba(76, 181, 81, 0.2);
      background-color: white !important;
    }
    
    &:hover {
      border-color: #4cb551;
    }
  }
`;

export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordToggle = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  color: #999;
  z-index: 1;
  
  &:hover {
    color: #4cb551;
  }
`;

export const ForgotPassword = styled.div`
  text-align: right;
  margin-bottom: 20px;
  font-size: 14px;
  color: #4cb551;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
    color: #3a9f3f;
  }
`;

export const SignUpText = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
`;

export const WrapperTextLight = styled.span`
  color: #4cb551;
  font-weight: 600;
  margin-left: 5px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
    color: #3a9f3f;
  }
`;

export const ErrorText = styled.p`
  color: #ff4d4f;
  font-size: 13px;
  margin: -15px 0 20px;
  padding-left: 40px;
`;