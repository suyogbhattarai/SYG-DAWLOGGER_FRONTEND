'use client';

import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import React, { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/utils/lib/redux/features/auth/authSlice';
import { AppDispatch, RootState } from '@/utils/lib/redux/Store';
import { useSearchParams } from 'next/navigation';
import { useToast, ToastContainer } from '@/components/Toast/Toast';
import { ButtonLoading } from '@/components/Loading/Loading';
import { Suspense } from 'react';

// Separate component to handle search params and main logic
function AuthContent() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loading, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [mounted, setMounted] = useState(false);

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [signupData, setSignupData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone_number: '',
    });

    const getRedirectPath = (role?: string) => {
        const redirect = searchParams.get('redirect');
        if (redirect && !redirect.includes('portfolio')) return redirect;
        return '/dashboard'; // All Dawlogs engineers go to the dashboard
    };

    useEffect(() => {
        setMounted(true);

        // Check for session expired param
        if (searchParams.get('sessionExpired') === 'true') {
            showError('Session expired. Please login again.');
            router.replace('/login');
        }

        if (isAuthenticated && user) {
            const path = getRedirectPath(user.role);
            router.push(path);
        }
    }, [isAuthenticated, user, router, searchParams]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#060918] relative overflow-hidden flex flex-col">
            <Navbar />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            {/* Background Decorative Elements */}
            <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#0695e0]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[20%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex-1 relative z-10 grid md:grid-cols-2 min-h-[calc(100vh-80px)]">
                {/* LEFT SIDE - IMMERSIVE BRANDING */}
                <div className="hidden md:flex flex-col items-end justify-start text-white relative overflow-hidden">
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0695e0]/10 to-transparent" />

                    <div className="w-full max-w-[960px] pt-32 lg:pt-40 pl-5 md:pl-10 lg:pl-15 pr-10 md:pr-20 lg:pr-32 relative z-10 space-y-10">
                        <div>
                            <div className="w-12 h-1 bg-[#0695e0] mb-10 rounded-full shadow-[0_0_20px_rgba(6,149,224,0.6)]" />
                            <h1 className="text-6xl lg:text-7xl font-black leading-[1] tracking-tighter mb-8 transition-all">
                                STUDIO <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0695e0] to-white/90">
                                    REVOLUTIONIZED
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-lg">
                                Dawlogs bridges the gap between creative inspiration and project security. Track every edit, sync every take.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'Seamless Versioning', desc: 'Secure recovery of project states.' },
                                { title: 'Global Sync', desc: 'Auto-sync across all studio locations.' },
                                { title: 'Collaborative Flow', desc: 'Real-time state sharing for teams.' }
                            ].map((feature, i) => (
                                <div key={i} className="flex gap-4 group cursor-default">
                                    <div className="mt-1 w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#0695e0]/40 group-hover:bg-[#0695e0]/10 transition-all">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#0695e0]" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-white group-hover:text-[#0695e0] transition-colors">{feature.title}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-10">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                {isLogin ? "Need a studio workspace?" : "Already an engineer?"}
                            </p>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="group/btn flex items-center gap-4 px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-black uppercase text-xs tracking-widest transition-all"
                            >
                                {isLogin ? 'Setup New Session' : 'Access Station'}
                                <span className="text-[#0695e0] group-hover/btn:translate-x-2 transition-transform">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Background Visual Logic */}
                    <div className="absolute bottom-10 right-10 opacity-[0.03] select-none pointer-events-none">
                        <svg width="600" height="300" viewBox="0 0 600 300">
                            {[...Array(20)].map((_, i) => (
                                <rect
                                    key={i}
                                    x={i * 30}
                                    y={150 - Math.random() * 100}
                                    width="10"
                                    height={50 + Math.random() * 150}
                                    fill="#0695e0"
                                    rx="5"
                                />
                            ))}
                        </svg>
                    </div>
                </div>

                {/* RIGHT SIDE - CLEAN AUTH PANEL */}
                <div className="flex flex-col items-start justify-start bg-[#080d26]/30">
                    <div className="w-full max-w-[960px] pt-32 lg:pt-48 pr-5 md:pr-10 lg:pr-15 pl-10 md:pl-20 lg:pl-32 relative z-10">
                        <div className="w-full max-w-[380px] space-y-10">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tight leading-none mb-3 uppercase">
                                    {isLogin ? 'Login' : 'Sign Up'}
                                </h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    {isLogin ? 'Access your session' : 'Create your workstation'}
                                </p>
                            </div>

                            {isLogin ? (
                                <div className="space-y-5">
                                    <Input icon={<FaUser />} placeholder="Studio Username" name="username"
                                        value={loginData.username}
                                        onChange={(e: any) => setLoginData({ ...loginData, username: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Access Password" name="password"
                                        value={loginData.password}
                                        onChange={(e: any) => setLoginData({ ...loginData, password: e.target.value })}
                                    />

                                    <div className="pt-6">
                                        <PrimaryButton loading={loading} text="Login" onClick={async () => {
                                            if (!loginData.username || !loginData.password) {
                                                showError('Enter credentials');
                                                return;
                                            }
                                            try {
                                                const res = await dispatch(loginUser(loginData)).unwrap();
                                                showSuccess('Session synchronized');
                                                setTimeout(() => router.push(getRedirectPath(res?.user?.role)), 1200);
                                            } catch (err: any) {
                                                showError(err || 'Auth failed');
                                            }
                                        }} />
                                        <div className="mt-8 flex justify-between items-center px-2">
                                            <button className="text-[10px] text-gray-500 font-bold uppercase tracking-widest hover:text-[#0695e0] transition">Forgot Key?</button>
                                            <button onClick={() => setIsLogin(false)} className="text-[10px] text-[#0695e0] font-black uppercase tracking-widest hover:underline">Register</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="First Name" name="first_name"
                                            value={signupData.first_name}
                                            onChange={(e: any) => setSignupData({ ...signupData, first_name: e.target.value })}
                                        />
                                        <Input placeholder="Last Name" name="last_name"
                                            value={signupData.last_name}
                                            onChange={(e: any) => setSignupData({ ...signupData, last_name: e.target.value })}
                                        />
                                    </div>

                                    <Input icon={<FaUser />} placeholder="Username" name="username"
                                        value={signupData.username}
                                        onChange={(e: any) => setSignupData({ ...signupData, username: e.target.value })}
                                    />
                                    <Input icon={<FaEnvelope />} placeholder="Email Address" name="email"
                                        value={signupData.email}
                                        onChange={(e: any) => setSignupData({ ...signupData, email: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Master Password" name="password"
                                        value={signupData.password}
                                        onChange={(e: any) => setSignupData({ ...signupData, password: e.target.value })}
                                    />
                                    <Input icon={<FaLock />} type="password" placeholder="Confirm Password" name="confirmPassword"
                                        value={signupData.confirmPassword}
                                        onChange={(e: any) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                    />

                                    <div className="pt-6">
                                        <PrimaryButton loading={loading} text="Initialize Session" onClick={async () => {
                                            if (signupData.password !== signupData.confirmPassword) {
                                                showError('Passwords do not match');
                                                return;
                                            }
                                            try {
                                                const res = await dispatch(registerUser({
                                                    username: signupData.username,
                                                    email: signupData.email,
                                                    password: signupData.password,
                                                    first_name: signupData.first_name,
                                                    last_name: signupData.last_name,
                                                })).unwrap();
                                                showSuccess('Session profile created');
                                                setTimeout(() => router.push(getRedirectPath(res?.user?.role)), 1200);
                                            } catch (err: any) {
                                                showError(err || 'Initialization failed');
                                            }
                                        }} />
                                        <p className="text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest pt-8">
                                            Already a member? <button onClick={() => setIsLogin(true)} className="text-[#0695e0] hover:underline ml-2">Sign In</button>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-[#060918]">Initializing Local Station...</div>}>
            <AuthContent />
        </Suspense>
    );
}

/* ---------- UI COMPONENTS ---------- */

function Input({ icon, ...props }: any) {
    return (
        <div className="relative group">
            {icon && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#0695e0] transition-colors">
                    {icon}
                </span>
            )}
            <input
                {...props}
                className={`w-full h-12 ${icon ? 'pl-11' : 'pl-5'
                    } pr-5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder-gray-600 focus:outline-none focus:border-[#0695e0]/50 focus:bg-white/[0.08] transition-all`}
            />
        </div>
    );
}

function PrimaryButton({ loading, text, onClick }: any) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-[#0695e0] text-white font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#0580c7] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-[0_10px_20px_-10px_rgba(6,149,224,0.6)]"
        >
            {loading ? <ButtonLoading text={text + '...'} /> : text}
        </button>
    );
}
