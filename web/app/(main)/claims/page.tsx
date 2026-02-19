
'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronRight, Inbox, Clock, CheckCircle, Plus, Shield, Scale, FileWarning, Search, X } from 'lucide-react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { ClaimForm } from '@/components/claims/ClaimForm';
import { motion, AnimatePresence } from 'framer-motion';

interface Claim {
    id: string;
    listingId: string;
    type: string;
    status: string;
    notes: string;
    createdAt: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    OWNERSHIP: { label: 'Disputa de Propiedad', color: 'text-red-500', bg: 'bg-red-500/10', icon: Scale },
    DUPLICATE: { label: 'Listado Duplicado', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: FileWarning },
    INACCURATE_DATA: { label: 'Datos Incorrectos', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertTriangle },
    SPAM: { label: 'Spam / Fraude', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Shield },
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
    OPEN: { label: 'Abierto', color: 'text-red-500', bgColor: 'bg-red-500/10 border-red-500/20', icon: AlertTriangle },
    UNDER_REVIEW: { label: 'En Revisión', color: 'text-yellow-500', bgColor: 'bg-yellow-500/10 border-yellow-500/20', icon: Inbox },
    RESOLVED: { label: 'Resuelto', color: 'text-green-500', bgColor: 'bg-green-500/10 border-green-500/20', icon: CheckCircle },
    REJECTED: { label: 'Rechazado', color: 'text-gray-500', bgColor: 'bg-gray-500/10 border-gray-500/20', icon: X },
};

export default function ClaimsPage() {
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('');

    const fetchClaims = async () => {
        try {
            const res = await fetch('/api/governance/claims');
            if (res.ok) {
                const data = await res.json();
                setClaims(data);
            }
        } catch (error) {
            console.error('Failed to fetch claims:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const filteredClaims = filterStatus
        ? claims.filter(c => c.status === filterStatus)
        : claims;

    const openCount = claims.filter(c => c.status === 'OPEN').length;
    const reviewCount = claims.filter(c => c.status === 'UNDER_REVIEW').length;
    const resolvedCount = claims.filter(c => c.status === 'RESOLVED').length;

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Reclamos y Disputas
                        </span>
                        <Shield className="h-5 w-5 text-red-500" />
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Gestiona conflictos de propiedad, reportes de datos y listados duplicados.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AnimatedButton variant="secondary" className="text-sm font-medium" onClick={fetchClaims}>
                        Actualizar
                    </AnimatedButton>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-shadow font-medium text-sm"
                    >
                        <Plus className="h-4 w-4" />
                        {showForm ? 'Cerrar Formulario' : 'Nuevo Reclamo'}
                    </motion.button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: claims.length, gradient: 'from-slate-500/10 to-gray-500/10', iconColor: 'text-muted-foreground', icon: Scale },
                    { label: 'Abiertos', value: openCount, gradient: 'from-red-500/10 to-rose-500/10', iconColor: 'text-red-500', icon: AlertTriangle },
                    { label: 'En Revisión', value: reviewCount, gradient: 'from-yellow-500/10 to-amber-500/10', iconColor: 'text-yellow-500', icon: Clock },
                    { label: 'Resueltos', value: resolvedCount, gradient: 'from-green-500/10 to-emerald-500/10', iconColor: 'text-green-500', icon: CheckCircle },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br ${stat.gradient} border border-white/10 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-white/20 transition-colors`}
                        onClick={() => setFilterStatus(stat.label === 'Total' ? '' : stat.label === 'Abiertos' ? 'OPEN' : stat.label === 'En Revisión' ? 'UNDER_REVIEW' : 'RESOLVED')}
                    >
                        <div className={`p-2 rounded-lg bg-background/50 ${stat.iconColor}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Claim Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <ClaimForm
                            onSuccess={() => {
                                setShowForm(false);
                                fetchClaims();
                            }}
                            onCancel={() => setShowForm(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filter indicator */}
            {filterStatus && (
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Filtrando por:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[filterStatus]?.bgColor} ${STATUS_CONFIG[filterStatus]?.color}`}>
                        {STATUS_CONFIG[filterStatus]?.label}
                    </span>
                    <button onClick={() => setFilterStatus('')} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            {/* Claims List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse bg-gradient-to-br from-blue-950/5 via-card/40 to-card/20 border border-blue-500/10 rounded-xl p-5 space-y-3">
                            <div className="h-5 bg-muted/50 rounded w-2/3" />
                            <div className="h-3 bg-muted/50 rounded w-1/2" />
                            <div className="h-8 bg-muted/50 rounded w-full" />
                        </div>
                    ))}
                </div>
            ) : filteredClaims.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-muted/5">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-semibold text-lg mb-1">
                        {filterStatus ? 'Sin reclamos con este filtro' : 'No hay reclamos registrados'}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        {filterStatus
                            ? 'Intenta con otro filtro o elimina el actual.'
                            : 'Cuando se presente un conflicto de propiedad o datos, podrás crear un reclamo aquí.'
                        }
                    </p>
                    {!filterStatus && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg font-medium text-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Crear Primer Reclamo
                        </motion.button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClaims.map((claim, i) => {
                        const typeConfig = TYPE_CONFIG[claim.type] || TYPE_CONFIG.INACCURATE_DATA;
                        const statusConfig = STATUS_CONFIG[claim.status] || STATUS_CONFIG.OPEN;
                        const TypeIcon = typeConfig.icon;
                        const StatusIcon = statusConfig.icon;

                        return (
                            <AnimatedCard
                                key={claim.id}
                                index={i}
                                className="p-5 flex flex-col group hover:border-red-500/20 transition-all"
                            >
                                {/* Type + Status row */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${typeConfig.bg} ${typeConfig.color}`}>
                                        <TypeIcon className="h-3 w-3" />
                                        {typeConfig.label}
                                    </span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusConfig.bgColor} ${statusConfig.color}`}>
                                        <StatusIcon className="h-2.5 w-2.5" />
                                        {statusConfig.label}
                                    </span>
                                </div>

                                {/* Listing ID */}
                                <div className="text-xs text-muted-foreground mb-2 font-mono">
                                    Listado: {claim.listingId.substring(0, 12)}...
                                </div>

                                {/* Notes */}
                                {claim.notes && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
                                        {claim.notes}
                                    </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto">
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {new Date(claim.createdAt).toLocaleDateString('es-MX', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                        ID: {claim.id.substring(0, 8)}
                                    </span>
                                </div>
                            </AnimatedCard>
                        );
                    })}
                </div>
            )}
        </PageTransition>
    )
}
