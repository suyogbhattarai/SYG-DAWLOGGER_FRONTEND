// src/lib/redux/features/versions/versionsSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/utils/lib/axios/axiosInstance'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL_VERSIONS 

// -----------------------------------------
// Thunks
// -----------------------------------------

// Fetch versions for a project
export const fetchProjectVersions = createAsyncThunk(
  'versions/fetchByProject',
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}projects/${projectId}/versions/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch versions' })
    }
  }
)

// Fetch single version
export const fetchVersionById = createAsyncThunk(
  'versions/fetchById',
  async (versionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}${versionId}/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch version' })
    }
  }
)

// Fetch file list for a version
export const fetchVersionFileList = createAsyncThunk(
  'versions/fetchFileList',
  async (versionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}${versionId}/files/`)
      return { versionId, data: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch file list' })
    }
  }
)

// Upload version
export const uploadVersion = createAsyncThunk(
  'versions/upload',
  async (versionData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}upload/`, versionData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to upload version' })
    }
  }
)

// Delete version
export const deleteVersion = createAsyncThunk(
  'versions/delete',
  async (versionId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE}${versionId}/`)
      return versionId
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete version' })
    }
  }
)

// Request download for a version
export const requestDownload = createAsyncThunk(
  'versions/requestDownload',
  async (versionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}${versionId}/request-download/`, {})
      return { versionId, data: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to request download' })
    }
  }
)

// Check download status
export const checkDownloadStatus = createAsyncThunk(
  'versions/checkDownloadStatus',
  async (downloadId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}downloads/${downloadId}/status/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to check download status' })
    }
  }
)

// Fetch push status
export const fetchPushStatus = createAsyncThunk(
  'versions/fetchPushStatus',
  async (pushId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}pushes/${pushId}/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch push status' })
    }
  }
)

// Approve push
export const approvePush = createAsyncThunk(
  'versions/approvePush',
  async (pushId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}pushes/${pushId}/approve/`, {})
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to approve push' })
    }
  }
)

// Reject push
export const rejectPush = createAsyncThunk(
  'versions/rejectPush',
  async ({ pushId, reason }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE}pushes/${pushId}/reject/`, 
        { reason }
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
  async (pushId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}pushes/${pushId}/cancel/`, {})
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
  fileList: {},
  downloadRequests: {},
  pushStatus: null,
  loading: false,
  fileListLoading: false,
  downloadLoading: false,
  deleteLoading: false,
  error: null,
  fileListError: null,
  downloadError: null,
}

const versionsSlice = createSlice({
  name: 'versions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
      state.fileListError = null
      state.downloadError = null
    },
    clearPushStatus: (state) => {
      state.pushStatus = null
    },
    updateDownloadProgress: (state, action) => {
      const { versionId, status, progress, downloadId } = action.payload
      state.downloadRequests[versionId] = { status, progress, downloadId }
    },
    clearDownloadRequest: (state, action) => {
      const versionId = action.payload
      delete state.downloadRequests[versionId]
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
        state.error = null
      })
      .addCase(fetchProjectVersions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch versions'
      })

      // Fetch single version
      .addCase(fetchVersionById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVersionById.fulfilled, (state, action) => {
        state.loading = false
        state.currentVersion = action.payload
        state.error = null
      })
      .addCase(fetchVersionById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch version'
      })

      // Fetch file list
      .addCase(fetchVersionFileList.pending, (state) => {
        state.fileListLoading = true
        state.fileListError = null
      })
      .addCase(fetchVersionFileList.fulfilled, (state, action) => {
        state.fileListLoading = false
        state.fileList[action.payload.versionId] = action.payload.data.files
        state.fileListError = null
      })
      .addCase(fetchVersionFileList.rejected, (state, action) => {
        state.fileListLoading = false
        state.fileListError = action.payload?.message || 'Failed to fetch file list'
      })

      // Upload version
      .addCase(uploadVersion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadVersion.fulfilled, (state, action) => {
        state.loading = false
        state.pushStatus = action.payload
        state.error = null
      })
      .addCase(uploadVersion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to upload version'
      })

      // Delete version
      .addCase(deleteVersion.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteVersion.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove from all projects
        Object.keys(state.versions).forEach(projectId => {
          state.versions[projectId] = state.versions[projectId].filter(
            v => v.uid !== action.payload
          )
        })
        // Clear file list for deleted version
        delete state.fileList[action.payload]
        delete state.downloadRequests[action.payload]
        state.error = null
      })
      .addCase(deleteVersion.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload?.message || 'Failed to delete version'
      })

      // Request download
      .addCase(requestDownload.pending, (state, action) => {
        const versionId = action.meta.arg
        state.downloadLoading = true
        state.downloadError = null
        state.downloadRequests[versionId] = { status: 'requesting', progress: 0 }
      })
      .addCase(requestDownload.fulfilled, (state, action) => {
        state.downloadLoading = false
        const { versionId, data } = action.payload
        state.downloadRequests[versionId] = {
          status: data.download.status,
          progress: data.download.progress,
          downloadId: data.download.uid
        }
        state.downloadError = null
      })
      .addCase(requestDownload.rejected, (state, action) => {
        state.downloadLoading = false
        const versionId = action.meta.arg
        state.downloadRequests[versionId] = { status: 'failed', progress: 0 }
        state.downloadError = action.payload?.message || 'Failed to request download'
      })

      // Check download status
      .addCase(checkDownloadStatus.fulfilled, (state, action) => {
        const download = action.payload
        // Find version by download UID
        Object.keys(state.downloadRequests).forEach(versionId => {
          if (state.downloadRequests[versionId].downloadId === download.uid) {
            state.downloadRequests[versionId] = {
              status: download.status,
              progress: download.progress,
              downloadId: download.uid
            }
          }
        })
      })
      .addCase(checkDownloadStatus.rejected, (state, action) => {
        state.downloadError = action.payload?.message || 'Failed to check download status'
      })

      // Fetch push status
      .addCase(fetchPushStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPushStatus.fulfilled, (state, action) => {
        state.loading = false
        state.pushStatus = action.payload
        state.error = null
      })
      .addCase(fetchPushStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch push status'
      })

      // Approve push
      .addCase(approvePush.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(approvePush.fulfilled, (state, action) => {
        state.loading = false
        if (state.pushStatus) {
          state.pushStatus.status = 'approved'
        }
        state.error = null
      })
      .addCase(approvePush.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to approve push'
      })

      // Reject push
      .addCase(rejectPush.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(rejectPush.fulfilled, (state, action) => {
        state.loading = false
        if (state.pushStatus) {
          state.pushStatus.status = 'rejected'
        }
        state.error = null
      })
      .addCase(rejectPush.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to reject push'
      })

      // Cancel push
      .addCase(cancelPush.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelPush.fulfilled, (state, action) => {
        state.loading = false
        if (state.pushStatus) {
          state.pushStatus.status = 'cancelled'
        }
        state.error = null
      })
      .addCase(cancelPush.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to cancel push'
      })
  },
})

export const { 
  clearError, 
  clearPushStatus, 
  updateDownloadProgress, 
  clearDownloadRequest 
} = versionsSlice.actions

export default versionsSlice.reducer