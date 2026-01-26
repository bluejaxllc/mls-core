"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RetroSignInPage() {
    const router = useRouter();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/");
        } else {
            alert("GAME OVER: Invalid Credentials");
        }
    };

    return (
        <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center font-['Press_Start_2P'] text-white">
            <div className="max-w-md w-full border-4 border-white p-2 bg-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="border-4 border-white p-8 flex flex-col items-center gap-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl text-[#3b82f6] drop-shadow-[2px_2px_0px_white] tracking-tighter">.BLUE JAX</h1>
                        <p className="text-xs text-zinc-400">CORE SYSTEM ACCESS</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
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
                            className="w-full bg-[#3b82f6] border-2 border-white text-white p-4 text-xs hover:bg-[#2563eb] active:translate-y-1 transition-all"
                        >
                            AUTHENTICATE
                        </button>
                    </form>

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
