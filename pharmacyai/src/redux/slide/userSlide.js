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
              _id, 
              id,
              name, 
              email, 
              access_token, 
              isAdmin, 
              city, 
              phone, 
              address, 
              refreshToken,
              avatar 
            } = action.payload;
            
            // Kiểm tra và cập nhật các trường một cách rõ ràng
            if (_id !== undefined && _id !== null && _id !== '') state.id = _id;
            if (id !== undefined && id !== null && id !== '') state.id = id;
            if (name !== undefined && name !== null) state.name = name;
            if (email !== undefined && email !== null) state.email = email;
            if (access_token !== undefined && access_token !== null) state.access_token = access_token;
            if (isAdmin !== undefined) state.isAdmin = isAdmin; // isAdmin có thể là false
            if (city !== undefined && city !== null) state.city = city;
            if (phone !== undefined && phone !== null) state.phone = phone;
            if (address !== undefined && address !== null) state.address = address;
            if (refreshToken !== undefined && refreshToken !== null) state.refreshToken = refreshToken;
            if (avatar !== undefined && avatar !== null) state.avatar = avatar;
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