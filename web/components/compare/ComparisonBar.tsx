'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useComparison } from '@/lib/comparison-context';
import { X, ArrowRight, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ComparisonBar() {
    const { items, removeItem, clearAll } = useComparison();
    const router = useRouter();

    if (items.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl"
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="hidden md:flex items-center gap-2 text-white pr-4 border-r border-slate-700">
                            <BarChart3 className="h-5 w-5 text-blue-400" />
                            <span className="text-sm font-medium">Comparar</span>
                        </div>

                        {/* Selected Items */}
                        <div className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                            {items.map(item => (
                                <motion.div
                                    key={item.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="flex items-center gap-2 bg-slate-800 rounded-lg px-3 py-2 min-w-0 shrink-0"
                                >
                                    {item.image && (
                                        <img src={item.image} alt="" className="h-8 w-8 rounded object-cover" />
                                    )}
                                    <span className="text-white text-sm truncate max-w-[120px]">
                                        {item.title}
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-slate-400 hover:text-red-400 transition-colors shrink-0"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            ))}

                            {/* Empty Slots */}
                            {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="h-12 w-32 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center shrink-0">
                                    <span className="text-slate-500 text-xs">+ Agregar</span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={clearAll}
                                className="text-slate-400 hover:text-white text-sm transition-colors"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={() => router.push('/compare')}
                                disabled={items.length < 2}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                            >
                                Comparar ({items.length})
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
