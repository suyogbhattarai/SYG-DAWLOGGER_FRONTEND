// src/lib/redux/features/samples/samplesSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/samples/'

// Helper to get auth headers
const getAuthHeaders = (getState) => {
  const { auth } = getState()
  return {
    'Authorization': `Bearer ${auth.apiKey}`,
  }
}

// -----------------------------------------
// Thunks
// -----------------------------------------

// Fetch samples for a project
export const fetchProjectSamples = createAsyncThunk(
  'samples/fetchByProject',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}projects/${projectId}/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch samples' })
    }
  }
)

// Fetch single sample
export const fetchSampleById = createAsyncThunk(
  'samples/fetchById',
  async (sampleId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}${sampleId}/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch sample' })
    }
  }
)

// Upload sample
export const uploadSample = createAsyncThunk(
  'samples/upload',
  async ({ projectId, formData }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}projects/${projectId}/`,
        formData,
        {
          headers: {
            ...getAuthHeaders(getState),
            'Content-Type': 'multipart/form-data',
          }
        }
      )
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to upload sample' })
    }
  }
)

// Update sample
export const updateSample = createAsyncThunk(
  'samples/update',
  async ({ sampleId, data }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}${sampleId}/`, data, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update sample' })
    }
  }
)

// Delete sample
export const deleteSample = createAsyncThunk(
  'samples/delete',
  async (sampleId, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}${sampleId}/`, {
        headers: getAuthHeaders(getState)
      })
      return sampleId
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete sample' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  samples: {},
  currentSample: null,
  loading: false,
  uploadProgress: 0,
  error: null,
}

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch project samples
      .addCase(fetchProjectSamples.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectSamples.fulfilled, (state, action) => {
        state.loading = false
        const projectId = action.payload.project_id
        state.samples[projectId] = action.payload.samples
      })
      .addCase(fetchProjectSamples.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch samples'
      })

      // Fetch single sample
      .addCase(fetchSampleById.fulfilled, (state, action) => {
        state.currentSample = action.payload
      })

      // Upload sample
      .addCase(uploadSample.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadSample.fulfilled, (state, action) => {
        state.loading = false
        state.uploadProgress = 0
        const projectId = action.payload.project
        if (state.samples[projectId]) {
          state.samples[projectId].push(action.payload)
        }
      })
      .addCase(uploadSample.rejected, (state, action) => {
        state.loading = false
        state.uploadProgress = 0
        state.error = action.payload?.message || 'Failed to upload sample'
      })

      // Update sample
      .addCase(updateSample.fulfilled, (state, action) => {
        Object.keys(state.samples).forEach(projectId => {
          const index = state.samples[projectId].findIndex(s => s.id === action.payload.id)
          if (index !== -1) {
            state.samples[projectId][index] = action.payload
          }
        })
        if (state.currentSample?.id === action.payload.id) {
          state.currentSample = action.payload
        }
      })

      // Delete sample
      .addCase(deleteSample.fulfilled, (state, action) => {
        Object.keys(state.samples).forEach(projectId => {
          state.samples[projectId] = state.samples[projectId].filter(
            s => s.id !== action.payload
          )
        })
      })
  },
})

export const { clearError, setUploadProgress, resetUploadProgress } = samplesSlice.actions
export default samplesSlice.reducer