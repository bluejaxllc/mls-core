"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Suspense } from "react";

const fadeUp = (delay: number = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
});

const ERROR_MESSAGES: Record<string, string> = {
    token_missing: "No se proporcionó un token de verificación.",
    invalid_token: "El enlace de verificación es inválido o ya fue utilizado.",
    expired: "El enlace de verificación ha expirado. Registre su cuenta nuevamente.",
    server_error: "Error del servidor. Intente nuevamente más tarde.",
};

function VerifyContent() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const msg = searchParams.get('msg');

    const isSuccess = status === 'success';
    const isError = status === 'error';
    const errorMessage = msg ? ERROR_MESSAGES[msg] || "Error desconocido." : "";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center relative overflow-hidden"
            style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
        >
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#0a0a0a] to-[#0a0a0a]"></div>
            </div>

            {/* Logo */}
            <motion.div {...fadeUp(0)} className="absolute top-6 right-6 z-20">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-blue-600 rounded-sm"></div>
                    <span className="font-bold tracking-tight text-sm font-mono">BLUE JAX</span>
                    <span className="text-zinc-600 text-xs font-mono">/ MLS</span>
                </div>
            </motion.div>

            <div className="relative z-10 w-full max-w-md px-4">
                <motion.div
                    {...fadeUp(0.1)}
                    className="relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-950/20 via-zinc-900/80 to-zinc-900/60 shadow-2xl"
                >
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

                    <div className="p-8 md:p-10 text-center">
                        {!status && (
                            /* Loading state */
                            <motion.div {...fadeUp(0)}>
                                <Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto mb-6" />
                                <h2 className="text-xl font-bold">Verificando...</h2>
                                <p className="text-zinc-500 text-sm mt-2">Procesando su solicitud de verificación.</p>
                            </motion.div>
                        )}

                        {isSuccess && (
                            <motion.div {...fadeUp(0)}>
                                <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_-8px_rgba(16,185,129,0.3)]">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-2">
                                    <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                                        Email Verificado
                                    </span>
                                </h2>
                                <p className="text-zinc-400 text-sm mb-6">
                                    Su cuenta ha sido verificada exitosamente. Ya puede iniciar sesión.
                                </p>
                                <Link
                                    href="/auth/signin"
                                    className="inline-block w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold text-sm text-center transition-all hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)]"
                                >
                                    Iniciar Sesión
                                </Link>
                            </motion.div>
                        )}

                        {isError && (
                            <motion.div {...fadeUp(0)}>
                                <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="h-8 w-8 text-red-400" />
                                </div>
                                <h2 className="text-xl font-black tracking-tight mb-2">
                                    <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                                        Error de Verificación
                                    </span>
                                </h2>
                                <p className="text-zinc-400 text-sm mb-6">{errorMessage}</p>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/auth/register"
                                        className="inline-block w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold text-sm text-center transition-all hover:from-blue-500 hover:to-blue-400"
                                    >
                                        Registrarse Nuevamente
                                    </Link>
                                    <Link
                                        href="/auth/signin"
                                        className="text-xs text-zinc-500 hover:text-blue-400 transition-colors"
                                    >
                                        Volver a Iniciar Sesión
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
