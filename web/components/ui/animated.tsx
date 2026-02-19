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
            whileHover={{ y: -5, boxShadow: "0 0 20px -5px var(--primary)" }}
            className={cn("bg-card/40 backdrop-blur-md text-card-foreground rounded-xl border border-white/10 shadow-sm transition-all hover:border-primary/50 relative overflow-hidden", className)}
        >
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
            primary: "bg-primary text-primary-foreground hover:bg-yellow-400 focus:ring-primary shadow-[0_0_15px_rgba(255,230,0,0.4)]",
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
                className="relative"
                initial={false}
                whileFocus="focus"
            >
                <motion.input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-white/10 bg-card/30 backdrop-blur-sm px-3 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                        className
                    )}
                    {...(props as any)}
                />
            </motion.div>
        )
    }
)
AnimatedInput.displayName = "AnimatedInput";
