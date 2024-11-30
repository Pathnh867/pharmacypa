import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: '',
}

export const productSlide = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions

export default productSlide.reducer