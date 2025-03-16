import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal, Select } from 'antd'
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import TableComponent from '../TableComponents/TableComponent'
import InputComponents from '../InputComponents/InputComponents'
import { WrapperUploadFile } from './style'
import { getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponents from '../DrawerComponents/DrawerComponents'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('');
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [typeSelect, setTypeSelect] = useState('')
  const user = useSelector((state)=> state?.user)
  
  const [stateProduct, setStateProduct] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description: '',
    discount:''
  })
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description: '',
    discount:''
  })

  const [form] = Form.useForm();
  const mutation = useMutationHooks(
    (data) => {
      const { name, image, type, price, countInStock, rating, description, discount } = data
      const res = ProductService.createProduct({ name, image, type, price, countInStock, rating, description,discount })
      return res
    }
  )
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id, token, ...rests } = data
      const res = ProductService.updateProduct(id, token, { ...rests })
      return res
    },
  )

  const mutationDelete  = useMutationHooks(
    (data) => {
      const { id, token } = data
      const res = ProductService.deleteProduct(id, token)
      return res
    },
  )

  const getAllProduct = async () => {
    const res = await ProductService.getAllProduct('', 100)
    return res
  }

  

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        image: res?.data?.image,
        type: res?.data?.type,
        price: res?.data?.price,
        countInStock: res?.data?.countInStock,
        rating: res?.data?.rating,
        description: res?.data?.description,
        discount:res?.data?.discount
      })
    }
    setIsPendingUpdate(false)
  }
  useEffect(() => {
    form.setFieldsValue(stateProductDetails)
  }, [form, stateProductDetails])
  
  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true)
      fetchGetDetailsProduct(rowSelected)
    }
    
  }, [rowSelected])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }
  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const {data: dataDelete, isPending: isPendingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete
  const queryProduct = useQuery({
      queryKey: ['product'],
      queryFn: getAllProduct,
    });
  const typeProduct = useQuery({
      queryKey: ['type-product'],
      queryFn: fetchAllTypeProduct,
  });
  
  const {isPending:isPendingProduct, data:products} = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color:'red', fontSize:'30px', cursor:'pointer'}} onClick={()=> setIsModalOpenDelete(true)} />
        <EditOutlined style={{color:'#4cb551', fontSize:'30px', cursor:'pointer'}} onClick={handleDetailsProduct} />
      </div>
    )
  }
  const getTypeName = (typeId) => {
    const foundType = typeProduct?.data?.data?.find(type => type._id === typeId);
    return foundType ? foundType.name : typeId;
  }
  console.log('type', typeProduct)
  const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a,b) => a.name.length - b.name.length
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a,b) => a.price - b.price,
            filters: [
                    {
                      text: '>= 100',
                      value: '>=',
                    },
                    {
                      text: '<=100',
                      value: '<=',
                    },
                  ],
            onFilter: (value, record) => {
            if(value==='>='){
                return record.price >=100
              }
              return record.price <=100
            },
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a,b) => a.rating - b.rating,
            filters: [
                    {
                      text: '>= 3',
                      value: '>=',
                    },
                    {
                      text: '<=3',
                      value: '<=',
                    },
                  ],
            onFilter: (value, record) => {
                if(value==='>='){
                    return Number(record.rating) >=3
                  }
                  return  Number(record.rating) <=3
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (typeId) => getTypeName(typeId)
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: renderAction
        },
    ];
    

  const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {...product, key: product._id}
  })
  
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDelete) {
      message.error()
    }
  }, [isSuccessDelete])
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: '',
      image: '',
      type: '',
      price: '',
      countInStock: '',
      rating: '',
      description: '',
      discount:''
    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleCancel()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  const handleDeleteProduct = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: '',
      image: '',
      type: '',
      price: '',
      countInStock:'',
      rating: '',
      description: '',
      discount:''
    })
    form.resetFields()
  };
 
  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      image: stateProduct.image,
      type: stateProduct.type,
      price: stateProduct.price,
      countInStock:stateProduct.countInStock,
      rating: stateProduct.rating,
      description: stateProduct.description,
      discount:stateProduct.discount,
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }
  const handleOnchange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }
  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview
    })
  }
  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview
    })
  }

  const onUpdateProduct = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateProductDetails }, {
      onSettled: () => {
        queryProduct.refetch()
       }
     })
  }

  const handleChangeSelect = (value) => {
    if (value === 'add_type') {
      setTypeSelect('add_type');
      setStateProduct({
        ...stateProduct,
        type: '' // Xóa giá trị type hiện tại để người dùng nhập mới
      });
    } else {
      setTypeSelect('');
      setStateProduct({
        ...stateProduct,
        type: value // Giá trị là ID của Type
      });
    }
  }
  const handleChangeSelectDetails = (value) => {
    if (value === 'add_type') {
      setTypeSelect('add_type');
      setStateProductDetails({
        ...stateProductDetails,
        type: '' // Xóa giá trị type hiện tại để người dùng nhập mới
      });
    } else {
      setTypeSelect('');
      setStateProductDetails({
        ...stateProductDetails,
        type: value // Giá trị là ID của Type
      });
    }
  }
  const handleAddType = async () => {
    try {
      if (stateProduct.type) {
        // Gọi API tạo Type mới
        const res = await ProductService.createType({ name: stateProduct.type });
        if (res.status === 'OK') {
          // Cập nhật lại giá trị type trong form bằng ID vừa tạo
          setStateProduct({
            ...stateProduct,
            type: res.data._id
          });
          // Refresh danh sách Type
          typeProduct.refetch();
          message.success('Tạo loại sản phẩm mới thành công');
          setTypeSelect(''); // Đóng ô input
        }
      }
    } catch (error) {
      message.error('Tạo loại sản phẩm mới thất bại');
    }
  }

  return (
      <div>
          <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
          <div style={{marginTop:'10px'}}>
              <Button style={{height:'150px', width:'150px', borderRadius:'6px',borderStyle:'dashed'}} onClick={()=> setIsModalOpen(true)}><PlusCircleOutlined style={{fontSize:'60px'}} /></Button>
          </div>
          <div style={{marginTop:'20px'}}>
              <TableComponent columns={columns} isPending={isPendingProduct} data={dataTable} onRow={(record,rowIndex)=> {
                return {
                  onClick: event => {
                    setRowSelected(record._id)
                  }
                }
              }} />
          </div>
          <Modal forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
             <Loading isPending={isPending}>
                <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                autoComplete="on"
                form={form}
              >
                <Form.Item
                    label="Tên sản phẩm"
                    name="name"
                    rules={[{ required: true, message: 'Hãy nhập tên sản phẩm' }]}
                  >
                    <InputComponents value={stateProduct.name} onChange={handleOnchange} name="name" />
                  </Form.Item>
                  <Form.Item
                    label="Loại sản phẩm"
                    name="type"
                    rules={[{ required: true, message: 'Hãy nhập loại sản phẩm' }]}
                  >
                    <Select
                      name="type"
                      onChange={handleChangeSelect}
                      options={renderOptions(typeProduct?.data?.data)}
                      value={stateProduct.type}
                    />
                    {typeSelect === 'add_type' && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <InputComponents 
                          value={stateProduct.type} 
                          onChange={handleOnchange} 
                          name="type" 
                          placeholder="Nhập tên loại mới"
                        /> 
                        <Button onClick={handleAddType}>Tạo loại mới</Button>
                      </div>
                    )}
                  </Form.Item>
                  <Form.Item
                    label="Số lượng tồn kho"
                    name="countInStock"
                    rules={[{ required: true, message: 'Hãy nhập số lượng tồn kho' }]}
                  >
                    <InputComponents value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                  </Form.Item>
                  <Form.Item
                    label="Giá sản phẩm"
                    name="price"
                    rules={[{ required: true, message: 'Hãy nhập giá sản phẩm' }]}
                  >
                    <InputComponents  value={stateProduct.price} onChange={handleOnchange} name="price"/>
                  </Form.Item>
                  <Form.Item
                    label="Miêu tả sản phẩm"
                    name="description"
                    rules={[{ required: true, message: 'Hãy nhập miêu tả sản phẩm' }]}
                  >
                    <InputComponents value={stateProduct.description} onChange={handleOnchange} name="description" />
                  </Form.Item>
                  <Form.Item
                    label="Đánh giá sản phẩm"
                    name="rating"
                    rules={[{ required: true, message: 'Nhập' }]}
                  >
                    <InputComponents value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                  </Form.Item>
                  <Form.Item
                    label="Giảm giá" 
                    name="discount"
                    rules={[{ required: true, message: 'Nhập giảm giá sản phẩm' }]}
                  >
                    <InputComponents value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                  </Form.Item>
                  <Form.Item
                    label="Hình ảnh sản phẩm"
                    name="image"
                    rules={[{ required: true, message: 'Nhập hình ảnh sản phẩm' }]}
                  >
                    <WrapperUploadFile onChange = {handleOnchangeAvatar} maxCount={1}>
                      <Button>Chọn ảnh</Button>
                      {stateProduct?.image && (
                        <img src={stateProduct?.image} style={{
                          height:'60px',
                          width: '60px',
                          borderRadius: '50%',
                          objectFit:'cover',
                          marginLeft: '10px'
                        }} alt="avatar" />
                      )}
                    </WrapperUploadFile>
                  </Form.Item>
                  <Form.Item wrapperCol={{offset: 20, span: 16}}>
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      </Form.Item>
              </Form>
             </Loading>
          </Modal>
          <DrawerComponents title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={()=> setIsOpenDrawer(false)} width='90%'>
              <Loading isPending={isPendingUpdated || isPendingUpdate}>
                        <Form
                          name="basic"
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 15 }}
                          onFinish={onUpdateProduct}
                          autoComplete="on"
                          form={form}
                        >
                          <Form.Item
                              label="Tên sản phẩm"
                              name="name"
                              rules={[{ required: true, message: 'Hãy nhập tên sản phẩm' }]}
                            >
                              <InputComponents value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
                          </Form.Item>
                          <Form.Item
                              label="Loại sản phẩm"
                              name="type"
                              rules={[{ required: true, message: 'Hãy nhập loại sản phẩm' }]}
                            >
                             <Select
                                name="type"
                                onChange={handleChangeSelectDetails}
                                options={renderOptions(typeProduct?.data?.data)}
                                value={stateProductDetails.type}
                              />
                              {typeSelect === 'add_type' && (
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                  <InputComponents 
                                    value={stateProductDetails.type} 
                                    onChange={handleOnchangeDetails} 
                                    name="type" 
                                    placeholder="Nhập tên loại mới"
                                  /> 
                                  <Button onClick={handleAddType}>Tạo loại mới</Button>
                                </div>
                              )}
                          </Form.Item>
                          <Form.Item
                              label="Số lượng tồn kho"
                              name="countInStock"
                              rules={[{ required: true, message: 'Hãy nhập số lượng tồn kho' }]}
                            >
                              <InputComponents value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
                          </Form.Item>
                          <Form.Item
                              label="Giá sản phẩm"
                              name="price"
                              rules={[{ required: true, message: 'Hãy nhập giá sản phẩm' }]}
                            >
                              <InputComponents  value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price"/>
                          </Form.Item>
                          <Form.Item
                              label="Miêu tả sản phẩm"
                              name="description"
                              rules={[{ required: true, message: 'Hãy nhập miêu tả sản phẩm' }]}
                            >
                              <InputComponents value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                          </Form.Item>
                          <Form.Item
                              label="Đánh giá sản phẩm"
                              name="rating"
                              rules={[{ required: true, message: 'Nhập' }]}
                            >
                              <InputComponents value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
                          </Form.Item>
                          <Form.Item
                              label="Giảm giá"
                              name="discount"
                              rules={[{ required: true, message: 'Nhập giảm giá' }]}
                            >
                              <InputComponents value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
                          </Form.Item>
                          <Form.Item
                              label="Hình ảnh sản phẩm"
                              name="image"
                              rules={[{ required: true, message: 'Nhập hình ảnh sản phẩm' }]}
                            >
                              <WrapperUploadFile onChange = {handleOnchangeAvatarDetails} maxCount={1}>
                                <Button>Chọn ảnh</Button>
                                {stateProductDetails?.image && (
                                  <img src={stateProductDetails?.image} style={{
                                    height:'60px',
                                    width: '60px',
                                    borderRadius: '50%',
                                    objectFit:'cover',
                                    marginLeft: '10px'
                                  }} alt="avatar" />
                                )}
                              </WrapperUploadFile>
                           </Form.Item>
                           <Form.Item wrapperCol={{offset: 20, span: 16}}>
                                  <Button type="primary" htmlType="submit">
                                    Lưu
                                  </Button>
                           </Form.Item>
                        </Form>
                      </Loading>
          </DrawerComponents>
          <Modal title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
              <Loading isPending={isPendingDelete }>
                  <div>Bạn có chắc muốn xóa sản phẩm?</div>
              </Loading>
          </Modal>
    </div>
  )
}

export default AdminProduct