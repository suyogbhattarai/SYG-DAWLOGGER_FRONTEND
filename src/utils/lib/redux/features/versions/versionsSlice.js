// src/lib/redux/features/versions/versionsSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/versions/'

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

// Fetch versions for a project
export const fetchProjectVersions = createAsyncThunk(
  'versions/fetchByProject',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}projects/${projectId}/versions/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch versions' })
    }
  }
)

// Fetch single version
export const fetchVersionById = createAsyncThunk(
  'versions/fetchById',
  async (versionId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}${versionId}/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch version' })
    }
  }
)

// Upload version
export const uploadVersion = createAsyncThunk(
  'versions/upload',
  async (versionData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}upload/`, versionData, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to upload version' })
    }
  }
)

// Delete version
export const deleteVersion = createAsyncThunk(
  'versions/delete',
  async (versionId, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}${versionId}/`, {
        headers: getAuthHeaders(getState)
      })
      return versionId
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete version' })
    }
  }
)

// Fetch push status
export const fetchPushStatus = createAsyncThunk(
  'versions/fetchPushStatus',
  async (pushId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}push/${pushId}/status/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch push status' })
    }
  }
)

// Approve push
export const approvePush = createAsyncThunk(
  'versions/approvePush',
  async (pushId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}push/${pushId}/approve/`, {}, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to approve push' })
    }
  }
)

// Reject push
export const rejectPush = createAsyncThunk(
  'versions/rejectPush',
  async ({ pushId, reason }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}push/${pushId}/reject/`, 
        { reason },
        { headers: getAuthHeaders(getState) }
      )
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to reject push' })
    }
  }
)

// Cancel push
export const cancelPush = createAsyncThunk(
  'versions/cancelPush',
  async (pushId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}push/${pushId}/cancel/`, {}, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to cancel push' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  versions: {},
  currentVersion: null,
  pushStatus: null,
  loading: false,
  error: null,
}

const versionsSlice = createSlice({
  name: 'versions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearPushStatus: (state) => {
      state.pushStatus = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch project versions
      .addCase(fetchProjectVersions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectVersions.fulfilled, (state, action) => {
        state.loading = false
        const projectId = action.payload.project_id
        state.versions[projectId] = action.payload.versions
      })
      .addCase(fetchProjectVersions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch versions'
      })

      // Fetch single version
      .addCase(fetchVersionById.fulfilled, (state, action) => {
        state.currentVersion = action.payload
      })

      // Upload version
      .addCase(uploadVersion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadVersion.fulfilled, (state, action) => {
        state.loading = false
        state.pushStatus = action.payload
      })
      .addCase(uploadVersion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to upload version'
      })

      // Delete version
      .addCase(deleteVersion.fulfilled, (state, action) => {
        // Remove from all projects
        Object.keys(state.versions).forEach(projectId => {
          state.versions[projectId] = state.versions[projectId].filter(
            v => v.id !== action.payload
          )
        })
      })

      // Fetch push status
      .addCase(fetchPushStatus.fulfilled, (state, action) => {
        state.pushStatus = action.payload
      })

      // Approve push
      .addCase(approvePush.fulfilled, (state, action) => {
        if (state.pushStatus) {
          state.pushStatus.status = 'approved'
        }
      })

      // Reject push
      .addCase(rejectPush.fulfilled, (state, action) => {
        if (state.pushStatus) {
          state.pushStatus.status = 'rejected'
        }
      })

      // Cancel push
      .addCase(cancelPush.fulfilled, (state, action) => {
        if (state.pushStatus) {
          state.pushStatus.status = 'failed'
        }
      })
  },
})

export const { clearError, clearPushStatus } = versionsSlice.actions
export default versionsSlice.reducer