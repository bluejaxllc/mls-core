import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 font-['Press_Start_2P'] text-[#E60012]">
            <h1 className="text-4xl mb-8 drop-shadow-[4px_4px_0px_white]">GAME OVER</h1>
            <h2 className="text-sm text-white mb-8 text-center max-w-lg leading-relaxed border-4 border-white p-6 bg-black">
                ACCESS DENIED<br /><br />
                <span className="text-[10px] text-zinc-400">YOUR PERMISSION LEVEL IS TOO LOW FOR THIS LEVEL.</span>
            </h2>
            <Link href="/">
                <div className="bg-white text-black hover:bg-zinc-200 inline-flex items-center justify-center text-xs px-6 py-4 border-b-4 border-r-4 border-zinc-500 active:border-0 active:translate-y-1 transition-all cursor-pointer">
                    TRY AGAIN (Return Home)
                </div>
            </Link>
        </div>
    );
}
