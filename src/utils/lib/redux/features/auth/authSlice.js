// src/lib/redux/features/auth/authSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/accounts/'

// -----------------------------------------
// Thunks
// -----------------------------------------

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}register/`, userData)
      console.log('🔍 Register Response:', response.data)
      
      // API returns data nested under 'data' key
      const data = {
        user: response.data.data.user,
        api_key: response.data.data.api_key,
        tokens: response.data.data.tokens
      }
      
      console.log('💾 Storing to localStorage:', data)
      localStorage.setItem('authUser', JSON.stringify(data))
      
      return data
    } catch (err) {
      console.error('❌ Register Error:', err.response?.data)
      return rejectWithValue(err.response?.data || { message: 'Registration failed' })
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔑 Login attempt with:', credentials)
      const response = await axios.post(`${API_BASE}login/`, credentials)
      console.log('🔍 Login Response:', response.data)
      
      // API returns data nested under 'data' key
      const apiData = response.data.data
      
      // Check what we actually received
      if (!apiData.user) {
        console.error('⚠️ No user in response!')
      }
      if (!apiData.api_key) {
        console.error('⚠️ No api_key in response!')
      }
      if (!apiData.tokens) {
        console.error('⚠️ No tokens in response!')
      }
      
      const data = {
        user: apiData.user,
        api_key: apiData.api_key,
        tokens: apiData.tokens
      }
      
      console.log('💾 Storing to localStorage:', data)
      localStorage.setItem('authUser', JSON.stringify(data))
      
      // Verify it was stored
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
        await axios.post(`${API_BASE}logout/`, {}, {
          headers: {
            'Authorization': `Bearer ${tokens.access}`
          }
        })
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('authUser')
      console.log('🗑️ Cleared localStorage')
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
  async (_, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth
      const response = await axios.get(`${API_BASE}check/`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Auth check failed' })
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth
      const response = await axios.put(`${API_BASE}profile/update/`, profileData, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      })
      return response.data.user
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Profile update failed' })
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth
      const response = await axios.post(`${API_BASE}profile/change-password/`, passwordData, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Password change failed' })
    }
  }
)

export const regenerateAPIKey = createAsyncThunk(
  'auth/regenerateAPIKey',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth
      const response = await axios.post(`${API_BASE}profile/regenerate-api-key/`, {}, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      })
      return response.data.api_key
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'API key regeneration failed' })
    }
  }
)

export const searchUsers = createAsyncThunk(
  'auth/searchUsers',
  async (query, { getState, rejectWithValue }) => {
    try {
      const { tokens } = getState().auth
      const response = await axios.get(`${API_BASE}users/search/?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access}`
        }
      })
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
  initialized: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log('✅ Register fulfilled with:', action.payload)
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
        state.tokens = action.payload.tokens
        state.initialized = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log('❌ Register rejected:', action.payload)
        state.loading = false
        state.error = action.payload?.message || 'Registration failed'
        state.initialized = true
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled with:', action.payload)
        state.loading = false
        state.user = action.payload.user
        state.apiKey = action.payload.api_key
        state.tokens = action.payload.tokens
        state.initialized = true
        
        // Log the state after update
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

export const { clearError, clearSearchResults } = authSlice.actions
export default authSlice.reducer