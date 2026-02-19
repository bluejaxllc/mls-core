"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
    return (
        <button
            onClick={() => signIn()}
            className="bg-[#E60012] text-white px-4 py-2 border-2 border-white hover:bg-[#ff0015] active:translate-y-1 transition-all font-['Press_Start_2P'] text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
        >
            START GAME (Sign In)
        </button>
    );
}
