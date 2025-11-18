// src/app/dashboard/page.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/utils/lib/redux/store'
import { logoutUser } from '@/utils/lib/redux/features/auth/authSlice'
import { fetchProjects, createProject } from '@/utils/lib/redux/features/projects/projectsSlice'
import { fetchUserActivity } from '@/utils/lib/redux/features/activity/activitySlice'
import ProtectedRoute from '../../components/ProtectedRoute'
import { 
  AiOutlineUser, 
  AiOutlineMail, 
  AiOutlineCalendar, 
  AiOutlineLogout,
  AiOutlinePlus,
  AiOutlineProject,
  AiOutlineClockCircle,
  AiOutlineHistory
} from 'react-icons/ai'
import { FiFolder, FiUsers, FiBox } from 'react-icons/fi'

export default function DashboardPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Redux state
  const { user, apiKey } = useAppSelector((state) => state.auth)
  const { projects, loading: projectsLoading } = useAppSelector((state) => state.projects)
  const { userActivity, loading: activityLoading } = useAppSelector((state) => state.activity)

  // Local state
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchProjects())
      dispatch(fetchUserActivity(20))
    }
  }, [dispatch, user])

  // Calculate stats
  const projectCount = projects.length
  const totalVersions = projects.reduce((sum, p) => sum + (p.version_count || 0), 0)
  const totalMembers = projects.reduce((sum, p) => sum + (p.members?.length || 0), 0)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      await dispatch(createProject({
        name: newProjectName,
        description: newProjectDesc
      })).unwrap()
      
      setNewProjectName('')
      setNewProjectDesc('')
      setShowCreateProject(false)
      dispatch(fetchProjects()) // Refresh list
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  const getActionIcon = (action) => {
    const iconMap = {
      project_created: <FiFolder className="text-blue-500" />,
      member_added: <FiUsers className="text-green-500" />,
      version_pushed: <FiBox className="text-purple-500" />,
      sample_uploaded: <AiOutlineClockCircle className="text-yellow-500" />,
    }
    return iconMap[action] || <AiOutlineHistory className="text-gray-500" />
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}


        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#EF8E34] to-[#d67d2d] rounded-2xl p-8 mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-white/90">
              Manage your DAW projects, track versions, and collaborate with your team.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Projects */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <AiOutlineProject size={32} className="text-[#EF8E34] mx-auto mb-2" />
              <p className="text-4xl font-bold text-white mb-1">{projectCount}</p>
              <p className="text-gray-400 text-sm">Projects</p>
            </div>

            {/* Versions */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <FiBox size={32} className="text-purple-500 mx-auto mb-2" />
              <p className="text-4xl font-bold text-white mb-1">{totalVersions}</p>
              <p className="text-gray-400 text-sm">Total Versions</p>
            </div>

            {/* Team Members */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <FiUsers size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-4xl font-bold text-white mb-1">{totalMembers}</p>
              <p className="text-gray-400 text-sm">Team Members</p>
            </div>

            {/* Activities */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <AiOutlineHistory size={32} className="text-blue-500 mx-auto mb-2" />
              <p className="text-4xl font-bold text-white mb-1">{userActivity.length}</p>
              <p className="text-gray-400 text-sm">Recent Activities</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Projects */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projects Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Your Projects</h3>
                  <button
                    onClick={() => setShowCreateProject(!showCreateProject)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#EF8E34] hover:bg-[#d67d2d] text-white rounded-lg transition-all font-medium"
                  >
                    <AiOutlinePlus size={18} />
                    <span>New Project</span>
                  </button>
                </div>

                {/* Create Project Form */}
                {showCreateProject && (
                  <form onSubmit={handleCreateProject} className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-600">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#EF8E34]"
                      required
                    />
                    <textarea
                      placeholder="Project Description (optional)"
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#EF8E34] resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateProject(false)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Projects List */}
                {projectsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EF8E34] mx-auto"></div>
                    <p className="text-gray-400 mt-2">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <FiFolder size={48} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No projects yet. Create your first one!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 bg-gray-900 border border-gray-700 rounded-lg hover:border-[#EF8E34] transition-all cursor-pointer group"
                        onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-white group-hover:text-[#EF8E34] transition-colors">
                              {project.name}
                            </h4>
                            {project.description && (
                              <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <FiBox size={14} />
                                <span>{project.version_count || 0} versions</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <FiUsers size={14} />
                                <span>{project.members?.length || 0} members</span>
                              </span>
                              <span>{project.user_role}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            {project.has_active_push && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                                Active Push
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#EF8E34]/20 p-3 rounded-lg">
                      <AiOutlineUser size={20} className="text-[#EF8E34]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Username</p>
                      <p className="text-white font-semibold">{user?.username}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500/20 p-3 rounded-lg">
                      <AiOutlineMail size={20} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs">Email</p>
                      <p className="text-white font-semibold text-sm truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-500/20 p-3 rounded-lg">
                      <AiOutlineCalendar size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Member Since</p>
                      <p className="text-white font-semibold text-sm">
                        {user?.date_joined
                          ? new Date(user.date_joined).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Activity & API Key */}
            <div className="space-y-6">
              {/* API Key Section */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Your API Key</h3>
                <div className="bg-gray-900 border border-gray-600 rounded-lg p-3">
                  <code className="text-[#EF8E34] font-mono text-xs break-all">{apiKey}</code>
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Use this key to authenticate API requests from your DAW plugin.
                </p>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                
                {activityLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EF8E34] mx-auto"></div>
                  </div>
                ) : userActivity.length === 0 ? (
                  <div className="text-center py-6">
                    <AiOutlineHistory size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">No activity yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userActivity.slice(0, 10).map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getActionIcon(activity.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium">
                              {activity.action_display}
                            </p>
                            <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                              {activity.description}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}