// src/app/dashboard/page.js
'use client'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/lib/redux/store'
import { logoutUser } from '@/utils/lib/redux/features/auth/authSlice'
import ProtectedRoute from '../../components/ProtectedRoute'
import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar, AiOutlineLogout } from 'react-icons/ai'

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, apiKey } = useAppSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">DAW Logger Dashboard</h1>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                <AiOutlineLogout size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#EF8E34] to-[#d67d2d] rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-white/90">
              You're successfully logged in to your DAW Logger account.
            </p>
          </div>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Username Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-[#EF8E34]/20 p-3 rounded-lg">
                  <AiOutlineUser size={24} className="text-[#EF8E34]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Username</p>
                  <p className="text-white font-semibold text-lg">{user?.username}</p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <AiOutlineMail size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold text-lg break-all">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Join Date Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="bg-green-500/20 p-3 rounded-lg">
                  <AiOutlineCalendar size={24} className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-semibold text-lg">
                    {user?.date_joined
                      ? new Date(user.date_joined).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* API Key Section */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Your API Key</h3>
            <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
              <code className="text-[#EF8E34] font-mono text-sm break-all">{apiKey}</code>
            </div>
            <p className="text-gray-400 text-sm mt-3">
              Keep this API key secure. You'll need it to authenticate API requests.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg">
              <p className="text-4xl font-bold text-[#EF8E34] mb-2">0</p>
              <p className="text-gray-400">Projects</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg">
              <p className="text-4xl font-bold text-[#EF8E34] mb-2">0</p>
              <p className="text-gray-400">Sessions</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg">
              <p className="text-4xl font-bold text-[#EF8E34] mb-2">0h</p>
              <p className="text-gray-400">Total Time</p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
