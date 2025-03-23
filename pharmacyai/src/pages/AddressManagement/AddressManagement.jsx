import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Button, Modal, Form, Input, message, Popconfirm, Tag, Avatar } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  HomeOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  PhoneOutlined 
} from '@ant-design/icons';
import * as AddressService from '../../services/AddressService';
import AddressSelection from '../AddressComponents/AddressSelection';

const AddressManagement = () => {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <Card 
        title="Địa chỉ của tôi"
        bordered={false}
      >
        <AddressSelection user={user} onSelectAddress={() => {}} />
      </Card>
    </div>
  );
};

export default AddressManagement;