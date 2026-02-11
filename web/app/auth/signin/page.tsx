"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetroSignInPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
                }, 2000);
            } else {
                setBetaStatus('error');
            }
        } catch (error) {
            setBetaStatus('error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/dashboard");
        } else {
            alert("GAME OVER: Invalid Credentials");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center font-['Press_Start_2P'] text-white relative">

            {/* Beta Modal */}
            {showBeta && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border-4 border-blue-500 p-6 max-w-md w-full shadow-[0_0_50px_rgba(59,130,246,0.3)] relative">
                        <button
                            onClick={() => setShowBeta(false)}
                            className="absolute top-2 right-2 text-zinc-500 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl text-blue-500 mb-4 text-center">JOIN PROTOCOL BETA</h2>

                        {betaStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-4">✅</div>
                                <p className="text-green-500 text-sm mb-2">REQUEST RECEIVED</p>
                                <p className="text-[10px] text-zinc-400">ADMIN WILL PROCESS YOUR ACCESS TOKEN.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleBetaSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-blue-400 block mb-1">CODENAME / NAME *</label>
                                    <input
                                        required
                                        className="w-full bg-black border border-zinc-700 p-2 text-xs focus:border-blue-500 outline-none text-white font-mono"
                                        value={betaForm.name}
                                        onChange={e => setBetaForm({ ...betaForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-blue-400 block mb-1">EMAIL FREQUENCY *</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full bg-black border border-zinc-700 p-2 text-xs focus:border-blue-500 outline-none text-white font-mono"
                                        value={betaForm.email}
                                        onChange={e => setBetaForm({ ...betaForm, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-blue-400 block mb-1">FACTION (COMPANY)</label>
                                        <input
                                            className="w-full bg-black border border-zinc-700 p-2 text-xs focus:border-blue-500 outline-none text-white font-mono"
                                            value={betaForm.company}
                                            onChange={e => setBetaForm({ ...betaForm, company: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-blue-400 block mb-1">COMMS (PHONE)</label>
                                        <input
                                            className="w-full bg-black border border-zinc-700 p-2 text-xs focus:border-blue-500 outline-none text-white font-mono"
                                            value={betaForm.phone}
                                            onChange={e => setBetaForm({ ...betaForm, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {betaStatus === 'error' && (
                                    <p className="text-red-500 text-[10px] text-center">TRANSMISSION FAILED. RETRY.</p>
                                )}

                                <button
                                    disabled={betaStatus === 'loading'}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 text-xs mt-4 border-2 border-transparent hover:border-white transition-all disabled:opacity-50"
                                >
                                    {betaStatus === 'loading' ? 'TRANSMITTING...' : 'INITIATE REQUEST'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-md w-full border-4 border-white p-2 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="border-4 border-white p-8 flex flex-col items-center gap-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl text-[#3b82f6] drop-shadow-[2px_2px_0px_white] tracking-tighter">.BLUE JAX</h1>
                        <p className="text-xs text-zinc-400">CORE SYSTEM ACCESS</p>
                    </div>

                    {/* Form */}
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-[#3b82f6]">USERNAME</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black border-2 border-white p-3 text-xs focus:outline-none focus:border-[#3b82f6] text-white font-mono"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-[#3b82f6]">PASSWORD</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border-2 border-white p-3 text-xs focus:outline-none focus:border-[#3b82f6] text-white font-mono"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black border-2 border-[#3b82f6] text-[#3b82f6] p-4 text-xs hover:bg-[#3b82f6] hover:text-white active:translate-y-1 transition-all"
                            >
                                AUTHENTICATE
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowBeta(true)}
                                className="text-[10px] text-zinc-500 hover:text-blue-400 underline decoration-dashed underline-offset-4"
                            >
                                [ REQUEST BETA ACCESS ]
                            </button>
                        </div>
                    </div>

                    {/* Footer / Credits */}
                    <div className="text-[8px] text-zinc-500 text-center mt-4">
                        <p>bluejax.core © 2026</p>
                        <p>INSERT TOKEN TO CONTINUE</p>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none opacity-5 z-[-1]"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>
        </div>
    );
}
