// src/services/PrescriptionService.js
import axios from "axios"
import { axiosJWT } from "./UserService"

export const uploadPrescription = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/prescription/upload`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getUserPrescriptions = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/prescription/user`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const getPrescriptionDetails = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/prescription/details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}

export const updatePrescriptionStatus = async (id, status, note, access_token) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/prescription/status/${id}`, 
        { status, note }, 
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
    )
    return res.data
}

export const getAllPrescriptions = async (access_token, limit = 10, page = 0, sort = null, filter = null) => {
    let url = `${process.env.REACT_APP_API_URL}/prescription/all?limit=${limit}&page=${page}`
    
    if (sort) {
        url += `&sort=${JSON.stringify(sort)}`
    }
    
    if (filter) {
        url += `&filter=${JSON.stringify(filter)}`
    }
    
    const res = await axiosJWT.get(url, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}