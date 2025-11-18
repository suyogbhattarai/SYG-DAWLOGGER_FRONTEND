// src/components/ProtectedRoute.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '../utils/lib/redux/store'
import { loadUserFromStorage } from '../utils/lib/redux/features/auth/authSlice'
import Loader from "../components/ui/Loader"

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, loading, initialized } = useAppSelector((state) => state.auth)

  // Load user from localStorage on mount
  useEffect(() => {
    if (!initialized) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, initialized])

  // Redirect to home if not authenticated after initialization
  useEffect(() => {
    if (initialized && !loading && !user) {
      router.push('/')
    }
  }, [initialized, loading, user, router])

  // Show loader while checking authentication
  if (!initialized || loading) {
    return <Loader fullScreen />
  }

  // User not authenticated, redirect happening
  if (!user) {
    return <Loader fullScreen />
  }

  // User is authenticated, show protected content
  return <>{children}</>
}