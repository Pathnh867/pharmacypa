import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    ordersItemSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt:'',
    isDeliverd: false,
    deliverdAt:''
}

export const orderSlide = createSlice({
  name: 'order',
  initialState,
  reducers: {
      addOrderProduct: (state, action) => {
          const { orderItem } = action.payload
          const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product)
          if (itemOrder) {
              itemOrder.amount += orderItem?.amount
          } else {
              state.orderItems.push(orderItem)
          }
      },
      increaseAmount: (state, action) => {
        const { idProduct } = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
        const itemOrderSelected = state?.ordersItemSelected?.find((item) => item?.product === idProduct)
        itemOrder.amount++;
        if (itemOrderSelected) {
          itemOrderSelected.amount++;
        }
      },
      decreaseAmount: (state, action) => {
        const { idProduct } = action.payload
        const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
        const itemOrderSelected = state?.ordersItemSelected?.find((item) => item?.product === idProduct)
        itemOrder.amount--;
        if (itemOrderSelected) {
          itemOrderSelected.amount--;
        }
      },
      removeOrderProduct: (state, action) => {
        const { idProduct } = action.payload
        const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct)
        const itemOrderSelected = state?.ordersItemSelected?.filter((item) => item?.product !== idProduct)
        state.orderItems = itemOrder;
        state.ordersItemSelected = itemOrderSelected
      },
      removeAllOrderProduct: (state, action) => {
        const { listChecked } = action.payload || {}
        
        // Nếu có listChecked, chỉ xóa các sản phẩm trong danh sách
        if (listChecked && listChecked.length > 0) {
          const itemOrders = state?.orderItems?.filter((item) => !listChecked.includes(item.product))
          const itemOrderSelected = state?.ordersItemSelected?.filter((item) => !listChecked.includes(item.product))
          state.orderItems = itemOrders
          state.ordersItemSelected = itemOrderSelected
        } else {
          // Nếu không có listChecked, xóa tất cả sản phẩm
          state.orderItems = []
          state.ordersItemSelected = []
        }
      },
      selectedOrder: (state, action) => {
        const { listChecked } = action.payload
        const orderSelected = []
        state.orderItems.forEach((order) => {
          if (listChecked.includes(order.product)) {
            orderSelected.push(order)
          }
        })
        state.ordersItemSelected = orderSelected
      },
  },
})

// Action creators are generated for each case reducer function
export const { 
  addOrderProduct, 
  removeOrderProduct, 
  increaseAmount, 
  decreaseAmount, 
  removeAllOrderProduct, 
  selectedOrder 
} = orderSlide.actions

export default orderSlide.reducer