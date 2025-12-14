'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import Navbar from '@/components/Navbar/Navbar'
import dashboard from "./dashboard.jpg"

export default function HomePage() {
  const heroRef = useRef(null)
  const mockupRef = useRef(null)
  const featureRef = useRef(null)
  const featureMockupRef = useRef(null)
  const statsRef = useRef(null)
  const floatingMockupRef = useRef(null)

  // Stats element refs
  const stat1 = useRef(null)
  const stat2 = useRef(null)
  const stat3 = useRef(null)
  const stat4 = useRef(null)


  useEffect(() => {
    gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2 })
    gsap.fromTo(mockupRef.current, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.5 })

    // Feature Section
    gsap.fromTo(featureRef.current, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1.3, scrollTrigger: featureRef.current
    })

    gsap.fromTo(featureMockupRef.current, { scale: 0.8, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1.2, scrollTrigger: featureRef.current
    })

    // Stats Count Animation
    const counters = [stat1, stat2, stat3, stat4]
    const targets = [1200, 980, 340, 2150]

    counters.forEach((el, i) => {
      gsap.fromTo(el, { innerText: 0 }, {
        innerText: targets[i],
        duration: 2,
        snap: 'innerText',
        scrollTrigger: statsRef.current
      })
    })

    // Floating Mockup
    gsap.to(floatingMockupRef.current, {
      y: -20,
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut"
    })
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#091536] via-[#11316d] to-[#5ebad4] ">

      <Navbar/>
      <section ref={heroRef} className="flex   px-16 py-30 gap-20">
        <div className="flex-1 z-2">
          <h1 className="text-6xl font-bold mb-9">
            Version your sound.<br />Control your creativity.
          </h1>
          <p className="text-white/80 max-w-xl text-lg mb-10">
            SYG DAW Logger is a powerful version control and collaboration platform for modern music producers.
          </p>
          <div className="flex gap-6">
            <button className="px-8 py-3 bg-white/20 rounded-full">Try it now</button>
            <button className="px-8 py-3 border border-white/30 rounded-full">Contact Sales</button>
          </div>
        </div>
  <div className="flex-1  " ref={mockupRef}>
          <div className="bg-white/10 border   border-white/20 rounded-3xl p-2 shadow-2xl">
            <Image
              src={dashboard}
              alt="DAW Dashboard Preview"
            
         width={710}
         height={900}
              className="rounded-3xl"
            />
          </div>
        </div>
      
      </section>

      <section
        ref={featureRef}
        className="px-16 py-32 grid lg:grid-cols-2 gap-20 items-center"
      >
        <div>
          <h2 className="text-5xl font-semibold mb-6">
            Why choose SYG DAW Logger?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            A next-generation versioning workflow built for modern music producers.
            Trusted by creators who value speed, workflow cleanliness, and real-time collaboration.
          </p>

          <ul className="space-y-4 text-white/80 text-lg">
            <li>✔ Incremental cloud versioning for huge DAW projects</li>
            <li>✔ Team collaboration with access roles</li>
            <li>✔ AI-driven project health & stem insights</li>
            <li>✔ Fast rollback, compare, and history tracking</li>
            <li>✔ Secure long-term archiving for professionals</li>
          </ul>
        </div>

        <div className="relative h-[360px]">
          <div ref={featureMockupRef}
            className="absolute inset-0 bg-white/5 border border-white/20 rounded-3xl shadow-xl backdrop-blur-xl"
          ></div>
        </div>
      </section>

      {/* Stats Section – GitHub Inspired */}
      <section
        ref={statsRef}
        className="px-16 py-28 text-center"
      >
        <h2 className="text-4xl font-bold mb-10">Built for scale</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col">
            <span className="text-5xl font-bold" id="stat1">0</span>
            <p className="text-white/60">Projects Stored</p>
          </div>

          <div className="flex flex-col">
            <span className="text-5xl font-bold" id="stat2">0</span>
            <p className="text-white/60">GB Optimized</p>
          </div>

          <div className="flex flex-col">
            <span className="text-5xl font-bold" id="stat3">0</span>
            <p className="text-white/60">Team Members</p>
          </div>

          <div className="flex flex-col">
            <span className="text-5xl font-bold" id="stat4">0</span>
            <p className="text-white/60">AI Insights Generated</p>
          </div>
        </div>
      </section>
  
      {/* Dashboard Mockup with Float Effect */}
      <section className="px-16 py-32">
        <div className="relative h-[500px]">
          <div
            ref={floatingMockupRef}
            className="absolute right-10 top-10 w-[480px] h-[320px] bg-white/10
                 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-xl"
          ></div>

          <h2 className="text-5xl font-semibold max-w-xl">
            A dashboard that keeps your workflow clean.
          </h2>
          <p className="text-white/70 max-w-lg mt-4 text-lg">
            Visualize project health, analyze stems, access versions instantly,
            and collaborate without friction.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-16 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Start creating confidently.</h2>
        <button className="px-10 py-4 bg-white/20 rounded-full text-lg">
          Get Started Free
        </button>
      </section>

    </div>
  )
}
