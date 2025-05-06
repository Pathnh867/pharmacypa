import React from 'react';
import { Tooltip, Tag } from 'antd';
import { FileProtectOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledTag = styled(Tag)`
  margin-right: 0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  
  &.prescription {
    background-color: #ffa39e;
    color: #c41d7f;
    border-color: #ffccc7;
  }
  
  &.non-prescription {
    background-color: #b7eb8f;
    color: #389e0d;
    border-color: #d9f7be;
  }
`;

const PrescriptionBadge = ({ requiresPrescription, style, size = 'default' }) => {
  if (requiresPrescription) {
    return (
      <Tooltip title="Thuốc kê đơn - Cần đơn của bác sĩ">
        <StyledTag 
          className="prescription"
          icon={<FileProtectOutlined />}
          style={style}
          size={size}
        >
          Kê đơn
        </StyledTag>
      </Tooltip>
    );
  }
  
  return (
    <Tooltip title="Thuốc không kê đơn - Có thể mua trực tiếp">
      <StyledTag
        className="non-prescription"
        icon={<SafetyCertificateOutlined />}
        style={style}
        size={size}
      >
        Không kê đơn
      </StyledTag>
    </Tooltip>
  );
};

export default PrescriptionBadge;