'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn, ImageOff } from 'lucide-react';

interface PropertyGalleryProps {
    images: string[];
    title: string;
    address?: string;
}

export function PropertyGallery({ images, title, address }: PropertyGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

    const validImages = images.filter((_, i) => !imgErrors.has(i));

    const handleImgError = (index: number) => {
        setImgErrors(prev => new Set(prev).add(index));
    };

    const navigate = (dir: 'prev' | 'next') => {
        if (images.length === 0) return;
        setActiveIndex(prev =>
            dir === 'next'
                ? (prev + 1) % images.length
                : (prev - 1 + images.length) % images.length
        );
    };

    if (!images || images.length === 0) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <ImageOff className="h-10 w-10 text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-lg font-medium text-slate-500">Sin imágenes disponibles</p>
                    <p className="text-sm text-slate-400 mt-1">{address || title}</p>
                </div>
                {address && (
                    <div className="w-full max-w-lg h-48 rounded-xl overflow-hidden border shadow-sm mt-2">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                            frameBorder="0"
                            scrolling="no"
                            loading="lazy"
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <>
            {/* Hero Image */}
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden group">
                <motion.img
                    key={activeIndex}
                    initial={{ opacity: 0.5, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={images[activeIndex]}
                    alt={`${title} - Foto ${activeIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImgError(activeIndex)}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Image counter */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    {activeIndex + 1} / {images.length}
                </div>

                {/* Zoom button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setLightboxOpen(true)}
                    className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ZoomIn className="h-4 w-4" />
                </motion.button>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <motion.button
                            whileHover={{ scale: 1.1, x: -2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('prev')}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-foreground p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1, x: 2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('next')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-foreground p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </motion.button>
                    </>
                )}

                {/* Info overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">{title}</h1>
                    {address && (
                        <p className="text-sm text-white/80 mt-1 drop-shadow">{address}</p>
                    )}
                </div>
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, i) => (
                        <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveIndex(i)}
                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex
                                    ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                    : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={img}
                                alt={`Thumb ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={() => handleImgError(i)}
                            />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm z-10"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                            {activeIndex + 1} / {images.length}
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('prev'); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm"
                                >
                                    <ChevronLeft className="h-8 w-8" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('next'); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur-sm"
                                >
                                    <ChevronRight className="h-8 w-8" />
                                </button>
                            </>
                        )}

                        <motion.img
                            key={`lightbox-${activeIndex}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={images[activeIndex]}
                            alt={`${title} - Foto ${activeIndex + 1}`}
                            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
