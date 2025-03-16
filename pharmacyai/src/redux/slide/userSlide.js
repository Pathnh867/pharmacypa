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
            const { _id= '' ,name='', email='', access_token='', isAdmin, city='', phone= '', address='', refreshToken='',avatar='' } = action.payload
            console.log('action', action)
            state.name = name ;
            state.email = email;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city;
            state.phone = phone;
            state.address = address;
            state.id = _id;
            state.refreshToken = refreshToken;
            state.avatar = avatar;
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