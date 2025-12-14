'use client'
import { useEffect } from 'react'
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from 'react-icons/ai'

export default function Toast({ message, type, onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const Icon = type === 'success' ? AiOutlineCheckCircle : AiOutlineCloseCircle

  return (
    <div className="fixed top-24 right-6 z-[100] bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]">
      <Icon size={22} />
      <p className="flex-1 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="hover:bg-white/20 rounded-full p-1 transition"
      >
        <AiOutlineClose size={16} />
      </button>
    </div>
  )
}
