import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slide/counterSlide'
import userReducer from './slide/userSlide'
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  },
})