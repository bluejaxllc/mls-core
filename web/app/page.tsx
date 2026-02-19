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
            <nav className="relative z-50 flex items-center justify-between px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 md:h-4 md:w-4 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-base md:text-lg">BLUE JAX</span>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                    <Link href="/auth/signin" className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors">
                        Acceso Admin
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="bg-white text-black px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                        <span className="hidden sm:inline">ENTRAR AL SISTEMA</span>
                        <span className="sm:hidden">ENTRAR</span>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-12 md:pt-20 pb-16 md:pb-32 px-4 text-center max-w-5xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4 md:mb-6 inline-flex items-center gap-2 px-2.5 md:px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[9px] md:text-[10px] tracking-widest uppercase"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Sistema Activo v1.0
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-4 md:mb-6 bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent leading-tight"
                >
                    INTELIGENCIA <br />
                    MLS DESCENTRALIZADA
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-sm md:text-base lg:text-lg text-zinc-400 max-w-2xl mb-6 md:mb-10 leading-relaxed px-4"
                >
                    La infraestructura inmutable para el mercado inmobiliario de México.
                    Gestiona listados, verifica propiedad y automatiza la gobernanza con seguridad de nivel protocolo.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4"
                >
                    <Link
                        href="/auth/signin"
                        className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm md:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
                    >
                        Inicializar Sistema <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href="/whitepaper"
                        className="px-6 md:px-8 py-3 md:py-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg font-medium text-sm md:text-base transition-all flex items-center justify-center"
                    >
                        Leer Whitepaper
                    </Link>
                </motion.div>

            </main>

            {/* Features Grid */}
            <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto px-4 pb-12 md:pb-20">
                <FeatureCard
                    icon={ShieldCheck}
                    title="Gobernanza Automatizada"
                    desc="Reglas codificadas en lógica. Los listados se verifican automáticamente contra estándares estrictos de cumplimiento."
                    delay={0.8}
                />
                <FeatureCard
                    icon={Globe}
                    title="Sincronización de Mercado"
                    desc="Propagación de datos en tiempo real a través de la red. Fuente única de verdad para el estado de propiedades."
                    delay={0.9}
                />
                <FeatureCard
                    icon={Zap}
                    title="Verificación Instantánea"
                    desc="Arquitectura de confianza cero. Identidad y propiedad verificadas criptográficamente."
                    delay={1.0}
                />
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-10 text-center text-zinc-500 text-sm">
                <p>&copy; 2026 BLUE JAX CORE. Todos los sistemas operativos.</p>
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
            className="p-4 md:p-6 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm hover:border-blue-500/30 transition-colors group"
        >
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-blue-500/20 transition-colors">
                <Icon className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">{desc}</p>
        </motion.div>
    );
}
