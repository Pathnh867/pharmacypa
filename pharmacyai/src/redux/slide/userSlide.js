import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    name: '',
    email: '',
    phone: '',
    access_token: '',
    isAdmin: false,
    address: '',
    city:'',
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { _id= '' ,name='', email='', access_token='', isAdmin, city='', phone= '', address='', refreshToken='' } = action.payload
            console.log('action', action)
            state.name = name || email;
            state.email = email;
            state.access_token = access_token;
            state.isAdmin = isAdmin;
            state.city = city;
            state.phone = phone;
            state.address = address;
            state.id = _id;
            state.refreshToken = refreshToken;
        },
        resetUser: (state) => {
            state.name = '';
            state.email = '';
            state.access_token = '';
            state.isAdmin = false;
        },
  },
})

// Action creators are generated for each case reducer function
export const {updateUser, resetUser} = userSlide.actions

export default userSlide.reducer