'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/SideBar';
import Navbar from '@/components/Navbar/Navbar';
import ProtectedRoute from '@/components/dashboard/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    return (
        <div className="min-h-screen bg-[var(--background)]">

            {/* Fixed Navbar */}
            <Navbar variant="dashboard" onMenuClick={() => setSidebarOpen(true)} />

            {/* Sidebar (Fixed position handled internally) */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />

            {/* Main Content Area */}
            <div
                className={`
                    pt-16 transition-all duration-500 min-h-screen flex flex-col
                    ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}
                `}
            >
                <main className="flex-1 px-5 py-8 lg:p-9 text-[var(--foreground)] max-w-[1920px] mx-auto w-full">
                    <ProtectedRoute allowedRoles={['admin', 'staff', 'user']}>
                        {children}
                    </ProtectedRoute>
                </main>
            </div>

        </div>
    );
}
