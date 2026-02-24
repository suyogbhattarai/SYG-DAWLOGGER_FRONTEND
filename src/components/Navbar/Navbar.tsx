'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from './logo.png'
import logolight from './logolight.png'
import ThemeToggle from './ThemeToggle'
import { useAppSelector, useAppDispatch } from '@/utils/lib/redux/Store'
import { logout } from '@/utils/lib/redux/features/auth/authSlice'

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
    variant?: 'default' | 'dashboard';
    readonly onMenuClick?: () => void;
    forceTransparent?: boolean;
}

function Navbar({ variant = 'default', onMenuClick, forceTransparent = false }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isSolidPage = pathname === '/dashboard' || pathname?.startsWith('/dashboard');

    const [navBg, setNavBg] = useState(forceTransparent ? 'transparent' : (isSolidPage ? 'var(--background)' : 'transparent'));
    const [textColor, setTextColor] = useState('white');
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        setMounted(true);
        const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
        setTheme(currentTheme);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileDropdownOpen(false);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Disable GSAP for dashboard mode
        if (variant === 'dashboard') return;
        if (!navRef.current) return;

        // Homepage - use original GSAP animations
        if (isHomePage) {
            let ctx = gsap.context(() => {
                ScrollTrigger.matchMedia({
                    "(min-width: 1025px)": function () {
                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '300px top',
                            onEnter: () => {
                                setTextColor('black');
                            },
                            onLeaveBack: () => {
                                setTextColor('white');
                            }
                        });

                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '1800px top',
                            onEnter: () => {
                                setNavBg('var(--background)');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'var(--background)',
                                    top: '0rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                });
                            },
                            onLeaveBack: () => {
                                setNavBg('transparent');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'transparent',
                                    top: '1rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                    boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                                });
                            }
                        });
                    },

                    "(min-width: 768px) and (max-width: 1025px)": function () {
                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '300px top',
                            onEnter: () => {
                                setTextColor('black');
                            },
                            onLeaveBack: () => {
                                setTextColor('white');
                            }
                        });

                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '1600px top',
                            onEnter: () => {
                                setNavBg('var(--background)');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'var(--background)',
                                    top: '0rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.25)'
                                });
                            },
                            onLeaveBack: () => {
                                setNavBg('transparent');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'transparent',
                                    top: '1rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                    boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                                });
                            }
                        });
                    },

                    "(max-width: 767px)": function () {
                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '200px top',
                            onEnter: () => {
                                setTextColor('black');
                            },
                            onLeaveBack: () => {
                                setTextColor('white');
                            }
                        });

                        ScrollTrigger.create({
                            trigger: 'body',
                            start: '1400px top',
                            onEnter: () => {
                                setNavBg('var(--background)');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'var(--background)',
                                    top: '0rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                });
                            },
                            onLeaveBack: () => {
                                setNavBg('transparent');
                                gsap.to(navRef.current, {
                                    backgroundColor: 'transparent',
                                    top: '1rem',
                                    duration: 0.3,
                                    ease: 'power2.out',
                                    boxShadow: '0 0px 0px rgba(0, 0, 0, 0)'
                                });
                            }
                        });
                    }
                });
            });

            return () => ctx.revert();
        }

        // Other pages - adaptive navbar based on scroll and background
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const sections = document.querySelectorAll('section');

            // Check which section is currently at the top
            let currentBg = 'transparent';
            let currentText = 'white';
            let foundSection = false;

            // 1. Detect section background for text color switching
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 150 && rect.bottom >= 150) {
                    foundSection = true;
                    const bgColor = window.getComputedStyle(section).backgroundColor;
                    if (bgColor.includes('rgb')) {
                        const rgb = bgColor.match(/\d+/g);
                        if (rgb) {
                            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
                            // If it's a light section, we could switch to dark text here if needed
                            // Text is white globally for now based on design
                        }
                    }
                }
            });

            // 2. Set background based on scroll threshold
            let threshold = 80;
            if (pathname === '/products' || pathname?.startsWith('/products')) {
                threshold = 600;
            }

            // Homepage background transition is handled purely by GSAP
            if (isHomePage) {
                return;
            }

            if (scrollY >= threshold) {
                currentBg = 'var(--background)';
            } else {
                currentBg = 'transparent';
            }

            // 3. Special overrides for specific pages
            if (pathname === '/about' || pathname?.startsWith('/about') ||
                pathname === '/services' || pathname?.startsWith('/services')) {
                currentBg = 'transparent';
            }

            if (isSolidPage) {
                currentBg = 'var(--background)';
            }

            setNavBg(currentBg);
            setTextColor(currentText);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [variant, isHomePage, pathname, isSolidPage]);

    const getNavStyles = () => {
        if (variant === 'dashboard') {
            return "fixed top-0 bg-[var(--surface)] border-b border-[var(--border)] h-20 flex items-center shadow-lg backdrop-blur-3xl";
        }
        if (isHomePage) {
            return "fixed lg:top-4 md:top-4 top-4";
        }
        // Other pages - top-0 when background active, top-4 when transparent
        return navBg === 'transparent' ? "fixed top-4" : "fixed top-0";
    };

    const getNavPadding = () => {
        return "";
    };

    const isAdmin = user?.role === 'admin' || user?.is_admin;
    const isStaff = user?.role === 'staff' || user?.is_staff;

    return (
        <>
            <nav
                ref={navRef}
                style={{ backgroundColor: variant === 'dashboard' ? 'transparent' : navBg }}
                className={`${getNavStyles()} left-0 right-0 w-full z-40 transition-all duration-500 ${navBg === 'transparent' ? '' : 'backdrop-blur-md shadow-sm'}`}
            >
                <div className={`w-full max-w-[1920px] mx-auto ${variant === 'dashboard' ? 'px-4 lg:px-6' : `lg:px-15 ${navBg === 'transparent' ? 'md:py-[1.4rem] py-[0.9rem]' : 'md:py-[0.9rem] py-[0.6rem]'} md:px-10 sm:px-5 px-5`}`}>
                    <div className="rounded-lg ">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center flex-shrink-0">
                                <div className="w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]">
                                    <Link href="/">
                                        <Image
                                            src={(theme === 'dark' || (navBg === 'transparent' && textColor === 'white')) ? logo : logolight}
                                            alt="Dawlogger Logo"
                                            className="object-contain w-full"
                                            priority
                                        />
                                    </Link>
                                </div>
                            </div>

                            {variant !== 'dashboard' && (
                                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                                    <a href="/features" className={`hover:text-[var(--accent)] transition text-sm xl:text-base whitespace-nowrap ${(navBg === 'transparent' && textColor === 'white') ? 'text-white' : 'text-[var(--foreground)]'} font-medium`}>Features</a>
                                    <a href="/pricing" className={`hover:text-[var(--accent)] transition text-sm xl:text-base whitespace-nowrap ${(navBg === 'transparent' && textColor === 'white') ? 'text-white' : 'text-[var(--foreground)]'} font-medium`}>Pricing</a>
                                    <a href="/download" className={`hover:text-[var(--accent)] transition text-sm xl:text-base whitespace-nowrap ${(navBg === 'transparent' && textColor === 'white') ? 'text-white' : 'text-[var(--foreground)]'} font-medium`}>Download</a>
                                    <a href="/about" className={`hover:text-[var(--accent)] transition text-sm xl:text-base whitespace-nowrap ${(navBg === 'transparent' && textColor === 'white') ? 'text-white' : 'text-[var(--foreground)]'} font-medium`}>About</a>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <ThemeToggle forceWhite={navBg === 'transparent' && textColor === 'white'} />
                                {!mounted ? (
                                    <div className="w-24 h-9 rounded-full bg-[var(--surface-hover)] animate-pulse"></div>
                                ) : isAuthenticated ? (
                                    <div className="flex items-center gap-4">
                                        {variant !== 'dashboard' && (
                                            <Link href="/dashboard" className="bg-[var(--accent)] px-4 xl:px-6 py-2 rounded-full font-black text-white hover:opacity-90 transition text-sm xl:text-base shadow-[0_0_15px_var(--accent-glow)]">
                                                Dashboard
                                            </Link>
                                        )}
                                        <div className="relative" ref={profileDropdownRef}>
                                            <button
                                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                                className="flex items-center gap-2 hover:opacity-80 transition"
                                            >
                                                <div className="w-9 h-9 rounded-full bg-[var(--surface-hover)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
                                                    {user?.profile_picture ? (
                                                        <Image
                                                            src={user.profile_picture}
                                                            alt={user.username}
                                                            width={36}
                                                            height={36}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-[var(--accent)] text-white font-bold text-sm">
                                                            {user?.username?.[0]?.toUpperCase() || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <svg className={`w-4 h-4 ${navBg === 'transparent' && textColor === 'white' ? 'text-white' : 'text-[var(--foreground)]'} transition ${isProfileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            </button>

                                            {isProfileDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-48 bg-[var(--surface)] rounded-lg shadow-2xl border border-[var(--border)] py-2 z-50 backdrop-blur-3xl overflow-hidden">
                                                    <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-hover)]">
                                                        <p className="font-bold text-[var(--foreground)] truncate text-sm">{user?.username}</p>
                                                        <p className="text-[10px] text-[var(--foreground-muted)] truncate">{user?.email}</p>
                                                        <p className="text-[9px] text-[var(--accent)] mt-1.5 font-black uppercase tracking-[0.2em]">{user?.role || 'Engineer'}</p>
                                                    </div>
                                                    <Link
                                                        href="/profile"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="block px-4 py-2 text-sm text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition"
                                                    >
                                                        My Profile
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : loading ? (
                                    <div className="w-9 h-9 rounded-full bg-[var(--surface-hover)] animate-pulse border border-[var(--border)]"></div>
                                ) : (
                                    <Link href="/login" className="bg-[var(--accent)] px-8 py-2.5 rounded-full font-black text-white hover:opacity-90 transition text-base shadow-[0_0_20px_var(--accent-glow)]" onClick={() => setIsOpen(false)}>Get Started</Link>
                                )}

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={`lg:hidden p-2 rounded-xl transition-all duration-300 ${navBg === 'transparent' && textColor === 'white' ? 'text-white' : 'text-[var(--foreground)]'} hover:bg-[var(--surface-hover)]`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                        )}
                                    </svg>
                                </button>
                            </div>

                        </div>

                        {/* Mobile Menu Content */}
                        <div
                            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="flex flex-col items-center gap-3 py-6 bg-[var(--surface)]/80 backdrop-blur-xl rounded-2xl border border-[var(--border)] mb-4">
                                <a href="/features" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>Features</a>
                                <a href="/pricing" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>Pricing</a>
                                <a href="/download" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>Download</a>
                                <a href="/about" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>About</a>

                                {!mounted ? (
                                    <div className="w-32 h-6 bg-[var(--surface-hover)] animate-pulse rounded-full my-2"></div>
                                ) : isAuthenticated ? (
                                    <>
                                        <div className="w-full h-[1px] bg-[var(--border)] my-2" />
                                        <Link href="/dashboard" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>
                                            Dashboard
                                        </Link>
                                        <Link href="/profile" className="hover:text-[var(--accent)] transition text-base font-bold text-[var(--foreground)]" onClick={() => setIsOpen(false)}>
                                            My Profile
                                        </Link>
                                        <button onClick={() => { handleLogout(); }} className="hover:text-[var(--accent)] transition text-base font-bold text-red-400">
                                            Logout
                                        </button>
                                    </>
                                ) : loading ? (
                                    <div className="w-8 h-8 rounded-full bg-[var(--surface-hover)] animate-pulse border border-[var(--border)] my-2"></div>
                                ) : (
                                    <Link href="/login" className="w-[80%] text-center bg-[var(--accent)] text-white px-6 py-3 rounded-full font-black hover:opacity-90 transition text-base mt-4 shadow-lg shadow-[var(--accent-glow)]" onClick={() => setIsOpen(false)}>Get Started</Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
