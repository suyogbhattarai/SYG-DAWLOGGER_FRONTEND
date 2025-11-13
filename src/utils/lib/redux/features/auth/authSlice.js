// src/lib/redux/features/auth/authSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Full API URLs
const REGISTER_URL = 'http://127.0.0.1:8000/api/accounts/register/'
const LOGIN_URL = 'http://127.0.0.1:8000/api/accounts/login/'

// ------------------------
// Thunks
// ------------------------

// Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(REGISTER_URL, userData)
      localStorage.setItem('authUser', JSON.stringify(response.data.data))
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Registration failed' })
    }
  }
)

// Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(LOGIN_URL, credentials)
      localStorage.setItem('authUser', JSON.stringify(response.data.data))
      return response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Login failed' })
    }
  }
)

// Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('authUser')
  return null
})

// Load user from localStorage
export const loadUserFromStorage = createAsyncThunk('auth/loadUser', async () => {
  const data = localStorage.getItem('authUser')
  return data ? JSON.parse(data) : null
})

// ------------------------
// Slice
// ------------------------
const initialState = {
  user: null,
  apiKey: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.apiKey = null
      })

      // Load user
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user
          state.apiKey = action.payload.api_key
        }
      })
  },
})

export default authSlice.reducer
