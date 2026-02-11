'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Lock, ArrowRight } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden relative font-sans">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-60"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-lg">BLUE JAX</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/auth/signin" className="text-sm text-zinc-400 hover:text-white transition-colors">
                        Admin Access
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                        ENTER PROTOCOL
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] tracking-widest uppercase"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    System Online v1.0
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent"
                >
                    DECENTRALIZED <br />
                    MLS INTELLIGENCE
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg text-zinc-400 max-w-2xl mb-10 leading-relaxed"
                >
                    The immutable infrastructure for Mexico's real estate market.
                    Manage listings, verify ownership, and automate governance with protocol-level security.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link
                        href="/auth/signin"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
                    >
                        Initialize System <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg font-medium transition-all flex items-center justify-center">
                        Read Whitepaper
                    </button>
                </motion.div>

            </main>

            {/* Features Grid */}
            <section className="relative z-10 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 pb-20">
                <FeatureCard
                    icon={ShieldCheck}
                    title="Automated Governance"
                    desc="Rules encoded in logic. Listings are verified against strict compliance standards automatically."
                    delay={0.8}
                />
                <FeatureCard
                    icon={Globe}
                    title="Market Synchronization"
                    desc="Real-time data propagation across the network. Single source of truth for property status."
                    delay={0.9}
                />
                <FeatureCard
                    icon={Zap}
                    title="Instant Verification"
                    desc="Zero-trust architecture. Identity and ownership verified cryptographically."
                    delay={1.0}
                />
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-10 text-center text-zinc-500 text-sm">
                <p>&copy; 2026 BLUE JAX CORE. All systems operational.</p>
            </footer>

        </div>
    );
}

function FeatureCard({ icon: Icon, title, desc, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay }}
            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-colors group"
        >
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Icon className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
