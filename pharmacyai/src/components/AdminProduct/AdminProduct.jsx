// pharmacyai/src/components/AdminProduct/AdminProduct.jsx

import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Select, Input, Tag, Tooltip, Space, Upload, message, Divider } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, 
  FilterOutlined, ReloadOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import { getBase64, renderOptions } from '../../utils'
import { convertPrice } from '../../utils'

// Import style mới
import {
  AdminSectionTitle,
  AdminCard,
  AdminTable,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminSearchContainer,
  OrderItem,
  colors
} from './style';

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [typeSelect, setTypeSelect] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(null);
  const user = useSelector((state) => state?.user);
  
  const [stateProduct, setStateProduct] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description: '',
    discount: ''
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description: '',
    discount: ''
  });

  const [form] = Form.useForm();
  const [detailsForm] = Form.useForm();

  // Mutation hooks
  const mutation = useMutationHooks(
    (data) => {
      const { name, image, type, price, countInStock, rating, description, discount } = data;
      const res = ProductService.createProduct({ name, image, type, price, countInStock, rating, description, discount });
      return res;
    }
  );

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data;
      const res = ProductService.updateProduct(id, token, { ...rests });
      return res;
    }
  );

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id, token } = data;
      const res = ProductService.deleteProduct(id, token);
      return res;
    }
  );

  // Query hooks
  const queryProduct = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProduct('', 100),
  });

  const typeQuery = useQuery({
    queryKey: ['product-types'],
    queryFn: ProductService.getAllTypeProduct,
  });

  const { data: products, isPending: isPendingProducts } = queryProduct;
  const { data: typeProducts, isPending: isPendingTypes } = typeQuery;

  // Fetch chi tiết sản phẩm khi chọn
  const fetchGetDetailsProduct = async (rowSelected) => {
    if (!rowSelected) return;
    
    setIsPendingUpdate(true);
    try {
      const res = await ProductService.getDetailsProduct(rowSelected);
      if (res?.data) {
        setStateProductDetails({
          name: res?.data?.name,
          image: res?.data?.image,
          type: res?.data?.type,
          price: res?.data?.price,
          countInStock: res?.data?.countInStock,
          rating: res?.data?.rating,
          description: res?.data?.description,
          discount: res?.data?.discount
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setIsPendingUpdate(false);
    }
  };

  // Cập nhật form chi tiết khi có dữ liệu
  useEffect(() => {
    if (rowSelected) {
      fetchGetDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    detailsForm.setFieldsValue(stateProductDetails);
  }, [detailsForm, stateProductDetails]);

  // Handle modal và drawer actions
  const handleDetailsProduct = () => {
    setIsDrawerOpen(true);
  };

  const handleOpenCreateModal = () => {
    form.resetFields();
    setStateProduct({
      name: '',
      image: '',
      type: '',
      price: '',
      countInStock:'',
      rating: '',
      description: '',
      discount: ''
    });
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle form submissions
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      image: stateProduct.image,
      type: stateProduct.type,
      price: stateProduct.price,
      countInStock: stateProduct.countInStock,
      rating: stateProduct.rating,
      description: stateProduct.description,
      discount: stateProduct.discount,
    };
    
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      }
    });
  };

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ 
      id: rowSelected, 
      token: user?.access_token, 
      ...stateProductDetails 
    }, {
      onSettled: () => {
        queryProduct.refetch();
      }
    });
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate({ 
      id: rowSelected, 
      token: user?.access_token 
    }, {
      onSettled: () => {
        queryProduct.refetch();
      }
    });
  };

  // Handle input changes
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    });
  };

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    });
  };

  // Handle select changes
  const handleChangeSelect = (value) => {
    if (value === 'add_type') {
      setTypeSelect('add_type');
      setStateProduct({
        ...stateProduct,
        type: ''
      });
    } else {
      setTypeSelect('');
      setStateProduct({
        ...stateProduct,
        type: value
      });
    }
  };

  const handleChangeSelectDetails = (value) => {
    if (value === 'add_type') {
      setTypeSelect('add_type');
      setStateProductDetails({
        ...stateProductDetails,
        type: ''
      });
    } else {
      setTypeSelect('');
      setStateProductDetails({
        ...stateProductDetails,
        type: value
      });
    }
  };

  // Handle type creation
  const handleAddType = async () => {
    try {
      if (stateProduct.type) {
        const res = await ProductService.createType({ name: stateProduct.type });
        if (res.status === 'OK') {
          setStateProduct({
            ...stateProduct,
            type: res.data._id
          });
          typeQuery.refetch();
          message.success('Tạo loại sản phẩm mới thành công');
          setTypeSelect('');
        }
      }
    } catch (error) {
      message.error('Tạo loại sản phẩm mới thất bại');
    }
  };

  const handleAddTypeDetails = async () => {
    try {
      if (stateProductDetails.type) {
        const res = await ProductService.createType({ name: stateProductDetails.type });
        if (res.status === 'OK') {
          setStateProductDetails({
            ...stateProductDetails,
            type: res.data._id
          });
          typeQuery.refetch();
          message.success('Tạo loại sản phẩm mới thành công');
          setTypeSelect('');
        }
      }
    } catch (error) {
      message.error('Tạo loại sản phẩm mới thất bại');
    }
  };

  // Handle search and filter
  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
  };

  const resetFilters = () => {
    setSearchText('');
    setFilterType(null);
  };

  // Xử lý phản hồi từ mutations
  useEffect(() => {
    if (mutation.isSuccess && mutation.data?.status === 'OK') {
      message.success('Thêm sản phẩm thành công');
      handleCancelModal();
    } else if (mutation.isError) {
      message.error('Thêm sản phẩm thất bại');
    }
  }, [mutation.isSuccess, mutation.isError]);

  useEffect(() => {
    if (mutationUpdate.isSuccess && mutationUpdate.data?.status === 'OK') {
      message.success('Cập nhật sản phẩm thành công');
      handleCloseDrawer();
    } else if (mutationUpdate.isError) {
      message.error('Cập nhật sản phẩm thất bại');
    }
  }, [mutationUpdate.isSuccess, mutationUpdate.isError]);

  useEffect(() => {
    if (mutationDelete.isSuccess && mutationDelete.data?.status === 'OK') {
      message.success('Xóa sản phẩm thành công');
      handleCancelDelete();
    } else if (mutationDelete.isError) {
      message.error('Xóa sản phẩm thất bại');
    }
  }, [mutationDelete.isSuccess, mutationDelete.isError]);

  // Get type name helper
  const getTypeName = (type) => {
    if (type && typeof type === 'object' && type.name) {
      return type.name;
    }
    
    if (typeof type === 'string') {
      const foundType = typeProducts?.data?.find(t => t._id === type);
      return foundType ? foundType.name : type;
    }
    
    return 'Không xác định';
  };

  // Prepare table columns
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text, record) => (
        <OrderItem style={{ margin: 0, padding: 0, border: 'none' }}>
          <div className="item-image">
            <img src={record.image} alt={text} />
          </div>
          <div className="item-info">
            <div className="item-name">{text}</div>
          </div>
        </OrderItem>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: '15%',
      render: (price, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: colors.primary }}>{convertPrice(price)}</div>
          {record.discount > 0 && (
            <Tag color="red">-{record.discount}%</Tag>
          )}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Danh mục',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (type) => (
        <Tag color={colors.primary} style={{ color: 'white' }}>
          {getTypeName(type)}
        </Tag>
      ),
      filters: typeProducts?.data?.map(type => ({ text: type.name, value: type._id })) || [],
      onFilter: (value, record) => {
        if (typeof record.type === 'object') {
          return record.type._id === value;
        }
        return record.type === value;
      },
    },
    {
      title: 'Tồn kho',
      dataIndex: 'countInStock',
      key: 'countInStock',
      width: '10%',
      render: (count) => (
        <span style={{ color: count > 0 ? colors.success : colors.error }}>
          {count}
        </span>
      ),
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: '10%',
      render: (rating) => (
        <span style={{ color: rating >= 4 ? colors.warning : colors.textPrimary }}>
          {rating} ⭐
        </span>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chi tiết">
            <Button 
              icon={<EyeOutlined />} 
              type="primary"
              ghost
              onClick={() => {
                setRowSelected(record._id);
                handleDetailsProduct();
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              icon={<EditOutlined />} 
              type="primary"
              onClick={() => {
                setRowSelected(record._id);
                handleDetailsProduct();
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              icon={<DeleteOutlined />} 
              danger
              onClick={() => {
                setRowSelected(record._id);
                setIsModalOpenDelete(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Filter data
  const filterData = (data) => {
    if (!data) return [];
    
    return data.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(searchText.toLowerCase());
      const typeMatch = !filterType || 
                       (typeof item.type === 'object' ? 
                        item.type._id === filterType : 
                        item.type === filterType);
      
      return nameMatch && typeMatch;
    });
  };

  const dataSource = products?.data ? filterData(products.data).map(item => ({
    ...item,
    key: item._id
  })) : [];

  // Upload props
  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    showUploadList: false,
  };

  return (
    <div>
      <AdminSectionTitle>Quản lý sản phẩm</AdminSectionTitle>
      
      {/* Search và Filter */}
      <AdminCard style={{ marginBottom: '24px' }}>
        <AdminSearchContainer>
          <div className="search-item">
            <AdminInput
              prefix={<SearchOutlined />}
              placeholder="Tìm kiếm theo tên sản phẩm"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </div>
          
          <div className="search-item">
            <AdminSelect
              placeholder="Lọc theo danh mục"
              value={filterType}
              onChange={handleFilterChange}
              style={{ width: '100%' }}
              allowClear
              loading={isPendingTypes}
            >
              {typeProducts?.data?.map(type => (
                <Select.Option key={type._id} value={type._id}>{type.name}</Select.Option>
              ))}
            </AdminSelect>
          </div>
          
          <div className="search-actions">
            <AdminButton
              icon={<FilterOutlined />}
              onClick={() => queryProduct.refetch()}
              type="primary"
              ghost
            >
              Lọc
            </AdminButton>
            
            <AdminButton
              icon={<ReloadOutlined />}
              onClick={resetFilters}
            >
              Đặt lại
            </AdminButton>
            
            <AdminButton
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleOpenCreateModal}
            >
              Thêm sản phẩm
            </AdminButton>
          </div>
        </AdminSearchContainer>
      </AdminCard>
      
      {/* Table */}
      <AdminCard>
        <AdminTable
          columns={columns}
          dataSource={dataSource}
          rowKey="_id"
          loading={isPendingProducts}
          pagination={{ pageSize: 10 }}
        />
      </AdminCard>
      
      {/* Modal Thêm sản phẩm */}
      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={handleCancelModal}
        footer={null}
        width={700}
      >
        <Loading isPending={mutation.isPending}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '200px', textAlign: 'center' }}>
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  {stateProduct.image ? (
                    <img 
                      src={stateProduct.image} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <UploadOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                      <div>Tải lên ảnh sản phẩm</div>
                    </div>
                  )}
                </div>
                
                <Upload
                  {...uploadProps}
                  onChange={handleOnchangeAvatar}
                >
                  <Button icon={<UploadOutlined />}>
                    {stateProduct.image ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                  </Button>
                </Upload>
              </div>
              
              <div style={{ flex: 1 }}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <AdminInput 
                    name="name" 
                    value={stateProduct.name} 
                    onChange={handleOnchange} 
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Loại sản phẩm"
                  name="type"
                  rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
                >
                  <AdminSelect
                    name="type"
                    onChange={handleChangeSelect}
                    options={typeProducts?.data ? renderOptions(typeProducts.data) : []}
                    value={stateProduct.type || ''}
                    placeholder="Chọn loại sản phẩm"
                  />
                  {typeSelect === 'add_type' && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <AdminInput 
                        value={stateProduct.type} 
                        onChange={handleOnchange} 
                        name="type" 
                        placeholder="Nhập tên loại mới"
                      /> 
                      <Button onClick={handleAddType} type="primary">
                        Tạo loại mới
                      </Button>
                    </div>
                  )}
                </Form.Item>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="price"
                      value={stateProduct.price}
                      onChange={handleOnchange}
                      placeholder="Nhập giá sản phẩm"
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Giảm giá (%)"
                    name="discount"
                    rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="discount"
                      value={stateProduct.discount}
                      onChange={handleOnchange}
                      placeholder="Nhập % giảm giá"
                      addonAfter="%"
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Form.Item
                    label="Số lượng tồn kho"
                    name="countInStock"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="countInStock"
                      value={stateProduct.countInStock}
                      onChange={handleOnchange}
                      placeholder="Nhập số lượng tồn kho"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Đánh giá sản phẩm"
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng nhập đánh giá sản phẩm' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="rating"
                      value={stateProduct.rating}
                      onChange={handleOnchange}
                      placeholder="Nhập đánh giá (1-5)"
                      min={1}
                      max={5}
                      step={0.1}
                    />
                  </Form.Item>
                </div>
                
                <Form.Item
                  label="Mô tả sản phẩm"
                  name="description"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
                >
                  <Input.TextArea
                    name="description"
                    value={stateProduct.description}
                    onChange={handleOnchange}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={4}
                  />
                </Form.Item>
              </div>
            </div>
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
              <Button onClick={handleCancelModal} style={{ marginRight: '10px' }}>
                Hủy
              </Button>
              <AdminButton type="primary" htmlType="submit">
                Tạo sản phẩm
              </AdminButton>
            </div>
          </Form>
        </Loading>
      </Modal>
      
      {/* Modal chi tiết/sửa sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        open={isDrawerOpen}
        onCancel={handleCloseDrawer}
        width={700}
        footer={null}
      >
        <Loading isPending={isPendingUpdate || mutationUpdate.isPending}>
          <Form
            form={detailsForm}
            layout="vertical"
            onFinish={onUpdateProduct}
            requiredMark={false}
            initialValues={stateProductDetails}
          >
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ width: '200px', textAlign: 'center' }}>
                <div style={{ 
                  width: '200px', 
                  height: '200px', 
                  border: '1px dashed #d9d9d9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  overflow: 'hidden'
                }}>
                  {stateProductDetails.image ? (
                    <img 
                      src={stateProductDetails.image} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <UploadOutlined style={{ fontSize: '32px', marginBottom: '8px' }} />
                      <div>Tải lên ảnh sản phẩm</div>
                    </div>
                  )}
                </div>
                
                <Upload
                  {...uploadProps}
                  onChange={handleOnchangeAvatarDetails}
                >
                  <Button icon={<UploadOutlined />}>
                    {stateProductDetails.image ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                  </Button>
                </Upload>
              </div>
              
              <div style={{ flex: 1 }}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="name"
                  rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
                >
                  <AdminInput 
                    name="name" 
                    value={stateProductDetails.name} 
                    onChange={handleOnchangeDetails} 
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Item>
                
                <Form.Item
                  label="Loại sản phẩm"
                  name="type"
                  rules={[{ required: true, message: 'Vui lòng chọn loại sản phẩm' }]}
                >
                  <AdminSelect
                    name="type"
                    onChange={handleChangeSelectDetails}
                    options={typeProducts?.data ? renderOptions(typeProducts.data) : []}
                    value={stateProductDetails.type}
                    placeholder="Chọn loại sản phẩm"
                  />
                  {typeSelect === 'add_type' && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <AdminInput 
                        value={stateProductDetails.type} 
                        onChange={handleOnchangeDetails} 
                        name="type" 
                        placeholder="Nhập tên loại mới"
                      /> 
                      <Button onClick={handleAddTypeDetails} type="primary">
                        Tạo loại mới
                      </Button>
                    </div>
                  )}
                </Form.Item>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="price"
                      value={stateProductDetails.price}
                      onChange={handleOnchangeDetails}
                      placeholder="Nhập giá sản phẩm"
                      addonAfter="VNĐ"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Giảm giá (%)"
                    name="discount"
                    rules={[{ required: true, message: 'Vui lòng nhập % giảm giá' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="discount"
                      value={stateProductDetails.discount}
                      onChange={handleOnchangeDetails}
                      placeholder="Nhập % giảm giá"
                      addonAfter="%"
                    />
                  </Form.Item>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Form.Item
                    label="Số lượng tồn kho"
                    name="countInStock"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng tồn kho' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="countInStock"
                      value={stateProductDetails.countInStock}
                      onChange={handleOnchangeDetails}
                      placeholder="Nhập số lượng tồn kho"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    label="Đánh giá sản phẩm"
                    name="rating"
                    rules={[{ required: true, message: 'Vui lòng nhập đánh giá sản phẩm' }]}
                    style={{ width: '50%' }}
                  >
                    <AdminInput
                      type="number"
                      name="rating"
                      value={stateProductDetails.rating}
                      onChange={handleOnchangeDetails}
                      placeholder="Nhập đánh giá (1-5)"
                      min={1}
                      max={5}
                      step={0.1}
                    />
                  </Form.Item>
                </div>
                
                <Form.Item
                  label="Mô tả sản phẩm"
                  name="description"
                  rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm' }]}
                >
                  <Input.TextArea
                    name="description"
                    value={stateProductDetails.description}
                    onChange={handleOnchangeDetails}
                    placeholder="Nhập mô tả sản phẩm"
                    rows={4}
                  />
                </Form.Item>
              </div>
            </div>
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
              <Button onClick={handleCloseDrawer} style={{ marginRight: '10px' }}>
                Hủy
              </Button>
              <AdminButton type="primary" htmlType="submit">
                Cập nhật
              </AdminButton>
            </div>
          </Form>
        </Loading>
      </Modal>
      
      {/* Modal xác nhận xóa */}
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        confirmLoading={mutationDelete.isPending}
      >
        <p>Bạn chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </div>
  );
};

export default AdminProduct;