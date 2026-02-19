'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Database, Scale, FileSearch, Layers, Gavel, Eye, Clock, Rocket, ChevronRight } from 'lucide-react';

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-30px' },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }
});

export default function WhitepaperPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 selection:bg-blue-500/30">

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px),
                                          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px)`
                    }}
                ></div>
            </div>

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 border-b border-blue-500/10 bg-[#0a0a0a]/90 backdrop-blur-xl">
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-zinc-600 hover:text-blue-400 transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="h-4 w-px bg-blue-500/20"></div>
                        <div>
                            <div className="text-xs font-mono tracking-wider text-blue-500/60 uppercase">Documento de Arquitectura</div>
                            <div className="text-sm font-bold text-white">MLS México — v2.0</div>
                        </div>
                    </div>
                    <Link href="/#aplicar" className="text-[10px] font-mono tracking-wider text-blue-500/60 hover:text-blue-400 transition-colors uppercase hidden md:block">
                        Solicitar Acceso →
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">

                {/* ─── DOCUMENT TITLE ─── */}
                <motion.div {...fadeUp(0)} className="mb-16 md:mb-24">
                    <div className="font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase mb-6">
                        Motor de Gobernanza e Integridad de Mercado
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-[-0.04em] text-white leading-[1.05] mb-6">
                        Documento de{' '}
                        <span className="bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">
                            Arquitectura
                        </span>
                    </h1>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-600">
                        <span>Versión 2.0</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                        <span>Arquitectura de Verdad Compartida</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                        <span>Febrero 2026</span>
                    </div>
                </motion.div>

                {/* ─── RESUMEN EJECUTIVO ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionLabel text="Resumen Ejecutivo" />

                    <div className="space-y-5 text-base md:text-lg leading-relaxed">
                        <p>
                            El mercado inmobiliario en México opera bajo{' '}
                            <span className="text-white font-semibold">condiciones de datos hostiles</span>.
                            La fragmentación del inventario, el robo de exclusivas y la manipulación de información
                            destruyen el valor comercial de los brokers profesionales.
                        </p>
                        <p>
                            La MLS (Multiple Listing Service){' '}
                            <span className="text-blue-400 font-semibold">no es un portal de consumidores ni una plataforma de generación de leads</span>.
                            Es una infraestructura nacional de registro de broker a broker, cuya función principal es
                            establecer la verdad compartida, la integridad de los datos, la gobernanza y la coordinación
                            justa del mercado. Codifica reglas, responsabilidad y transparencia directamente en el software.
                        </p>
                    </div>
                </motion.section>

                <Divider />

                {/* ─── 1. PRINCIPIOS DE ARQUITECTURA ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionNumber number="01" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                        Principios de Arquitectura y Separación de Responsabilidades
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed mb-10">
                        Para garantizar la neutralidad y la seguridad de la plataforma, el ecosistema opera bajo una
                        estricta separación de capas:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Layer 1 */}
                        <motion.div {...fadeUp(0.1)} className="relative overflow-hidden p-6 md:p-8 rounded-xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40 group hover:border-blue-500/25 transition-all duration-500">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover:via-blue-400/40 transition-all duration-500"></div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] transition-all duration-500">
                                    <Layers className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="text-[10px] font-mono text-blue-500/70 tracking-wider uppercase">Capa de Identidad</div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">Blue Jax — Operaciones</h3>
                            <p className="text-sm leading-relaxed text-zinc-500">
                                Blue Jax autentica a los usuarios, asigna el contexto (rol, organización, broker) y entrega tokens
                                de identidad seguros a la MLS. La MLS confía en Blue Jax para saber{' '}
                                <span className="text-zinc-300">quién es el usuario</span> y si{' '}
                                <span className="text-zinc-300">está activo o revocado</span>.
                            </p>
                        </motion.div>

                        {/* Layer 2 */}
                        <motion.div {...fadeUp(0.2)} className="relative overflow-hidden p-6 md:p-8 rounded-xl border border-cyan-500/10 bg-gradient-to-br from-cyan-950/20 via-zinc-900/60 to-zinc-900/40 group hover:border-cyan-500/25 transition-all duration-500">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent group-hover:via-cyan-400/40 transition-all duration-500"></div>
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)] transition-all duration-500">
                                    <ShieldCheck className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div className="text-[10px] font-mono text-cyan-500/70 tracking-wider uppercase">Capa de Gobernanza</div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-3">MLS Core — Datos Canónicos</h3>
                            <p className="text-sm leading-relaxed text-zinc-500">
                                La MLS contiene la lógica de dominio. Es el sistema de registro para{' '}
                                <span className="text-zinc-300">propiedades</span> (activos físicos),{' '}
                                <span className="text-zinc-300">listados</span> (ofertas comerciales),{' '}
                                <span className="text-zinc-300">reglas de gobernanza</span> y{' '}
                                <span className="text-zinc-300">resolución de conflictos</span>.
                                La MLS no gestiona contraseñas ni actividades de CRM.
                            </p>
                        </motion.div>
                    </div>
                </motion.section>

                <Divider />

                {/* ─── 2. GOBERNANZA DETERMINISTA ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionNumber number="02" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                        Gobernanza Determinista{' '}
                        <span className="text-zinc-600">(Motor de Reglas)</span>
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed mb-10">
                        La gobernanza se hace cumplir a través de un motor de reglas, no a discreción humana.
                        Este motor evalúa de forma determinista y auditable:
                    </p>

                    <div className="space-y-4">
                        {/* Sub 2.1 */}
                        <motion.div {...fadeUp(0.1)} className="relative overflow-hidden p-6 md:p-8 rounded-xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40 group hover:border-blue-500/25 transition-all duration-500">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] transition-all duration-500">
                                    <Database className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Jerarquía y Precedencia de Datos</h3>
                                    <p className="text-sm leading-relaxed text-zinc-500">
                                        Múltiples fuentes pueden hacer referencia a la misma propiedad. Sin embargo, la
                                        precedencia de los datos se aplica a través de una{' '}
                                        <span className="text-zinc-300">jerarquía de confianza de la fuente</span>.
                                        Los datos enviados por un broker autorizado siempre superan jerárquicamente a
                                        los datos raspados (scraped), los cuales solo se permiten como{' '}
                                        <span className="text-cyan-400 font-medium">información no canónica</span>.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sub 2.2 */}
                        <motion.div {...fadeUp(0.2)} className="relative overflow-hidden p-6 md:p-8 rounded-xl border border-indigo-500/10 bg-gradient-to-br from-indigo-950/20 via-zinc-900/60 to-zinc-900/40 group hover:border-indigo-500/25 transition-all duration-500">
                            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)] transition-all duration-500">
                                    <Clock className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">Inmutabilidad Histórica</h3>
                                    <p className="text-sm leading-relaxed text-zinc-500">
                                        Los listados están versionados;{' '}
                                        <span className="text-white font-semibold">nunca se sobrescriben</span>.
                                        El sistema mantiene instantáneas históricas inmutables.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust hierarchy diagram */}
                    <motion.div {...fadeUp(0.3)} className="mt-8 relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40 border border-blue-500/10 rounded-xl">
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                        <div className="text-[10px] font-mono text-blue-500/60 tracking-wider uppercase mb-4">Jerarquía de Confianza</div>
                        <div className="space-y-3">
                            {[
                                { level: 1, label: 'Datos Broker Autorizado', trust: 'CANÓNICO', color: 'emerald', width: '100%' },
                                { level: 2, label: 'Datos Verificados MLS', trust: 'VERIFICADO', color: 'blue', width: '75%' },
                                { level: 3, label: 'Datos Scrapeados (Web)', trust: 'NO CANÓNICO', color: 'cyan', width: '45%' },
                                { level: 4, label: 'Fuente Desconocida', trust: 'RECHAZADO', color: 'indigo', width: '20%' },
                            ].map((item, i) => (
                                <motion.div key={i} {...fadeUp(0.3 + i * 0.1)} className="flex items-center gap-4">
                                    <div className="text-[10px] font-mono text-zinc-700 w-6 text-right shrink-0">{item.level}</div>
                                    <div className="flex-1">
                                        <div
                                            className={`h-9 rounded-lg flex items-center justify-between px-3 transition-all duration-500 hover:scale-[1.01]
                                                ${item.color === 'emerald' ? 'bg-emerald-950/30 border border-emerald-500/15 hover:border-emerald-500/30' : ''}
                                                ${item.color === 'blue' ? 'bg-blue-950/30 border border-blue-500/15 hover:border-blue-500/30' : ''}
                                                ${item.color === 'cyan' ? 'bg-cyan-950/30 border border-cyan-500/15 hover:border-cyan-500/30' : ''}
                                                ${item.color === 'indigo' ? 'bg-indigo-950/30 border border-indigo-500/15 hover:border-indigo-500/30' : ''}
                                            `}
                                            style={{ width: item.width }}
                                        >
                                            <span className="text-[10px] text-zinc-400 truncate">{item.label}</span>
                                            <span className={`text-[9px] font-mono font-bold tracking-wider shrink-0 ml-2
                                                ${item.color === 'emerald' ? 'text-emerald-400' : ''}
                                                ${item.color === 'blue' ? 'text-blue-400' : ''}
                                                ${item.color === 'cyan' ? 'text-cyan-400' : ''}
                                                ${item.color === 'indigo' ? 'text-indigo-400' : ''}
                                            `}>{item.trust}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.section>

                <Divider />

                {/* ─── 3. RESOLUCIÓN AUTOMATIZADA DE CONFLICTOS ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionNumber number="03" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                        Resolución Automatizada de Conflictos{' '}
                        <span className="text-zinc-600">(Claims Engine)</span>
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed mb-10">
                        El sistema incluye un módulo formal de reclamaciones para sustituir las disputas informales
                        entre brokers por una resolución estructurada. El motor de conflictos maneja automáticamente:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                        {[
                            { icon: Scale, label: 'Listados concurrentes para la misma propiedad física', color: 'blue', delay: 0.1 },
                            { icon: Gavel, label: 'Disputas sobre contratos de exclusividad', color: 'cyan', delay: 0.2 },
                            { icon: FileSearch, label: 'Desafíos a la precisión de los datos', color: 'indigo', delay: 0.3 },
                        ].map((item, i) => (
                            <motion.div key={i} {...fadeUp(item.delay)} className={`relative overflow-hidden p-5 rounded-xl border text-center group hover:scale-[1.02] transition-all duration-500
                                ${item.color === 'blue' ? 'border-blue-500/10 bg-gradient-to-br from-blue-950/20 to-zinc-900/40 hover:border-blue-500/25' : ''}
                                ${item.color === 'cyan' ? 'border-cyan-500/10 bg-gradient-to-br from-cyan-950/20 to-zinc-900/40 hover:border-cyan-500/25' : ''}
                                ${item.color === 'indigo' ? 'border-indigo-500/10 bg-gradient-to-br from-indigo-950/20 to-zinc-900/40 hover:border-indigo-500/25' : ''}
                            `}>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-500
                                    ${item.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]' : ''}
                                    ${item.color === 'cyan' ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' : ''}
                                    ${item.color === 'indigo' ? 'bg-indigo-500/10 border border-indigo-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]' : ''}
                                `}>
                                    <item.icon className={`h-5 w-5
                                        ${item.color === 'blue' ? 'text-blue-400' : ''}
                                        ${item.color === 'cyan' ? 'text-cyan-400' : ''}
                                        ${item.color === 'indigo' ? 'text-indigo-400' : ''}
                                    `} />
                                </div>
                                <p className="text-xs text-zinc-500 leading-relaxed">{item.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Conflict lifecycle */}
                    <motion.div {...fadeUp(0.3)} className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40 border border-blue-500/10 rounded-xl">
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                        <div className="text-[10px] font-mono text-blue-500/60 tracking-wider uppercase mb-5">
                            Cuando se activa un conflicto, el sistema:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                            {[
                                'Suspende la publicación cuando es necesario',
                                'Exige carga probatoria (documentos legales)',
                                'Sigue un ciclo de vida definido',
                                'Produce registros de auditoría inmutables',
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="h-6 w-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:shadow-[0_0_10px_-3px_rgba(59,130,246,0.3)] transition-all duration-500">
                                        <span className="text-[9px] font-mono text-blue-400">{String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-sm text-zinc-400">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.section>

                <Divider />

                {/* ─── 4. TRAZABILIDAD Y PREPARACIÓN LEGAL ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionNumber number="04" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                        Trazabilidad y Preparación Legal
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed mb-10">
                        La MLS es un{' '}
                        <span className="text-white font-semibold">árbitro neutral</span>.
                        Cada decisión en la MLS es explicable, registrada y atribuible.
                    </p>

                    <p className="text-base leading-relaxed mb-10">
                        El sistema genera logs de auditoría exhaustivos que registran:{' '}
                        <span className="text-white font-medium">quién</span> realizó la acción,{' '}
                        <span className="text-white font-medium">qué</span> cambió,{' '}
                        <span className="text-white font-medium">por qué</span> cambió,{' '}
                        <span className="text-white font-medium">qué reglas se activaron</span> y{' '}
                        <span className="text-white font-medium">qué decisión se tomó</span>.
                        Esta arquitectura hace que la plataforma sea apta para:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: Eye, label: 'Revisiones Regulatorias', desc: 'Cumplimiento auditable con estándares gubernamentales', color: 'emerald', delay: 0.1 },
                            { icon: Gavel, label: 'Disputas Legales Formales', desc: 'Evidencia indexable y exportable para litigio', color: 'cyan', delay: 0.2 },
                            { icon: ShieldCheck, label: 'Supervisión del Mercado', desc: 'Monitoreo continuo de integridad y fairness', color: 'blue', delay: 0.3 },
                        ].map((item, i) => (
                            <motion.div key={i} {...fadeUp(item.delay)} className={`relative overflow-hidden p-6 rounded-xl border group hover:scale-[1.02] transition-all duration-500
                                ${item.color === 'emerald' ? 'border-emerald-500/10 bg-gradient-to-br from-emerald-950/20 to-zinc-900/40 hover:border-emerald-500/25' : ''}
                                ${item.color === 'cyan' ? 'border-cyan-500/10 bg-gradient-to-br from-cyan-950/20 to-zinc-900/40 hover:border-cyan-500/25' : ''}
                                ${item.color === 'blue' ? 'border-blue-500/10 bg-gradient-to-br from-blue-950/20 to-zinc-900/40 hover:border-blue-500/25' : ''}
                            `}>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-500
                                    ${item.color === 'emerald' ? 'bg-emerald-500/10 border border-emerald-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]' : ''}
                                    ${item.color === 'cyan' ? 'bg-cyan-500/10 border border-cyan-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]' : ''}
                                    ${item.color === 'blue' ? 'bg-blue-500/10 border border-blue-500/20 group-hover:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]' : ''}
                                `}>
                                    <item.icon className={`h-5 w-5
                                        ${item.color === 'emerald' ? 'text-emerald-400' : ''}
                                        ${item.color === 'cyan' ? 'text-cyan-400' : ''}
                                        ${item.color === 'blue' ? 'text-blue-400' : ''}
                                    `} />
                                </div>
                                <h3 className="text-sm font-bold text-white mb-1">{item.label}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <Divider />

                {/* ─── 5. FASES DE IMPLEMENTACIÓN ─── */}
                <motion.section {...fadeUp()} className="mb-20 md:mb-28">
                    <SectionNumber number="05" />
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
                        Fases de Implementación{' '}
                        <span className="text-zinc-600">(Roadmap de Ejecución)</span>
                    </h2>

                    <div className="mt-10 space-y-0">
                        {/* Phase 1 */}
                        <Phase
                            number="01"
                            title="Establecimiento de Gobernanza Local"
                            status="ACTUAL"
                            statusColor="emerald"
                            items={[
                                'Formación de la mesa de gobernanza con el Top 5 de brokers de la región (Chihuahua).',
                                'Integración de Blue Jax como proveedor de identidad exclusivo.',
                                'Carga inicial de inventario canónico para establecer precedencia de datos.',
                            ]}
                        />

                        {/* Phase 2 */}
                        <Phase
                            number="02"
                            title="Motor de Reglas y Prevención de Conflictos"
                            status="SIGUIENTE"
                            statusColor="amber"
                            items={[
                                'Activación del sistema de "Claims" (reclamaciones) para detección automática de duplicidades.',
                                'Auditoría de propiedades vs. listados.',
                            ]}
                        />

                        {/* Phase 3 */}
                        <Phase
                            number="03"
                            title="Exposición Controlada (API Pública)"
                            status="FUTURO"
                            statusColor="zinc"
                            items={[
                                'Exposición de resúmenes de inventario y estadísticas de mercado de datos públicos (sin IDs internos ni datos de los brokers).',
                                'Venta de acceso a datos verificados vía API a portales inmobiliarios de terceros, obligándolos a consumir la verdad canónica de la MLS.',
                            ]}
                        />
                    </div>
                </motion.section>

                {/* ─── FOOTER ─── */}
                <footer className="relative pt-16 border-t border-blue-500/10 text-center">
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                    <p className="text-zinc-700 text-xs font-mono tracking-wider">
                        &copy; 2026 BLUE JAX CORE — Documento de Arquitectura v2.0
                    </p>
                    <Link
                        href="/#aplicar"
                        className="inline-flex items-center gap-2 mt-6 text-xs font-mono text-blue-500/60 hover:text-blue-400 transition-colors tracking-wider uppercase"
                    >
                        Solicitar Acceso al Sistema <ChevronRight className="h-3 w-3" />
                    </Link>
                </footer>

            </main>
        </div>
    );
}

/* ═══════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════ */

function SectionLabel({ text }: { text: string }) {
    return (
        <div className="mb-6">
            <span className="font-mono text-[10px] tracking-[0.2em] text-blue-500/70 uppercase">{`// ${text.toLowerCase()}`}</span>
        </div>
    );
}

function SectionNumber({ number }: { number: string }) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono tracking-wider text-blue-500/50 uppercase">Sección {number}</span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-500/10 to-transparent"></div>
        </div>
    );
}

function Divider() {
    return (
        <div className="my-8 md:my-12">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-800/30 to-transparent"></div>
        </div>
    );
}

function Phase({ number, title, status, statusColor, items }: {
    number: string;
    title: string;
    status: string;
    statusColor: 'emerald' | 'amber' | 'zinc';
    items: string[];
}) {
    const colorMap = {
        emerald: {
            border: 'border-emerald-500/10 hover:border-emerald-500/25',
            bg: 'bg-gradient-to-br from-emerald-950/20 via-zinc-900/60 to-zinc-900/40',
            glow: 'via-emerald-500/20',
            icon: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            badge: 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20',
            dot: 'bg-emerald-500/40',
        },
        amber: {
            border: 'border-cyan-500/10 hover:border-cyan-500/25',
            bg: 'bg-gradient-to-br from-cyan-950/20 via-zinc-900/60 to-zinc-900/40',
            glow: 'via-cyan-500/20',
            icon: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
            badge: 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/20',
            dot: 'bg-cyan-500/40',
        },
        zinc: {
            border: 'border-indigo-500/10 hover:border-indigo-500/25',
            bg: 'bg-gradient-to-br from-indigo-950/20 via-zinc-900/60 to-zinc-900/40',
            glow: 'via-indigo-500/20',
            icon: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
            badge: 'bg-indigo-950/50 text-indigo-400 border border-indigo-500/20',
            dot: 'bg-indigo-500/40',
        },
    };
    const c = colorMap[statusColor];
    return (
        <div className={`relative overflow-hidden p-6 md:p-8 rounded-xl border ${c.border} ${c.bg} group transition-all duration-500 mb-4`}>
            <div className={`absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent ${c.glow} to-transparent`}></div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${c.icon}`}>
                        <Rocket className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                        Fase {number}: {title}
                    </h3>
                </div>
                <span className={`text-[9px] font-mono font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-lg self-start ${c.badge}`}>{status}</span>
            </div>
            <ul className="space-y-3 ml-12">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className={`h-1.5 w-1.5 rounded-full ${c.dot} mt-2 shrink-0`}></div>
                        <span className="text-sm text-zinc-500 leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
