'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Scale, FileSearch, ArrowRight, AlertTriangle, ChevronRight, Lock, Eye, Gavel, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
});

export default function LandingPage() {
    const [formData, setFormData] = useState({
        brokerName: '',
        volume: '',
        problem: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Auto-detect: dark mode after 7pm and before 7am
        const hour = new Date().getHours();
        const shouldBeDark = hour >= 19 || hour < 7;
        setIsDark(shouldBeDark);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } catch (err) {
            console.error('Submission failed:', err);
        }
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0a0a] text-slate-900 dark:text-white selection:bg-blue-500/30 overflow-hidden relative transition-colors duration-500">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-[#f0f2f5] to-[#e8eaed] dark:from-blue-950/20 dark:via-[#0a0a0a] dark:to-[#0a0a0a] transition-colors duration-500"></div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(100,100,100,0.1) 50px),
                                          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(100,100,100,0.1) 50px)`
                    }}
                ></div>
                {/* Scanline effect */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(100,100,100,0.05) 2px, transparent 3px)`,
                        backgroundSize: '100% 3px'
                    }}
                ></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 md:h-4 md:w-4 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-base md:text-lg font-mono">BLUE JAX</span>
                    <span className="text-slate-500 dark:text-zinc-600 text-xs font-mono hidden sm:inline">/ MLS</span>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                    <Link href="/whitepaper" className="hidden sm:block text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors font-mono uppercase tracking-wider">
                        Whitepaper
                    </Link>
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all duration-300 group"
                        aria-label="Cambiar tema"
                    >
                        {isDark ? (
                            <Sun className="h-4 w-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
                        ) : (
                            <Moon className="h-4 w-4 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
                        )}
                    </button>
                    <Link
                        href="/auth/signin"
                        className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black px-3 md:px-4 py-1.5 md:py-2 rounded text-[10px] md:text-xs font-bold dark:hover:bg-zinc-200 transition-colors flex items-center gap-2 font-mono uppercase tracking-wider"
                    >
                        Acceso
                    </Link>
                </div>
            </nav>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 1: HERO — EL GOLPE DE AUTORIDAD
            ══════════════════════════════════════════════════════════════ */}
            <main className="relative z-10 flex flex-col items-center justify-center pt-16 md:pt-28 pb-20 md:pb-40 px-4 text-center max-w-5xl mx-auto">

                {/* Pre-título monoespaciado */}
                <motion.div {...fadeUp(0)} className="mb-6 md:mb-8">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-slate-600 dark:text-zinc-500 uppercase border border-slate-300 dark:border-zinc-800 px-4 py-2 rounded bg-white/70 dark:bg-transparent backdrop-blur-sm">
                        Sistema de Registro y Gobernanza Inmobiliaria
                    </span>
                </motion.div>

                {/* Título Principal */}
                <motion.h1
                    {...fadeUp(0.15)}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-[-0.04em] mb-6 md:mb-8 leading-[0.9] max-w-4xl"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                    <span className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-zinc-600 bg-clip-text text-transparent">
                        La Verdad{' '}
                    </span>
                    <span className="bg-gradient-to-b from-slate-800 via-slate-700 to-slate-500 dark:from-white dark:via-zinc-200 dark:to-zinc-600 bg-clip-text text-transparent">
                        Compartida
                    </span>
                    <br />
                    <span className="bg-gradient-to-b from-blue-700 via-blue-600 to-slate-500 dark:from-zinc-300 dark:via-zinc-400 dark:to-zinc-700 bg-clip-text text-transparent">
                        del Mercado Inmobiliario.
                    </span>
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    {...fadeUp(0.3)}
                    className="text-sm md:text-base lg:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mb-8 md:mb-10 leading-relaxed px-4"
                >
                    La MLS es un sistema de registro de broker a broker cuya función principal es establecer la{' '}
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">integridad de los datos</span>, la{' '}
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">gobernanza</span> y la{' '}
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">coordinación justa del mercado</span>.
                </motion.p>

                {/* Advertencia */}
                <motion.div
                    {...fadeUp(0.4)}
                    className="mb-10 md:mb-14 flex items-center gap-3 px-4 md:px-6 py-3 rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/30 max-w-xl shadow-sm dark:shadow-none"
                >
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <p className="text-xs md:text-sm text-blue-700 dark:text-blue-400 font-medium text-left">
                        La MLS no es un mercado de consumidores ni un portal de generación de leads.
                    </p>
                </motion.div>

                {/* CTAs */}
                <motion.div
                    {...fadeUp(0.5)}
                    className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4"
                >
                    <a
                        href="#aplicar"
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-slate-900 text-white dark:bg-white dark:text-black rounded-lg font-bold text-sm md:text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-md dark:shadow-[0_0_60px_-10px_rgba(255,255,255,0.15)] hover:bg-slate-800"
                    >
                        Aplicar a la Mesa de Gobernanza Local <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                        href="/whitepaper"
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-white dark:bg-transparent border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 text-slate-700 dark:text-zinc-300 rounded-lg font-medium text-sm md:text-base transition-all flex items-center justify-center shadow-sm dark:shadow-none hover:bg-slate-50"
                    >
                        Leer la Constitución del Mercado
                    </Link>
                </motion.div>
            </main>

            {/* Divider */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent"></div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 2: LA REALIDAD OPERATIVA — EL DOLOR
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-5xl mx-auto">
                <motion.div {...fadeUp(0)} className="mb-3">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-600 dark:text-blue-500/80 uppercase">
                        // diagnóstico
                    </span>
                </motion.div>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-8 md:mb-10 leading-tight text-slate-900 dark:text-white"
                >
                    Diseñado para Condiciones{' '}
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                        de Datos Hostiles.
                    </span>
                </motion.h2>

                <motion.p
                    {...fadeUp(0.2)}
                    className="text-base md:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl"
                >
                    El mercado actual está fracturado por el{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">robo de exclusivas</span>,{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">información basura</span> y{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">disputas informales</span>.
                    La MLS asume condiciones de datos hostiles y diseña para las disputas.
                    Reemplazamos las peleas entre agencias con una{' '}
                    <span className="text-slate-900 dark:text-white font-medium">arquitectura de software auditable</span>.
                </motion.p>

                {/* Hostile metrics — premium cards */}
                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {[
                        { value: '73%', label: 'Duplicación de listados en portales públicos', color: 'blue', delay: 0.3 },
                        { value: '0', label: 'Cero tolerancia a datos no verificados', color: 'cyan', delay: 0.4 },
                        { value: '24/7', label: 'Monitoreo automatizado de infracciones', color: 'indigo', delay: 0.5 },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            {...fadeUp(stat.delay)}
                            className={`relative overflow-hidden rounded-xl p-6 md:p-8 border text-center group hover:scale-[1.02] transition-all duration-500
                                bg-white/80 shadow-sm
                                dark:bg-[#111318] dark:shadow-none
                                ${stat.color === 'blue' ? 'border-blue-200 hover:border-blue-400 dark:border-blue-500/20 dark:hover:border-blue-400/40' : ''}
                                ${stat.color === 'cyan' ? 'border-cyan-200 hover:border-cyan-400 dark:border-cyan-500/20 dark:hover:border-cyan-400/40' : ''}
                                ${stat.color === 'indigo' ? 'border-indigo-200 hover:border-indigo-400 dark:border-indigo-500/20 dark:hover:border-indigo-400/40' : ''}
                            `}
                        >
                            {/* Colored inner glow for dark mode */}
                            <div className={`absolute inset-0 opacity-0 dark:opacity-100 transition-opacity
                                ${stat.color === 'blue' ? 'bg-gradient-to-br from-blue-500/[0.07] via-transparent to-blue-900/[0.05]' : ''}
                                ${stat.color === 'cyan' ? 'bg-gradient-to-br from-cyan-500/[0.07] via-transparent to-cyan-900/[0.05]' : ''}
                                ${stat.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500/[0.07] via-transparent to-indigo-900/[0.05]' : ''}
                            `}></div>
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500
                                ${stat.color === 'blue' ? 'via-blue-300 dark:via-blue-400/50 group-hover:via-blue-500 group-hover:w-32' : ''}
                                ${stat.color === 'cyan' ? 'via-cyan-300 dark:via-cyan-400/50 group-hover:via-cyan-500 group-hover:w-32' : ''}
                                ${stat.color === 'indigo' ? 'via-indigo-300 dark:via-indigo-400/50 group-hover:via-indigo-500 group-hover:w-32' : ''}
                            `}></div>
                            <div className={`relative z-10 text-3xl md:text-5xl font-black font-mono mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-b
                                ${stat.color === 'blue' ? 'from-blue-600 to-blue-800 dark:from-blue-300 dark:to-blue-500' : ''}
                                ${stat.color === 'cyan' ? 'from-cyan-600 to-cyan-800 dark:from-cyan-300 dark:to-cyan-500' : ''}
                                ${stat.color === 'indigo' ? 'from-indigo-600 to-indigo-800 dark:from-indigo-300 dark:to-indigo-500' : ''}
                            `}>{stat.value}</div>
                            <div className="relative z-10 text-[10px] md:text-xs text-slate-500 dark:text-zinc-400 leading-tight">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Animated Divider */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800/30 to-transparent"></div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 3: LOS PILARES DEL SISTEMA
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-7xl mx-auto">
                <motion.div {...fadeUp(0)} className="text-center mb-16 md:mb-20">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-slate-600 dark:text-zinc-600 uppercase block mb-4">
                        // arquitectura del sistema
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                        Tres Pilares.{' '}
                        <span className="text-slate-400 dark:text-zinc-500">Cero Ambigüedad.</span>
                    </h2>
                </motion.div>

                {/* 3-Column Premium Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Pilar 1 */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="relative overflow-hidden rounded-2xl border p-8 md:p-10 group transition-all duration-500 bg-white/80 border-blue-200 hover:border-blue-400 shadow-sm dark:shadow-none dark:border-blue-500/10 dark:bg-gradient-to-br dark:from-blue-950/40 dark:via-zinc-900/60 dark:to-zinc-900/40 dark:hover:border-blue-500/25"
                    >
                        {/* Watermark Number */}
                        <div className="absolute -right-4 -top-6 text-[120px] font-black leading-none select-none pointer-events-none text-slate-100 dark:text-blue-500/[0.04]">01</div>
                        {/* Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-500/40 to-transparent group-hover:via-blue-500 dark:group-hover:via-blue-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 bg-blue-50 border-blue-100 group-hover:bg-blue-100 group-hover:border-blue-200 dark:bg-blue-500/10 border dark:border-blue-500/20 dark:group-hover:bg-blue-500/15 dark:group-hover:border-blue-500/30 dark:group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                                <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase block mb-4 text-blue-600 dark:text-blue-500/60">Pilar 01</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">
                                Motor de Gobernanza{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">Implacable</span>
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-500">
                                La gobernanza se hace cumplir a través de un motor de reglas, no a discreción humana.
                                Todo es <span className="text-slate-900 dark:text-zinc-300 font-medium">determinista</span>,{' '}
                                <span className="text-slate-900 dark:text-zinc-300 font-medium">transparente</span> y{' '}
                                <span className="text-slate-900 dark:text-zinc-300 font-medium">auditable</span>.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pilar 2 */}
                    <motion.div
                        {...fadeUp(0.2)}
                        className="relative overflow-hidden rounded-2xl border p-8 md:p-10 group transition-all duration-500 bg-white/80 border-cyan-200 hover:border-cyan-400 shadow-sm dark:shadow-none dark:border-cyan-500/10 dark:bg-gradient-to-br dark:from-cyan-950/40 dark:via-zinc-900/60 dark:to-zinc-900/40 dark:hover:border-cyan-500/25"
                    >
                        <div className="absolute -right-4 -top-6 text-[120px] font-black leading-none select-none pointer-events-none text-slate-100 dark:text-cyan-500/[0.04]">02</div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-300 dark:via-cyan-500/40 to-transparent group-hover:via-cyan-500 dark:group-hover:via-cyan-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-100 group-hover:border-cyan-200 dark:bg-cyan-500/10 border dark:border-cyan-500/20 dark:group-hover:bg-cyan-500/15 dark:group-hover:border-cyan-500/30 dark:group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
                                <Database className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase block mb-4 text-cyan-600 dark:text-cyan-500/60">Pilar 02</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">
                                Jerarquía de Datos{' '}
                                <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 dark:from-cyan-400 dark:to-cyan-300 bg-clip-text text-transparent">Canónicos</span>
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-500">
                                Los listados son versionados, nunca sobrescritos. Aplicamos una regla estricta: los datos enviados
                                por los brokers <span className="text-slate-900 dark:text-zinc-300 font-medium">siempre superan</span> a los datos extraídos de la web.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pilar 3 */}
                    <motion.div
                        {...fadeUp(0.3)}
                        className="relative overflow-hidden rounded-2xl border p-8 md:p-10 group transition-all duration-500 bg-white/80 border-indigo-200 hover:border-indigo-400 shadow-sm dark:shadow-none dark:border-indigo-500/10 dark:bg-gradient-to-br dark:from-indigo-950/40 dark:via-zinc-900/60 dark:to-zinc-900/40 dark:hover:border-indigo-500/25"
                    >
                        <div className="absolute -right-4 -top-6 text-[120px] font-black leading-none select-none pointer-events-none text-slate-100 dark:text-indigo-500/[0.04]">03</div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-500/40 to-transparent group-hover:via-indigo-500 dark:group-hover:via-indigo-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100 group-hover:border-indigo-200 dark:bg-indigo-500/10 border dark:border-indigo-500/20 dark:group-hover:bg-indigo-500/15 dark:group-hover:border-indigo-500/30 dark:group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
                                <Scale className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-mono tracking-[0.25em] uppercase block mb-4 text-indigo-600 dark:text-indigo-500/60">Pilar 03</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight text-slate-900 dark:text-white">
                                Resolución de Conflictos{' '}
                                <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">Automatizada</span>
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-500">
                                Reemplazamos las disputas informales entre brokers con una resolución estructurada.
                                Un sistema formal de reclamaciones maneja automáticamente{' '}
                                <span className="text-slate-900 dark:text-zinc-300 font-medium">listados competidores</span> y{' '}
                                <span className="text-slate-900 dark:text-zinc-300 font-medium">disputas de exclusividad</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 4: RED DE CONFIANZA — AGENTES Y BROKERS
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-7xl mx-auto">
                <motion.div {...fadeUp(0)} className="text-center mb-16 md:mb-20">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-emerald-600 dark:text-emerald-500/80 uppercase block mb-4">
                        // ecosistema operativo
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] text-slate-900 dark:text-white">
                        Cómo Interactúan{' '}
                        <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            Brokers y Agentes.
                        </span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Visual representation */}
                    <motion.div {...fadeUp(0.1)} className="relative h-full min-h-[400px] rounded-2xl border bg-white/80 border-emerald-200 shadow-sm dark:shadow-none dark:border-emerald-500/10 dark:bg-gradient-to-br dark:from-emerald-950/20 dark:via-zinc-900/60 dark:to-zinc-900/40 p-8 flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-500/40 to-transparent"></div>

                        {/* Broker A & B Connection */}
                        <div className="flex justify-between w-full max-w-md items-center mb-16 relative">
                            {/* Connection line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-emerald-300 to-cyan-300 dark:from-blue-500/50 dark:via-emerald-500/50 dark:to-cyan-500/50 -translate-y-1/2 overflow-hidden">
                                <motion.div
                                    className="w-full h-full bg-gradient-to-r from-transparent via-white dark:via-white opacity-50"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-16 w-16 rounded-xl bg-blue-50 border-blue-200 dark:bg-blue-950 border dark:border-blue-500/30 flex items-center justify-center mb-3 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                                    <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-bold text-sm bg-blue-100 text-blue-800 dark:bg-blue-400 dark:text-blue-950 px-2 pl-2 rounded">Broker A</span>
                            </div>

                            <div className="relative z-10 bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-500/30 px-4 py-2 rounded-full shadow-sm dark:shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
                                <span className="text-[10px] md:text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">CO-BROKERAGE</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="h-16 w-16 rounded-xl bg-cyan-50 border-cyan-200 dark:bg-cyan-950 border dark:border-cyan-500/30 flex items-center justify-center mb-3 shadow-sm dark:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
                                    <ShieldCheck className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                                </div>
                                <span className="font-bold text-sm bg-cyan-100 text-cyan-800 dark:bg-cyan-400 dark:text-cyan-950 px-2 rounded">Broker B</span>
                            </div>
                        </div>

                        {/* Agents showing hierarchy */}
                        <div className="w-full max-w-sm flex justify-between absolute bottom-12 px-6">
                            <div className="flex flex-col items-center relative">
                                <div className="h-20 w-px bg-blue-200 dark:bg-blue-500/30 absolute bottom-10"></div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 border-blue-200 dark:bg-zinc-800 border dark:border-blue-500/30 flex items-center justify-center z-10">
                                    <div className="h-4 w-4 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">Agentes</span>
                            </div>

                            <div className="flex flex-col items-center relative">
                                <div className="h-20 w-px bg-cyan-200 dark:bg-cyan-500/30 absolute bottom-10"></div>
                                <div className="h-10 w-10 rounded-full bg-slate-100 border-cyan-200 dark:bg-zinc-800 border dark:border-cyan-500/30 flex items-center justify-center z-10">
                                    <div className="h-4 w-4 bg-cyan-500 dark:bg-cyan-400 rounded-full"></div>
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">Agentes</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text content */}
                    <div className="space-y-8 md:pl-4">
                        <motion.div {...fadeUp(0.2)} className="border-l-2 border-emerald-300 dark:border-emerald-500/30 pl-5">
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Los Agentes (Asesores)</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Operan bajo el paraguas de su <span className="text-slate-900 dark:text-white font-medium">Broker</span>.
                                Utilizan la plataforma para subir listados, buscar propiedades para sus clientes,
                                y gestionar prospectos. Cada acción de un agente está vinculada a su agencia, garantizando que
                                <span className="text-emerald-700 dark:text-emerald-400 font-medium"> la exclusividad y las comisiones siempre les pertenezcan a ellos</span>.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp(0.3)} className="border-l-2 border-blue-300 dark:border-blue-500/30 pl-5">
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Los Brokers (Agencias)</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Son los titulares de las exclusivas y los directores de orquesta.
                                Los brokers invitan a sus agentes, supervisan el inventario de su equipo, y participan en la Gobernanza. Tienen visibilidad total sobre las operaciones de su agencia.
                            </p>
                        </motion.div>

                        <motion.div {...fadeUp(0.4)} className="border-l-2 border-cyan-300 dark:border-cyan-500/30 pl-5">
                            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Interacción Broker a Broker</h3>
                            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                Si un agente del <span className="text-blue-700 dark:text-blue-400 font-medium">Broker A</span> tiene una propiedad, y un agente del <span className="text-cyan-700 dark:text-cyan-400 font-medium">Broker B</span> tiene al comprador, la MLS coordina el cierre cruzado. Las reglas de comisión se establecen <span className="text-slate-900 dark:text-white font-medium">por sistema</span> desde el inicio, mitigando riesgos de disputas.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Animated Divider */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-800/30 to-transparent"></div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 5: AUDITORÍA Y PROTECCIÓN LEGAL
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative overflow-hidden border rounded-2xl bg-white/80 border-blue-200 shadow-xl dark:shadow-none dark:border-blue-500/10 dark:bg-gradient-to-br dark:from-blue-950/20 dark:via-zinc-900/60 dark:to-zinc-900/40">
                        {/* Top glow */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-500/30 to-transparent"></div>
                        {/* Watermark */}
                        <div className="absolute -right-8 -top-12 text-[200px] font-black leading-none select-none pointer-events-none text-slate-100 dark:text-blue-500/[0.02]">§</div>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left: Content */}
                            <div className="p-8 md:p-12 lg:p-16">
                                <motion.div {...fadeUp(0)}>
                                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-600 dark:text-blue-500/60 uppercase block mb-4">
                                        // protección legal
                                    </span>
                                </motion.div>

                                <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-8 leading-tight text-slate-900 dark:text-white">
                                    Trazabilidad{' '}
                                    <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                        Absoluta.
                                    </span>
                                </motion.h2>

                                <motion.p {...fadeUp(0.2)} className="text-base md:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-10">
                                    Cada decisión en la MLS es explicable, registrada y atribuible.
                                    El sistema registra{' '}
                                    <span className="text-slate-900 dark:text-white font-medium">quién</span> realizó la acción,{' '}
                                    <span className="text-slate-900 dark:text-white font-medium">qué</span> cambió,{' '}
                                    <span className="text-blue-700 dark:text-blue-300 font-medium">por qué</span> cambió y{' '}
                                    <span className="text-blue-700 dark:text-blue-300 font-medium">qué reglas se activaron</span>,
                                    haciéndolo apto para revisión regulatoria y disputas legales.
                                </motion.p>
                            </div>

                            {/* Right: Visual audit trail */}
                            <div className="p-8 md:p-12 lg:p-16 border-t md:border-t-0 md:border-l border-slate-300 dark:border-blue-500/10 flex flex-col justify-center">
                                <div className="space-y-3">
                                    {[
                                        { icon: Eye, label: 'Quién', desc: 'Identidad verificada del actor', color: 'emerald', delay: 0.2 },
                                        { icon: FileSearch, label: 'Qué (El "Diff")', desc: 'Comparación exacta del antes y el después', color: 'cyan', delay: 0.3 },
                                        { icon: Gavel, label: 'Por Qué', desc: 'Regla de gobernanza que se activó', color: 'blue', delay: 0.4 },
                                        { icon: Lock, label: 'Inmutable', desc: 'Registro blindado contra manipulación', color: 'indigo', delay: 0.5 },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            {...fadeUp(item.delay)}
                                            className={`flex items-start gap-4 p-4 rounded-xl border group transition-all duration-500 hover:scale-[1.02] bg-white/80 dark:bg-transparent shadow-sm dark:shadow-none
                                                ${item.color === 'emerald' ? 'border-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-500/10 dark:hover:border-emerald-500/25 dark:hover:bg-emerald-950/30' : ''}
                                                ${item.color === 'cyan' ? 'border-cyan-100 hover:border-cyan-300 dark:bg-cyan-950/20 dark:border-cyan-500/10 dark:hover:border-cyan-500/25 dark:hover:bg-cyan-950/30' : ''}
                                                ${item.color === 'blue' ? 'border-blue-100 hover:border-blue-300 dark:bg-blue-950/20 dark:border-blue-500/10 dark:hover:border-blue-500/25 dark:hover:bg-blue-950/30' : ''}
                                                ${item.color === 'indigo' ? 'border-indigo-100 hover:border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-500/10 dark:hover:border-indigo-500/25 dark:hover:bg-indigo-950/30' : ''}
                                            `}
                                        >
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                                                ${item.color === 'emerald' ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:group-hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]' : ''}
                                                ${item.color === 'cyan' ? 'bg-cyan-50 border border-cyan-200 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' : ''}
                                                ${item.color === 'blue' ? 'bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20 dark:group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]' : ''}
                                                ${item.color === 'indigo' ? 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' : ''}
                                            `}>
                                                <item.icon className={`h-5 w-5
                                                    ${item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : ''}
                                                    ${item.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : ''}
                                                    ${item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : ''}
                                                    ${item.color === 'indigo' ? 'text-indigo-600 dark:text-indigo-400' : ''}
                                                `} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{item.label}</div>
                                                <div className="text-xs text-slate-500 dark:text-zinc-500">{item.desc}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 5: PARA EL ASESOR — REGLAS DEL JUEGO
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-7xl mx-auto">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800/20 to-transparent"></div>

                <motion.div {...fadeUp(0)} className="text-center mb-16 md:mb-20 pt-8">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-slate-500 dark:text-zinc-500 uppercase block mb-4">
                        // manual del operador
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-6 text-slate-900 dark:text-white">
                        Para el Asesor <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">Diferenciado.</span>
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        La MLS es tu principal herramienta productiva. Establece las reglas claras de cómo operas, con quién interactúas y qué se espera de ti.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {/* Beneficios */}
                    <motion.div {...fadeUp(0.1)} className="bg-white/80 border-slate-300 shadow-sm dark:bg-zinc-900/40 border dark:border-zinc-800 p-8 rounded-2xl hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-colors group">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Los Beneficios</h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                            <strong className="text-slate-900 dark:text-zinc-200">Inventario real y auditado.</strong> No más perder el tiempo llamando para verificar si una propiedad sigue disponible. Si está activa en la MLS, el listar broker la tiene lista para venta compartida inmediata. Tú te enfocas en cerrar tratos, no en cazar datos fantasmas.
                        </p>
                    </motion.div>

                    {/* Interacciones */}
                    <motion.div {...fadeUp(0.2)} className="bg-white/80 border-slate-300 shadow-sm dark:bg-zinc-900/40 border dark:border-zinc-800 p-8 rounded-2xl hover:border-blue-400 dark:hover:border-blue-500/30 transition-colors group">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Las Interacciones</h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                            <strong className="text-slate-900 dark:text-zinc-200">Colaboración sin fricción.</strong> El proceso de identidad elimina las barreras de confianza inicial. Todo contacto inter-agencia se realiza a través de perfiles verificados y criptográficamente sellados, garantizando la división justa de comisiones pactada de antemano.
                        </p>
                    </motion.div>

                    {/* Expectativas */}
                    <motion.div {...fadeUp(0.3)} className="bg-white/80 border-slate-300 shadow-sm dark:bg-zinc-900/40 border dark:border-zinc-800 p-8 rounded-2xl hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-colors group">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Las Expectativas</h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                            <strong className="text-slate-900 dark:text-zinc-200">Profesionalismo radical.</strong> La calidad de los datos es la moneda de cambio de la red. Se exige fotografía profesional, polígonos GPS precisos, documentación soporte obligatoria, actualización de estatus en tiempo real y comunicación protocolar entre miembros.
                        </p>
                    </motion.div>

                    {/* Reglas del Juego */}
                    <motion.div {...fadeUp(0.4)} className="bg-white/80 border-slate-300 shadow-sm dark:bg-zinc-900/40 border dark:border-zinc-800 p-8 rounded-2xl hover:border-red-400 dark:hover:border-red-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 dark:bg-red-500/[0.03] rounded-full blur-3xl"></div>
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 mb-6 group-hover:scale-110 transition-transform relative z-10">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white relative z-10">Las Reglas del Juego</h3>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed relative z-10">
                            <strong className="text-slate-900 dark:text-zinc-200">0% tolerancia a engaños y piratería.</strong> Quien sube listados no exclusivos falsamente, intenta desviar leads (clientes) de colegas al momento de mostrar propiedades, omite el pago de splits acordados, o altera datos geográficos es congelado y expulsado por el sistema de forma inmediata.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 6: CTA FINAL — EL FILTRO
            ══════════════════════════════════════════════════════════════ */}
            <section id="aplicar" className="relative z-10 py-24 md:py-32 px-4 max-w-4xl mx-auto">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800/20 to-transparent"></div>
                <motion.div {...fadeUp(0)} className="text-center mb-4 pt-8">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-slate-500 dark:text-blue-500/60 uppercase">
                        // acceso restringido
                    </span>
                </motion.div>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-6 md:mb-8 text-center leading-tight text-slate-900 dark:text-white"
                >
                    El Mercado se Controla,{' '}
                    <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-slate-500 to-slate-700 dark:from-zinc-400 dark:to-zinc-600 bg-clip-text text-transparent">No se Ruega.</span>
                </motion.h2>

                <motion.p
                    {...fadeUp(0.2)}
                    className="text-base md:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed text-center max-w-2xl mx-auto mb-14"
                >
                    El acceso a la capa base de la MLS está estrictamente limitado a brokers con{' '}
                    <span className="text-slate-900 dark:text-zinc-200 font-medium">volumen comprobable</span>{' '}
                    que busquen proteger su inventario. El sistema optimiza para la confianza, la equidad y
                    la legitimidad a largo plazo, no para el crecimiento desmedido.
                </motion.p>

                {/* Application Form — Premium Card */}
                <motion.div {...fadeUp(0.3)}>
                    {submitted ? (
                        <div className="relative overflow-hidden border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 rounded-2xl dark:bg-gradient-to-br dark:from-emerald-950/30 dark:to-zinc-900/40 p-10 md:p-14 text-center">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-400 dark:via-emerald-500/40 to-transparent"></div>
                            <div className="h-16 w-16 rounded-2xl bg-emerald-100 border border-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-sm dark:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Solicitud Recibida</h3>
                            <p className="text-slate-600 dark:text-zinc-400 text-sm">
                                Su aplicación está en cola para revisión por el comité de gobernanza.
                                <br />Recibirá respuesta en un plazo de 72 horas hábiles.
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl border bg-white/80 border-blue-200 dark:border-blue-500/10 dark:bg-gradient-to-br dark:from-blue-950/20 dark:via-zinc-900/60 dark:to-zinc-900/40 transform dark:shadow-none shadow-xl">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-500/30 to-transparent"></div>
                            <div className="absolute -right-6 -top-8 text-[140px] font-black leading-none select-none pointer-events-none text-slate-100 dark:text-blue-500/[0.03]">✦</div>
                            <form onSubmit={handleSubmit} className="relative z-10 p-8 md:p-12">
                                <div className="space-y-6">
                                    {/* Broker Name */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-600 dark:text-blue-500/60 uppercase mb-2">
                                            Nombre del Broker / Agencia
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.brokerName}
                                            onChange={(e) => setFormData(p => ({ ...p, brokerName: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-blue-500/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 text-sm transition-all hover:border-slate-300 dark:hover:border-blue-500/20"
                                            placeholder="Ej. Grupo Inmobiliario Alfa"
                                        />
                                    </div>

                                    {/* Volume */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-600 dark:text-blue-500/60 uppercase mb-2">
                                            Volumen de Propiedades Activas
                                        </label>
                                        <select
                                            required
                                            value={formData.volume}
                                            onChange={(e) => setFormData(p => ({ ...p, volume: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-blue-500/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 text-sm transition-all appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-blue-500/20"
                                        >
                                            <option value="" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">Seleccionar rango</option>
                                            <option value="1-10" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">1 – 10 propiedades</option>
                                            <option value="11-50" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">11 – 50 propiedades</option>
                                            <option value="51-200" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">51 – 200 propiedades</option>
                                            <option value="200+" className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">200+ propiedades</option>
                                        </select>
                                    </div>

                                    {/* Problem */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-600 dark:text-blue-500/60 uppercase mb-2">
                                            Principal Problema de Duplicación o Exclusividad
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.problem}
                                            onChange={(e) => setFormData(p => ({ ...p, problem: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-zinc-800/40 border border-slate-200 dark:border-blue-500/10 rounded-xl px-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 text-sm transition-all resize-none hover:border-slate-300 dark:hover:border-blue-500/20"
                                            placeholder="Describa el problema específico que enfrenta con listados duplicados, robo de exclusivas o disputas con otras agencias..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm md:text-base transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.5)] hover:from-blue-500 hover:to-blue-400"
                                    >
                                        Solicitar Lugar en la Mesa de Gobernanza <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-300 dark:border-blue-500/10 py-10 text-center bg-[#e8eaed]/50 dark:bg-transparent">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/20 to-transparent"></div>
                <p className="text-slate-500 dark:text-zinc-600 text-xs font-mono tracking-wider">&copy; 2026 BLUE JAX CORE — Todos los sistemas operativos.</p>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono">
                    <Link href="/whitepaper" className="text-slate-500 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">Documentación API</Link>
                    <span className="hidden sm:inline text-slate-300 dark:text-zinc-800">/</span>
                    <Link href="#" className="text-slate-500 hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">Estado del Sistema</Link>
                </div>
            </footer>

        </div>
    );
}
