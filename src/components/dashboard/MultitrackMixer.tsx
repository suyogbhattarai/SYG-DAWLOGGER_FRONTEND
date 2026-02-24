'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    MdPlayArrow,
    MdPause,
    MdStop,
    MdSkipPrevious,
    MdSkipNext,
    MdMic,
    MdGraphicEq,
    MdVolumeUp,
    MdLoop,
    MdCloudUpload,
    MdSettings,
    MdTimeline,
    MdViewHeadline,
} from 'react-icons/md';
import { IoMdMusicalNotes } from 'react-icons/io';

const MultitrackMixer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [tracks, setTracks] = useState([
        { id: 1, name: 'Kick Drum', color: '#f43f5e', volume: 80, pan: 0, muted: false, soloed: false, regions: [{ start: 0, duration: 400 }] },
        { id: 2, name: 'Snare', color: '#fb923c', volume: 75, pan: 0, muted: false, soloed: false, regions: [{ start: 50, duration: 350 }] },
        { id: 3, name: 'Lead Synth', color: '#00f2ff', volume: 60, pan: -20, muted: false, soloed: false, regions: [{ start: 100, duration: 600 }] },
        { id: 4, name: 'Bassline', color: '#22c55e', volume: 70, pan: 10, muted: false, soloed: false, regions: [{ start: 0, duration: 800 }] },
        { id: 5, name: 'Vocals', color: '#a855f7', volume: 90, pan: 0, muted: false, soloed: false, regions: [{ start: 200, duration: 500 }] },
    ]);

    // Transport simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => prev + 1);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (ticks: number) => {
        const mins = Math.floor(ticks / 600);
        const secs = Math.floor((ticks % 600) / 10);
        const ms = ticks % 10;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}0`;
    };

    const handleUpload = () => {
        const names = ['Guitar', 'Strings', 'Percussion', 'FX'];
        const colors = ['#3b82f6', '#ec4899', '#eab308', '#6366f1'];
        const newId = tracks.length + 1;
        setTracks([...tracks, {
            id: newId,
            name: names[Math.floor(Math.random() * names.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            volume: 80,
            pan: 0,
            muted: false,
            soloed: false,
            regions: [{ start: Math.random() * 100, duration: 300 + Math.random() * 500 }]
        }]);
    };

    return (
        <div className="flex flex-col h-full bg-[var(--background)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-2xl relative text-white font-sans">

            {/* DAW Header / Transport */}
            <div className="bg-[#1a1a24] p-3 flex items-center justify-between border-b border-white/10 select-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors">
                            <MdSkipPrevious size={20} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`p-2 rounded-lg transition-all ${isPlaying ? 'bg-[var(--accent)] text-white shadow-[0_0_20px_var(--accent-glow)]' : 'hover:bg-white/10 text-white/60'}`}
                        >
                            {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
                        </button>
                        <button
                            onClick={() => { setIsPlaying(false); setCurrentTime(0); }}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors"
                        >
                            <MdStop size={20} />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 transition-colors">
                            <MdSkipNext size={20} />
                        </button>
                    </div>

                    <div className="bg-black/60 px-4 py-2 rounded-xl flex items-center gap-4 border border-white/5 font-mono text-sm">
                        <div className="text-[var(--accent)] tabular-nums">{formatTime(currentTime)}</div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="text-white/60">120.00 <span className="text-[10px] opacity-50 uppercase">BPM</span></div>
                        <div className="w-px h-4 bg-white/10" />
                        <div className="text-white/60">4 / 4</div>
                    </div>

                    <button
                        onClick={handleUpload}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-[#00d4ff] rounded-xl text-xs font-black tracking-widest uppercase hover:scale-105 transition-transform shadow-lg shadow-[var(--accent-glow)]"
                    >
                        <MdCloudUpload size={18} />
                        Upload Track
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[8px] uppercase tracking-tighter text-white/40">CPU</span>
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[15%]" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5 group">
                        <MdVolumeUp className="text-white/40 group-hover:text-[var(--accent)] transition-colors" />
                        <div className="w-24 h-1 bg-white/10 rounded-full cursor-pointer relative">
                            <div className="absolute top-0 left-0 h-full bg-[var(--accent)] w-2/3" />
                        </div>
                    </div>
                    <button className="p-2 text-white/40 hover:text-white transition-colors">
                        <MdSettings size={20} />
                    </button>
                </div>
            </div>

            {/* DAW Content (Arrangement + Headers) */}
            <div className="flex-1 flex overflow-hidden bg-[#0f0f15]">
                {/* Track Headers Column */}
                <div className="w-64 border-r border-white/5 overflow-y-auto scrollbar-hide flex flex-col bg-[#12121a]">
                    {tracks.map(track => (
                        <div key={track.id} className="h-24 border-b border-white/5 p-3 flex flex-col justify-between hover:bg-white/5 transition-colors group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 rounded-full" style={{ backgroundColor: track.color }} />
                                    <span className="text-xs font-bold truncate max-w-[100px]">{track.name}</span>
                                </div>
                                <MdGraphicEq size={14} className="text-white/20 group-hover:text-white/60" />
                            </div>

                            <div className="flex items-center gap-1 mt-2">
                                <button className={`flex-1 py-1 text-[8px] font-black uppercase rounded border transition-colors ${track.muted ? 'bg-red-500/80 border-red-500' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}>M</button>
                                <button className={`flex-1 py-1 text-[8px] font-black uppercase rounded border transition-colors ${track.soloed ? 'bg-yellow-500/80 border-yellow-500 text-black' : 'bg-black/20 border-white/5 text-white/40 hover:border-white/20'}`}>S</button>
                                <button className="flex-1 py-1 text-[8px] font-black uppercase rounded border bg-black/20 border-white/5 text-rose-500/40 hover:text-rose-500 hover:border-rose-500/40">R</button>
                                <div className="flex-[3] h-4 bg-black/40 rounded flex items-center px-1 overflow-hidden relative">
                                    <div className="h-0.5 bg-green-500/60 rounded-full" style={{ width: isPlaying ? `${Math.random() * 80 + 20}%` : '5%' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleUpload}
                        className="p-4 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[var(--accent)] hover:bg-white/5 transition-all text-center border-b border-white/5"
                    >
                        + Add Audio track
                    </button>
                </div>

                {/* Timeline / Arrangement Area */}
                <div className="flex-1 relative overflow-auto bg-[#0a0a0f] scrollbar-hide">
                    {/* Grid */}
                    <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(100px,1fr))] opacity-[0.03] pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="border-r border-white" />
                        ))}
                    </div>

                    {/* Playhead */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-[var(--accent)] z-20 pointer-events-none"
                        style={{ left: `${currentTime * 2 * zoom}px` }}
                    >
                        <div className="w-3 h-3 bg-[var(--accent)] rounded-full -ml-1.5 shadow-[0_0_15px_var(--accent)]" />
                    </div>

                    {/* Timeline Tracks */}
                    <div className="flex flex-col min-w-max">
                        {tracks.map(track => (
                            <div key={track.id} className="h-24 border-b border-white/5 relative flex items-center group">
                                {track.regions.map((region, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute h-16 rounded-xl border-t border-r border-b-2 border-l-2 flex flex-col justify-center px-4 cursor-grab active:cursor-grabbing hover:brightness-110 transition-all shadow-lg overflow-hidden"
                                        style={{
                                            left: `${region.start * 2 * zoom}px`,
                                            width: `${region.duration * zoom}px`,
                                            backgroundColor: `${track.color}20`,
                                            borderColor: `${track.color}50`
                                        }}
                                    >
                                        <div className="flex items-center gap-1 mb-1 relative z-10">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: track.color }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest truncate" style={{ color: track.color }}>
                                                {track.name} Clip
                                            </span>
                                        </div>

                                        {/* Waveform Visualization */}
                                        <div className="flex items-end gap-[1px] h-6 opacity-40">
                                            {[...Array(Math.floor(region.duration / 10))].map((_, j) => (
                                                <div
                                                    key={j}
                                                    className="w-1 rounded-full flex-shrink-0"
                                                    style={{
                                                        height: `${20 + Math.abs(Math.sin((j + region.start) * 0.2)) * 80}%`,
                                                        backgroundColor: track.color
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        {/* Reflection effect */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-30 pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mixer Area (Bottom) */}
            <div className="h-72 bg-[#12121a] border-t border-white/10 flex overflow-x-auto scrollbar-hide">
                {tracks.map(track => (
                    <div key={track.id} className="w-24 flex-shrink-0 border-r border-white/5 flex flex-col p-2 bg-gradient-to-b from-[#1a1a24] to-[#12121a] relative group">

                        {/* Level Meter (Background) */}
                        <div className="absolute right-1 top-2 bottom-8 w-1 bg-black/40 rounded-full overflow-hidden opacity-50">
                            <div
                                className="w-full bg-gradient-to-t from-green-500 via-yellow-400 to-red-500 absolute bottom-0 transition-all duration-75"
                                style={{ height: isPlaying ? `${Math.random() * 90 + 5}%` : '5%' }}
                            />
                        </div>

                        {/* Pan Knob (Represented as a stylized div) */}
                        <div className="flex flex-col items-center gap-1 mb-4">
                            <span className="text-[8px] uppercase font-black text-white/30">Pan</span>
                            <div className="w-8 h-8 rounded-full border-2 border-white/10 bg-black/40 flex items-center justify-center relative cursor-ns-resize group-hover:border-[var(--accent)] transition-colors">
                                <div
                                    className="w-0.5 h-3 bg-[var(--accent)] rounded-full absolute top-1 origin-bottom"
                                    style={{ transform: `rotate(${track.pan}deg)` }}
                                />
                                <div className="text-[7px] font-black">{track.pan > 0 ? `R${track.pan}` : track.pan < 0 ? `L${Math.abs(track.pan)}` : 'C'}</div>
                            </div>
                        </div>

                        {/* Fader Track */}
                        <div className="flex-1 flex justify-center py-2 relative">
                            <div className="w-1 bg-[#0a0a0f] rounded-full h-full border border-white/5" />
                            {/* Fader Handle */}
                            <div
                                className="absolute w-6 h-10 bg-zinc-800 border border-zinc-700 rounded-sm shadow-xl flex flex-col items-center justify-center gap-1 cursor-ns-resize hover:bg-zinc-700 active:bg-zinc-600 transition-colors z-10"
                                style={{ bottom: `${track.volume}%`, transform: 'translateY(50%)' }}
                            >
                                <div className="w-4 h-0.5 bg-[var(--accent)]/40" />
                                <div className="w-4 h-0.5 bg-[var(--accent)]" />
                                <div className="w-4 h-0.5 bg-[var(--accent)]/40" />
                            </div>

                            {/* DB markings */}
                            <div className="absolute left-10 flex flex-col justify-between h-full py-2 text-[6px] font-black text-white/20 select-none pointer-events-none">
                                <span>+6</span>
                                <span>0</span>
                                <span>-6</span>
                                <span>-12</span>
                                <span>-48</span>
                                <span>-inf</span>
                            </div>
                        </div>

                        {/* Track Info */}
                        <div className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-1">
                            <div className="flex gap-1">
                                <button className={`flex-1 text-[8px] font-black p-1 rounded ${track.muted ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}>M</button>
                                <button className={`flex-1 text-[8px] font-black p-1 rounded ${track.soloed ? 'bg-yellow-500 text-black' : 'bg-white/5 hover:bg-white/10 text-white/40'}`}>S</button>
                            </div>
                            <div className="h-4 bg-black/60 rounded flex items-center justify-center">
                                <span className="text-[9px] font-black uppercase truncate px-1 text-white/60">{track.name}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Master Track */}
                <div className="w-32 flex-shrink-0 border-l-2 border-white/10 flex flex-col p-2 bg-gradient-to-b from-[#252533] to-[#1a1a24] relative shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]">
                    <span className="text-[8px] uppercase font-black text-[var(--accent)] mb-2 text-center tracking-[0.2em]">Master</span>

                    <div className="flex gap-4 flex-1">
                        {/* Dual Faders for L/R */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="flex-1 w-2 bg-[#0a0a0f] rounded-full relative">
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-8 h-12 bg-[var(--accent)] rounded-md border border-white/20 shadow-2xl flex items-center justify-center"
                                    style={{ bottom: '80%', transform: 'translateY(50%)' }}
                                >
                                    <div className="w-1 h-6 bg-white/20 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Master Meters */}
                        <div className="w-12 h-full flex gap-1 bg-black/40 p-1 rounded">
                            <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-400 to-red-500"
                                    style={{ height: isPlaying ? `${Math.random() * 70 + 20}%` : '2%' }}
                                />
                            </div>
                            <div className="flex-1 bg-[#0a0a0f] relative overflow-hidden">
                                <div
                                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 via-yellow-400 to-red-500"
                                    style={{ height: isPlaying ? `${Math.random() * 70 + 20}%` : '2%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-white/10">
                        <div className="text-[10px] font-black text-center text-white/40">OUTPUT 1-2</div>
                    </div>
                </div>
            </div>

            {/* Browser / FX Panel (Floating toggle or bottom bar) */}
            <div className="bg-[#12121a] px-6 py-2 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                <div className="flex gap-6">
                    <button className="hover:text-[var(--accent)] transition-colors flex items-center gap-2"><MdViewHeadline /> Browser</button>
                    <button className="hover:text-[var(--accent)] transition-colors flex items-center gap-2"><MdTimeline /> Automation</button>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-green-500/60 uppercase">System Ready</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default MultitrackMixer;
