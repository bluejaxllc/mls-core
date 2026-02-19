'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Database, Scale, FileSearch, ArrowRight, AlertTriangle, ChevronRight, Lock, Eye, Gavel } from 'lucide-react';
import { useState } from 'react';

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }
});

export default function LandingPage() {
    const [formData, setFormData] = useState({
        brokerName: '',
        volume: '',
        problem: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-blue-500/30 overflow-hidden relative">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-[#0a0a0a] to-[#0a0a0a]"></div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px),
                                          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px)`
                    }}
                ></div>
                {/* Scanline effect */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 2px, transparent 3px)`,
                        backgroundSize: '100% 3px'
                    }}
                ></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 md:h-4 md:w-4 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-base md:text-lg font-mono">BLUE JAX</span>
                    <span className="text-zinc-600 text-xs font-mono hidden sm:inline">/ MLS</span>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                    <Link href="/whitepaper" className="hidden sm:block text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-mono uppercase tracking-wider">
                        Whitepaper
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="bg-white text-black px-3 md:px-4 py-1.5 md:py-2 rounded text-[10px] md:text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2 font-mono uppercase tracking-wider"
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
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-zinc-500 uppercase border border-zinc-800 px-4 py-2 rounded">
                        Sistema de Registro y Gobernanza Inmobiliaria
                    </span>
                </motion.div>

                {/* Título Principal */}
                <motion.h1
                    {...fadeUp(0.15)}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-[-0.04em] mb-6 md:mb-8 leading-[0.9] max-w-4xl"
                    style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
                >
                    <span className="bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent">
                        La Verdad{' '}
                    </span>
                    <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent">
                        Compartida
                    </span>
                    <br />
                    <span className="bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-700 bg-clip-text text-transparent">
                        del Mercado Inmobiliario.
                    </span>
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                    {...fadeUp(0.3)}
                    className="text-sm md:text-base lg:text-lg text-zinc-400 max-w-2xl mb-8 md:mb-10 leading-relaxed px-4"
                >
                    La MLS es un sistema de registro de broker a broker cuya función principal es establecer la{' '}
                    <span className="text-zinc-200 font-medium">integridad de los datos</span>, la{' '}
                    <span className="text-zinc-200 font-medium">gobernanza</span> y la{' '}
                    <span className="text-zinc-200 font-medium">coordinación justa del mercado</span>.
                </motion.p>

                {/* Advertencia */}
                <motion.div
                    {...fadeUp(0.4)}
                    className="mb-10 md:mb-14 flex items-center gap-3 px-4 md:px-6 py-3 rounded-lg border border-blue-900/50 bg-blue-950/30 max-w-xl"
                >
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-blue-400 shrink-0" />
                    <p className="text-xs md:text-sm text-blue-400 font-medium text-left">
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
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-black rounded-lg font-bold text-sm md:text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_60px_-10px_rgba(255,255,255,0.15)]"
                    >
                        Aplicar a la Mesa de Gobernanza Local <ArrowRight className="h-4 w-4" />
                    </a>
                    <Link
                        href="/whitepaper"
                        className="px-6 md:px-8 py-3.5 md:py-4 bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-lg font-medium text-sm md:text-base transition-all flex items-center justify-center"
                    >
                        Leer la Constitución del Mercado
                    </Link>
                </motion.div>
            </main>

            {/* Divider */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 2: LA REALIDAD OPERATIVA — EL DOLOR
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-5xl mx-auto">
                <motion.div {...fadeUp(0)} className="mb-3">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-500/80 uppercase">
                        // diagnóstico
                    </span>
                </motion.div>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-8 md:mb-10 leading-tight"
                >
                    Diseñado para Condiciones{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        de Datos Hostiles.
                    </span>
                </motion.h2>

                <motion.p
                    {...fadeUp(0.2)}
                    className="text-base md:text-lg text-zinc-400 leading-relaxed max-w-3xl"
                >
                    El mercado actual está fracturado por el{' '}
                    <span className="text-blue-400 font-semibold">robo de exclusivas</span>,{' '}
                    <span className="text-blue-400 font-semibold">información basura</span> y{' '}
                    <span className="text-blue-400 font-semibold">disputas informales</span>.
                    La MLS asume condiciones de datos hostiles y diseña para las disputas.
                    Reemplazamos las peleas entre agencias con una{' '}
                    <span className="text-white font-medium">arquitectura de software auditable</span>.
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
                                ${stat.color === 'blue' ? 'border-blue-500/15 bg-gradient-to-br from-blue-950/30 to-zinc-900/40 hover:border-blue-500/30' : ''}
                                ${stat.color === 'cyan' ? 'border-cyan-500/15 bg-gradient-to-br from-cyan-950/30 to-zinc-900/40 hover:border-cyan-500/30' : ''}
                                ${stat.color === 'indigo' ? 'border-indigo-500/15 bg-gradient-to-br from-indigo-950/30 to-zinc-900/40 hover:border-indigo-500/30' : ''}
                            `}
                        >
                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent to-transparent transition-all duration-500
                                ${stat.color === 'blue' ? 'via-blue-500/30 group-hover:via-blue-400/60 group-hover:w-32' : ''}
                                ${stat.color === 'cyan' ? 'via-cyan-500/30 group-hover:via-cyan-400/60 group-hover:w-32' : ''}
                                ${stat.color === 'indigo' ? 'via-indigo-500/30 group-hover:via-indigo-400/60 group-hover:w-32' : ''}
                            `}></div>
                            <div className={`text-3xl md:text-5xl font-black font-mono mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-b
                                ${stat.color === 'blue' ? 'from-blue-300 to-blue-500' : ''}
                                ${stat.color === 'cyan' ? 'from-cyan-300 to-cyan-500' : ''}
                                ${stat.color === 'indigo' ? 'from-indigo-300 to-indigo-500' : ''}
                            `}>{stat.value}</div>
                            <div className="text-[10px] md:text-xs text-zinc-500 leading-tight">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Animated Divider */}
            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-blue-800/30 to-transparent"></div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 3: LOS PILARES DEL SISTEMA
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4 max-w-7xl mx-auto">
                <motion.div {...fadeUp(0)} className="text-center mb-16 md:mb-20">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-zinc-600 uppercase block mb-4">
                        // arquitectura del sistema
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em]">
                        Tres Pilares.{' '}
                        <span className="text-zinc-600">Cero Ambigüedad.</span>
                    </h2>
                </motion.div>

                {/* 3-Column Premium Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Pilar 1 */}
                    <motion.div
                        {...fadeUp(0.1)}
                        className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/40 via-zinc-900/60 to-zinc-900/40 p-8 md:p-10 group hover:border-blue-500/25 transition-all duration-500"
                    >
                        {/* Watermark Number */}
                        <div className="absolute -right-4 -top-6 text-[120px] font-black text-blue-500/[0.04] leading-none select-none pointer-events-none">01</div>
                        {/* Top Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all duration-500 group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                                <ShieldCheck className="h-6 w-6 text-blue-400" />
                            </div>
                            <span className="text-[10px] font-mono text-blue-500/60 tracking-[0.25em] uppercase block mb-4">Pilar 01</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight">
                                Motor de Gobernanza{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Implacable</span>
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                La gobernanza se hace cumplir a través de un motor de reglas, no a discreción humana.
                                Todo es <span className="text-zinc-300">determinista</span>,{' '}
                                <span className="text-zinc-300">transparente</span> y{' '}
                                <span className="text-zinc-300">auditable</span>.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pilar 2 */}
                    <motion.div
                        {...fadeUp(0.2)}
                        className="relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-950/40 via-zinc-900/60 to-zinc-900/40 p-8 md:p-10 group hover:border-cyan-500/25 transition-all duration-500"
                    >
                        <div className="absolute -right-4 -top-6 text-[120px] font-black text-cyan-500/[0.04] leading-none select-none pointer-events-none">02</div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/15 group-hover:border-cyan-500/30 transition-all duration-500 group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
                                <Database className="h-6 w-6 text-cyan-400" />
                            </div>
                            <span className="text-[10px] font-mono text-cyan-500/60 tracking-[0.25em] uppercase block mb-4">Pilar 02</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight">
                                Jerarquía de Datos{' '}
                                <span className="bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Canónicos</span>
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Los listados son versionados, nunca sobrescritos. Aplicamos una regla estricta: los datos enviados
                                por los brokers <span className="text-zinc-300">siempre superan</span> a los datos extraídos de la web.
                            </p>
                        </div>
                    </motion.div>

                    {/* Pilar 3 */}
                    <motion.div
                        {...fadeUp(0.3)}
                        className="relative overflow-hidden rounded-2xl border border-indigo-500/10 bg-gradient-to-br from-indigo-950/40 via-zinc-900/60 to-zinc-900/40 p-8 md:p-10 group hover:border-indigo-500/25 transition-all duration-500"
                    >
                        <div className="absolute -right-4 -top-6 text-[120px] font-black text-indigo-500/[0.04] leading-none select-none pointer-events-none">03</div>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent group-hover:via-indigo-400/60 transition-all duration-500"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500/15 group-hover:border-indigo-500/30 transition-all duration-500 group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]">
                                <Scale className="h-6 w-6 text-indigo-400" />
                            </div>
                            <span className="text-[10px] font-mono text-indigo-500/60 tracking-[0.25em] uppercase block mb-4">Pilar 03</span>
                            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight leading-tight">
                                Resolución de Conflictos{' '}
                                <span className="bg-gradient-to-r from-indigo-400 to-indigo-300 bg-clip-text text-transparent">Automatizada</span>
                            </h3>
                            <p className="text-sm text-zinc-500 leading-relaxed">
                                Reemplazamos las disputas informales entre brokers con una resolución estructurada.
                                Un sistema formal de reclamaciones maneja automáticamente{' '}
                                <span className="text-zinc-300">listados competidores</span> y{' '}
                                <span className="text-zinc-300">disputas de exclusividad</span>.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
                SECCIÓN 4: AUDITORÍA Y PROTECCIÓN LEGAL
            ══════════════════════════════════════════════════════════════ */}
            <section className="relative z-10 py-24 md:py-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="relative overflow-hidden border border-blue-500/10 rounded-2xl bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40">
                        {/* Top glow */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                        {/* Watermark */}
                        <div className="absolute -right-8 -top-12 text-[200px] font-black text-blue-500/[0.02] leading-none select-none pointer-events-none">§</div>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Left: Content */}
                            <div className="p-8 md:p-12 lg:p-16">
                                <motion.div {...fadeUp(0)}>
                                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-500/60 uppercase block mb-4">
                                        // protección legal
                                    </span>
                                </motion.div>

                                <motion.h2 {...fadeUp(0.1)} className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-8 leading-tight">
                                    Trazabilidad{' '}
                                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        Absoluta.
                                    </span>
                                </motion.h2>

                                <motion.p {...fadeUp(0.2)} className="text-base md:text-lg text-zinc-400 leading-relaxed mb-10">
                                    Cada decisión en la MLS es explicable, registrada y atribuible.
                                    El sistema registra{' '}
                                    <span className="text-white font-medium">quién</span> realizó la acción,{' '}
                                    <span className="text-white font-medium">qué</span> cambió,{' '}
                                    <span className="text-white font-medium">por qué</span> cambió y{' '}
                                    <span className="text-white font-medium">qué reglas se activaron</span>,
                                    haciéndolo apto para revisión regulatoria y disputas legales.
                                </motion.p>
                            </div>

                            {/* Right: Visual audit trail */}
                            <div className="p-8 md:p-12 lg:p-16 border-t md:border-t-0 md:border-l border-blue-500/10 flex flex-col justify-center">
                                <div className="space-y-3">
                                    {[
                                        { icon: Eye, label: 'Quién', desc: 'Identidad verificada del actor', color: 'emerald', delay: 0.2 },
                                        { icon: FileSearch, label: 'Qué', desc: 'Cambio exacto registrado con diff', color: 'cyan', delay: 0.3 },
                                        { icon: Gavel, label: 'Por Qué', desc: 'Regla de gobernanza que se activó', color: 'blue', delay: 0.4 },
                                        { icon: Lock, label: 'Inmutable', desc: 'Registro blindado contra manipulación', color: 'indigo', delay: 0.5 },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            {...fadeUp(item.delay)}
                                            className={`flex items-start gap-4 p-4 rounded-xl border group transition-all duration-500 hover:scale-[1.02]
                                                ${item.color === 'emerald' ? 'bg-emerald-950/20 border-emerald-500/10 hover:border-emerald-500/25 hover:bg-emerald-950/30' : ''}
                                                ${item.color === 'cyan' ? 'bg-cyan-950/20 border-cyan-500/10 hover:border-cyan-500/25 hover:bg-cyan-950/30' : ''}
                                                ${item.color === 'blue' ? 'bg-blue-950/20 border-blue-500/10 hover:border-blue-500/25 hover:bg-blue-950/30' : ''}
                                                ${item.color === 'indigo' ? 'bg-indigo-950/20 border-indigo-500/10 hover:border-indigo-500/25 hover:bg-indigo-950/30' : ''}
                                            `}
                                        >
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500
                                                ${item.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]' : ''}
                                                ${item.color === 'cyan' ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' : ''}
                                                ${item.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]' : ''}
                                                ${item.color === 'indigo' ? 'bg-indigo-500/10 border border-indigo-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' : ''}
                                            `}>
                                                <item.icon className={`h-5 w-5
                                                    ${item.color === 'emerald' ? 'text-emerald-400' : ''}
                                                    ${item.color === 'cyan' ? 'text-cyan-400' : ''}
                                                    ${item.color === 'blue' ? 'text-blue-400' : ''}
                                                    ${item.color === 'indigo' ? 'text-indigo-400' : ''}
                                                `} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{item.label}</div>
                                                <div className="text-xs text-zinc-500">{item.desc}</div>
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
                SECCIÓN 5: CTA FINAL — EL FILTRO
            ══════════════════════════════════════════════════════════════ */}
            <section id="aplicar" className="relative z-10 py-24 md:py-32 px-4 max-w-4xl mx-auto">
                <motion.div {...fadeUp(0)} className="text-center mb-4">
                    <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-blue-500/60 uppercase">
                        // acceso restringido
                    </span>
                </motion.div>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.03em] mb-6 md:mb-8 text-center leading-tight"
                >
                    El Mercado se Controla,{' '}
                    <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-zinc-500 to-zinc-600 bg-clip-text text-transparent">No se Ruega.</span>
                </motion.h2>

                <motion.p
                    {...fadeUp(0.2)}
                    className="text-base md:text-lg text-zinc-500 leading-relaxed text-center max-w-2xl mx-auto mb-14"
                >
                    El acceso a la capa base de la MLS está estrictamente limitado a brokers con{' '}
                    <span className="text-zinc-300 font-medium">volumen comprobable</span>{' '}
                    que busquen proteger su inventario. El sistema optimiza para la confianza, la equidad y
                    la legitimidad a largo plazo, no para el crecimiento desmedido.
                </motion.p>

                {/* Application Form — Premium Card */}
                <motion.div {...fadeUp(0.3)}>
                    {submitted ? (
                        <div className="relative overflow-hidden border border-emerald-500/20 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-zinc-900/40 p-10 md:p-14 text-center">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent"></div>
                            <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                                <ShieldCheck className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Solicitud Recibida</h3>
                            <p className="text-zinc-400 text-sm">
                                Su aplicación está en cola para revisión por el comité de gobernanza.
                                <br />Recibirá respuesta en un plazo de 72 horas hábiles.
                            </p>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                            <div className="absolute -right-6 -top-8 text-[140px] font-black text-blue-500/[0.03] leading-none select-none pointer-events-none">✦</div>
                            <form onSubmit={handleSubmit} className="relative z-10 p-8 md:p-12">
                                <div className="space-y-6">
                                    {/* Broker Name */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-500/60 uppercase mb-2">
                                            Nombre del Broker / Agencia
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.brokerName}
                                            onChange={(e) => setFormData(p => ({ ...p, brokerName: e.target.value }))}
                                            className="w-full bg-zinc-800/40 border border-blue-500/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all hover:border-blue-500/20"
                                            placeholder="Ej. Grupo Inmobiliario Alfa"
                                        />
                                    </div>

                                    {/* Volume */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-500/60 uppercase mb-2">
                                            Volumen de Propiedades Activas
                                        </label>
                                        <select
                                            required
                                            value={formData.volume}
                                            onChange={(e) => setFormData(p => ({ ...p, volume: e.target.value }))}
                                            className="w-full bg-zinc-800/40 border border-blue-500/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all appearance-none cursor-pointer hover:border-blue-500/20"
                                        >
                                            <option value="" className="bg-zinc-900">Seleccionar rango</option>
                                            <option value="1-10" className="bg-zinc-900">1 – 10 propiedades</option>
                                            <option value="11-50" className="bg-zinc-900">11 – 50 propiedades</option>
                                            <option value="51-200" className="bg-zinc-900">51 – 200 propiedades</option>
                                            <option value="200+" className="bg-zinc-900">200+ propiedades</option>
                                        </select>
                                    </div>

                                    {/* Problem */}
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-blue-500/60 uppercase mb-2">
                                            Principal Problema de Duplicación o Exclusividad
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.problem}
                                            onChange={(e) => setFormData(p => ({ ...p, problem: e.target.value }))}
                                            className="w-full bg-zinc-800/40 border border-blue-500/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 text-sm transition-all resize-none hover:border-blue-500/20"
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
            <footer className="relative z-10 border-t border-blue-500/10 py-10 text-center">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                <p className="text-zinc-600 text-xs font-mono tracking-wider">&copy; 2026 BLUE JAX CORE — Todos los sistemas operativos.</p>
            </footer>

        </div>
    );
}
