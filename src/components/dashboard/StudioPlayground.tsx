'use client';

import React, { useState } from 'react';
import {
    MdPlayArrow,
    MdPause,
    MdStop,
    MdSkipPrevious,
    MdSkipNext,
    MdMic,
    MdGraphicEq,
    MdSettings,
    MdVolumeUp,
    MdLoop
} from 'react-icons/md';
import { IoMdMusicalNotes } from 'react-icons/io';

const StudioPlayground = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock data for tracks
    const tracks = [
        { id: 1, name: 'Lead Vocals', type: 'audio', color: '#00f2ff' },
        { id: 2, name: 'Synth Chords', type: 'midi', color: '#a855f7' },
        { id: 3, name: 'Kick Drum', type: 'audio', color: '#f43f5e' },
        { id: 4, name: 'Bassline', type: 'midi', color: '#22c55e' },
    ];

    return (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden flex flex-col h-[500px] shadow-2xl">
            {/* DAW Transport Bar */}
            <div className="bg-[var(--surface-hover)]/50 p-4 flex items-center justify-between border-b border-[var(--border)]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 bg-[var(--background)]/40 p-1.5 rounded-xl border border-[var(--border)]">
                        <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--foreground-muted)] transition-colors">
                            <MdSkipPrevious size={20} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`p-2 rounded-lg transition-all ${isPlaying ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent-glow)]' : 'hover:bg-[var(--surface-hover)] text-[var(--foreground-muted)]'}`}
                        >
                            {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                        </button>
                        <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--foreground-muted)] transition-colors">
                            <MdStop size={20} />
                        </button>
                        <button className="p-2 hover:bg-[var(--surface-hover)] rounded-lg text-[var(--foreground-muted)] transition-colors">
                            <MdSkipNext size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-black tracking-widest text-[var(--accent)] bg-[var(--background)]/40 px-6 py-3 rounded-xl border border-[var(--accent)]/10">
                        <span>00 : 04 : 128</span>
                        <div className="h-4 w-px bg-[var(--accent)]/20 mx-2" />
                        <span>128.00 BPM</span>
                    </div>

                    <button className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/10 hover:bg-red-500/20 transition shadow-sm">
                        <MdMic size={20} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition">
                        <MdLoop size={20} />
                    </button>
                    <div className="flex items-center gap-3 bg-[var(--background)]/20 p-2 rounded-xl border border-[var(--border)]">
                        <MdVolumeUp className="text-[var(--foreground-muted)]" />
                        <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-[var(--accent)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main DAW Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Track Headers */}
                <div className="w-64 border-r border-[var(--border)] bg-[var(--surface)] overflow-y-auto">
                    {tracks.map(track => (
                        <div key={track.id} className="p-4 border-b border-[var(--border)] hover:bg-[var(--surface-hover)] transition cursor-pointer group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: track.color }} />
                                    <span className="text-xs font-black text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]">{track.name}</span>
                                </div>
                                {track.type === 'midi' ? <IoMdMusicalNotes size={14} className="text-[var(--foreground-muted)]/50" /> : <MdGraphicEq size={14} className="text-[var(--foreground-muted)]/50" />}
                            </div>
                            <div className="flex gap-1">
                                <div className="px-2 py-0.5 bg-[var(--background)]/50 border border-[var(--border)] rounded text-[8px] font-black uppercase text-[var(--foreground-muted)]">M</div>
                                <div className="px-2 py-0.5 bg-[var(--background)]/50 border border-[var(--border)] rounded text-[8px] font-black uppercase text-[var(--foreground-muted)]">S</div>
                                <div className="flex-1 h-3 bg-[var(--background)]/40 rounded flex items-center px-1">
                                    <div className="h-1 bg-green-500/40 rounded-full" style={{ width: '40%' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full p-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-all text-center border-b border-[var(--border)] hover:bg-[var(--surface-hover)]">
                        + Add Track
                    </button>
                </div>

                {/* Timeline Area */}
                <div className="flex-1 relative bg-[var(--background)]/50 overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 grid grid-cols-8 gap-px opacity-5 pointer-events-none">
                        {[...Array(8)].map((_, i) => <div key={i} className="border-r border-[var(--foreground)]" />)}
                    </div>

                    {/* Playhead */}
                    <div className="absolute top-0 bottom-0 left-[20%] w-px bg-[var(--accent)] shadow-[0_0_15px_var(--accent)] z-10">
                        <div className="w-3 h-3 bg-[var(--accent)] rounded-full -ml-[5.5px] -mt-1 shadow-[0_0_15px_var(--accent)]" />
                    </div>

                    {/* Track Regions */}
                    <div className="p-0 overflow-y-auto h-full">
                        {tracks.map((track, i) => (
                            <div key={track.id} className="h-[65px] border-b border-[var(--border)]/50 relative flex items-center px-4">
                                <div
                                    className={`absolute h-10 rounded-xl border flex flex-col justify-center px-3 shadow-lg hover:shadow-xl transition-all duration-300`}
                                    style={{
                                        left: `${15 + (i * 10)}%`,
                                        width: `${30 + (i * 5)}%`,
                                        backgroundColor: `${track.color}15`,
                                        borderColor: `${track.color}40`
                                    }}
                                >
                                    <div className="flex items-center gap-1 mb-1">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: track.color }} />
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: track.color }}>Region {i + 1}</span>
                                    </div>
                                    <div className="flex items-end gap-0.5 h-4 opacity-50">
                                        {[...Array(20)].map((_, j) => (
                                            <div
                                                key={j}
                                                className="w-1 rounded-full"
                                                style={{
                                                    height: `${20 + Math.random() * 80}%`,
                                                    backgroundColor: track.color
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="bg-[var(--surface)] px-6 py-2.5 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" /> Engine: Core Audio</span>
                    <span>Buffer: 256 Samples</span>
                    <span>Latency: 4.2ms</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[var(--accent)]">CPU: 12%</span>
                    <span>Disk: 2%</span>
                </div>
            </div>
        </div>
    );
};

export default StudioPlayground;
