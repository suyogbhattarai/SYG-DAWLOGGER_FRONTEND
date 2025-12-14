// app/dashboard/projects/page.jsx
'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { FiFolder, FiPlus, FiX, FiLoader } from 'react-icons/fi'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  clearActionError,
  clearError
} from '@/utils/lib/redux/features/projects/projectsSlice'

export default function ProjectsPage() {
  const dispatch = useDispatch()
  const { projects, loading, actionLoading, error, actionError } = useSelector(
    (state) => state.projects
  )
  const { toast, success, error: showError, hideToast } = useToast()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    require_push_approval: false
  })

  // Fetch projects on mount
  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  // Clear errors when modals close
  useEffect(() => {
    if (!showCreateModal && !showEditModal) {
      dispatch(clearActionError())
    }
  }, [showCreateModal, showEditModal, dispatch])

  const handleCreateProject = async (e) => {
    e.preventDefault()
    dispatch(clearActionError())

    const result = await dispatch(createProject({
      name: formData.name,
      description: formData.description || null,
      require_push_approval: formData.require_push_approval
    }))

    if (createProject.fulfilled.match(result)) {
      setShowCreateModal(false)
      setFormData({ name: '', description: '', require_push_approval: false })
      success('Project created successfully!')
    } else {
      showError(actionError || 'Failed to create project')
    }
  }

  const handleUpdateProject = async (e) => {
    e.preventDefault()
    if (!selectedProject) return

    dispatch(clearActionError())

    const result = await dispatch(updateProject({
      projectUid: selectedProject.uid,
      data: {
        name: formData.name,
        description: formData.description || null,
        require_push_approval: formData.require_push_approval
      }
    }))

    if (updateProject.fulfilled.match(result)) {
      setShowEditModal(false)
      setSelectedProject(null)
      setFormData({ name: '', description: '', require_push_approval: false })
      success('Project updated successfully!')
    } else {
      showError(actionError || 'Failed to update project')
    }
  }

  const handleDeleteProject = async () => {
    if (!selectedProject) return

    const result = await dispatch(deleteProject(selectedProject.uid))

    if (deleteProject.fulfilled.match(result)) {
      setShowDeleteModal(false)
      setSelectedProject(null)
      success('Project deleted successfully!')
    } else {
      showError(actionError || 'Failed to delete project')
    }
  }

  const openEditModal = (project) => {
    setSelectedProject(project)
    setFormData({
      name: project.name,
      description: project.description || '',
      require_push_approval: project.require_push_approval
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (project) => {
    setSelectedProject(project)
    setShowDeleteModal(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen p-10 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FiLoader className="w-8 h-8 animate-spin" />
          <p className="text-white/70">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-10 text-white">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast}
          duration={3000}
        />
      )}
      
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold">Projects</h1>
            <p className="text-white/70 mt-2">Manage your DAW projects and sample baskets</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2 font-semibold"
          >
            <FiPlus className="w-5 h-5" />
            New Project
          </button>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button onClick={() => dispatch(clearError())} className="text-red-200 hover:text-white">
              <FiX />
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FiFolder className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-white/60 mb-6">Create your first project to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-semibold"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.uid}
                className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg hover:bg-white/8 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-1">{project.name}</h2>
                    <p className="text-white/60 text-sm">
                      Updated: {formatDate(project.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="px-2 py-1 text-xs rounded-lg bg-white/10">
                      {project.user_role}
                    </span>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-white/70 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <div className="text-white/60 mb-1">Versions</div>
                    <div className="font-bold text-lg">{project.version_count || 0}</div>
                  </div>
                  <div className="bg-white/5 border border-white/8 rounded-xl p-3">
                    <div className="text-white/60 mb-1">Owner</div>
                    <div className="font-semibold truncate">{project.owner.username}</div>
                  </div>
                </div>

                {project.require_push_approval && (
                  <div className="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-200">
                    Requires push approval
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.uid}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-center text-sm font-semibold transition-colors"
                  >
                    Open
                  </Link>
                  {project.user_role === 'owner' && (
                    <>
                      <button
                        onClick={() => openEditModal(project)}
                        className="px-4 py-2 rounded-lg bg-white/6 hover:bg-white/10 text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(project)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {actionError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors resize-none"
                    placeholder="Project description..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="requireApproval"
                    checked={formData.require_push_approval}
                    onChange={(e) => setFormData({ ...formData, require_push_approval: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/10"
                  />
                  <label htmlFor="requireApproval" className="text-sm">
                    Require push approval
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold transition-colors"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={actionLoading}
                  >
                    {actionLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                    {actionLoading ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Project</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {actionError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
                  {actionError}
                </div>
              )}

              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="editRequireApproval"
                    checked={formData.require_push_approval}
                    onChange={(e) => setFormData({ ...formData, require_push_approval: e.target.checked })}
                    className="w-5 h-5 rounded bg-white/5 border border-white/10"
                  />
                  <label htmlFor="editRequireApproval" className="text-sm">
                    Require push approval
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold transition-colors"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={actionLoading}
                  >
                    {actionLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                    {actionLoading ? 'Updating...' : 'Update Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-red-400">Delete Project</h2>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-white/60 hover:text-white"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {actionError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-sm text-red-200">
                  {actionError}
                </div>
              )}

              <p className="text-white/80 mb-6">
                Are you sure you want to delete <span className="font-bold">{selectedProject.name}</span>? 
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-semibold transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={actionLoading}
                >
                  {actionLoading && <FiLoader className="w-4 h-4 animate-spin" />}
                  {actionLoading ? 'Deleting...' : 'Delete Project'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}