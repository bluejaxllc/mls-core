'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Loader2, CheckCircle2, XCircle, Clock, Mail, Phone, Building2, Search, UserPlus } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { toast } from 'react-hot-toast';

interface BetaUser {
    id: string;
    email: string;
    name: string;
    company: string | null;
    phone: string | null;
    status: string;
    createdAt: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    PENDING: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800', icon: Clock },
    APPROVED: { label: 'Aprobado', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
    REJECTED: { label: 'Rechazado', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800', icon: XCircle },
};

export default function BetaAdminPage() {
    const [users, setUsers] = useState<BetaUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/beta');
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error('Failed to fetch beta users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/beta', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
                toast.success(status === 'APPROVED' ? 'Acceso aprobado' : status === 'REJECTED' ? 'Solicitud rechazada' : 'Estado actualizado');
            }
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const filtered = users
        .filter(u => filter === 'ALL' || u.status === filter)
        .filter(u => {
            if (!search) return true;
            const q = search.toLowerCase();
            return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.company || '').toLowerCase().includes(q);
        });

    const counts = {
        ALL: users.length,
        PENDING: users.filter(u => u.status === 'PENDING').length,
        APPROVED: users.filter(u => u.status === 'APPROVED').length,
        REJECTED: users.filter(u => u.status === 'REJECTED').length,
    };

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <PageTransition className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-800 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Solicitudes Beta</h1>
                            <p className="text-white/70 text-sm">{users.length} solicitudes totales</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-4 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, email o empresa..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { key: 'ALL', label: 'Total', color: 'text-foreground', bg: 'from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900' },
                    { key: 'PENDING', label: 'Pendientes', color: 'text-amber-600', bg: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950' },
                    { key: 'APPROVED', label: 'Aprobados', color: 'text-emerald-600', bg: 'from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950' },
                    { key: 'REJECTED', label: 'Rechazados', color: 'text-red-500', bg: 'from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950' },
                ].map((s, idx) => (
                    <motion.div
                        key={s.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        onClick={() => setFilter(filter === s.key ? 'ALL' : s.key)}
                        className={`bg-gradient-to-br ${s.bg} border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${filter === s.key ? 'ring-2 ring-offset-1 ring-purple-500' : ''
                            }`}
                    >
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-black mt-1 ${s.color}`}>{counts[s.key as keyof typeof counts]}</p>
                    </motion.div>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-500" />
                    <p className="text-muted-foreground text-sm">Cargando solicitudes...</p>
                </div>
            ) : filtered.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin solicitudes</h3>
                    <p className="text-muted-foreground text-sm">No hay solicitudes con estos criterios</p>
                </AnimatedCard>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {filtered.map((user, idx) => {
                            const cfg = STATUS_CFG[user.status] || STATUS_CFG.PENDING;
                            const Icon = cfg.icon;
                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`border rounded-xl p-4 ${cfg.bg} transition-all hover:shadow-md`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-sm">{user.name}</h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.color} bg-white/60 dark:bg-black/20`}>
                                                    <Icon className="h-3 w-3" />
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </span>
                                                {user.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phone}
                                                    </span>
                                                )}
                                                {user.company && (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" />
                                                        {user.company}
                                                    </span>
                                                )}
                                                <span className="text-muted-foreground/60">{fmtDate(user.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            {user.status !== 'APPROVED' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateStatus(user.id, 'APPROVED')}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Aprobar
                                                </motion.button>
                                            )}
                                            {user.status !== 'REJECTED' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateStatus(user.id, 'REJECTED')}
                                                    className="px-3 py-1.5 bg-red-500/10 text-red-600 border border-red-200 dark:border-red-900 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Rechazar
                                                </motion.button>
                                            )}
                                            {user.status !== 'PENDING' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateStatus(user.id, 'PENDING')}
                                                    className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
                                                >
                                                    Revertir
                                                </motion.button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageTransition>
    );
}
