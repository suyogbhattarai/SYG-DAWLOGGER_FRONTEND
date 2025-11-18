// src/lib/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import authReducer from './features/auth/authSlice'
import projectsReducer from './features/projects/projectsSlice'
import versionsReducer from './features/versions/versionsSlice'
import samplesReducer from './features/samples/samplesSlice'
import activityReducer from './features/activity/activitySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    versions: versionsReducer,
    samples: samplesReducer,
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Typed hooks are not needed in JS, but you can still create custom hooks
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
