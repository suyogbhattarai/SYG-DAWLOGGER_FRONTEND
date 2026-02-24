'use client';

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient() {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const whyChooseSectionRef = useRef<HTMLDivElement>(null);
  const [isGsapReady, setIsGsapReady] = useState(false);

  useEffect(() => {
    // Delay initialization to make sure DOM is fully rendered
    const timer = setTimeout(() => {
      let ctx = gsap.context(() => {
        // Parallax card overlap effect for Why Choose Us section
        if (whyChooseSectionRef.current) {
          gsap.fromTo(
            whyChooseSectionRef.current,
            {
              y: '100vh',
              scale: 0.9,
              opacity: 0
            },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: whyChooseSectionRef.current,
                start: 'top bottom',
                end: 'top 20%',
                scrub: 1.5,
                anticipatePin: 1,
              },
            }
          );
        }

        // Scroll animations for sections
        sectionsRef.current.forEach((section) => {
          if (!section) return;
          gsap.fromTo(
            section,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse"
              },
            }
          );
        });

        const TEXT_START = 0.1;

        // Scroll animation for video
        if (videoContainerRef.current && videoRef.current) {
          ScrollTrigger.matchMedia({
            // DESKTOP (lg and above - 1024px+)
            "(min-width: 1024px)": function () {
              const mainTl = gsap.timeline({
                scrollTrigger: {
                  trigger: videoContainerRef.current,
                  start: "top top",
                  end: "+=200%",
                  scrub: 0.15, // Slightly more direct
                  pin: true,
                  anticipatePin: 1,
                  snap: {
                    snapTo: [0, 1],
                    duration: 0.1, // Near-instant snap
                    delay: 0,      // No waiting to start snap
                    ease: "power2.out"
                  }
                },
              });

              mainTl.to(videoRef.current, {
                scale: 1,
                borderRadius: "40px",
                height: "65vh",
                width: "48vw",
                y: "18vh",
                x: "48vw",
                ease: "power3.inOut",
                onStart: () => videoRef.current?.classList.add('shrunken'),
                onReverseComplete: () => videoRef.current?.classList.remove('shrunken'),
              }, 0);

              mainTl.to(".video-overlay", {
                opacity: 0.15,
                backgroundColor: 'var(--background)',
                ease: "power2.inOut",
              }, 0);

              mainTl.to(".old-content", {
                scale: 0.9,
                y: "-40px",
                opacity: 0,
                duration: 0.2, // Faster exit
                ease: "power2.inOut",
              }, 0);

              mainTl.set(".old-content", { pointerEvents: "none" }, 0.2);
              mainTl.fromTo(".new-content",
                { opacity: 0, scale: 0.98, y: 10 },
                { opacity: 1, scale: 1, y: 0, pointerEvents: "auto", duration: 0.3, ease: "power2.out" },
                0.1 // Overlap with old exit
              );

              mainTl.fromTo(".scroll-indicator",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
                0.3
              );
            },

            // TABLET (md to lg - 768px to 1024px)
            "(min-width: 768px) and (max-width: 1023px)": function () {
              const mainTl = gsap.timeline({
                scrollTrigger: {
                  trigger: videoContainerRef.current,
                  start: "top top",
                  end: "+=200%",
                  scrub: 0.15,
                  pin: true,
                  anticipatePin: 1,
                  snap: {
                    snapTo: [0, 1],
                    duration: 0.1,
                    delay: 0,
                    ease: "power2.out"
                  }
                },
              });

              mainTl.to(videoRef.current, {
                borderRadius: "30px",
                height: "52vh",
                width: "90vw",
                y: "24vh",
                x: "5vw",
                ease: "power3.inOut",
                onStart: () => videoRef.current?.classList.add('shrunken'),
                onReverseComplete: () => videoRef.current?.classList.remove('shrunken'),
              }, 0);

              mainTl.to(".video-overlay", {
                opacity: 0,
                backgroundColor: 'var(--background)',
                ease: "power2.inOut",
              }, 0);

              mainTl.to(".old-content", {
                opacity: 0,
                y: "-30px",
                duration: 0.2,
                ease: "power2.inOut",
              }, 0);

              mainTl.set(".old-content", { pointerEvents: "none" }, 0.2);
              mainTl.fromTo(".new-content",
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out" },
                0.1
              );

              mainTl.fromTo(".scroll-indicator",
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
                0.3
              );
            },

            // MOBILE (below md - under 768px)
            "(max-width: 767px)": function () {
              const mainTl = gsap.timeline({
                scrollTrigger: {
                  trigger: videoContainerRef.current,
                  start: "top top",
                  end: "+=200%",
                  scrub: 0.15,
                  pin: true,
                  anticipatePin: 1,
                  snap: {
                    snapTo: [0, 1],
                    duration: 0.1,
                    delay: 0,
                    ease: "power2.out"
                  }
                },
              });

              mainTl.to(videoRef.current, {
                borderRadius: "20px",
                height: "48vh",
                width: "92vw",
                y: "26vh",
                x: "4vw",
                ease: "power3.inOut",
                onStart: () => videoRef.current?.classList.add('shrunken'),
                onReverseComplete: () => videoRef.current?.classList.remove('shrunken'),
              }, 0);

              mainTl.to(".video-overlay", {
                opacity: 0,
                backgroundColor: 'var(--background)',
                ease: "power2.inOut",
              }, 0);

              mainTl.to(".old-content", {
                opacity: 0,
                y: "-20px",
                duration: 0.2,
                ease: "power2.inOut",
              }, 0);

              mainTl.set(".old-content", { pointerEvents: "none" }, 0.2);
              mainTl.fromTo(".new-content",
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out" },
                0.1
              );

              mainTl.fromTo(".scroll-indicator",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
                0.3
              );
            },
          });
        }

        ScrollTrigger.refresh();
        // Set GSAP as ready after triggers are established
        setTimeout(() => setIsGsapReady(true), 200);
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        ctx.revert();
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[var(--background)] min-h-screen relative overflow-x-hidden transition-colors duration-500">
      {/* Modern Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Abstract Moving Lighthings - Softened for better grid visibility */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0695e0]/10 blur-[130px] rounded-full" />
        <div className="absolute top-[20%] right-[0%] w-[35%] h-[35%] bg-slate-200/50 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[20%] w-[30%] h-[30%] bg-blue-100/40 blur-[110px] rounded-full" />

        <style jsx global>{`
          @keyframes pulse-slow {
            0% { transform: scale(1) translate(0, 0); opacity: 0.3; }
            100% { transform: scale(1.2) translate(50px, 50px); opacity: 0.6; }
          }
          @keyframes float-slow {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-100px, 100px); }
            100% { transform: translate(0, 0); }
          }
          @keyframes shine-sweep {
            0% { transform: translateX(-100%) skewX(-15deg); }
            30% { transform: translateX(200%) skewX(-15deg); }
            100% { transform: translateX(200%) skewX(-15deg); }
          }
          @keyframes scroll-down {
            0% { transform: translateY(0); opacity: 0; }
            50% { transform: translateY(10px); opacity: 1; }
            100% { transform: translateY(20px); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Skeleton Overlay - Fixed on top until GSAP is ready */}
      {!isGsapReady && (
        <div className="fixed inset-0 z-[100] bg-[var(--background)]">
          <Navbar />
          <div className="h-screen w-full flex items-end justify-start relative overflow-hidden pb-0">
            <div className="absolute inset-0 bg-slate-950/20 animate-pulse" />
            <div className="relative z-20 w-full max-w-7xl mx-auto lg:px-15 md:px-10 px-5 flex flex-col items-start">
              <div className="w-48 h-8 bg-white/5 rounded-full mb-6 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Actual Content - Always in DOM but invisible while initializing */}
      <div className={`relative z-10 transition-opacity duration-700 ${isGsapReady ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />

        <section
          ref={videoContainerRef}
          className="relative h-screen w-full overflow-hidden z-30"
        >
          <div
            ref={videoRef}
            className="absolute z-0 top-0 left-0 w-full h-full overflow-hidden bg-slate-900 shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/0 transition-all duration-300 group"
            style={{ backdropFilter: 'blur(0px)' }}
          >
            {/* Liquid Glass Shine Effect - Sweeps across when shrunken */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-[.shrunken]:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[15deg] animate-[shine-sweep_4s_infinite]" />
            </div>

            {/* Glass refraction edges (shrunken state only) */}
            <div className="absolute inset-0 z-25 border-t border-l border-white/20 rounded-[inherit] pointer-events-none opacity-0 group-[.shrunken]:opacity-100" />

            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>

            {/* Light Card Overlay */}
            <div className="video-overlay absolute inset-0 z-10 bg-black/40 transition-[opacity]"></div>

            {/* Inner Content - Appears centered inside video after shrink */}
          </div>

          <div className="new-content absolute inset-0 lg:inset-auto lg:top-[18vh] lg:left-[5vw] lg:w-[40vw] lg:h-[65vh] z-40 flex flex-col items-center lg:items-start justify-center p-6 opacity-0 pointer-events-none">
            <div className="max-w-4xl lg:text-left text-center">
              <div className="mb-4">
                <h1 className="text-[1.8rem] sm:text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] font-black leading-[1.1] tracking-tighter max-w-4xl lg:mx-0 mx-auto">
                  <span className="new-heading text-[var(--accent)] block">Master Your</span>
                  <span className="new-heading-line-2 text-[var(--foreground)] block">Creative Workflow</span>
                </h1>
              </div>

              <div className="mb-8">
                <h2 className="text-xs md:text-base lg:text-lg text-[var(--foreground-muted)] new-subheading max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium">
                  The first true version control system built exclusively for music producers. Secure your stems, track changes, and collaborate effortlessly.
                </h2>
              </div>

              <div className="new-buttons flex flex-wrap gap-3 lg:justify-start justify-center mb-6">
                <Link href="/dashboard">
                  <button className="py-2.5 px-6 bg-[#0695e0] hover:bg-[#0580c7] text-white rounded-full text-sm md:text-base font-semibold transition shadow-lg shadow-[#0695e0]/20">
                    Start Free Trial
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="py-2.5 px-6 border border-[var(--border-bright)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] rounded-full text-sm md:text-base font-semibold transition backdrop-blur-sm">
                    View Pricing
                  </button>
                </Link>
              </div>

              <p className="security-message text-[var(--foreground-muted)]/60 text-[9px] font-bold uppercase tracking-[0.2em]">
                Cloud Secure • 1000+ Active Users • Trusted by Professionals
              </p>
            </div>
          </div>

          <div className="absolute left-0 bottom-10 z-10 lg:px-15 md:px-10 sm:px-5 px-3 max-w-7xl w-full">
            <div className="old-content w-full md:px-0">
              <div className="mb-6">
                <h2 className="text-2xl text-white/90 font-normal mb-5 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-[var(--accent)]"></span>
                  Built for the Modern Producer
                </h2>
                <h1 className="text-4xl md:text-[60px] font-black leading-[1.05] text-white tracking-tighter max-w-4xl">
                  Master Your <br />
                  <span className="text-[var(--accent)]">Creative Workflow.</span>
                </h1>
              </div>

              <p className="max-w-3xl font-light text-base md:text-lg text-white/70 mb-12 leading-relaxed font-outfit">
                Dawlogger provides cloud-based versioning for music producers. From automated stem backups to team collaboration, we redefine the creative workflow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/dashboard">
                  <button className="py-3.5 px-10 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white rounded-full transition text-base font-bold shadow-xl shadow-[var(--accent-glow)]">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-10 py-3.5 border border-[var(--border-bright)] text-[var(--foreground)] rounded-full hover:bg-[var(--surface-hover)] transition text-base backdrop-blur-sm">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Simple Animated Scroll Down Line - Hidden by default, shown by GSAP */}
          <div className="scroll-indicator absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 via-white/50 to-transparent relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[30%] bg-[#0695e0] animate-[scroll-down_2s_infinite]" />
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-[0.3em] font-medium">Scroll down to explore</span>
          </div>
        </section>

        <main className="bg-transparent text-[var(--foreground)] relative z-10">
          <section className="min-h-screen relative flex items-center justify-center px-5 md:px-20 py-32 overflow-hidden">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="about-text">
                <h2 className="text-5xl md:text-7xl font-bold text-[var(--accent)] mb-8 leading-tight">
                  <span className="text-[var(--foreground)] font-outfit">Built for</span> <br /><span className="font-outfit">Producers</span>
                </h2>
                <p className="text-xl text-[var(--foreground-muted)] mb-6 font-light leading-relaxed">
                  Dawlogger combines cloud-based version control with a project management interface designed for modern music production.
                </p>
                <div className="space-y-4">
                  {['Automated Backups', 'Real-time Collaboration', 'AI Project Insights'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[var(--foreground)]">
                      <div className="w-5 h-5 rounded-full border border-[var(--accent)] flex items-center justify-center text-[10px] text-[var(--accent)]">✓</div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="about-image relative">
                <div className="absolute -inset-4 bg-[#0695e0]/10 blur-3xl rounded-full" />
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="h-48 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl"></div>
                  <div className="h-48 bg-[#0695e0]/10 border border-[#0695e0]/20 backdrop-blur-xl rounded-3xl mt-12"></div>
                  <div className="h-48 bg-[#0695e0]/10 border border-[#0695e0]/20 backdrop-blur-xl rounded-3xl -mt-12"></div>
                  <div className="h-48 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 md:px-20 py-24 w-full mx-auto bg-[var(--background)] rounded-t-[60px] shadow-[0_-40px_100px_rgba(0,0,0,0.1)] relative z-30 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#0695e0 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
            <div className="max-w-4xl relative mx-auto text-center z-20">
              <h2 className="text-5xl md:text-8xl font-bold text-[var(--foreground)] mb-8 tracking-tighter">
                Ready to Start?
              </h2>
              <p className="text-xl md:text-2xl text-[var(--foreground-muted)] mb-12 font-medium">
                Join thousands of music producers and studios who trust Dawlogger for their creative vision.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/dashboard">
                  <button className="px-12 py-5 bg-[var(--accent)] text-white rounded-full text-xl font-bold hover:bg-[var(--accent)]/90 transition-all transform hover:scale-105 shadow-2xl shadow-[var(--accent-glow)] underline-none">
                    Get Started Free
                  </button>
                </Link>
                <Link href="/features">
                  <button className="px-12 py-5 bg-[var(--foreground)] text-[var(--background)] rounded-full text-xl font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-xl">
                    View Features
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}
