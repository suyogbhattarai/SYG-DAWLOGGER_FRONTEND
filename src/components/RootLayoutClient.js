// src/components/RootLayoutClient.js
'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../utils/lib/redux/store'
import { loadUserFromStorage } from '../utils/lib/redux/features/auth/authSlice'

export default function RootLayoutClient({ children }) {
  const dispatch = useAppDispatch()
  const { initialized } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Load user from localStorage when app first mounts
    if (!initialized) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, initialized])

  return <>{children}</>
}