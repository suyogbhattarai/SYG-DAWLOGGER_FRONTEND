// src/lib/axios/axiosInstance.js
import axios from 'axios'

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor - Add auth token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('authUser')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          const token = parsed?.tokens?.access
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch (err) {
          console.error('Failed to parse auth data:', err)
        }
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      const errorData = error.response?.data

      // Check if it's a token expiration error
      const isTokenExpired = 
        errorData?.code === 'token_not_valid' ||
        errorData?.detail?.includes('token') ||
        errorData?.detail?.includes('expired') ||
        errorData?.detail?.toLowerCase().includes('given token not valid') ||
        errorData?.messages?.some(msg => 
          msg.message === 'Token is expired' || 
          msg.token_type === 'access'
        )

      if (isTokenExpired && typeof window !== 'undefined') {
        console.log('🔒 Token expired, logging out...')
        
        // Clear auth data from localStorage
        localStorage.removeItem('authUser')
        localStorage.removeItem('tokens')
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        
        // Dispatch event for Redux to clear state
        window.dispatchEvent(new CustomEvent('auth:sessionExpired'))
        
        // Show alert
        alert('Session expired. Please login again.')
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = '/home'
        }, 1000)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance