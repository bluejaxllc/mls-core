'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Loader2, CheckCircle2, XCircle, Clock,
    Mail, Phone, Shield, Search, UserCog, BadgeCheck, Ban
} from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { toast } from 'react-hot-toast';

interface StaffUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    roles: string;
    phoneNumber: string | null;
    mlsStatus: string;
    licenseNumber: string | null;
    createdAt: string;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    ACTIVE: { label: 'Activo', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
    INACTIVE: { label: 'Inactivo', color: 'text-zinc-500', bg: 'bg-zinc-100 dark:bg-zinc-900/30 border-zinc-300 dark:border-zinc-700', icon: Clock },
    SUSPENDED: { label: 'Suspendido', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800', icon: XCircle },
};

const ROLE_BADGES: Record<string, { color: string; icon: any }> = {
    admin: { color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', icon: Shield },
    agent: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', icon: BadgeCheck },
    user: { color: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400', icon: Users },
};

export default function StaffManagementPage() {
    const [users, setUsers] = useState<StaffUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/staff');
            if (res.ok) setUsers(await res.json());
        } catch (err) {
            console.error('Failed to fetch staff:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const updateUser = async (id: string, data: { roles?: string; mlsStatus?: string }) => {
        try {
            const res = await fetch('/api/staff', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...data })
            });
            if (res.ok) {
                const updated = await res.json();
                setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
                toast.success('Personal actualizado');
            }
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const getName = (u: StaffUser) => {
        const parts = [u.firstName, u.lastName].filter(Boolean);
        return parts.length > 0 ? parts.join(' ') : u.email.split('@')[0];
    };

    const getRoles = (r: string) => r.split(',').map(s => s.trim()).filter(Boolean);

    const filtered = users
        .filter(u => filter === 'ALL' || u.mlsStatus === filter)
        .filter(u => {
            if (!search) return true;
            const q = search.toLowerCase();
            const name = getName(u).toLowerCase();
            return name.includes(q) || u.email.toLowerCase().includes(q) || (u.phoneNumber || '').includes(q);
        });

    const counts = {
        ALL: users.length,
        ACTIVE: users.filter(u => u.mlsStatus === 'ACTIVE').length,
        INACTIVE: users.filter(u => u.mlsStatus === 'INACTIVE').length,
        SUSPENDED: users.filter(u => u.mlsStatus === 'SUSPENDED').length,
    };

    const fmtDate = (d: string) => new Date(d).toLocaleDateString('es-MX', {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        <PageTransition className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/5 rounded-full -ml-28 -mb-28" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <UserCog className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                                Gestión de Personal
                            </h1>
                            <p className="text-white/70 text-sm">{users.length} miembros del equipo</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-4 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, email o teléfono..."
                            className="w-full pl-9 pr-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { key: 'ALL', label: 'Total', color: 'text-foreground', bg: 'from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900' },
                    { key: 'ACTIVE', label: 'Activos', color: 'text-emerald-600', bg: 'from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950' },
                    { key: 'INACTIVE', label: 'Inactivos', color: 'text-zinc-500', bg: 'from-zinc-50 to-gray-50 dark:from-zinc-950 dark:to-gray-950' },
                    { key: 'SUSPENDED', label: 'Suspendidos', color: 'text-red-500', bg: 'from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950' },
                ].map((s, idx) => (
                    <motion.div
                        key={s.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        onClick={() => setFilter(filter === s.key ? 'ALL' : s.key)}
                        className={`bg-gradient-to-br ${s.bg} border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${filter === s.key ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                            }`}
                    >
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-black mt-1 ${s.color}`}>{counts[s.key as keyof typeof counts]}</p>
                    </motion.div>
                ))}
            </div>

            {/* Staff List */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-muted-foreground text-sm">Cargando personal...</p>
                </div>
            ) : filtered.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin resultados</h3>
                    <p className="text-muted-foreground text-sm">No hay personal con estos criterios</p>
                </AnimatedCard>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {filtered.map((user, idx) => {
                            const cfg = STATUS_CFG[user.mlsStatus] || STATUS_CFG.ACTIVE;
                            const Icon = cfg.icon;
                            const roles = getRoles(user.roles);
                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className={`border rounded-xl p-4 ${cfg.bg} transition-all hover:shadow-md`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                                        {/* Avatar + Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {getName(user).charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-bold text-sm truncate">{getName(user)}</h3>
                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.color} bg-white/60 dark:bg-black/20`}>
                                                            <Icon className="h-3 w-3" />
                                                            {cfg.label}
                                                        </span>
                                                    </div>
                                                    {/* Role badges */}
                                                    <div className="flex gap-1 mt-0.5 flex-wrap">
                                                        {roles.map(role => {
                                                            const rb = ROLE_BADGES[role] || ROLE_BADGES.user;
                                                            const RoleIcon = rb.icon;
                                                            return (
                                                                <span key={role} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${rb.color}`}>
                                                                    <RoleIcon className="h-2.5 w-2.5" />
                                                                    {role}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground ml-11">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </span>
                                                {user.phoneNumber && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phoneNumber}
                                                    </span>
                                                )}
                                                {user.licenseNumber && (
                                                    <span className="flex items-center gap-1">
                                                        <BadgeCheck className="h-3 w-3" />
                                                        Lic: {user.licenseNumber}
                                                    </span>
                                                )}
                                                <span className="text-muted-foreground/60">Registrado: {fmtDate(user.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0 ml-11 md:ml-0">
                                            {user.mlsStatus !== 'ACTIVE' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateUser(user.id, { mlsStatus: 'ACTIVE' })}
                                                    className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Activar
                                                </motion.button>
                                            )}
                                            {user.mlsStatus !== 'SUSPENDED' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateUser(user.id, { mlsStatus: 'SUSPENDED' })}
                                                    className="px-3 py-1.5 bg-red-500/10 text-red-600 border border-red-200 dark:border-red-900 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center gap-1"
                                                >
                                                    <Ban className="h-3.5 w-3.5" />
                                                    Suspender
                                                </motion.button>
                                            )}
                                            {user.mlsStatus === 'ACTIVE' && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => updateUser(user.id, { mlsStatus: 'INACTIVE' })}
                                                    className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/80 transition-colors"
                                                >
                                                    Desactivar
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
