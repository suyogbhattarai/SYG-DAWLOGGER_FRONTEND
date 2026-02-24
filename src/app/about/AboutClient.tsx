'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MdCheckCircle, MdEngineering, MdDesignServices, MdHandyman } from 'react-icons/md';

gsap.registerPlugin(ScrollTrigger);

const backgroundImages = [
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920', // Studio
    'https://images.unsplash.com/photo-1514525253361-b83f85dfd75c?w=1920', // Music event/production
    'https://images.unsplash.com/photo-1520523242609-64660f689b28?w=1920', // Waveforms/Digital
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920'  // DJ/Producer
];

export default function AboutClient() {
    const [isGsapReady, setIsGsapReady] = useState(false);

    // 1. Scroll Snap Initialization (Document Level)
    useEffect(() => {
        const html = document.documentElement;
        const originalSnapType = html.style.scrollSnapType;
        const originalScrollBehavior = html.style.scrollBehavior;
        const originalHeight = html.style.height;
        const originalOverflow = html.style.overflowY;

        html.style.scrollSnapType = 'y mandatory';
        html.style.scrollBehavior = 'smooth';
        html.style.height = '100vh';
        html.style.overflowY = 'scroll';
        document.body.style.scrollSnapType = 'y mandatory';

        return () => {
            html.style.scrollSnapType = originalSnapType;
            html.style.scrollBehavior = originalScrollBehavior;
            html.style.height = originalHeight;
            html.style.overflowY = originalOverflow;
            document.body.style.scrollSnapType = '';
        };
    }, []);

    // 2. GSAP & Parallax Initialization
    useEffect(() => {
        const initGsap = () => {
            const sections = gsap.utils.toArray<HTMLElement>('.snap-section');
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());

            sections.forEach((section) => {
                const bgImage = section.querySelector('.parallax-bg');
                if (bgImage) {
                    gsap.to(bgImage, {
                        yPercent: 30,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                            invalidateOnRefresh: true
                        }
                    });
                }

                const content = section.querySelectorAll('.content-fade');
                if (content.length > 0) {
                    gsap.fromTo(content,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            stagger: 0.15,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: section,
                                start: 'top 80%',
                                toggleActions: 'play none none reverse',
                                invalidateOnRefresh: true
                            }
                        }
                    );
                }
            });

            ScrollTrigger.refresh();
            setTimeout(() => {
                setIsGsapReady(true);
            }, 200);
        };

        const timer = setTimeout(initGsap, 500);
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="bg-[var(--background)] min-h-screen relative">
            {!isGsapReady && (
                <div className="fixed inset-0 z-[100] bg-[var(--background)]">
                    <Navbar forceTransparent={true} />
                    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/50 animate-pulse" />
                        <div className="relative z-20 w-full max-w-4xl mx-auto px-5 flex flex-col items-center translate-y-[100px]">
                            <div className="w-32 h-6 bg-white/5 rounded-full mb-6 animate-pulse" />
                            <div className="w-full max-w-2xl h-16 bg-white/5 rounded-2xl mb-4 animate-pulse" />
                            <div className="w-3/4 max-w-lg h-16 bg-white/5 rounded-2xl mb-8 animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            <div className={`transition-opacity duration-700 ${isGsapReady ? 'opacity-100' : 'opacity-0'}`}>
                <Navbar forceTransparent={true} />

                {/* 1. Hero Section */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[0]})` }}
                        />
                        <div className="absolute inset-0 bg-black/60 z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--background)] to-transparent z-10" />

                        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-[#00f2ff]/10 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none z-10" />
                        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-purple-600/10 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                            <span className="content-fade inline-block px-4 py-1.5 bg-[#00f2ff] text-[#050510] text-[8px] font-black uppercase tracking-widest rounded-full mb-6 shadow-lg shadow-cyan-500/20">
                                The Creative OS
                            </span>
                            <h1 className="content-fade text-3xl md:text-[55px] font-black text-white mb-6 leading-tight">
                                Version Your Sound, <br />
                                <span className="text-[#00f2ff]">Control Your Creativity.</span>
                            </h1>
                            <p className="content-fade text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-medium">
                                Dawlogger is the industry's first purpose-built version control and collaboration system for digital audio workstations.
                            </p>
                            <div className="content-fade flex gap-4">
                                <a href="/login" className="bg-[#00f2ff] hover:bg-[#3a7bd5] text-[#050510] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20">
                                    Join Alpha
                                </a>
                                <a href="/features" className="bg-white/5 hover:bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all border border-white/10">
                                    Our Tech
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Who We Are */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 will-change-transform h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[1]})` }}
                        />
                        <div className="absolute inset-0 bg-black/70 z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-2xl ml-auto text-right flex flex-col items-end mt-24 md:mt-40">
                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">
                                By Producers, For Producers
                            </h2>
                            <p className="content-fade text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium">
                                Dawlogger started in a bedroom studio where we lost a potential hit song to a corrupted DAW file. We decided that "File_Final_v2_Final3.als" wasn't a workflow—it was a tragedy. Today, we're building the tools we wish we had years ago.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-xl">
                                <div className="content-fade flex items-center justify-end gap-4 p-5 bg-white/5 backdrop-blur rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                    <div>
                                        <h4 className="font-black text-white text-[10px] uppercase mb-1 tracking-widest">Audio Engineering</h4>
                                        <p className="text-gray-400 text-[10px]">Lossless versioning for every take.</p>
                                    </div>
                                    <MdEngineering className="text-[#00f2ff] shrink-0" size={32} />
                                </div>
                                <div className="content-fade flex items-center justify-end gap-4 p-5 bg-white/5 backdrop-blur rounded-2xl border border-white/10 group hover:bg-white/10 transition-all">
                                    <div>
                                        <h4 className="font-black text-white text-[10px] uppercase mb-1 tracking-widest">Global Sync</h4>
                                        <p className="text-gray-400 text-[10px]">Collab from anywhere, instantly.</p>
                                    </div>
                                    <MdDesignServices className="text-[#00f2ff] shrink-0" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Core Values */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[2]})` }}
                        />
                        <div className="absolute inset-0 bg-black/80 z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-4xl mt-24 md:mt-40">
                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">
                                The Producer's Creed
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#00f2ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                                        <MdHandyman size={28} className="text-[#050510]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Technical Precision</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        Our sync algorithm understands DAW project structures, ensuring only changed bits are uploaded, saving your time and bandwidth.
                                    </p>
                                </div>

                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#00f2ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                                        <MdCheckCircle size={28} className="text-[#050510]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Creative Security</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        Military-grade encryption for your intellectual property. Your stems, your tracks, your ownership—locked and safe.
                                    </p>
                                </div>

                                <div className="content-fade p-8 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
                                    <div className="w-14 h-14 bg-[#00f2ff] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                                        <MdDesignServices size={28} className="text-[#050510]" />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Pure Workflow</h3>
                                    <p className="text-gray-400 text-xs leading-relaxed font-medium">
                                        We stay out of your creative way. Dawlogger works in the background so you can stay in the zone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Experience Section */}
                <section
                    className="snap-section relative h-screen w-full flex items-center overflow-hidden"
                    style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                    <div className="parallax-bg absolute inset-0 z-0 h-[140%] -top-[20%] w-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImages[3]})` }}
                        />
                        <div className="absolute inset-0 bg-black/60 z-10" />
                    </div>

                    <div className="relative z-20 w-full max-w-[1920px] mx-auto px-5">
                        <div className="max-w-3xl ml-auto text-right flex flex-col items-end">
                            <div className="content-fade inline-block p-10 md:p-14 rounded-[3rem] bg-[#00f2ff] mb-10 shadow-2xl shadow-cyan-500/30">
                                <h3 className="text-6xl md:text-8xl font-black text-[#050510] mb-2 tracking-tighter">v1.2</h3>
                                <p className="text-[#050510]/90 font-black text-xs uppercase tracking-[0.3em]">Stable Release</p>
                            </div>

                            <h2 className="content-fade text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
                                A New Standard for <span className="text-[#00f2ff]">Music Teams.</span>
                            </h2>
                            <p className="content-fade text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-2xl font-medium">
                                Trusted by platinum-certified producers and bedroom artists alike. DAWLogger is the secret weapon that keeps your creative process organised, collaborative, and fail-safe.
                            </p>

                            <div className="content-fade flex flex-wrap gap-4 justify-end">
                                <div className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                                    <span className="text-white font-black text-[10px] uppercase tracking-wider">Cloud Native</span>
                                </div>
                                <div className="px-6 py-3 bg-[#00f2ff]/10 backdrop-blur-md rounded-full border border-[#00f2ff]/30">
                                    <span className="text-[#00f2ff] font-black text-[10px] uppercase tracking-wider">API Integration</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="snap-section w-full bg-[#050510]" style={{ scrollSnapAlign: 'end' }}>
                    <Footer />
                </section>
            </div>
        </div>
    );
}
