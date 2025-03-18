import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    access_token: '',
    isAdmin: false,
    address: '',
    city: '',
    avatar: '',
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { 
              _id= '', 
              name='', 
              email='', 
              access_token='', 
              isAdmin, 
              city='', 
              phone= '', 
              address='', 
              refreshToken='',
              avatar='' 
            } = action.payload;
            
            // Chỉ cập nhật các trường được cung cấp, giữ nguyên các trường khác
            if (_id) state.id = _id;
            if (name) state.name = name;
            if (email) state.email = email;
            if (access_token) state.access_token = access_token;
            if (isAdmin !== undefined) state.isAdmin = isAdmin;
            if (city) state.city = city;
            if (phone) state.phone = phone;
            if (address) state.address = address;
            if (refreshToken) state.refreshToken = refreshToken;
            if (avatar) state.avatar = avatar;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.access_token = '';
            state.isAdmin = false;
            state.phone = '';
            state.avatar = '';
            state.address = '';
        },
  },
})

// Action creators are generated for each case reducer function
export const {updateUser, resetUser} = userSlide.actions

export default userSlide.reducer