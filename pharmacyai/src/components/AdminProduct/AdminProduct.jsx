import React, { useEffect, useState } from 'react'
import { WrapperHeader } from './style'
import { Button, Form, Modal } from 'antd'
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import TableComponent from '../TableComponents/TableComponent'
import InputComponents from '../InputComponents/InputComponents'
import { WrapperUploadFile } from './style'
import { getBase64 } from '../../utils'
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
  const user = useSelector((state)=> state?.user)
  
  const [stateProduct, setStateProduct] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description:''
  })
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    image: '',
    type: '',
    price: '',
    countInStock:'',
    rating: '',
    description:''
  })

  const [form] = Form.useForm();
  const mutation = useMutationHooks(
    (data) => {
      const { name, image, type, price, countInStock, rating, description } = data
      const res = ProductService.createProduct({ name, image, type, price, countInStock, rating, description })
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
    const res = await ProductService.getAllProduct()
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
        description:res?.data?.description
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

  const { data, isPending, isSuccess, isError } = mutation
  const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const {data: dataDelete, isPending: isPendingDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete
  const queryProduct = useQuery({
      queryKey: ['product'],
      queryFn: getAllProduct
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
      description: ''
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
      description:''
    })
    form.resetFields()
  };
 
  const onFinish = () => {
    mutation.mutate(stateProduct, {
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
                    <InputComponents value={stateProduct.type} onChange={handleOnchange} name="type" />
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
                              <InputComponents value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
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
          <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
              <Loading isPending={isPendingDelete }>
                  <div>Bạn có chắc muốn xóa người dùng?</div>
              </Loading>
          </ModalComponent>
    </div>
  )
}

export default AdminProduct