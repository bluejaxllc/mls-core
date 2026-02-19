'use client';

import { useComparison } from '@/lib/comparison-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Download, Building2, MapPin, DollarSign, Shield, Layers, GitCompare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';

export default function ComparePage() {
    const { items, removeItem, clearAll } = useComparison();
    const router = useRouter();

    if (items.length < 2) {
        return (
            <PageTransition className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="h-20 w-20 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl flex items-center justify-center">
                        <GitCompare className="h-10 w-10 text-muted-foreground/40" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Selecciona al menos 2 propiedades</h1>
                    <p className="text-muted-foreground text-sm max-w-md mx-auto">Vuelve a la página de listados y selecciona propiedades para comparar.</p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/listings')}
                        className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Ir a Listados
                    </motion.button>
                </motion.div>
            </PageTransition>
        );
    }

    const rows = [
        { label: 'Precio', icon: <DollarSign className="h-4 w-4" />, render: (item: any) => item.price ? `$${item.price.toLocaleString()} MXN` : 'No disponible' },
        { label: 'Dirección', icon: <MapPin className="h-4 w-4" />, render: (item: any) => item.address || 'No disponible' },
        { label: 'Tipo', icon: <Layers className="h-4 w-4" />, render: (item: any) => item.propertyType || item.source || '-' },
        { label: 'Estado', icon: <Shield className="h-4 w-4" />, render: (item: any) => item.status || '-' },
        {
            label: 'Confianza', icon: <Shield className="h-4 w-4" />, render: (item: any) => {
                const score = item.trustScore ?? 50;
                const color = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';
                return <span className={`font-bold ${color}`}>{score}/100</span>;
            }
        },
    ];

    return (
        <PageTransition className="space-y-6 pb-20">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <GitCompare className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Comparación de Propiedades</h1>
                    </div>
                    <p className="text-white/70 text-sm">Comparando {items.length} propiedades lado a lado</p>
                </div>
            </div>

            {/* Comparison Table */}
            <AnimatedCard className="p-0 overflow-hidden" index={0}>
                {/* Property Headers */}
                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}>
                    <div className="p-4 bg-muted/50 border-b border-r font-semibold text-sm text-muted-foreground">
                        Propiedad
                    </div>
                    {items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 border-b relative group"
                        >
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="h-40 rounded-lg overflow-hidden mb-3 bg-muted">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-sm truncate" title={item.title}>{item.title}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Data Rows */}
                {rows.map((row, rowIdx) => (
                    <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + rowIdx * 0.05 }}
                        className="grid"
                        style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
                    >
                        <div className={`p-4 border-r flex items-center gap-2 text-sm font-medium ${rowIdx % 2 === 0 ? 'bg-muted/30' : ''}`}>
                            {row.icon}
                            {row.label}
                        </div>
                        {items.map(item => (
                            <div
                                key={item.id}
                                className={`p-4 text-sm ${rowIdx % 2 === 0 ? 'bg-muted/30' : ''}`}
                            >
                                {row.render(item)}
                            </div>
                        ))}
                    </motion.div>
                ))}
            </AnimatedCard>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearAll}
                    className="px-4 py-2 border rounded-xl text-sm hover:bg-muted transition-colors"
                >
                    Limpiar Selección
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.print()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                </motion.button>
            </div>
        </PageTransition>
    );
}
