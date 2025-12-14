// src/hooks/useToast.js
'use client'
import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  const success = useCallback((message) => {
    showToast(message, 'success')
  }, [showToast])

  const error = useCallback((message) => {
    showToast(message, 'error')
  }, [showToast])

  return {
    toast,
    showToast,
    hideToast,
    success,
    error,
  }
}

// Example usage:
// const { toast, success, error, hideToast } = useToast()
// success('Project created!')
// error('Failed to create project')
// 
// {toast && (
//   <Toast 
//     message={toast.message} 
//     type={toast.type} 
//     onClose={hideToast} 
//   />
// )}