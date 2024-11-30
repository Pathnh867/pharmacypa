import { configureStore } from '@reduxjs/toolkit'
import productReducer from './slide/productSlide'
import userReducer from './slide/userSlide'
export const store = configureStore({
  reducer: {
    product: productReducer,
    user: userReducer
  },
})