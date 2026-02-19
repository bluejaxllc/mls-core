import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 font-['Press_Start_2P'] text-[#E60012]">
            <h1 className="text-4xl mb-8 drop-shadow-[4px_4px_0px_rgba(59,130,246,0.3)] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">GAME OVER</h1>
            <h2 className="text-sm text-white mb-8 text-center max-w-lg leading-relaxed border-4 border-blue-500/30 p-6 bg-black rounded-lg shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] relative overflow-hidden">
                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
                ACCESS DENIED<br /><br />
                <span className="text-[10px] text-zinc-400">YOUR PERMISSION LEVEL IS TOO LOW FOR THIS LEVEL.</span>
            </h2>
            <Link href="/">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 inline-flex items-center justify-center text-xs px-6 py-4 border-b-4 border-r-4 border-blue-800 active:border-0 active:translate-y-1 transition-all cursor-pointer rounded shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]">
                    TRY AGAIN (Return Home)
                </div>
            </Link>
        </div>
    );
}
