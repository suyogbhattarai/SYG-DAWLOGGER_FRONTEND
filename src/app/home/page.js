'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar/Navbar'
import dashboard from "./dashboard.jpg"

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const videoContainerRef = useRef(null)
  const textContainerRef = useRef(null)
  const featureRef = useRef(null)
  const statsRef = useRef(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Initial load
    const loadTimer = setTimeout(() => {
      setIsLoaded(true)

      // Start animations after load
      const contentTimer = setTimeout(() => {
        setShowContent(true)
      }, 300)

      return () => clearTimeout(contentTimer)
    }, 800)

    return () => clearTimeout(loadTimer)
  }, [])

  useEffect(() => {
    if (!isLoaded || !showContent) return

    // Hero video animation - starts full screen, then shrinks
    if (videoContainerRef.current) {
      gsap.fromTo(
        videoContainerRef.current,
        {
          scale: 1.5,
          y: 0,
        },
        {
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.5,
        }
      )
    }

    // Text fade in after video starts shrinking
    if (textContainerRef.current) {
      gsap.fromTo(
        textContainerRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          delay: 1,
        }
      )
    }

    // Features section
    if (featureRef.current) {
      gsap.fromTo(
        featureRef.current.children,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featureRef.current,
            start: 'top 75%',
          },
        }
      )
    }

    // Stats animation
    if (statsRef.current) {
      const statElements = statsRef.current.querySelectorAll('.stat-number')
      statElements.forEach((el, index) => {
        const target = parseInt(el.getAttribute('data-target'))
        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power1.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
            },
            onUpdate: function () {
              el.innerText = Math.ceil(this.targets()[0].innerText)
            },
          }
        )
      })
    }
  }, [isLoaded, showContent])

  // Loading screen
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0695e0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dawlogger...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 md:px-16 pt-24 pb-16 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#0695e0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div ref={textContainerRef} className="opacity-0">
            <div className="inline-block px-4 py-2 bg-[#0695e0]/10 rounded-full mb-6">
              <span className="text-[#0695e0] font-semibold text-sm uppercase tracking-wider">
                Version Control for Music
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Version your sound.
              <br />
              <span className="text-[#0695e0]">Control your creativity.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
              Dawlogger is a powerful version control and collaboration platform designed specifically for modern music producers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-[#0695e0] text-white rounded-lg font-semibold text-lg hover:bg-[#0580c7] transition-all shadow-lg shadow-[#0695e0]/30 hover:shadow-xl hover:shadow-[#0695e0]/40 hover:-translate-y-0.5">
                Get Started Free
              </button>
              <button className="px-8 py-4 border-2 border-[#0695e0] text-[#0695e0] rounded-lg font-semibold text-lg hover:bg-[#0695e0] hover:text-white transition-all">
                Watch Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>1000+ Active Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0695e0] rounded-full"></div>
                <span>Cloud Secure</span>
              </div>
            </div>
          </div>

          {/* Video/Dashboard Preview */}
          <div ref={videoContainerRef} className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-900/20 border border-gray-200/50 bg-white/50 backdrop-blur-sm p-3">
              <Image
                src={dashboard}
                alt="DAW Dashboard Preview"
                width={800}
                height={600}
                className="rounded-xl w-full h-auto"
                priority
              />
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#0695e0] text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm">
                ✨ New Features
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Dawlogger?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A next-generation versioning workflow built for modern music producers
            </p>
          </div>

          <div ref={featureRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud Versioning</h3>
              <p className="text-gray-600 leading-relaxed">
                Incremental cloud versioning for huge DAW projects with intelligent compression
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Real-time collaboration with access roles and permissions management
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-driven project health monitoring and stem analysis for better workflow
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Rollback</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick rollback, compare versions, and comprehensive history tracking
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Archiving</h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with long-term archiving for professionals
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#0695e0]/10 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#0695e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimized performance with smart caching and delta compression
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0695e0] to-[#0580c7] rounded-3xl p-12 md:p-16 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Built for Scale
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2" data-target="1200">0</div>
                <p className="text-blue-100 text-sm md:text-base">Projects Stored</p>
              </div>

              <div className="text-center">
                <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2" data-target="980">0</div>
                <p className="text-blue-100 text-sm md:text-base">GB Optimized</p>
              </div>

              <div className="text-center">
                <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2" data-target="340">0</div>
                <p className="text-blue-100 text-sm md:text-base">Team Members</p>
              </div>

              <div className="text-center">
                <div className="stat-number text-4xl md:text-5xl font-bold text-white mb-2" data-target="2150">0</div>
                <p className="text-blue-100 text-sm md:text-base">AI Insights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-16 bg-white/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Start Creating Confidently
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of music producers who trust Dawlogger for their version control needs
          </p>
          <button className="px-10 py-5 bg-[#0695e0] text-white rounded-lg font-bold text-lg hover:bg-[#0580c7] transition-all shadow-xl shadow-[#0695e0]/30 hover:shadow-2xl hover:shadow-[#0695e0]/40 hover:-translate-y-1">
            Get Started Free →
          </button>
        </div>
      </section>
    </div>
  )
}
