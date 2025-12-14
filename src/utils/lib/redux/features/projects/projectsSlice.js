// src/lib/redux/features/projects/projectsSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/utils/lib/axios/axiosInstance'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL_PROJECTS

console.log('🔧 Projects Slice - API_BASE:', API_BASE)
console.log('🔧 Projects Slice - axiosInstance loaded:', !!axiosInstance)

// -----------------------------------------
// Thunks
// -----------------------------------------

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch projects' })
    }
  }
)

// Fetch single project (using UID)
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectUid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}${projectUid}/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch project' })
    }
  }
)

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE, projectData)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create project' })
    }
  }
)

// Update project (using UID)
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ projectUid, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API_BASE}${projectUid}/`, data)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update project' })
    }
  }
)

// Delete project (using UID)
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectUid, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE}${projectUid}/`)
      return projectUid
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete project' })
    }
  }
)

// Fetch project members (using UID)
export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchMembers',
  async (projectUid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}${projectUid}/members/`)
      return { projectUid, members: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch members' })
    }
  }
)

// Add project member (using UID)
export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectUid, userId, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${API_BASE}${projectUid}/members/`,
        { user_id: userId, role }
      )
      return { projectUid, member: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to add member' })
    }
  }
)

// Remove project member (using UID)
export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectUid, memberId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE}${projectUid}/members/${memberId}/`)
      return { projectUid, memberId }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to remove member' })
    }
  }
)

// Fetch all projects status
export const fetchProjectsStatus = createAsyncThunk(
  'projects/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE}status/`)
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch status' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  projects: [],
  currentProject: null,
  members: {}, // Store members by projectUid
  loading: false,
  actionLoading: false, // For create/update/delete operations
  error: null,
  actionError: null, // For create/update/delete errors
}

const projectsSlice = createSlice({
  name: 'projects',
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
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload
    },
    resetProjectsState: (state) => {
      state.projects = []
      state.currentProject = null
      state.members = {}
      state.loading = false
      state.actionLoading = false
      state.error = null
      state.actionError = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
        state.error = null
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.payload?.detail || 'Failed to fetch projects'
      })

      // Fetch single project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
        state.error = null
        // Also update in projects array if exists
        const index = state.projects.findIndex(p => p.uid === action.payload.uid)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.payload?.detail || 'Failed to fetch project'
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.actionLoading = false
        state.projects.push(action.payload)
        state.currentProject = action.payload
        state.actionError = null
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || action.payload?.name?.[0] || 'Failed to create project'
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.actionLoading = false
        const index = state.projects.findIndex(p => p.uid === action.payload.uid)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject?.uid === action.payload.uid) {
          state.currentProject = action.payload
        }
        state.actionError = null
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || action.payload?.name?.[0] || 'Failed to update project'
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.actionLoading = false
        state.projects = state.projects.filter(p => p.uid !== action.payload)
        if (state.currentProject?.uid === action.payload) {
          state.currentProject = null
        }
        // Clean up members for deleted project
        delete state.members[action.payload]
        state.actionError = null
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || 'Failed to delete project'
      })

      // Fetch members
      .addCase(fetchProjectMembers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.loading = false
        state.members[action.payload.projectUid] = action.payload.members
        state.error = null
      })
      .addCase(fetchProjectMembers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.payload?.detail || 'Failed to fetch members'
      })

      // Add member
      .addCase(addProjectMember.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(addProjectMember.fulfilled, (state, action) => {
        state.actionLoading = false
        const { projectUid, member } = action.payload
        if (!state.members[projectUid]) {
          state.members[projectUid] = []
        }
        state.members[projectUid].push(member)
        state.actionError = null
      })
      .addCase(addProjectMember.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.error || action.payload?.message || action.payload?.detail || 'Failed to add member'
      })

      // Remove member
      .addCase(removeProjectMember.pending, (state) => {
        state.actionLoading = true
        state.actionError = null
      })
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        state.actionLoading = false
        const { projectUid, memberId } = action.payload
        if (state.members[projectUid]) {
          state.members[projectUid] = state.members[projectUid].filter(m => m.id !== memberId)
        }
        state.actionError = null
      })
      .addCase(removeProjectMember.rejected, (state, action) => {
        state.actionLoading = false
        state.actionError = action.payload?.message || action.payload?.detail || 'Failed to remove member'
      })

      // Fetch projects status (lightweight, no loading indicator)
      .addCase(fetchProjectsStatus.fulfilled, (state, action) => {
        // Update projects with status information
        action.payload.forEach(statusProject => {
          const index = state.projects.findIndex(p => p.uid === statusProject.uid)
          if (index !== -1) {
            state.projects[index] = { ...state.projects[index], ...statusProject }
          }
        })
      })
      .addCase(fetchProjectsStatus.rejected, (state, action) => {
        // Silent fail for status updates
        console.error('Failed to fetch project status:', action.payload)
      })
  },
})

export const { 
  clearError, 
  clearActionError, 
  clearAllErrors, 
  clearCurrentProject, 
  setCurrentProject,
  resetProjectsState 
} = projectsSlice.actions

export default projectsSlice.reducer