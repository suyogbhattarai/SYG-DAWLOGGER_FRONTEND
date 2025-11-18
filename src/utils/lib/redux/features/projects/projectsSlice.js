// src/lib/redux/features/projects/projectsSlice.js
'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000/api/projects/'

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

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch projects' })
    }
  }
)

// Fetch single project
export const fetchProjectById = createAsyncThunk(
  'projects/fetchById',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}${projectId}/`, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch project' })
    }
  }
)

// Create project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(API_BASE, projectData, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to create project' })
    }
  }
)

// Update project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ projectId, data }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE}${projectId}/`, data, {
        headers: getAuthHeaders(getState)
      })
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to update project' })
    }
  }
)

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}${projectId}/`, {
        headers: getAuthHeaders(getState)
      })
      return projectId
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to delete project' })
    }
  }
)

// Fetch project members
export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchMembers',
  async (projectId, { getState, rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE}${projectId}/members/`, {
        headers: getAuthHeaders(getState)
      })
      return { projectId, members: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to fetch members' })
    }
  }
)

// Add project member
export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role }, { getState, rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE}${projectId}/members/`,
        { user_id: userId, role },
        { headers: getAuthHeaders(getState) }
      )
      return { projectId, member: response.data }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to add member' })
    }
  }
)

// Remove project member
export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, memberId }, { getState, rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE}${projectId}/members/${memberId}/`, {
        headers: getAuthHeaders(getState)
      })
      return { projectId, memberId }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Failed to remove member' })
    }
  }
)

// -----------------------------------------
// Slice
// -----------------------------------------

const initialState = {
  projects: [],
  currentProject: null,
  members: {},
  loading: false,
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
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
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch projects'
      })

      // Fetch single project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch project'
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false
        state.projects.push(action.payload)
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to create project'
      })

      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload
        }
      })

      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload)
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null
        }
      })

      // Fetch members
      .addCase(fetchProjectMembers.fulfilled, (state, action) => {
        state.members[action.payload.projectId] = action.payload.members
      })

      // Add member
      .addCase(addProjectMember.fulfilled, (state, action) => {
        const { projectId, member } = action.payload
        if (!state.members[projectId]) {
          state.members[projectId] = []
        }
        state.members[projectId].push(member)
      })

      // Remove member
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        const { projectId, memberId } = action.payload
        if (state.members[projectId]) {
          state.members[projectId] = state.members[projectId].filter(m => m.id !== memberId)
        }
      })
  },
})

export const { clearError, clearCurrentProject } = projectsSlice.actions
export default projectsSlice.reducer