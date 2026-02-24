'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { fetchDashboardOverview } from '@/utils/lib/redux/features/management/managementSlice';
import StatCard from '@/components/dashboard/StatCard';
import {
    MdLibraryMusic,
    MdAlbum,
    MdAutoGraph,
    MdTune,
    MdCloudDone,
    MdPlayArrow,
    MdMoreHoriz,
    MdAccessTime,
    MdSettingsVoice,
    MdHistory,
    MdGraphicEq,
    MdCloudSync
} from 'react-icons/md';
import { FiLoader, FiZap } from 'react-icons/fi';
import { IoIosMic, IoMdMusicalNotes } from 'react-icons/io';
import { DashboardOverviewSkeleton } from '@/components/Skeletons/Skeletons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Asset Imports
import StudioPlayground from '@/components/dashboard/StudioPlayground';
import abletonLogo from '@/app/dashboard/abeleton.png';
import flLogo from '@/app/dashboard/fl.png';
import logicLogo from '@/app/dashboard/logic.png';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { overview, overviewLoading, error } = useSelector((s: RootState) => s.management);

    useEffect(() => {
        dispatch(fetchDashboardOverview() as any);
    }, [dispatch]);

    if (overviewLoading && !overview) {
        return <DashboardOverviewSkeleton />;
    }

    const totalProjects = overview?.length || 0;
    const activePushes = overview?.filter(p => p.has_active_push).length || 0;
    const totalVersions = overview?.reduce((acc, p) => acc + p.version_count, 0) || 0;
    const teamRole = overview?.[0]?.user_role || 'User';

    return (
        <div className="space-y-10 animate-fadeIn min-h-screen pb-20">
            {/* DAW Studio Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-10 rounded-[3rem] bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-[var(--accent)]/20 flex items-center gap-2 shadow-[0_0_15px_var(--accent-glow)]">
                            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                            AI Powered Studio
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-[var(--foreground)] tracking-tighter leading-none mb-4">
                        Welcome back, <span className="text-[var(--accent)]">Producer.</span>
                    </h1>
                    <p className="text-[var(--foreground-muted)] text-lg font-medium max-w-xl leading-relaxed">
                        Your intelligent workspace is synced. All your DAW projects, versions, and collaborators are unified here.
                    </p>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex items-center gap-5 bg-[var(--accent)] p-6 rounded-[2rem] border border-[var(--accent)]/20 shadow-[0_20px_40px_-15px_var(--accent-glow)] transform hover:scale-105 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                            <MdCloudSync size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-0.5">Global Sync</p>
                            <p className="text-md font-extrabold text-white">Cloud Active (v4.2.1)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Studio Playground - INTEGRATED DAW */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                        <MdGraphicEq size={22} />
                    </div>
                    <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight uppercase tracking-widest">Studio Playground</h2>
                </div>
                <StudioPlayground />
            </div>

            {/* DAW Integration Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: 'Ableton Live', logo: abletonLogo, status: 'Connected', version: '11.3.10' },
                    { name: 'FL Studio', logo: flLogo, status: 'Standby', version: '21.2.3' },
                    { name: 'Logic Pro', logo: logicLogo, status: 'Standby', version: '10.8.1' }
                ].map((daw, i) => (
                    <div key={i} className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 flex items-center gap-6 hover:border-[var(--accent)]/30 hover:bg-[var(--surface-hover)] transition-all duration-500 cursor-pointer shadow-xl">
                        <div className="w-16 h-16 relative grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                            <Image src={daw.logo} alt={daw.name} fill className="object-contain" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-sm font-black text-[var(--foreground)]">{daw.name}</h3>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${daw.status === 'Connected' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-500'}`}>
                                    {daw.status}
                                </span>
                            </div>
                            <p className="text-[10px] text-[var(--foreground-muted)] font-bold mt-1 tracking-wider">{daw.version}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Core Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Sessions"
                    value={totalProjects}
                    icon={<MdAlbum size={24} />}
                />
                <StatCard
                    title="Live Pushes"
                    value={activePushes}
                    icon={<MdCloudSync size={24} />}
                    accent
                />
                <StatCard
                    title="History Points"
                    value={totalVersions}
                    icon={<MdHistory size={24} />}
                />
                <StatCard
                    title="Engineer Role"
                    value={teamRole}
                    icon={<MdTune size={24} />}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                {/* Recent Project Sessions - Left Section */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff]">
                                <MdLibraryMusic size={22} />
                            </div>
                            <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight uppercase tracking-widest">Recent Sessions</h2>
                        </div>
                        <Link href="/dashboard/projects" className="text-xs font-black text-[#00f2ff] hover:underline uppercase tracking-[0.2em]">
                            View Vault
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {overview && overview.length > 0 ? (
                            overview.slice(0, 4).map((project, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                                    className="group bg-[var(--surface)] border border-[var(--border)] rounded-[2.5rem] p-8 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-hover)] transition-all duration-500 cursor-pointer relative overflow-hidden shadow-xl"
                                >
                                    <div className="absolute bottom-0 right-0 p-8 opacity-[0.02] transform translate-y-4 translate-x-4">
                                        <MdGraphicEq size={120} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all duration-300">
                                                <MdPlayArrow size={28} />
                                            </div>
                                            <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${project.user_role === 'owner' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {project.user_role}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mb-2">{project.name}</h3>
                                        <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--foreground-muted)]">
                                            <span className="flex items-center gap-1.5"><MdHistory size={14} className="text-[var(--accent)]" /> {project.version_count} Versions</span>
                                            <span className="flex items-center gap-1.5"><MdAccessTime size={14} /> {new Date(project.created_at).toLocaleDateString()}</span>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                                            <div className="flex -space-x-3">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="w-9 h-9 rounded-full bg-[var(--surface-hover)] border-2 border-[var(--surface)] flex items-center justify-center text-[11px] font-bold text-[var(--foreground)] shadow-lg">
                                                        {project.owner_username?.[0]?.toUpperCase()}
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors">
                                                <MdMoreHoriz size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 py-24 text-center text-gray-600 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                                <MdAlbum className="mx-auto mb-4 opacity-10" size={64} />
                                <p className="italic font-medium">No recorded sessions found in the pipeline.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Activity Stream - Right Section */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00f2ff]/10 flex items-center justify-center text-[#00f2ff]">
                            <FiZap size={22} />
                        </div>
                        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight uppercase tracking-widest">Live Activity</h2>
                    </div>

                    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[3rem] p-8 min-h-[500px] relative overflow-hidden shadow-2xl">
                        <div className="space-y-6">
                            {overview && overview.filter(p => p.has_active_push).length > 0 ? (
                                overview.filter(p => p.has_active_push).map((project, idx) => (
                                    <div key={idx} className="p-6 bg-[var(--accent)]/5 rounded-3xl border border-[var(--accent)]/10 relative overflow-hidden group hover:border-[var(--accent)]/30 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] animate-pulse shadow-[0_0_15px_var(--accent-glow)]">
                                                    <MdSettingsVoice size={22} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-[var(--foreground)] truncate max-w-[150px]">{project.name}</h4>
                                                    <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-widest">Cloud Syncing...</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-[var(--foreground-muted)]">{project.latest_push?.progress || 0}%</span>
                                        </div>

                                        <p className="text-[11px] text-[var(--foreground-muted)] mb-4 line-clamp-1 italic">{project.latest_push?.message || 'Optimizing stem packets...'}</p>

                                        <div className="w-full bg-[var(--background)]/40 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-[var(--accent)] h-full transition-all duration-1000 shadow-[0_0_15px_var(--accent)]"
                                                style={{ width: `${project.latest_push?.progress || 30}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-24 text-center text-[var(--foreground-muted)] italic text-sm">
                                    <MdCloudDone className="mx-auto mb-8 text-[var(--accent)] opacity-20" size={84} />
                                    <p className="font-black uppercase tracking-[0.3em] mb-2 text-[var(--foreground-muted)]">Studio Fully Synced</p>
                                    <p className="text-[10px] text-[var(--foreground-muted)] max-w-[200px] mx-auto leading-relaxed">All local stems are mirrored and high-fidelity encrypted.</p>
                                </div>
                            )}
                        </div>

                        {/* AI Insights Snippet */}
                        <div className="absolute bottom-8 left-8 right-8 p-8 bg-[var(--surface)] rounded-[2rem] border border-[var(--border)] shadow-xl backdrop-blur-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <MdAutoGraph className="text-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" size={20} />
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">AI Production Intelligence</h5>
                            </div>
                            <p className="text-[13px] text-[var(--foreground)] leading-relaxed italic font-medium">
                                "The low-end frequencies in <span className="text-[var(--accent)]">Sync Session_04</span> need 2.4dB reduction around 60Hz to clear head-room."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
