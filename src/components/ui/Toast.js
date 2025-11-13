'use client'
import { useEffect } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from 'react-icons/ai'

export default function Toast({ message, type, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  const Icon = type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle

  // Ensure message is always string
  const displayMessage = typeof message === 'string' ? message : JSON.stringify(message)

  return (
    <div className={`fixed top-20 right-4 z-[100] ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3 min-w-[320px] animate-slide-in`}>
      <Icon size={24} className="flex-shrink-0" />
      <p className="flex-1 font-medium">{displayMessage}</p>
      <button onClick={onClose} className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors">
        <AiOutlineClose size={18} />
      </button>
    </div>
  )
}
