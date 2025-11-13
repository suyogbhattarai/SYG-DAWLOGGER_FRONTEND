// src/lib/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import authReducer from './features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Typed hooks are not needed in JS, but you can still create custom hooks
export const useAppDispatch = () => useDispatch()
export const useAppSelector = useSelector
