'use client';

import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    accent?: boolean;
    onClick?: () => void;
}

const StatCard = ({ title, value, icon, accent, onClick }: StatCardProps) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-5 p-6 rounded-[2rem] bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-300 group cursor-pointer shadow-lg"
        >
            <div
                className={`
          w-12 h-12 rounded-2xl flex items-center justify-center text-xl
          ${accent ? 'bg-[var(--accent)]/10 text-[var(--accent)] shadow-[0_0_15px_var(--accent-glow)]' : 'bg-[var(--surface-hover)] text-[var(--foreground-muted)]'}
        `}
            >
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-[var(--foreground-muted)] uppercase tracking-[0.2em] mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-black text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">{value}</h3>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
