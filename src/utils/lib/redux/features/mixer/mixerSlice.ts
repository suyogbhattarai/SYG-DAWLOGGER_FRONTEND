import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/utils/lib/axios/axiosInstance';

export interface AudioClip {
    id: number;
    track: number;
    name: string;
    audio_file: string;
    start_time: number;
    duration: number | null;
}

export interface Track {
    id: number;
    project: number;
    name: string;
    volume: number;
    pan: number;
    muted: boolean;
    soloed: boolean;
    color: string;
    order: number;
    clips: AudioClip[];
}

export interface MixerProject {
    id: number;
    name: string;
    owner: number;
    owner_name: string;
    created_at: string;
    updated_at: string;
    bpm: number;
    tracks: Track[];
}

interface MixerState {
    projects: MixerProject[];
    currentProject: MixerProject | null;
    loading: boolean;
    error: string | null;
}

const initialState: MixerState = {
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
};

// ============================================================
// THUNKS
// ============================================================

export const fetchMixerProjects = createAsyncThunk(
    'mixer/fetchProjects',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/mixer/projects/');
            return response.data.results || response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mixer projects');
        }
    }
);

export const fetchMixerProjectById = createAsyncThunk(
    'mixer/fetchProjectById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/mixer/projects/${id}/`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mixer project');
        }
    }
);

export const createMixerProject = createAsyncThunk(
    'mixer/createProject',
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/mixer/projects/', { name });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create project');
        }
    }
);

export const createTrack = createAsyncThunk(
    'mixer/createTrack',
    async ({ projectId, name }: { projectId: number, name: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/mixer/tracks/', { project: projectId, name });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create track');
        }
    }
);

export const updateTrack = createAsyncThunk(
    'mixer/updateTrack',
    async ({ id, data }: { id: number, data: Partial<Track> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/api/mixer/tracks/${id}/`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update track');
        }
    }
);

export const uploadClip = createAsyncThunk(
    'mixer/uploadClip',
    async ({ trackId, file, name }: { trackId: number, file: File, name: string }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('track', trackId.toString());
            formData.append('audio_file', file);
            formData.append('name', name);
            const response = await axiosInstance.post('/api/mixer/clips/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload clip');
        }
    }
);

export const updateClip = createAsyncThunk(
    'mixer/updateClip',
    async ({ id, data }: { id: number, data: Partial<AudioClip> }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(`/api/mixer/clips/${id}/`, data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update clip');
        }
    }
);

const mixerSlice = createSlice({
    name: 'mixer',
    initialState,
    reducers: {
        setCurrentProject: (state, action) => {
            state.currentProject = action.payload;
        },
        clearMixerError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMixerProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMixerProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchMixerProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchMixerProjectById.fulfilled, (state, action) => {
                state.currentProject = action.payload;
            })
            .addCase(createMixerProject.fulfilled, (state, action) => {
                state.projects.unshift(action.payload);
                state.currentProject = action.payload;
            })
            .addCase(createTrack.fulfilled, (state, action) => {
                if (state.currentProject && state.currentProject.id === action.payload.project) {
                    state.currentProject.tracks.push({ ...action.payload, clips: [] });
                }
            })
            .addCase(updateTrack.fulfilled, (state, action) => {
                if (state.currentProject) {
                    const idx = state.currentProject.tracks.findIndex(t => t.id === action.payload.id);
                    if (idx !== -1) {
                        state.currentProject.tracks[idx] = { ...state.currentProject.tracks[idx], ...action.payload };
                    }
                }
            })
            .addCase(uploadClip.fulfilled, (state, action) => {
                if (state.currentProject) {
                    const track = state.currentProject.tracks.find(t => t.id === action.payload.track);
                    if (track) {
                        track.clips.push(action.payload);
                    }
                }
            });
    },
});

export const { setCurrentProject, clearMixerError } = mixerSlice.actions;
export default mixerSlice.reducer;
