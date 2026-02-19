import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists, based on other UI components

interface ImageCarouselProps {
    images: string[];
    onRemove?: (index: number) => void;
    className?: string;
}

export function ImageCarousel({ images, onRemove, className }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1 === images.length ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    if (!images || images.length === 0) {
        return (
            <div className={cn("w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground", className)}>
                No images available
            </div>
        );
    }

    return (
        <div className={cn("relative w-full aspect-video group overflow-hidden rounded-lg bg-black/5", className)}>
            <AnimatePresence mode='wait'>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex]}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                    alt={`Property Image ${currentIndex + 1}`}
                />
            </AnimatePresence>

            {/* Controls - Only show if more than 1 image */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.preventDefault(); handlePrev(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); handleNext(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                                className={cn(
                                    "w-2 h-2 rounded-full transition-colors",
                                    idx === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/80"
                                )}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Remove Button (Optional) */}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onRemove(currentIndex);
                        if (currentIndex >= images.length - 1) setCurrentIndex(Math.max(0, images.length - 2));
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remove Image"
                >
                    <X size={16} />
                </button>
            )}

            {/* Counter Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
