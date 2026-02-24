'use client'
import { FiHome, FiFolder, FiLayers, FiSettings, FiUser } from "react-icons/fi"
import Link from "next/link"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/lib/redux/store'
import { loginUser, registerUser, logoutUser, clearError } from '@/utils/lib/redux/features/auth/authSlice'
import { AiOutlineUser } from 'react-icons/ai'
import { FiChevronDown } from 'react-icons/fi'
import logo from './logo.png'
import Loader, { LoaderButton } from '../../components/ui/Loader'
import Toast from '../../components/ui/Toast'
import React, { useState, useRef, useEffect } from 'react'
import ProtectedRoute from "@/components/ProtectedRoute"
export default function DashboardLayout({ children }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, user, error, fieldErrors } = useAppSelector((state) => state.auth)

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dropdownRef = useRef(null)

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const extractErrorMessage = (error) => {
    if (!error) return 'Unknown error occurred'
    if (typeof error === 'string') return error
    if (error.response?.data) {
      const data = error.response.data
      if (data.errors && typeof data.errors === 'object') {
        return Object.values(data.errors).flat().join(', ') || data.message || 'Invalid input data'
      }
      if (data.message) return data.message
      if (data.detail) return data.detail
    }
    if (error.message) return error.message
    return 'Server unreachable. Is backend running?'
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
    dispatch(clearError())
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await dispatch(loginUser(loginForm)).unwrap()
      setToast({ show: true, message: 'Login successful 🎉', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } catch (error) {
      setToast({ show: true, message: extractErrorMessage(error), type: 'error' })
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'error' })
      return
    }
    try {
      await dispatch(registerUser(signupForm)).unwrap()
      setToast({ show: true, message: 'Account created successfully 🎉', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } catch (error) {
      const data = error.response?.data
      if (data?.errors) {
        // Handle field errors
      } else {
        setToast({ show: true, message: data?.message || 'Registration failed', type: 'error' })
      }
    }
  }

 const handleLogout = async () => {
  console.log("Logout button clicked!");

  try {
    await dispatch(logoutUser()).unwrap();
    console.log("Logout successful, redirecting...");

    setShowProfileDropdown(false);

    router.replace('/');
    // force re-render by clearing localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setTimeout(() => {
      window.location.reload();
    }, 200);
    
  } catch (err) {
    console.log("Logout failed:", err);
  }
};


  return (
    <ProtectedRoute>
       <div className="flex min-h-screen w-full bg-gradient-to-b from-[#060f29] via-[#09265b] to-[#33626e]">
      {/* =========================== SIDEBAR ============================ */}
      <aside className="w-20 fixed left-0 top-0 h-full bg-white/5 border-r border-white/10 backdrop-blur-xl flex flex-col items-center py-10 gap-8">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold text-white">
          Pr
        </div>  

        <MenuIcon label="Sessions" />
        <MenuIcon label="Versions" />
        <MenuIcon label="Health" />
        <MenuIcon label="Files" />
        <MenuIcon label="Analytics" />

        <div className="mt-auto text-white/40 text-xs pb-6">v1.0</div>
      </aside>

      

      {/* =========================== MAIN CONTENT ============================ */}
      <main className="flex-1 ml-20 ">
        {/* Header with Navbar */}
    
    <header className="flex items-center sticky top-0 z-10 left-0 w-full justify-between px-8 py-4 bg-white/5 border-b border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <Image src={logo} alt="dawlogs" width={150} />
          </div>

          <nav className="hidden md:flex gap-10 text-white/90">
            <a className="hover:text-white cursor-pointer">Library</a>
            <a className="hover:text-white cursor-pointer">Sessions</a>
            <a className="hover:text-white cursor-pointer">Sample Basket</a>
            <a className="hover:text-white cursor-pointer">Community</a>
            <a className="hover:text-white cursor-pointer">Insights</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex gap-2 bg-white/10 px-4 py-2 rounded-full"
                >
                  <AiOutlineUser /> {user.username} <FiChevronDown />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 bg-white rounded-xl p-3 text-black">
                    <button onClick={() => router.push('/dashboard')} className="block py-2">Dashboard</button>
                    <button onClick={handleLogout} className="block py-2 text-red-600">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setShowLoginModal(true)} className="bg-white/10 px-6 py-2 rounded-full">Sign In</button>
                <button onClick={() => setShowSignupModal(true)} className="bg-white text-[#0b4e75] px-6 py-2 rounded-full">Sign Up</button>
              </div>
            )}
          </div>
        </header>
        {/* Page Content */}
        {children}
      </main>

      {/* Modals and Loader */}
      {loading && <Loader fullScreen />}
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </div>
    </ProtectedRoute>
   
  )
}

function MenuIcon({ label }) {
  return (
    <div className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center cursor-pointer transition">
      <span className="text-white/60 text-xs">{label.slice(0, 2)}</span>
    </div>
  )
}
