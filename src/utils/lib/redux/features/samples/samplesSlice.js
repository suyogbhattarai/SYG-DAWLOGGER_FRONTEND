// src/lib/redux/features/samples/samplesSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/utils/lib/axios/axiosInstance'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL_SAMPLES || 'http://127.0.0.1:8000/api/samples/'

console.log('🔧 Samples Slice - API_BASE:', API_BASE)
console.log('🔧 Samples Slice - axiosInstance loaded:', !!axiosInstance)

// -----------------------------------------
// Thunks
// -----------------------------------------

// Fetch samples for a project
export const fetchProjectSamples = createAsyncThunk(
  'samples/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}projects/${projectId}/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch samples' })
    }
  }
)

// Fetch single sample
export const fetchSampleById = createAsyncThunk(
  'samples/fetchById',
  async (sampleId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}${sampleId}/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch sample' })
    }
  }
)

// Upload sample
export const uploadSample = createAsyncThunk(
  'samples/upload',
  async ({ projectId, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE}projects/${projectId}/`,
        formData,
        {
          headers: {
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
  async ({ sampleId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_BASE}${sampleId}/`, data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update sample' })
    }
  }
)

// Delete sample
export const deleteSample = createAsyncThunk(
  'samples/delete',
  async (sampleId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE}${sampleId}/`)
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
  actionLoading: false, // For upload/update/delete operations
  uploadProgress: 0,
  error: null,
  actionError: null, // For upload/update/delete errors
}

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearActionError: (state) => {
      state.actionError = null
    },
    clearAllErrors: (state) => {
      state.error = null
      state.actionError = null
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0
    },
    clearCurrentSample: (state) => {
      state.currentSample = null
    },
    resetSamplesState: (state) => {
      state.samples = {}
      state.currentSample = null
      state.loading = false
      state.actionLoading = false
      state.uploadProgress = 0
      state.error = null
      state.actionError = null
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
        state.error = null
      })
      .addCase(fetchProjectSamples.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.payload?.detail || 'Failed to fetch samples'
      })

      // Fetch single sample
      .addCase(fetchSampleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSampleById.fulfilled, (state, action) => {
        state.loading = false
        state.currentSample = action.payload
        state.error = null
      })
      .addCase(fetchSampleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.payload?.detail || 'Failed to fetch sample'
      })

      // Upload sample
      .addCase(uploadSample.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(uploadSample.fulfilled, (state, action) => {
        state.actionLoading = false
        state.uploadProgress = 0
        const projectId = action.payload.project
        if (state.samples[projectId]) {
          state.samples[projectId].push(action.payload)
        } else {
          state.samples[projectId] = [action.payload]
        }
        state.actionError = null
      })
      .addCase(uploadSample.rejected, (state, action) => {
        state.actionLoading = false
        state.uploadProgress = 0
        state.actionError = action.payload?.message || action.payload?.detail || 'Failed to upload sample'
      })

      // Update sample
      .addCase(updateSample.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(updateSample.fulfilled, (state, action) => {
        state.actionLoading = false
        Object.keys(state.samples).forEach(projectId => {
          const index = state.samples[projectId].findIndex(s => s.id === action.payload.id)
          if (index !== -1) {
            state.samples[projectId][index] = action.payload
          }
        })
        if (state.currentSample?.id === action.payload.id) {
          state.currentSample = action.payload
        }
        state.actionError = null
      })
      .addCase(updateSample.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || 'Failed to update sample'
      })

      // Delete sample
      .addCase(deleteSample.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(deleteSample.fulfilled, (state, action) => {
        state.actionLoading = false
        Object.keys(state.samples).forEach(projectId => {
          state.samples[projectId] = state.samples[projectId].filter(
            s => s.id !== action.payload
          )
        })
        if (state.currentSample?.id === action.payload) {
          state.currentSample = null
        }
        state.actionError = null
      })
      .addCase(deleteSample.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || 'Failed to delete sample'
      })
  },
})

export const { 
  clearError, 
  clearActionError, 
  clearAllErrors, 
  setUploadProgress, 
  resetUploadProgress,
  clearCurrentSample,
  resetSamplesState 
} = samplesSlice.actions

export default samplesSlice.reducer