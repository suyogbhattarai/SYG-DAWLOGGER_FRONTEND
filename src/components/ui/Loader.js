// src/components/ui/Loader.jsx
'use client'
import React from 'react'

export default function Loader({ size = 'medium', fullScreen = false }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-[#EF8E34] border-t-transparent rounded-full animate-spin`}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {spinner}
        </div>
      </div>
    )
  }

  return spinner
}

// Button with loader
export function LoaderButton({
  loading,
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`relative ${className} ${loading || disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader size="small" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>{children}</span>
    </button>
  )
}
