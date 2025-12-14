'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/lib/redux/store'
import { loginUser, registerUser, logoutUser, clearError } from '@/utils/lib/redux/features/auth/authSlice'
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineUser,
} from 'react-icons/ai'
import { FiChevronDown } from 'react-icons/fi'
import logo from './logo.png'
import Loader, { LoaderButton } from '../ui/Loader'
import Toast from '../ui/Toast'

export default function Navbar() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const { loading, user, error, fieldErrors, tokens } = useAppSelector((state) => state.auth)

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    console.log('Navbar mounted — current auth user:', user)
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      // defensive: make sure ref exists
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const extractErrorMessage = (error) => {
    if (!error) return 'Unknown error occurred';
    if (typeof error === 'string') return error;
    const data = error.response?.data;
    if (data?.errors) return Object.values(data.errors).flat().join(', ')
    return data?.message || error.message || 'Server error'
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowSignupModal(false)
    setShowPassword(false)
    setShowConfirmPassword(false)
    dispatch(clearError())
  }

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      console.log('Attempting login with', loginForm)
      await dispatch(loginUser(loginForm)).unwrap()
      console.log('Login succeeded — redirecting to /dashboard')
      setToast({ show: true, message: 'Login successful 🎉', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      setToast({ show: true, message: extractErrorMessage(err), type: 'error' })
    }
  }

  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      setToast({ show: true, message: 'Passwords do not match', type: 'error' })
      return
    }
    try {
      console.log('Attempting signup with', signupForm)
      await dispatch(registerUser(signupForm)).unwrap()
      console.log('Signup succeeded — redirecting to /dashboard')
      setToast({ show: true, message: 'Account created successfully 🎉', type: 'success' })
      closeModals()
      router.push('/dashboard')
    } catch (err) {
      console.error('Signup failed:', err)
      const data = err.response?.data
      if (data?.errors) {
        setToast({ show: true, message: 'Fix highlighted errors', type: 'error' })
      } else {
        setToast({ show: true, message: data?.message || 'Registration failed', type: 'error' })
      }
    }
  }

  // LOGOUT: defensive + logs + both onMouseDown & onClick handlers
  const handleLogoutInternal = async (event) => {
    // prevent parent handlers from immediately hiding the dropdown before we act
    if (event && event.preventDefault) event.preventDefault()
    if (event && event.stopPropagation) event.stopPropagation()

    try {
      console.log('Logout initiated (handler) — tokens from state:', tokens)
      // dispatch the thunk and await it
      const result = await dispatch(logoutUser()).unwrap()
      console.log('logoutUser thunk resolved with:', result)
      // confirm localStorage cleared
      console.log('localStorage authUser after logout:', localStorage.getItem('authUser'))
      console.log('localStorage tokens after logout:', {
        tokens: localStorage.getItem('tokens'),
        access: localStorage.getItem('access'),
        refresh: localStorage.getItem('refresh'),
      })
      // close dropdown and navigate
      setShowProfileDropdown(false)
      console.log('Navigating to /')
      router.replace('/')
    } catch (err) {
      console.error('Error during logout:', err)
      // still attempt UI cleanup
      setShowProfileDropdown(false)
      router.replace('/')
    }
  }

  return (
    <>
      {loading && <Loader fullScreen />}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <header className="flex items-center justify-between px-6 md:px-16 py-6">
        <div className="flex items-center gap-4">
          <Image src={logo} alt="dawlogs" width={140} />
        </div>

        <nav className="hidden md:flex gap-10 text-white/90">
          <a className="hover:text-white cursor-pointer">Library</a>
          <a className="hover:text-white cursor-pointer">Sessions</a>
          <a className="hover:text-white cursor-pointer">Sample Basket</a>
          <a className="hover:text-white cursor-pointer">Community</a>
          <a className="hover:text-white cursor-pointer">Insights</a>
        </nav>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                console.log('Profile button clicked — toggling dropdown')
                setShowProfileDropdown((s) => !s)
              }}
              className="flex gap-2 bg-white/10 px-4 py-2 rounded-full"
              type="button"
            >
              <AiOutlineUser /> {user.username} <FiChevronDown />
            </button>

            {showProfileDropdown && (
              <div
                className="absolute right-0 mt-2 bg-white rounded-xl p-3 text-black shadow-lg w-40"
                role="menu"
              >
                <button
                  type="button"
                  className="block py-2 w-full text-left"
                  onClick={() => {
                    console.log('Dashboard navigation clicked')
                    setShowProfileDropdown(false)
                    router.push('/dashboard')
                  }}
                >
                  Dashboard
                </button>

                {/* IMPORTANT: use both onMouseDown AND onClick, and type="button" */}
                <button
                  type="button"
                  className="block py-2 text-red-600 w-full text-left"
                  onMouseDown={handleLogoutInternal}
                  onClick={(e) => {
                    // also call in onClick to be extra safe
                    handleLogoutInternal(e)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white/10 px-6 py-2 rounded-full"
              type="button"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignupModal(true)}
              className="bg-white text-[#0b4e75] px-6 py-2 rounded-full"
              type="button"
            >
              Sign Up
            </button>
          </div>
        )}

        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setMobileMenuOpen(true)}
          type="button"
        >
          <AiOutlineMenu />
        </button>
      </header>

      {/* Mobile menu, modals, etc. (unchanged from your prior working version) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden">
          <div className="absolute right-0 top-0 bg-[#101010] w-64 h-full p-6">
            <button
              className="text-white text-3xl mb-6"
              onClick={() => setMobileMenuOpen(false)}
              type="button"
            >
              <AiOutlineClose />
            </button>

            <div className="flex flex-col gap-6 text-white text-lg">
              <a>Library</a>
              <a>Sessions</a>
              <a>Sample Basket</a>
              <a>Community</a>
              <a>Insights</a>

              {!user ? (
                <>
                  <button
                    className="bg-white/10 px-6 py-2 rounded-full"
                    onClick={() => {
                      setShowLoginModal(true)
                      setMobileMenuOpen(false)
                    }}
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-white text-black px-6 py-2 rounded-full"
                    onClick={() => {
                      setShowSignupModal(true)
                      setMobileMenuOpen(false)
                    }}
                    type="button"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      router.push('/dashboard')
                    }}
                    type="button"
                  >
                    Dashboard
                  </button>
                  <button
                    onMouseDown={handleLogoutInternal}
                    onClick={handleLogoutInternal}
                    className="text-red-500"
                    type="button"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
          <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
            <button onClick={closeModals} className="absolute top-4 right-4 text-white text-xl" type="button">
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">Login</h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                placeholder="Username"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <LoaderButton
                type="submit"
                loading={loading}
                className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30"
              >
                Login
              </LoaderButton>
            </form>
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
          <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl">
            <button onClick={closeModals} className="absolute top-4 right-4 text-white text-xl" type="button">
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>

            <form onSubmit={handleSignup} className="space-y-4">
              <input
                placeholder="Username"
                value={signupForm.username}
                onChange={(e) => {
                  setSignupForm({ ...signupForm, username: e.target.value })
                  dispatch(clearError())
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
              />
              {fieldErrors?.username && <p className="text-red-500 text-sm mt-1">{fieldErrors.username[0]}</p>}

              <input
                placeholder="Email"
                value={signupForm.email}
                onChange={(e) => {
                  setSignupForm({ ...signupForm, email: e.target.value })
                  dispatch(clearError())
                }}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
              />
              {fieldErrors?.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email[0]}</p>}

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signupForm.password}
                  onChange={(e) => {
                    setSignupForm({ ...signupForm, password: e.target.value })
                    dispatch(clearError())
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 pr-10 text-white"
                />
                {fieldErrors?.password && <p className="text-red-500 text-sm mt-1">{fieldErrors.password[0]}</p>}

                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={signupForm.confirmPassword}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, confirmPassword: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 pr-10 text-white"
                />

                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>

              <LoaderButton type="submit" loading={loading} className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30">
                Sign Up
              </LoaderButton>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
