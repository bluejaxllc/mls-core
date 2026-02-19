'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, MapPin, CheckCircle2, XCircle, Loader2, Eye, User, Building2, Filter } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import toast from 'react-hot-toast';

interface Appointment {
    id: string;
    listingId: string;
    agentId: string;
    visitorId: string;
    startTime: string;
    endTime: string;
    status: string;
    notes: string | null;
    createdAt: string;
    listing: {
        title: string;
        address: string;
        images: string[];
    };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800' },
    CONFIRMED: { label: 'Confirmada', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800' },
    CANCELLED: { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800' },
    COMPLETED: { label: 'Completada', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' },
};

export default function AppointmentsPage() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'agent' | 'visitor'>('agent');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [updating, setUpdating] = useState<string | null>(null);

    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const fetchAppointments = async () => {
        try {
            const res = await fetch(`${API}/api/protected/appointments?role=${role}`, {
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments(data);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            setLoading(true);
            fetchAppointments();
        }
    }, [session, role]);

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        try {
            const res = await fetch(`${API}/api/protected/appointments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${(session as any)?.accessToken}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const statusLabel = status === 'CONFIRMED' ? 'confirmada' : status === 'CANCELLED' ? 'cancelada' : 'completada';
                toast.success(`Cita ${statusLabel}`);
                fetchAppointments();
            } else {
                toast.error('Error al actualizar la cita');
            }
        } catch {
            toast.error('Error de conexión');
        } finally {
            setUpdating(null);
        }
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    };

    const filtered = statusFilter === 'ALL'
        ? appointments
        : appointments.filter(a => a.status === statusFilter);

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'PENDING').length,
        confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
        completed: appointments.filter(a => a.status === 'COMPLETED').length,
    };

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Citas</h1>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-xl">Gestiona tus visitas a propiedades</p>

                    {/* Role Toggle */}
                    <div className="mt-4 flex gap-2">
                        {(['agent', 'visitor'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => setRole(r)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${role === r
                                    ? 'bg-white text-purple-700 shadow-lg'
                                    : 'bg-white/15 text-white/80 hover:bg-white/25'
                                    }`}
                            >
                                {r === 'agent' ? 'Como Agente' : 'Como Visitante'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total', value: stats.total, color: 'text-foreground', bg: 'from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20' },
                    { label: 'Pendientes', value: stats.pending, color: 'text-amber-600', bg: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20' },
                    { label: 'Confirmadas', value: stats.confirmed, color: 'text-emerald-600', bg: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20' },
                    { label: 'Completadas', value: stats.completed, color: 'text-blue-600', bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20' },
                ].map((s, idx) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`bg-gradient-to-br ${s.bg} border rounded-xl p-4`}
                    >
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${statusFilter === s
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {s === 'ALL' ? 'Todas' : STATUS_CONFIG[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-500" />
                    <p className="text-muted-foreground text-sm">Cargando citas...</p>
                </div>
            ) : filtered.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <CalendarDays className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin citas</h3>
                    <p className="text-muted-foreground text-sm">
                        {statusFilter !== 'ALL'
                            ? 'No hay citas con este estado'
                            : role === 'agent'
                                ? 'Aún no tienes visitas programadas'
                                : 'No has solicitado ninguna visita'}
                    </p>
                </AnimatedCard>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((apt, idx) => {
                            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.PENDING;
                            const image = apt.listing.images?.[0];
                            return (
                                <motion.div
                                    key={apt.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <AnimatedCard className="p-0 overflow-hidden" index={idx}>
                                        <div className="flex flex-col md:flex-row">
                                            {/* Image */}
                                            <div className="md:w-48 h-32 md:h-auto bg-muted shrink-0">
                                                {image ? (
                                                    <img src={image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Building2 className="h-10 w-10 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-4 md:p-5">
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <div>
                                                        <h3 className="font-bold text-sm md:text-base">{apt.listing.title || 'Propiedad'}</h3>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <MapPin className="h-3 w-3" />
                                                            {apt.listing.address || 'Sin dirección'}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {formatDate(apt.startTime)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {formatTime(apt.startTime)} – {formatTime(apt.endTime)}
                                                    </span>
                                                </div>

                                                {apt.notes && (
                                                    <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-purple-300 pl-2">
                                                        {apt.notes}
                                                    </p>
                                                )}

                                                {/* Actions */}
                                                {apt.status === 'PENDING' && role === 'agent' && (
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                                                            disabled={updating === apt.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Confirmar
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(apt.id, 'CANCELLED')}
                                                            disabled={updating === apt.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                                        >
                                                            <XCircle className="h-3.5 w-3.5" />
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                )}

                                                {apt.status === 'CONFIRMED' && role === 'agent' && (
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => updateStatus(apt.id, 'COMPLETED')}
                                                            disabled={updating === apt.id}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                            Marcar Completada
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </AnimatedCard>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageTransition>
    );
}
