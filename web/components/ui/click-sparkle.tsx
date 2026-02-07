"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sparkle {
    id: number;
    x: number;
    y: number;
    color: string;
}

export function ClickSparkle() {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const id = Date.now();
            const colors = ["#60A5FA", "#34D399", "#A78BFA", "#F472B6"];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            setSparkles((prev) => [...prev, { id, x: e.clientX, y: e.clientY, color: randomColor }]);

            setTimeout(() => {
                setSparkles((prev) => prev.filter((s) => s.id !== id));
            }, 1000);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <AnimatePresence>
                {sparkles.map((sparkle) => (
                    <motion.div
                        key={sparkle.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            left: sparkle.x,
                            top: sparkle.y,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${sparkle.color}`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
