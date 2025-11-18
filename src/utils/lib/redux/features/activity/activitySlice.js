// src/lib/redux/features/activity/activitySlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/activity/'

// Helper to get auth headers
const getAuthHeaders = (getState) => {
  const { auth } = getState()
  return {
    'Authorization': `Bearer ${auth.apiKey}`,
    'Content-Type': 'application/json'
  }
}

// -----------------------------------------
// Thunks
// -----------------------------------------

// Fetch activity logs for a project
export const fetchProjectActivity = createAsyncThunk(
  'activity/fetchByProject',
  async ({ projectId, limit = 100, action = null }, { getState, rejectWithValue }) => {
    try {
      let url = `${API_BASE}projects/${projectId}/?limit=${limit}`
      if (action) {
        url += `&action=${action}`
      }
      const response = await axios.get(url, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch activity' })
    }
  }
)

// Fetch user's activity logs
export const fetchUserActivity = createAsyncThunk(
  'activity/fetchByUser',
  async (limit = 50, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}user/?limit=${limit}`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch user activity' })
    }
  }
)

// Fetch single activity log
export const fetchActivityById = createAsyncThunk(
  'activity/fetchById',
  async (logId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}${logId}/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch activity log' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  projectActivity: {},
  userActivity: [],
  currentLog: null,
  loading: false,
  error: null,
}

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearProjectActivity: (state, action) => {
      if (action.payload) {
        delete state.projectActivity[action.payload]
      } else {
        state.projectActivity = {}
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch project activity
      .addCase(fetchProjectActivity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectActivity.fulfilled, (state, action) => {
        state.loading = false
        const projectId = action.payload.project_id
        state.projectActivity[projectId] = action.payload.activities
      })
      .addCase(fetchProjectActivity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch activity'
      })

      // Fetch user activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false
        state.userActivity = action.payload.activities
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch user activity'
      })

      // Fetch single activity log
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.currentLog = action.payload
      })
  },
})

export const { clearError, clearProjectActivity } = activitySlice.actions
export default activitySlice.reducer