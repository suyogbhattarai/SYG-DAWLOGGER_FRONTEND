'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { AiOutlineClose, AiOutlineMenu, AiOutlineLogin, AiOutlineUserAdd, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineRocket, AiOutlineCloud, AiOutlineTeam, AiOutlineBarChart, AiOutlineSound, AiOutlineThunderbolt } from 'react-icons/ai'
import { FaMusic, FaRobot, FaDownload, FaCheckCircle } from 'react-icons/fa'
import { SiApplemusic } from 'react-icons/si'

function DAWLoggerHomepage() {
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
    lastName: ''
  })

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

  const handleLogin = (e) => {
    e.preventDefault()
    console.log('Login:', loginForm)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    console.log('Signup:', signupForm)
  }

  const features = [
    {
      icon: <AiOutlineCloud size={40} />,
      title: 'Version Control',
      description: 'Track every change in your music projects with automatic versioning and rollback capabilities.'
    },
    {
      icon: <AiOutlineTeam size={40} />,
      title: 'Real-time Collaboration',
      description: 'Work seamlessly with producers, artists, and clients in real-time on the same project.'
    },
    {
      icon: <AiOutlineBarChart size={40} />,
      title: 'Project Insights',
      description: 'Get detailed analytics on project progress, workflow efficiency, and time tracking.'
    },
    {
      icon: <AiOutlineSound size={40} />,
      title: 'Mixing & Mastering',
      description: 'Professional mixing and mastering tools integrated directly into your workflow.'
    },
    {
      icon: <FaRobot size={40} />,
      title: 'AI Companion',
      description: 'Your intelligent assistant for music creation, suggestions, and technical guidance.'
    },
    {
      icon: <AiOutlineThunderbolt size={40} />,
      title: 'Workflow Manager',
      description: 'Streamline your production process with task management and milestone tracking.'
    }
  ]

  const daws = [
    { 
      name: 'FL Studio', 
      icon: (
        <div className="text-5xl font-bold">
          <span className="text-[#ef8e32]">FL</span>
        </div>
      )
    },
    { 
      name: 'Ableton Live', 
      icon: (
        <div className="text-5xl font-bold">
          <span className="text-[#ef8e32]">A</span>
        </div>
      )
    },
    { 
      name: 'Logic Pro', 
      icon: <SiApplemusic size={50} />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Music Production
              <br />
              <span className="text-[#ef8e32]">Reimagined</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Version control, real-time collaboration, AI assistance, and project insights—all in one powerful platform for music creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={openSignup}
                className="flex items-center space-x-2 px-8 py-4 bg-[#ef8e32] text-white text-lg font-semibold rounded-lg hover:bg-[#d67a28] transition-all shadow-2xl hover:scale-105"
              >
                <AiOutlineRocket size={24} />
                <span>Get Started Free</span>
              </button>
              <button
                onClick={openSignup}
                className="flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                <FaDownload size={20} />
                <span>Download Plugin</span>
              </button>
            </div>
            <p className="text-gray-400 mt-4">No credit card required • Free forever plan available</p>
          </div>

          {/* Floating cards animation */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-[#ef8e32] mb-2">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Version Control</h3>
              <p className="text-gray-400 text-sm">Never lose a project version again</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-[#ef8e32] mb-2">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">AI Companion</h3>
              <p className="text-gray-400 text-sm">Your intelligent music assistant</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:scale-105 transition-transform">
              <div className="text-[#ef8e32] mb-2">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Team Collaboration</h3>
              <p className="text-gray-400 text-sm">Work together in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A complete suite of tools designed for modern music production workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-[#ef8e32] transition-all hover:scale-105"
              >
                <div className="text-[#ef8e32] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAWs Section */}
      <section id="daws" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Works With Your DAW
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Seamless integration with industry-leading digital audio workstations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {daws.map((daw, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 flex flex-col items-center justify-center hover:border-[#ef8e32] transition-all hover:scale-105"
              >
                <div className="text-[#ef8e32] mb-4">
                  {daw.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {daw.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={openSignup}
              className="px-8 py-4 bg-[#ef8e32] text-white text-lg font-semibold rounded-lg hover:bg-[#d67a28] transition-all shadow-lg"
            >
              Download Plugin Now
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ef8e32] to-[#d67a28]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of producers, artists, and studios using SYG DAW Logger
          </p>
          <button
            onClick={openSignup}
            className="px-10 py-5 bg-white text-[#ef8e32] text-lg font-bold rounded-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            Start Creating Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                <span className="text-[#ef8e32]">SYG</span> DAW Logger
              </h3>
              <p className="text-gray-400">
                The ultimate music production platform for modern creators
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#daws" className="hover:text-white transition-colors">Supported DAWs</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 SYG DAW Logger. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-700">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400 mb-6">Log in to your DAW Logger account</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                    placeholder="Enter your username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-gray-300">
                    <input type="checkbox" className="mr-2 accent-[#ef8e32]" />
                    Remember me
                  </label>
                  <a href="#" className="text-[#ef8e32] hover:text-[#d67a28] transition-colors">
                    Forgot password?
                  </a>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full py-3 bg-[#ef8e32] text-white rounded-lg hover:bg-[#d67a28] transition-all font-semibold shadow-lg"
                >
                  Log In
                </button>
              </div>
              
              <p className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <button onClick={openSignup} className="text-[#ef8e32] hover:text-[#d67a28] font-semibold transition-colors">
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
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <AiOutlineClose size={24} />
            </button>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400 mb-6">Join DAW Logger today</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={signupForm.firstName}
                      onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={signupForm.lastName}
                      onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    value={signupForm.username}
                    onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                    placeholder="Choose a username"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Min 8 characters, 1 uppercase, 1 lowercase, 1 number
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ef8e32] transition-colors"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                
                <label className="flex items-start text-sm text-gray-300">
                  <input type="checkbox" className="mr-2 mt-1 accent-[#ef8e32]" />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
                
                <button
                  onClick={handleSignup}
                  className="w-full py-3 bg-[#ef8e32] text-white rounded-lg hover:bg-[#d67a28] transition-all font-semibold shadow-lg"
                >
                  Create Account
                </button>
              </div>
              
              <p className="mt-6 text-center text-gray-400">
                Already have an account?{' '}
                <button onClick={openLogin} className="text-[#ef8e32] hover:text-[#d67a28] font-semibold transition-colors">
                  Log in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DAWLoggerHomepage