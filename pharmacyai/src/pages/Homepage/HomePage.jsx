import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'

import { WrapperButtonMore, WrapperProduct, WrapperTypeProduct } from './style'
import SliderComponents from '../../components/SliderComponents/SliderComponents'
import slide1  from '../../assets/img/slide1.png'
import slide2  from '../../assets/img/slide2.png'
import slide3  from '../../assets/img/slide3.png'
import slide4  from '../../assets/img/slide4.png'
import slide5 from '../../assets/img/slide5.png'
import slide6  from '../../assets/img/slide6.png'
import slide7 from '../../assets/img/slide7.png'
import CardComponent from '../../components/CardComponents/CardComponent'
import NavBarComponent from '../../components/NavBarComponents/NavBarComponent'
import ButtonComponent from '../../components/ButtonComponents/ButtonComponent'
import thuochome from '../../assets/img/thuocjpg.jpg'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [pending, setPending] = useState(false)
  const [limit, setLimit] = useState(6)
  const [typeProduct, setTypeProduct] = useState([])
  
  const fetchProductAll = async (context) => {
    const search = context?.queryKey && context?.queryKey[2]
    const limit = context?.queryKey && context?.queryKey[1]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {  
      setTypeProduct(res?.data)
    }
  }

  const { isPending, isFetching, data: products, isPlaceholderData } = useQuery({
    queryKey: ['products', limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 50,
    placeholderData: keepPreviousData(true) 
    
  });

  useEffect(() => {
    fetchAllTypeProduct()
  }, [])

  return (
    <Loading isPending={isPending || pending}>
       <div style={{ width:'1270px', margin:'0 auto' }}>
      <WrapperTypeProduct>
       {typeProduct.map((item) => {
         return (
           <TypeProduct name={item} key={item} />
         )
       })}
        
      </WrapperTypeProduct>
        </div>
      <div className='body' style={{width: '100%', background:'#efefef'}}>
        <div className="container" style={{height:'1000px', width: '1270px', margin:'0 auto'}}>
          <SliderComponents arrImages={[slide1, slide2, slide3, slide4, slide5, slide6, slide7]} />
          <WrapperProduct>
            {products?.data?.map((product) => {
              return (
                <CardComponent
                  key={product._id}
                  countInStock={product.countInStock}
                  description={product.description}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  type={product.type}
                  selled={product.selled}
                  discount={product.discount}
                  id={product._id}
                />
              )
            })}
            
          </WrapperProduct>
          <div style={{width: '100%', display:'flex', justifyContent:'center', marginTop:'10px',}}>
            <WrapperButtonMore textButton="Xem Thêm" type="outline" styleButton={{
              border: '1px solid #4cb551',
              color: '#4cb551 ',
              width: '240px', height: '38px', borderRadius: '4px'

            }}
              styleTextButton={{ fontWeight: 500 }}
              onClick={() => setLimit((prev) => prev +6 ) } />
          </div>
        </div>
      </div>
    
    </Loading>
  )
}

export default HomePage