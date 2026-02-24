// src/components/ui/AuthSessionListener.js
'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '@/utils/lib/redux/features/auth/authSlice'

export default function AuthSessionListener() {
  const dispatch = useDispatch()

  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('🔔 Session expired event received, resetting auth state...')
      // Reset Redux auth state
      dispatch(logout())
    }

    // Listen for session expired events from axios interceptor
    window.addEventListener('auth:sessionExpired', handleSessionExpired)

    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired)
    }
  }, [dispatch])

  // This component doesn't render anything
  return null
}