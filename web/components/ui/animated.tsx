"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { ButtonHTMLAttributes, InputHTMLAttributes } from "react";

// --- ANIMATION PRESETS ---

export const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const, // Custom easing
        },
    }),
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export const hoverScale = {
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
};

// --- COMPONENTS ---

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerContainer}
            className={cn("w-full", className)}
        >
            {children}
        </motion.div>
    );
}

export function AnimatedCard({ children, className, index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
    return (
        <motion.div
            custom={index}
            variants={fadeIn}
            whileHover={{ y: -5, boxShadow: "0 0 25px -5px rgba(59,130,246,0.25)" }}
            className={cn("bg-gradient-to-br from-blue-950/10 via-card/60 to-card/40 backdrop-blur-md text-card-foreground rounded-xl border border-blue-500/10 shadow-sm transition-all duration-500 hover:border-blue-500/25 relative overflow-hidden group/card", className)}
        >
            {/* Top glow line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover/card:via-blue-400/40 transition-all duration-500" />
            {children}
        </motion.div>
    );
}

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
    isLoading?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ className, variant = "primary", isLoading, children, ...props }, ref) => {
        const baseStyles = "relative inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 focus:ring-blue-500 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)]",
            secondary: "bg-transparent text-foreground border border-white/20 hover:bg-white/10 hover:border-white/40 focus:ring-white/50",
            ghost: "hover:bg-primary/20 hover:text-primary",
            destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(baseStyles, variants[variant], className)}
                {...(props as any)}
            >
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        className="mr-2"
                    >
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                )}
                {children}
                {variant === 'primary' && (
                    <motion.div
                        className="absolute inset-0 rounded-lg bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ scale: 2, opacity: 0, transition: { duration: 0.4 } }}
                    />
                )}
            </motion.button>
        );
    }
);
AnimatedButton.displayName = "AnimatedButton";

export const AnimatedInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <motion.div
                className="relative group"
                initial={false}
                whileFocus="focus"
            >
                <motion.input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-blue-500/10 bg-card/30 backdrop-blur-sm px-3 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)]",
                        className
                    )}
                    {...(props as any)}
                />
                {/* Bottom glow line on focus */}
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-focus-within:via-blue-500/30 transition-all duration-500" />
            </motion.div>
        )
    }
)
AnimatedInput.displayName = "AnimatedInput";
