'use client'
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiFolder, FiLayers, FiMusic, FiFile, FiDownload, 
  FiRefreshCw, FiCheck, FiX, FiClock, FiTrash2, 
  FiChevronRight, FiChevronDown, FiAlertCircle,
  FiUsers, FiMessageSquare, FiSend, FiUserPlus,
  FiShield, FiCheckCircle, FiXCircle, FiLoader,
  FiSliders, FiGrid, FiZap, FiVolume2,
  FiPlayCircle, FiPauseCircle, FiActivity, FiFilter,
  FiPlus, FiTarget, FiBarChart2, FiRadio, FiHeadphones, 
  FiCpu, FiPackage, FiCommand, FiUpload, FiMaximize2,
  FiMinimize2
} from "react-icons/fi";

// Import Redux actions
import {
  fetchProjectVersions,
  fetchVersionById,
  fetchVersionFileList,
  uploadVersion,
  deleteVersion,
  requestDownload,
  checkDownloadStatus,
  fetchPushStatus,
  approvePush,
  rejectPush,
  cancelPush
} from '@/utils/lib/redux/features/versions/versionsSlice';

import {
  fetchProjectSamples,
  fetchSampleById,
  uploadSample,
  updateSample,
  deleteSample
} from '@/utils/lib/redux/features/samples/samplesSlice';

import {
  fetchProjectMembers,
  addProjectMember,
  removeProjectMember
} from '@/utils/lib/redux/features/projects/projectsSlice';

export default function AIDAWProjectDetail({ params }) {
  const dispatch = useDispatch();
  const projectUid = params?.projectUid;
  
  // Redux state
  const { versions, currentVersion, fileList, loading: versionsLoading, error: versionsError } = useSelector(state => state.versions);
  const { samples, loading: samplesLoading, error: samplesError } = useSelector(state => state.samples);
  const { currentProject, members, loading: projectLoading, actionError: projectError } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);

  // Local state
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [activePanel, setActivePanel] = useState(null); // 'versions', 'samples', 'team', 'files'
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  
  // Resizable panels
  const [leftWidth, setLeftWidth] = useState(320);
  const [rightWidth, setRightWidth] = useState(400);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  
  // Modals
  const [showUploadVersion, setShowUploadVersion] = useState(false);
  const [showUploadSample, setShowUploadSample] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPushId, setSelectedPushId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Upload forms
  const [versionFile, setVersionFile] = useState(null);
  const [versionCommitMessage, setVersionCommitMessage] = useState('');
  const [sampleFile, setSampleFile] = useState(null);
  const [sampleName, setSampleName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');

  const projectVersions = versions[projectUid] || [];
  const projectSamples = samples[projectUid] || [];
  const projectMembers = members[projectUid] || [];
  const currentFileList = selectedVersion ? (fileList[selectedVersion.uid] || []) : [];

  const isOwner = currentProject?.owner_id === user?.id;
  const isAdmin = isOwner || currentProject?.role === 'admin';
  const pendingPushes = projectVersions.filter(v => v.status === 'pending_approval');

  // Load data on mount
  useEffect(() => {
    if (projectUid) {
      dispatch(fetchProjectVersions(projectUid));
      dispatch(fetchProjectSamples(projectUid));
      if (isAdmin) {
        dispatch(fetchProjectMembers(projectUid));
      }
    }
  }, [dispatch, projectUid, isAdmin]);

  // Auto-select first version
  useEffect(() => {
    if (projectVersions.length > 0 && !selectedVersion) {
      setSelectedVersion(projectVersions[0]);
    }
  }, [projectVersions, selectedVersion]);

  // Load file list when version selected
  useEffect(() => {
    if (selectedVersion && !fileList[selectedVersion.uid]) {
      dispatch(fetchVersionFileList(selectedVersion.uid));
    }
  }, [dispatch, selectedVersion, fileList]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingLeft) {
        const newWidth = Math.max(280, Math.min(500, e.clientX));
        setLeftWidth(newWidth);
      }
      if (isDraggingRight) {
        const newWidth = Math.max(300, Math.min(600, window.innerWidth - e.clientX));
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight]);

  // API Handlers
  const handleApproveVersion = async (pushId) => {
    try {
      await dispatch(approvePush(pushId)).unwrap();
      dispatch(fetchProjectVersions(projectUid));
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleRejectVersion = async () => {
    if (!rejectReason.trim() || !selectedPushId) return;
    try {
      await dispatch(rejectPush({ pushId: selectedPushId, reason: rejectReason })).unwrap();
      dispatch(fetchProjectVersions(projectUid));
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedPushId(null);
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  const handleDeleteVersion = async (versionId) => {
    if (!confirm('Delete this version permanently?')) return;
    try {
      await dispatch(deleteVersion(versionId)).unwrap();
      if (selectedVersion?.uid === versionId) {
        setSelectedVersion(null);
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleUploadVersion = async (e) => {
    e.preventDefault();
    if (!versionFile || !versionCommitMessage.trim()) return;

    const formData = new FormData();
    formData.append('file', versionFile);
    formData.append('commit_message', versionCommitMessage);
    formData.append('project', projectUid);

    try {
      await dispatch(uploadVersion(formData)).unwrap();
      dispatch(fetchProjectVersions(projectUid));
      setShowUploadVersion(false);
      setVersionFile(null);
      setVersionCommitMessage('');
    } catch (err) {
      console.error('Failed to upload version:', err);
    }
  };

  const handleUploadSample = async (e) => {
    e.preventDefault();
    if (!sampleFile) return;

    const formData = new FormData();
    formData.append('file', sampleFile);
    if (sampleName.trim()) {
      formData.append('name', sampleName);
    }

    try {
      await dispatch(uploadSample({ projectId: projectUid, formData })).unwrap();
      dispatch(fetchProjectSamples(projectUid));
      setShowUploadSample(false);
      setSampleFile(null);
      setSampleName('');
    } catch (err) {
      console.error('Failed to upload sample:', err);
    }
  };

  const handleDeleteSample = async (sampleId) => {
    if (!confirm('Delete this sample?')) return;
    try {
      await dispatch(deleteSample(sampleId)).unwrap();
    } catch (err) {
      console.error('Failed to delete sample:', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail.trim()) return;

    try {
      await dispatch(addProjectMember({
        projectUid,
        userId: newMemberEmail, // API should handle email lookup
        role: newMemberRole
      })).unwrap();
      setShowAddMember(false);
      setNewMemberEmail('');
      setNewMemberRole('viewer');
    } catch (err) {
      console.error('Failed to add member:', err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await dispatch(removeProjectMember({ projectUid, memberId })).unwrap();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleDownloadVersion = async (versionId) => {
    try {
      await dispatch(requestDownload(versionId)).unwrap();
      // Poll for download status
      const pollInterval = setInterval(async () => {
        const status = await dispatch(checkDownloadStatus(versionId)).unwrap();
        if (status.status === 'ready') {
          clearInterval(pollInterval);
          window.open(status.download_url, '_blank');
        }
      }, 2000);
    } catch (err) {
      console.error('Failed to request download:', err);
    }
  };

  const handleSendAiMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages(prev => [...prev, {
      role: 'user',
      content: aiInput,
      timestamp: new Date()
    }]);
    
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I can help you with that! What would you like me to do?',
        timestamp: new Date()
      }]);
    }, 1000);
    
    setAiInput('');
  };

  // Helper functions
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FiCheck className="text-green-400" />;
      case 'processing': return <FiRefreshCw className="text-blue-400 animate-spin" />;
      case 'pending_approval': return <FiAlertCircle className="text-orange-400" />;
      case 'failed': return <FiX className="text-red-400" />;
      default: return <FiClock className="text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`;
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'admin': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'editor': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const buildFolderTree = () => {
    const tree = {};
    currentFileList.forEach(file => {
      const parts = file.path.split('/');
      let current = tree;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          if (!current._files) current._files = [];
          current._files.push(file);
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      });
    });
    return tree;
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileTree = (tree, path = '') => {
    const folders = Object.keys(tree).filter(k => k !== '_files');
    const files = tree._files || [];

    return (
      <div className="space-y-1">
        {folders.map(folderName => {
          const folderPath = path ? `${path}/${folderName}` : folderName;
          const isExpanded = expandedFolders.has(folderPath);
          
          return (
            <div key={folderPath}>
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all"
                onClick={() => toggleFolder(folderPath)}
              >
                {isExpanded ? <FiChevronDown className="opacity-50" /> : <FiChevronRight className="opacity-50" />}
                <FiFolder className="text-blue-300" />
                <span className="text-sm">{folderName}</span>
              </div>
              {isExpanded && (
                <div className="ml-6 border-l border-white/10 pl-2">
                  {renderFileTree(tree[folderName], folderPath)}
                </div>
              )}
            </div>
          );
        })}
        
        {files.map((file, idx) => {
          const isAudio = /\.(wav|mp3|flac|aiff|ogg)$/i.test(file.path);
          const displaySize = formatSize(file.size);
          
          return (
            <div 
              key={idx}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isAudio ? <FiMusic className="text-purple-300 flex-shrink-0" /> : <FiFile className="text-gray-400 flex-shrink-0" />}
                <span className="text-sm truncate">{file.path.split('/').pop()}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-white/40">{displaySize}</span>
                {file.storage === 'cas' && (
                  <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">CAS</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {/* Left Sidebar - Versions */}
      <aside 
        className="flex-shrink-0 bg-white/[0.02] backdrop-blur-xl border-r border-white/10 flex flex-col h-screen overflow-hidden"
        style={{ width: `${leftWidth}px` }}
      >
        <div className="p-4 border-b border-white/10 flex-shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <FiMusic />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{currentProject?.name}</h2>
              <p className="text-xs text-white/50">
                {projectVersions.length} versions
              </p>
            </div>
          </div>
          {pendingPushes.length > 0 && isAdmin && (
            <div className="px-3 py-2 bg-orange-500/10 border border-orange-500/30 text-orange-300 rounded-lg text-xs flex items-center gap-2">
              <FiAlertCircle />
              <span>{pendingPushes.length} pending</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar min-h-0">
          {versionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <FiLoader className="animate-spin text-2xl text-white/40" />
            </div>
          ) : (
            <div className="space-y-2">
              {projectVersions.map((version) => {
                const isSelected = selectedVersion?.uid === version.uid;
                
                return (
                  <div 
                    key={version.uid}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.05]'
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FiLayers className="text-sm" />
                        <span className="font-semibold text-sm">v{version.version_number}</span>
                        {getStatusIcon(version.status)}
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-white/10 rounded border border-white/20">
                        {version.storage_type}
                      </span>
                    </div>

                    <p className="text-xs text-white/60 mb-2 line-clamp-2">
                      {version.commit_message}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                      <span>{version.file_count} files</span>
                      <span>{formatSize(version.file_size)}</span>
                    </div>

                    <div className="text-xs text-white/40 mb-2">
                      {formatDate(version.created_at)}
                    </div>

                    {version.status === 'pending_approval' && isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveVersion(version.push_id);
                          }}
                          className="flex-1 px-2 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded text-xs transition-all flex items-center justify-center gap-1 border border-green-500/30"
                        >
                          <FiCheckCircle className="text-xs" /> Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPushId(version.push_id);
                            setShowRejectModal(true);
                          }}
                          className="flex-1 px-2 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-xs transition-all flex items-center justify-center gap-1 border border-red-500/30"
                        >
                          <FiXCircle className="text-xs" /> Reject
                        </button>
                      </div>
                    )}

                    {version.status === 'completed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadVersion(version.uid);
                        }}
                        className="w-full px-2 py-1.5 bg-white/10 hover:bg-white/15 rounded text-xs transition-all flex items-center justify-center gap-1 border border-white/20"
                      >
                        <FiDownload className="text-xs" /> Download
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVersion(version.uid);
                        }}
                        className="w-full mt-2 px-2 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded text-xs transition-all flex items-center justify-center gap-1 border border-red-500/20"
                      >
                        <FiTrash2 className="text-xs" /> Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 fixed right-0 top-3 flex-shrink-0 ">
          <button
            onClick={() => setShowUploadVersion(true)}
            className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <FiUpload /> 
          </button>
        </div>
      </aside>

      {/* Left Resize Handle */}
      <div
        className="w-1 hover:w-2 bg-white/5 hover:bg-white/20 cursor-col-resize transition-all flex-shrink-0"
        onMouseDown={() => setIsDraggingLeft(true)}
      />

      {/* Main AI Assistant Area */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-h-0">
          {/* AI Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-0">
            {aiMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-2xl">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <FiZap className="text-3xl" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">AI Music Production Assistant</h4>
                  <p className="text-sm text-white/50 mb-6">
                    Ask me to help with versions, samples, files, or team management
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setActivePanel('versions')}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-all border border-white/10"
                    >
                      <FiLayers className="mx-auto mb-1" />
                      Versions
                    </button>
                    <button
                      onClick={() => setActivePanel('samples')}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-all border border-white/10"
                    >
                      <FiMusic className="mx-auto mb-1" />
                      Samples
                    </button>
                    <button
                      onClick={() => setActivePanel('team')}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs transition-all border border-white/10"
                    >
                      <FiUsers className="mx-auto mb-1" />
                      Team
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-w-4xl mx-auto">
                {aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-2xl px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-50 mt-2">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Input */}
          <div className="p-4 fixed bottom-0 z-2 w-full flex-shrink-0 ">
            <div className="flex gap-2 bg-white/5 backdrop-blur-xl rounded-xl p-2 border border-white/20 max-w-3xl ml-[110px] ">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendAiMessage()}
                placeholder="Ask about versions, samples, files, or team..."
                className="flex-1 bg-transparent outline-0 focus:outline-0 border-none outline-none text-white placeholder-white/40 px-2"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!aiInput.trim()}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30 text-white rounded-lg transition-all flex items-center gap-2 border border-white/20 flex-shrink-0"
              >
                <FiSend /> Send
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Resize Handle */}
      {activePanel && (
        <div
          className="w-1 hover:w-2 bg-white/5 hover:bg-white/20 cursor-col-resize transition-all flex-shrink-0"
          onMouseDown={() => setIsDraggingRight(true)}
        />
      )}

      {/* Right Sidebar - Dynamic Panels */}
      {activePanel && (
        <aside 
          className="flex-shrink-0 bg-white/[0.02] backdrop-blur-xl border-l border-white/10 flex flex-col h-screen overflow-hidden"
          style={{ width: `${rightWidth}px` }}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-white/[0.02]">
            <h3 className="font-semibold flex items-center gap-2">
              {activePanel === 'versions' && <><FiLayers /> Versions</>}
              {activePanel === 'samples' && <><FiMusic /> Samples</>}
              {activePanel === 'team' && <><FiUsers /> Team</>}
              {activePanel === 'files' && <><FiFolder /> Files</>}
            </h3>
            <button
              onClick={() => setActivePanel(null)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <FiX />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-0">
            {/* Samples Panel */}
            {activePanel === 'samples' && (
              <div className="space-y-3">
                {samplesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-2xl text-white/40" />
                  </div>
                ) : projectSamples.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <FiMusic className="text-3xl mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No samples yet</p>
                  </div>
                ) : (
                  projectSamples.map((sample) => (
                    <div
                      key={sample.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiMusic className="text-purple-300 flex-shrink-0" />
                          <span className="text-sm font-medium truncate">{sample.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteSample(sample.id)}
                          className="p-1 hover:bg-red-500/20 text-red-300 rounded transition-all"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>
                      <p className="text-xs text-white/50 mb-2">{formatSize(sample.size)}</p>
                      <p className="text-xs text-white/40">{formatDate(sample.created_at)}</p>
                    </div>
                  ))
                )}
                <button
                  onClick={() => setShowUploadSample(true)}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <FiPlus /> Upload Sample
                </button>
              </div>
            )}

            {/* Team Panel */}
            {activePanel === 'team' && isAdmin && (
              <div className="space-y-3">
                {projectLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <FiLoader className="animate-spin text-2xl text-white/40" />
                  </div>
                ) : (
                  <>
                    {projectMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                              {member.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{member.username}</p>
                              <p className="text-xs text-white/50">{member.email}</p>
                            </div>
                          </div>
                          {isOwner && member.role !== 'owner' && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-1.5 hover:bg-red-500/20 text-red-300 rounded transition-all"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded border ${getRoleBadgeColor(member.role)}`}>
                          {member.role.toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {isOwner && (
                      <button
                        onClick={() => setShowAddMember(true)}
                        className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm transition-all flex items-center justify-center gap-2 border border-white/20"
                      >
                        <FiUserPlus /> Add Member
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Files Panel */}
            {activePanel === 'files' && (
              <div>
                {!selectedVersion ? (
                  <div className="text-center py-8 text-white/50">
                    <FiFolder className="text-3xl mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Select a version to view files</p>
                  </div>
                ) : currentFileList.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <FiFile className="text-3xl mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No files in this version</p>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-lg border border-white/10 p-3">
                    {renderFileTree(buildFolderTree())}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Upload Version Modal */}
      {showUploadVersion && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Upload New Version</h4>
              <button
                onClick={() => {
                  setShowUploadVersion(false);
                  setVersionFile(null);
                  setVersionCommitMessage('');
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleUploadVersion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Version File</label>
                <input
                  type="file"
                  onChange={(e) => setVersionFile(e.target.files[0])}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Commit Message</label>
                <textarea
                  value={versionCommitMessage}
                  onChange={(e) => setVersionCommitMessage(e.target.value)}
                  placeholder="Describe what changed in this version..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm resize-none"
                  rows="3"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!versionFile || !versionCommitMessage.trim()}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <FiUpload /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadVersion(false);
                    setVersionFile(null);
                    setVersionCommitMessage('');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Sample Modal */}
      {showUploadSample && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Upload Sample</h4>
              <button
                onClick={() => {
                  setShowUploadSample(false);
                  setSampleFile(null);
                  setSampleName('');
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleUploadSample} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sample File</label>
                <input
                  type="file"
                  onChange={(e) => setSampleFile(e.target.files[0])}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Sample Name (Optional)</label>
                <input
                  type="text"
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  placeholder="Enter sample name..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!sampleFile}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <FiUpload /> Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadSample(false);
                    setSampleFile(null);
                    setSampleName('');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Add Team Member</h4>
              <button
                onClick={() => {
                  setShowAddMember(false);
                  setNewMemberEmail('');
                  setNewMemberRole('viewer');
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <FiX />
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm cursor-pointer"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!newMemberEmail.trim()}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/30 rounded-lg transition-all flex items-center justify-center gap-2 border border-white/20"
                >
                  <FiUserPlus /> Add Member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMemberEmail('');
                    setNewMemberRole('viewer');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Version Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold">Reject Version</h4>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                  setSelectedPushId(null);
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <FiX />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this version is being rejected..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg outline-none focus:border-white/40 transition-all text-sm resize-none"
                  rows="4"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleRejectVersion}
                  disabled={!rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:bg-white/5 disabled:text-white/30 text-red-300 rounded-lg transition-all flex items-center justify-center gap-2 border border-red-500/30"
                >
                  <FiXCircle /> Reject Version
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setSelectedPushId(null);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}