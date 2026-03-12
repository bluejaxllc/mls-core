"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
});

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (formData.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Error al crear la cuenta.");
            }
        } catch {
            setError("Error de conexión. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

            {/* Back Link */}
            <motion.div {...fadeUp(0)} className="absolute top-6 left-6 z-20">
                <Link href="/auth/signin" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-wider uppercase">Iniciar Sesión</span>
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

            {/* Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    {...fadeUp(0.1)}
                    className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/80 to-zinc-900/60 shadow-2xl"
                >
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

                    <div className="p-8 md:p-10">
                        {success ? (
                            /* Success State */
                            <motion.div {...fadeUp(0)} className="text-center py-6">
                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-8px_rgba(16,185,129,0.3)]">
                                    <Mail className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-2">
                                    <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                                        Verifique su Email
                                    </span>
                                </h2>
                                <p className="text-zinc-400 text-sm mb-6">
                                    Hemos enviado un enlace de verificación a{' '}
                                    <span className="text-blue-400 font-medium">{formData.email}</span>.
                                    <br />Revise su bandeja de entrada (y spam).
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => router.push('/auth/signin')}
                                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm transition-all hover:from-blue-500 hover:to-blue-400 shadow-[0_0_30px_-8px_rgba(59,130,246,0.4)]"
                                    >
                                        Ir a Iniciar Sesión
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Header */}
                                <motion.div {...fadeUp(0.2)} className="text-center mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_-8px_rgba(59,130,246,0.3)]">
                                        <ShieldCheck className="h-7 w-7 text-blue-400" />
                                    </div>
                                    <h1 className="text-2xl font-black tracking-[-0.02em]">
                                        <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                                            Crear Cuenta
                                        </span>
                                    </h1>
                                    <p className="text-zinc-500 text-sm mt-2">
                                        Regístrese para acceder al sistema MLS
                                    </p>
                                </motion.div>

                                {/* Form */}
                                <motion.form {...fadeUp(0.3)} onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={(e) => updateField('firstName', e.target.value)}
                                                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                                placeholder="Juan"
                                                autoComplete="given-name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => updateField('lastName', e.target.value)}
                                                className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                                placeholder="Pérez"
                                                autoComplete="family-name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                            placeholder="correo@empresa.com"
                                            autoComplete="email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => updateField('password', e.target.value)}
                                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                            placeholder="Mínimo 6 caracteres"
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono tracking-wider text-zinc-500 uppercase mb-2">
                                            Confirmar Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => updateField('confirmPassword', e.target.value)}
                                            className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 text-white placeholder:text-zinc-600 transition-all"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        />
                                    </div>

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
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Creando cuenta...</>
                                        ) : (
                                            'Crear Cuenta'
                                        )}
                                    </button>
                                </motion.form>

                                {/* Sign in link */}
                                <motion.div {...fadeUp(0.4)} className="text-center mt-6">
                                    <Link href="/auth/signin" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors group">
                                        ¿Ya tiene cuenta?{' '}
                                        <span className="text-blue-500/70 group-hover:text-blue-400 underline decoration-dashed underline-offset-4 decoration-blue-500/30">
                                            Iniciar sesión
                                        </span>
                                    </Link>
                                </motion.div>
                            </>
                        )}
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
