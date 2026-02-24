'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/utils/lib/redux/Store';
import { logout } from '@/utils/lib/redux/features/auth/authSlice';
import Image from 'next/image';
import logo from '@/components/Navbar/logo.png';
import {
    MdDashboard,
    MdLibraryMusic,
    MdAlbum,
    MdGroup,
    MdLogout,
    MdChevronLeft,
    MdChevronRight,
    MdAutoGraph,
    MdTune,
    MdHistory
} from 'react-icons/md';
import { IoMusicalNotes } from 'react-icons/io5';

const Sidebar = ({
    isOpen,
    onClose,
    collapsed,
    setCollapsed
}: {
    isOpen: boolean;
    onClose: () => void;
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}) => {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { user, loading } = useSelector((s: RootState) => s.auth);

    // const [collapsed, setCollapsed] = useState(false); // Internal state removed

    const nav = [
        { name: 'Studio Home', href: '/dashboard', icon: <MdDashboard size={22} />, roles: ['admin', 'staff', 'user'] },
        { name: 'Projects', href: '/dashboard/projects', icon: <MdAlbum size={22} />, roles: ['admin', 'staff', 'user'] },
        { name: 'Sample Vault', href: '/dashboard/samples', icon: <MdLibraryMusic size={22} />, roles: ['admin', 'staff', 'user'] },
        { name: 'Multitrack Mixer', href: '/dashboard/mixer', icon: <MdTune size={22} />, roles: ['admin', 'staff', 'user'] },
        { name: 'AI Insights', href: '/dashboard/analytics', icon: <MdAutoGraph size={22} />, roles: ['admin', 'staff'] },
        { name: 'Collaborators', href: '/dashboard/hr', icon: <MdGroup size={22} />, roles: ['admin', 'staff'] },
        { name: 'Admin Console', href: '/dashboard/users', icon: <MdTune size={22} />, roles: ['admin'] }
    ];

    const filtered = nav.filter(i => user?.role && i.roles.includes(user.role));

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />}

            <aside
                className={`
          fixed z-30 lg:top-16 top-0 left-0 h-[calc(100vh-4rem)]
          ${collapsed ? 'w-20' : 'w-72'}
          bg-[var(--surface)] border-r border-[var(--border)]
          transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 overflow-visible h-full lg:h-[calc(100vh-4rem)]
        `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-24 bg-[var(--surface)] text-[var(--accent)] p-1.5 rounded-lg border border-[var(--border)] shadow-xl hidden lg:flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 group hover:border-[var(--accent)]/30"
                >
                    {collapsed ? <MdChevronRight size={18} className="group-hover:translate-x-0.5 transition" /> : <MdChevronLeft size={18} className="group-hover:-translate-x-0.5 transition" />}
                </button>

                {/* Navigation */}
                <nav className="p-3 space-y-1 mt-4">
                    {loading || !user ? (
                        // Skeleton State
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                                <div className="w-5 h-5 rounded bg-[var(--border)] animate-pulse shrink-0" />
                                <div className={`h-4 bg-[var(--border)] animate-pulse rounded transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-32 opacity-100'}`} />
                            </div>
                        ))
                    ) : (
                        filtered.map(item => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative ${active
                                        ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                                        }`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[var(--accent)] rounded-r-full shadow-[0_0_15px_var(--accent-glow)]" />
                                    )}
                                    <span className={`transition-all duration-300 transform ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-black whitespace-nowrap tracking-[0.05em] transition-all duration-500 ${collapsed ? 'w-0 opacity-0 overflow-hidden ml-0' : 'w-auto opacity-100 ml-0'
                                        }`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })
                    )}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-0 right-0 px-3">
                    {loading || !user ? (
                        <div className="px-3 py-2.5 flex items-center gap-3">
                            <div className="w-5 h-5 rounded bg-[var(--border)] animate-pulse shrink-0" />
                            <div className={`h-4 bg-[var(--border)] animate-pulse rounded transition-all duration-300 ${collapsed ? 'w-0 opacity-0' : 'w-24 opacity-100'}`} />
                        </div>
                    ) : (
                        <button
                            onClick={() => dispatch(logout())}
                            className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg 
                text-red-400 hover:bg-red-500/10 transition-all duration-200 group
            `}
                            title={collapsed ? 'Logout' : undefined}
                        >
                            <MdLogout size={20} />
                            <span className={`
                text-sm font-medium whitespace-nowrap transition-all duration-300
                ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
            `}>
                                Logout
                            </span>
                        </button>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
