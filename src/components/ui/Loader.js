'use client'
import React from 'react'

export default function Loader({ size = 'medium', fullScreen = false }) {
  const sizeMap = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  }

  const spinner = (
    <div
      className={`${sizeMap[size]} border-white/70 border-t-transparent rounded-full animate-spin`}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/5">
        <div className="bg-white/10 border border-white/30 backdrop-blur-xl rounded-2xl p-10 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]">
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
      className={`relative ${className} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/2 rounded">
          <Loader size="small" />
        </div>
      )}
      <span className={loading ? 'invisible' : 'visible'}>{children}</span>
    </button>
  )
}