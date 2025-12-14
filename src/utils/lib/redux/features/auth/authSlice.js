// src/lib/redux/features/auth/authSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import axiosInstance from '@/utils/lib/axios/axiosInstance'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL_ACCOUNTS || 'http://127.0.0.1:8000/api/accounts/'

// -----------------------------------------
// Thunks
// -----------------------------------------
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Use regular axios for registration (no auth needed)
      const response = await axios.post(`${API_BASE}register/`, userData)

      if (!response.data.success) {
        return rejectWithValue(response.data)
      }

      const data = {
        user: response.data.data.user,
        api_key: response.data.data.api_key,
        tokens: response.data.data.tokens,
      }

      localStorage.setItem('authUser', JSON.stringify(data))
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Registration failed' })
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔑 Login attempt with:', credentials)
      // Use regular axios for login (no auth needed)
      const response = await axios.post(`${API_BASE}login/`, credentials)
      console.log('🔍 Login Response:', response.data)
      
      const apiData = response.data.data
      
      const data = {
        user: apiData.user,
        api_key: apiData.api_key,
        tokens: apiData.tokens
      }
      
      console.log('💾 Storing to localStorage:', data)
      localStorage.setItem('authUser', JSON.stringify(data))
      
      const stored = localStorage.getItem('authUser')
      console.log('✅ Verified localStorage:', stored)
      
      return data
    } catch (err) {
      console.error('❌ Login Error:', err.response?.data)
      return rejectWithValue(err.response?.data || { message: 'Login failed' })
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const { tokens } = getState().auth

      if (tokens?.access) {
        // Use axiosInstance for authenticated requests
        await axiosInstance.post(`${API_BASE}logout/`)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear everything related to auth
      localStorage.removeItem('authUser')
      localStorage.removeItem('tokens')
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      console.log('🗑️ All auth data cleared')
    }

    return null
  }
)

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const data = localStorage.getItem('authUser')
    console.log('📂 Loading from localStorage:', data)
    
    if (!data) {
      console.log('ℹ️ No user data in localStorage')
      return null
    }
    
    try {
      const parsed = JSON.parse(data)
      console.log('✅ Parsed user data:', parsed)
      return parsed
    } catch (err) {
      console.error('❌ Failed to parse localStorage data:', err)
      localStorage.removeItem('authUser')
      return null
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Use axiosInstance - it will add auth header automatically
      const response = await axiosInstance.get(`${API_BASE}check/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Auth check failed' })
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Use axiosInstance - it will add auth header automatically
      const response = await axiosInstance.put(`${API_BASE}profile/update/`, profileData)
      return response.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Profile update failed' })
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      // Use axiosInstance - it will add auth header automatically
      const response = await axiosInstance.post(`${API_BASE}profile/change-password/`, passwordData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Password change failed' })
    }
  }
)

export const regenerateAPIKey = createAsyncThunk(
  'auth/regenerateAPIKey',
  async (_, { rejectWithValue }) => {
    try {
      // Use axiosInstance - it will add auth header automatically
      const response = await axiosInstance.post(`${API_BASE}profile/regenerate-api-key/`)
      return response.data.api_key
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'API key regeneration failed' })
    }
  }
)

export const searchUsers = createAsyncThunk(
  'auth/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      // Use axiosInstance - it will add auth header automatically
      const response = await axiosInstance.get(`${API_BASE}users/search/?q=${query}`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'User search failed' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  user: null,
  apiKey: null,
  tokens: null,
  searchResults: [],
  loading: false,
  error: null,
  fieldErrors: {},
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.fieldErrors = {}
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    // New action for automatic logout from interceptor
    resetAuth: (state) => {
      state.user = null
      state.apiKey = null
      state.tokens = null
      state.searchResults = []
      state.error = null
      state.fieldErrors = {}
      state.initialized = true
      console.log('🔒 Auth state reset (session expired)')
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('✅ Register fulfilled with:', action.payload)
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
        state.tokens = action.payload.tokens
        state.error = null
        state.fieldErrors = {}
        state.initialized = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log('❌ Register rejected:', action.payload)
        state.loading = false
        state.error = action.payload?.message || 'Registration failed'
        state.fieldErrors = action.payload?.errors || {}
        state.initialized = true
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
        state.fieldErrors = {}
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled with:', action.payload)
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
        state.tokens = action.payload.tokens
        state.error = null
        state.fieldErrors = {}
        state.initialized = true
        
        console.log('📊 New state:', {
          user: state.user,
          apiKey: state.apiKey,
          tokens: state.tokens
        })
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log('❌ Login rejected:', action.payload)
        state.loading = false
        state.error = action.payload?.message || 'Login failed'
        state.initialized = true
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.apiKey = null
        state.tokens = null
        state.searchResults = []
        state.error = null
        state.fieldErrors = {}
        state.initialized = true
      })

      // Load from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        console.log('📂 LoadUserFromStorage fulfilled:', action.payload)
        state.loading = false
        if (action.payload) {
          state.user = action.payload.user
          state.apiKey = action.payload.api_key
          state.tokens = action.payload.tokens
        }
        state.initialized = true
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false
        state.initialized = true
      })

      // Check auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
      .addCase(checkAuth.rejected, (state) => {
        // If auth check fails, clear state
        state.user = null
        state.apiKey = null
        state.tokens = null
      })

      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload
        // Update localStorage
        const authData = JSON.parse(localStorage.getItem('authUser') || '{}')
        authData.user = action.payload
        localStorage.setItem('authUser', JSON.stringify(authData))
      })

      // Regenerate API key
      .addCase(regenerateAPIKey.fulfilled, (state, action) => {
        state.apiKey = action.payload
        // Update localStorage
        const authData = JSON.parse(localStorage.getItem('authUser') || '{}')
        authData.api_key = action.payload
        localStorage.setItem('authUser', JSON.stringify(authData))
      })

      // Search users
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload.users
      })
  },
})

export const { clearError, clearSearchResults, resetAuth } = authSlice.actions
export default authSlice.reducer