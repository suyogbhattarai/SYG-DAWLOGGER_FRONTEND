'use client';

import React, { useEffect, useState } from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import Image from 'next/image'
import logo from '@/components/Navbar/logo.png'
import logolight from '@/components/Navbar/logolight.png'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
    setTheme(currentTheme)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
          setTheme(newTheme)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const services = [
    'Cloud Versioning',
    'Collaboration Tools',
    'AI Project Analysis',
    'Stem Management',
    'Disaster Recovery',
    'Plugin Analytics'
  ]

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Download', href: '/download' },
    { name: 'Contact', href: '/contact' },
    { name: 'Login', href: '/login' }
  ]

  return (
    <footer className="relative bg-[var(--surface)] border-t border-[var(--border)] text-[var(--foreground)]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-14 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Image
                src={theme === 'dark' ? logo : logolight}
                alt="Dawlogger"
                width={180}
                height={60}
                className="object-contain"
              />
            </div>
            <p className="text-[var(--foreground-muted)] text-sm leading-relaxed mb-6">
              The ultimate version control system for music producers. Secure, intelligent, and built for collaboration.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--surface-hover)] hover:bg-[#00f2ff] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <FaFacebookF className="text-[var(--foreground)] group-hover:text-black text-sm" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--surface-hover)] hover:bg-[#00f2ff] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <FaInstagram className="text-[var(--foreground)] group-hover:text-black text-sm" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--surface-hover)] hover:bg-[#00f2ff] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <FaTwitter className="text-[var(--foreground)] group-hover:text-black text-sm" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-[var(--surface-hover)] hover:bg-[#00f2ff] flex items-center justify-center transition-all duration-300 hover:scale-110 group"
              >
                <FaYoutube className="text-[var(--foreground)] group-hover:text-black text-sm" />
              </Link>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Features</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href="#"
                    className="text-[var(--foreground-muted)] hover:text-[#00f2ff] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-[var(--foreground-muted)] hover:text-[#00f2ff] transition-colors text-sm flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-[var(--foreground)]">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <FaEnvelope className="text-[#00f2ff] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[var(--foreground-muted)]">Email</p>
                  <a href="mailto:support@dawlogger.com" className="text-[var(--foreground)] font-medium hover:text-[#00f2ff] transition-colors break-all">
                    support@dawlogger.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <FaMapMarkerAlt className="text-[#00f2ff] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-[var(--foreground-muted)]">HQ</p>
                  <p className="text-[var(--foreground)] font-medium">
                    Los Angeles, CA
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 md:px-14 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--foreground-muted)] text-sm text-center md:text-left">
              © {currentYear} <span className="text-[#00f2ff] font-semibold">Dawlogger</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-[var(--foreground-muted)] hover:text-[#00f2ff] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[var(--foreground-muted)] hover:text-[#00f2ff] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent"></div>
    </footer>
  )
}