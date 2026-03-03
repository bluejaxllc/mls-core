"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
});

export default function SignInPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showBeta, setShowBeta] = useState(false);
    const [betaForm, setBetaForm] = useState({ name: '', email: '', company: '', phone: '' });
    const [betaStatus, setBetaStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleBetaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBetaStatus('loading');
        try {
            const res = await fetch('/api/beta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(betaForm)
            });
            if (res.ok) {
                setBetaStatus('success');
                setTimeout(() => {
                    setShowBeta(false);
                    setBetaStatus('idle');
                    setBetaForm({ name: '', email: '', company: '', phone: '' });
                }, 2500);
            } else {
                setBetaStatus('error');
            }
        } catch {
            setBetaStatus('error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/dashboard");
        } else {
            setError("Credenciales inválidas. Verifique e intente nuevamente.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center relative overflow-hidden"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#0a0a0a] to-[#0a0a0a]"></div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px),
                                          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.1) 50px)`
                    }}
                ></div>
            </div>

            {/* Beta Access Modal */}
            {showBeta && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative overflow-hidden rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-950/40 via-zinc-900/80 to-zinc-900/60 p-8 max-w-md w-full shadow-2xl"
                    >
                        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
                        <button
                            onClick={() => setShowBeta(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors text-lg"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="h-6 w-6 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Solicitar Acceso Beta</h2>
                            <p className="text-sm text-zinc-500 mt-1">Complete el formulario para iniciar el proceso de verificación</p>
                        </div>

                        {betaStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]">
                                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                                </div>
                                <p className="text-emerald-400 font-medium mb-1">Solicitud Recibida</p>
                                <p className="text-xs text-zinc-500">Un administrador procesará su solicitud en 72 horas hábiles.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBetaSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">Nombre Completo *</label>
                                    <input
                                        required
                                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                        placeholder="Nombre del broker o agente"
                                        value={betaForm.name}
                                        onChange={e => setBetaForm({ ...betaForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">Correo Electrónico *</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                        placeholder="correo@empresa.com"
                                        value={betaForm.email}
                                        onChange={e => setBetaForm({ ...betaForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">Empresa</label>
                                        <input
                                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                            placeholder="Inmobiliaria"
                                            value={betaForm.company}
                                            onChange={e => setBetaForm({ ...betaForm, company: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">Teléfono</label>
                                        <input
                                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                            placeholder="+52..."
                                            value={betaForm.phone}
                                            onChange={e => setBetaForm({ ...betaForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {betaStatus === 'error' && (
                                    <p className="text-red-400 text-xs text-center">Error al enviar. Intente nuevamente.</p>
                                )}

                                <button
                                    disabled={betaStatus === 'loading'}
                                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold text-sm transition-all hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_30px_-8px_rgba(59,130,246,0.4)]"
                                >
                                    {betaStatus === 'loading' ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                                    ) : (
                                        'Enviar Solicitud'
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Back Link */}
            <motion.div {...fadeUp(0)} className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-wider uppercase">Inicio</span>
                </Link>
            </motion.div>

            {/* Logo */}
            <motion.div {...fadeUp(0)} className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-sm font-mono">BLUE JAX</span>
                    <span className="text-zinc-600 text-xs font-mono">/ MLS</span>
                </div>
            </motion.div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    {...fadeUp(0.1)}
                    className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/80 to-zinc-900/60 shadow-2xl"
                >
                    {/* Top Glow */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

                    <div className="p-8 md:p-10">
                        {/* Header */}
                        <motion.div {...fadeUp(0.2)} className="text-center mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_-8px_rgba(59,130,246,0.3)]">
                                <ShieldCheck className="h-7 w-7 text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-black tracking-[-0.02em]">
                                <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                                    Acceso al Sistema
                                </span>
                            </h1>
                            <p className="text-zinc-500 text-sm mt-2">
                                Ingrese sus credenciales de broker autorizado
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.form {...fadeUp(0.3)} onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                    Usuario
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] text-white placeholder:text-zinc-600 transition-all"
                                    placeholder="nombre.broker"
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] text-white placeholder:text-zinc-600 transition-all"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 text-sm"
                                >
                                    <span>⚠</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.5)] hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Autenticando...</>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
                        </motion.form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800"></div>
                            <span className="text-[10px] font-mono text-zinc-600 tracking-wider uppercase">o</span>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800"></div>
                        </div>

                        {/* Beta Access */}
                        <motion.div {...fadeUp(0.4)} className="text-center">
                            <button
                                onClick={() => setShowBeta(true)}
                                className="text-xs text-zinc-500 hover:text-blue-400 transition-colors group"
                            >
                                ¿No tiene cuenta?{' '}
                                <span className="text-blue-500/70 group-hover:text-blue-400 underline decoration-dashed underline-offset-4 decoration-blue-500/30">
                                    Solicitar acceso beta
                                </span>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.p {...fadeUp(0.5)} className="text-center mt-6 text-zinc-600 text-[10px] font-mono tracking-wider">
                    © 2026 BLUE JAX CORE — Acceso restringido a brokers autorizados.
                </motion.p>
            </div>
        </div>
    );
}
