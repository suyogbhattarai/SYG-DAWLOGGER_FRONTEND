'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/lib/redux/store'
import { loginUser, registerUser } from '@/utils/lib/redux/features/auth/authSlice'
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from 'react-icons/ai'
import logo from './logo.png'
import Loader, { LoaderButton } from '../ui/Loader'
import Toast from '../ui/Toast'

export default function Navbar() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const openLogin = () => {
    setShowLoginModal(true)
    setShowSignupModal(false)
    setIsMenuOpen(false)
  }
  const openSignup = () => {
    setShowSignupModal(true)
    setShowLoginModal(false)
    setIsMenuOpen(false)
  }
  const closeModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // Helper to extract message string from error object
  const getErrorMessage = (payload) => {
    if (!payload) return 'Something went wrong!'
    if (typeof payload === 'string') return payload
    if (payload.message) return payload.message
    if (payload.errors) {
      if (Array.isArray(payload.errors)) return payload.errors[0]
      if (typeof payload.errors === 'object') return Object.values(payload.errors)[0]
    }
    return JSON.stringify(payload)
  }

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await dispatch(loginUser(loginForm))
    if (loginUser.fulfilled.match(result)) {
      setToast({ show: true, message: 'Logged in successfully!', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } else {
      setToast({ show: true, message: getErrorMessage(result.payload), type: 'error' })
    }
  }

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match!', type: 'error' })
      return
    }
    const result = await dispatch(registerUser(signupForm))
    if (registerUser.fulfilled.match(result)) {
      setToast({ show: true, message: 'Account created successfully!', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } else {
      setToast({ show: true, message: getErrorMessage(result.payload), type: 'error' })
    }
  }

  return (
    <>
      {/* Loader */}
      {loading && <Loader fullScreen />}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Image src={logo} alt="DAW Logger Logo" className="h-10 sm:h-12 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white font-medium">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white font-medium">Pricing</a>
              <a href="#docs" className="text-gray-300 hover:text-white font-medium">Documentation</a>
              <a href="#about" className="text-gray-300 hover:text-white font-medium">About</a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={openLogin} className="flex items-center space-x-2 px-4 py-2 text-white border border-primary hover:bg-[#EF8E34]/10 rounded-lg font-medium">
                <AiOutlineLogin size={18} />
                <span>Login</span>
              </button>
              <button onClick={openSignup} className="flex items-center space-x-2 px-4 py-2 bg-[#EF8E34] text-white rounded-lg font-medium shadow-lg">
                <AiOutlineUserAdd size={18} />
                <span>Sign Up</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden text-white p-2 rounded-lg hover:bg-gray-700 transition-colors">
              {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white px-2 py-2">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white px-2 py-2">Pricing</a>
                <a href="#docs" className="text-gray-300 hover:text-white px-2 py-2">Documentation</a>
                <a href="#about" className="text-gray-300 hover:text-white px-2 py-2">About</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-700">
                  <button onClick={openLogin} className="flex items-center justify-center px-4 py-2 text-white border border-primary rounded-lg">
                    <AiOutlineLogin size={18} />
                    <span>Login</span>
                  </button>
                  <button onClick={openSignup} className="flex items-center justify-center px-4 py-2 bg-[#EF8E34] text-white rounded-lg">
                    <AiOutlineUserAdd size={18} />
                    <span>Sign Up</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-700">
            <button onClick={closeModals} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <AiOutlineClose size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 mb-6">Log in to your DAW Logger account</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                <LoaderButton type="submit" loading={loading} className="w-full py-3 bg-[#EF8E34] text-white rounded-lg font-semibold shadow-lg">
                  Log In
                </LoaderButton>
              </form>
              <p className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <button onClick={openSignup} className="text-[#EF8E34] font-semibold">
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-700 my-8">
            <button onClick={closeModals} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
              <AiOutlineClose size={24} />
            </button>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400 mb-6">Join DAW Logger today</p>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                    <input
                      type="text"
                      value={signupForm.firstName}
                      onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={signupForm.lastName}
                      onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Username & Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username *</label>
                  <input
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    placeholder="Choose a username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Passwords */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start text-sm text-gray-300">
                  <input type="checkbox" className="mr-2 mt-1 accent-primary" required />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <LoaderButton type="submit" loading={loading} className="w-full py-3 bg-[#EF8E34] text-white rounded-lg font-semibold shadow-lg">
                  Create Account
                </LoaderButton>
              </form>

              <p className="mt-6 text-center text-gray-400">
                Already have an account?{' '}
                <button onClick={openLogin} className="text-[#EF8E34] font-semibold">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
