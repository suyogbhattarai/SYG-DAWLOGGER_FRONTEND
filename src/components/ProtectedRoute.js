// src/components/ProtectedRoute.js
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../utils/lib/redux/store'
import Loader from "../components/ui/Loader"

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const { user, loading } = useAppSelector((state) => state.auth)

  // Derived auth state
  const isAuthenticated = !!user

  useEffect(() => {
    // Check if user is authenticated after initial load
    const checkAuth = async () => {
      // Small delay to let auth state load from localStorage
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (!loading && !isAuthenticated) {
        router.push('/') // Redirect to login/home page
      }
    }

    checkAuth()
  }, [isAuthenticated, loading, router])

  // Show loader while checking authentication
  if (loading || !user) {
    return <Loader fullScreen />
  }

  return <>{children}</>
}
