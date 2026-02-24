'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import ProtectedRoute from "@/components/ProtectedRoute"

/**
 * Dashboard Page
 * - Hero with animated waveform
 * - Sessions grid with small waveform preview
 * - Animated version tree (SVG + GSAP)
 * - Analytics / Context panels
 *
 * Drop into Next.js / React project with TailwindCSS + GSAP installed.
 */

// ---------- Mock data ----------
const SESSIONS = [
  {
    id: 's1',
    title: 'Emotions',
    meta: 'Producer • Artist',
    status: 'active',
    progress: 72,
    type: 'mix',
  },
  {
    id: 's2',
    title: 'Health Analyzer',
    meta: 'Project stable',
    status: 'analyzed',
    progress: 95,
    type: 'analysis',
  },
  {
    id: 's3',
    title: 'Cleanup Suggestions',
    meta: 'Unnecessary stems detected',
    status: 'review',
    progress: 42,
    type: 'cleanup',
  },
]

/**
 * A branching version tree data structure.
 * parentIds array allows multiple parents (merges).
 */
const VERSIONS = [
  { id: 'v21', label: 'v21 • Instrument Balance', time: '1 week ago', color: '#f6c94d', parents: [] , icon: '🎛'},
  { id: 'v22', label: 'v22 • Drums Cleanup', time: '2 days ago', color: '#c48fff', parents: ['v21'], icon: '🥁'},
  { id: 'v23', label: 'v23 • Vocal Fix', time: 'Yesterday', color: '#5db3ff', parents: ['v22'], icon: '🎤'},
  { id: 'v24', label: 'v24 • Master Polish', time: '2 hrs ago', color: '#66e08a', parents: ['v22','v23'], icon: '🔊'},
]

// ---------- Utility small components ----------
const IconPlay = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 3v18l15-9L5 3z" fill="currentColor"/>
  </svg>
);

const Dot = ({ color = '#fff' }) => (
  <span style={{ background: color }} className="w-3 h-3 rounded-full inline-block mr-3"></span>
)

// ---------- Waveform (Hero) ----------
function WaveformHero({ animateRef }) {
  // Create multiple sine-like bars that subtly float for a smooth waveform effect
  // We'll animate translateY with GSAP for a "moving waveform" feel
  const barsRef = useRef([])
  useEffect(() => {
    if (!barsRef.current.length) return
    gsap.to(barsRef.current, {
      y: (i) => (i % 2 === 0 ? -8 : 8),
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: 'sine.inOut',
      stagger: { each: 0.08 },
    })
  }, [])

  return (
    <div
      ref={animateRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div className="absolute -top-16 left-0 w-[160%] h-[60%] opacity-20"
           style={{ filter: 'blur(30px)', transform: 'rotate(-3deg)' }}>
        <div className="w-full h-full flex items-center justify-between px-12">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (barsRef.current[i] = el)}
              style={{ width: 6, height: 24 + ((i % 7) * 6) }}
              className="bg-white/12 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ---------- Small waveform preview used inside cards ----------
function TinyWave({ seed = 0 }) {
  // Simple CSS animation for the tiny waveform
  const id = `wave-${seed}`
  return (
    <svg className="w-full h-10" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden>
      <path id={id} d="M0 10 Q 10 6 20 10 T 40 10 T 60 12 T 80 8 T 100 10" fill="none" stroke="currentColor" strokeWidth="0.9" className="text-white/30"/>
      <style>{`
        @keyframes wave-${seed} {
          0% { transform: translateX(0); opacity: 0.95 }
          50% { transform: translateX(-6%); opacity: 0.6 }
          100% { transform: translateX(0); opacity: 0.95 }
        }
        #${id} { transform-origin: center; animation: wave-${seed} ${3 + (seed % 3)}s ease-in-out infinite; }
      `}</style>
    </svg>
  )
}

// ---------- Version Tree (SVG-based) ----------
function VersionTree({ data = VERSIONS, onSelect }) {
  // We'll lay out nodes in a simple grid horizontally by insertion order
  const svgRef = useRef(null)
  const nodeRefs = useRef({})
  useEffect(() => {
    // Animate drawing of all lines using strokeDashoffset
    const lines = svgRef.current.querySelectorAll('.vt-line')
    lines.forEach((line) => {
      const len = line.getTotalLength()
      line.style.strokeDasharray = len
      line.style.strokeDashoffset = len
    })
    gsap.to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: 0.12, ease: 'power2.out' })
  }, [data])

  // compute coordinates for nodes
  // For simplicity: place nodes in rows by depth = number of ancestors (naive)
  const nodePositions = {}
  const depth = {}
  function calcDepth(id, visited = new Set()) {
    if (visited.has(id)) return 0
    visited.add(id)
    const node = data.find((n) => n.id === id)
    if (!node || !node.parents || node.parents.length === 0) return 0
    const d = Math.max(...node.parents.map((p) => calcDepth(p, visited))) + 1
    depth[id] = d
    return d
  }
  data.forEach((n) => calcDepth(n.id))
  // group by depth and assign x positions
  const groups = {}
  data.forEach((n, idx) => {
    const d = depth[n.id] ?? 0
    if (!groups[d]) groups[d] = []
    groups[d].push(n)
  })
  Object.keys(groups).forEach((d) => {
    groups[d].forEach((node, i) => {
      nodePositions[node.id] = { x: parseInt(d) * 220 + 60, y: i * 86 + 40 }
    })
  })

  function renderLines() {
    const lines = []
    data.forEach((node) => {
      const to = nodePositions[node.id]
      node.parents.forEach((p) => {
        const from = nodePositions[p]
        if (!from || !to) return
        // draw smooth cubic curve between from -> to
        const dx = (to.x - from.x) / 2
        const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y} ${to.x - dx} ${to.y} ${to.x} ${to.y}`
        lines.push(<path key={`${p}->${node.id}`} d={path} stroke="#ffffff22" strokeWidth="2" fill="none" className="vt-line"/>)
      })
    })
    return lines
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <svg ref={svgRef} className="w-[860px] h-[360px]" viewBox="0 0 860 360" preserveAspectRatio="xMinYMin meet" role="img" aria-label="Version tree visualization">
          <defs>
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.25"/>
            </filter>
          </defs>

          {/* lines */}
          <g className="lines">
            {renderLines()}
          </g>

          {/* nodes */}
          <g>
            {data.map((node) => {
              const pos = nodePositions[node.id] || { x: 60, y: 40 }
              return (
                <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                  {/* clickable rounded rect */}
                  <rect
                    x={-6} y={-18} rx="12" ry="12" width="180" height="48"
                    fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                    style={{ filter: 'url(#nodeShadow)', cursor: 'pointer' }}
                    onClick={() => onSelect?.(node)}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, { scale: 1.02, transformOrigin: 'left center', duration: 0.18 })
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, { scale: 1, duration: 0.16 })
                    }}
                  />
                  {/* small color dot */}
                  <circle cx={10} cy={6} r={8} fill={node.color} stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
                  {/* label */}
                  <text x={28} y={0} fill="#fff" fontSize="12" fontWeight="700">{node.id}</text>
                  <text x={28} y={14} fill="rgba(255,255,255,0.65)" fontSize="11">{node.time}</text>
                  {/* small icon */}
                  <text x={150} y={12} fontSize="14" aria-hidden>{node.icon}</text>
                </g>
              )
            })}
          </g>
        </svg>
      </div>
    </div>
  )
}

// ---------- Main page ----------
export default function DashboardPage() {
  const heroWaveRef = useRef(null)
  const mainRef = useRef(null)
  const [selectedVersion, setSelectedVersion] = useState(null)

  useEffect(() => {
    // page entrance
    gsap.fromTo(mainRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }
    )

    // float the hero slightly
    gsap.to(heroWaveRef.current, { y: -6, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' })
  }, [])

  return (
    <ProtectedRoute>
 <div className="min-h-screen px-8 md:px-14 py-14 relative ">
      {/* Waveform / decorative hero background */}
      <WaveformHero animateRef={heroWaveRef} />

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Welcome back, Producer <span className="ml-2">👋</span></h1>
        <p className="text-white/70 mt-3 max-w-2xl">
          Your creative hub — sessions, version history, and project insights all in one place.
        </p>
      </header>

      {/* Main content grid */}
      <main ref={mainRef} className="grid lg:grid-cols-3 gap-8">

        {/* Left - Main workspace (spans 2 columns on large screens) */}
        <section className="lg:col-span-2 space-y-8">

          {/* Sessions container */}
          <div className="bg-white/6 border border-white/12 rounded-3xl p-8 backdrop-blur-xl shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">My Active Sessions</h2>
                <p className="text-white/60 mt-1">Quick access to sessions you're actively working on.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-full bg-white/6 border border-white/8 text-sm">New Session</button>
                <button className="px-4 py-2 rounded-full bg-white/10 text-sm">Import DAW</button>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-6">
              {SESSIONS.map((s, i) => (
                <article key={s.id} className="p-6 rounded-2xl bg-white/4 border border-white/8 hover:bg-white/6 transition relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{s.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{s.meta}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">Progress</div>
                      <div className="font-semibold text-lg mt-1">{s.progress}%</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="h-10 bg-white/3 rounded-lg p-2">
                      <TinyWave seed={i} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/14">
                      <IconPlay className="w-4 h-4" /> <span className="text-sm">Open</span>
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-white/6 text-sm">Details</button>
                    <button className="ml-auto text-xs text-white/60">Last edit: 2h</button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Analytics & version tree combined */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* Analytics big card */}
            <div className="bg-white/6 border border-white/12 rounded-3xl p-6 backdrop-blur-xl shadow-lg">
              <h3 className="text-xl font-semibold">Project Analytics</h3>
              <p className="text-white/60 text-sm mt-1">Storage, versions, and health at a glance.</p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                  <div className="text-xs text-white/60">Total Versions</div>
                  <div className="text-2xl font-bold mt-2">24</div>
                  <div className="text-sm text-white/60 mt-1">Recent activity across branches</div>
                </div>

                <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                  <div className="text-xs text-white/60">Storage Used</div>
                  <div className="text-2xl font-bold mt-2">2.1 GB</div>
                  <div className="text-sm text-white/60 mt-1">Efficient deduplication</div>
                </div>

                <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                  <div className="text-xs text-white/60">Health Score</div>
                  <div className="text-2xl font-bold mt-2 text-green-300">87%</div>
                  <div className="text-sm text-white/60 mt-1">Warnings: 2 | Suggestions: 5</div>
                </div>

                <div className="p-4 rounded-xl bg-white/4 border border-white/6">
                  <div className="text-xs text-white/60">Contributors</div>
                  <div className="text-2xl font-bold mt-2">3</div>
                  <div className="text-sm text-white/60 mt-1">Collaborators on this project</div>
                </div>
              </div>
            </div>

            {/* Version tree card */}
            <div className="bg-white/6 border border-white/12 rounded-3xl p-6 backdrop-blur-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Version Tree</h3>
                  <p className="text-white/60 text-sm mt-1">Visual branching history — hover or click nodes for details.</p>
                </div>
                <div>
                  <button className="px-3 py-1 rounded-md bg-white/6 text-sm">Expand</button>
                </div>
              </div>

              <div className="mt-4">
                <VersionTree data={VERSIONS} onSelect={(v) => setSelectedVersion(v)} />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">Selected:</div>
                  <div className="text-sm font-semibold">{selectedVersion ? selectedVersion.label : 'None'}</div>
                </div>
                <div className="mt-3 flex gap-3">
                  <button className="px-4 py-2 rounded-lg bg-white/10">Open Selected</button>
                  <button className="px-4 py-2 rounded-lg bg-white/6">Compare</button>
                  <button className="px-4 py-2 rounded-lg border border-white/10">Export</button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Right - Side panels */}
        <aside className="space-y-6">
          {/* Quick actions / analytics */}
          <div className="bg-white/6 border border-white/12 rounded-3xl p-6 backdrop-blur-xl shadow-lg">
            <h3 className="text-lg font-semibold">Quick Overview</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">Storage</div>
                <div className="text-sm font-semibold">2.1 GB</div>
              </div>
              <div className="w-full h-2 bg-white/4 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-green-300" style={{ width: '48%' }} />
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-white/60">Peak CPU</div>
                <div className="text-sm font-semibold">12%</div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-white/60">Active Builds</div>
                <div className="text-sm font-semibold">2</div>
              </div>
            </div>
          </div>

          {/* Context / Notes */}
          <div className="bg-white/6 border border-white/12 rounded-3xl p-6 backdrop-blur-xl shadow-lg">
            <h3 className="text-lg font-semibold">Context</h3>
            <p className="text-white/60 text-sm mt-2">Notes & quick actions for the current project</p>

            <div className="mt-4 space-y-4">
              <div className="p-3 rounded-lg bg-white/4">
                <div className="text-sm font-semibold">Last imported stems</div>
                <div className="text-xs text-white/60 mt-1">kick.wav • snare.wav • bass.wav</div>
              </div>

              <div className="p-3 rounded-lg bg-white/4">
                <div className="text-sm font-semibold">TODO</div>
                <ul className="text-xs text-white/60 mt-1 space-y-1 list-disc ml-4">
                  <li>Tune vocals</li>
                  <li>Render stems</li>
                  <li>Archive old versions</li>
                </ul>
              </div>

              <div className="text-sm">
                <button className="w-full px-3 py-2 rounded-lg bg-white/10">Open Project Notes</button>
              </div>
            </div>
          </div>

          {/* Support / Help */}
          <div className="bg-white/4 border border-white/8 rounded-3xl p-4 text-center">
            <div className="text-sm font-semibold">Need help?</div>
            <div className="text-xs text-white/60 mt-1">Chat with the team or open docs</div>
            <div className="mt-3">
              <button className="px-3 py-2 rounded-lg bg-white/10">Open Support</button>
            </div>
          </div>
        </aside>
      </main>
    </div>
    </ProtectedRoute>
   
  )
}
