'use client';
import { useLanguage } from '@/lib/i18n';
import { authFetch } from '@/lib/api';
import {
    Settings, Users, Database, Globe, Edit, Plus, X, Loader2,
    Shield, Activity, Server, Clock, Cpu, HardDrive,
    ChevronRight, Zap, Check, AlertCircle
} from 'lucide-react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

type TabId = 'general' | 'users' | 'database' | 'security';

const TABS: { id: TabId; label: string; icon: any }[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'security', label: 'Seguridad', icon: Shield },
];

export default function SystemPage() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [config, setConfig] = useState<any>(null);
    const [configLoading, setConfigLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form states for Region Modal
    const [formRegion, setFormRegion] = useState('MX-CHH');
    const [formCurrency, setFormCurrency] = useState('MXN');
    const [formTimezone, setFormTimezone] = useState('America/Chihuahua');

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const data = await authFetch('/api/system/config', {}, (session as any)?.accessToken);
                setConfig(data);
                if (data) {
                    setFormRegion(data.region);
                    setFormCurrency(data.currency);
                    setFormTimezone(data.timezone);
                }
            } catch (err) {
                console.error('Config fetch failed', err);
            } finally {
                setConfigLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            const updated = await authFetch('/api/system/config', {
                method: 'POST',
                body: JSON.stringify({
                    region: formRegion,
                    currency: formCurrency,
                    timezone: formTimezone
                })
            }, (session as any)?.accessToken);

            if (updated) {
                setConfig(updated);
                setShowRegionModal(false);
                toast.success('Configuración guardada exitosamente');
            }
        } catch (err) {
            console.error('Save failed', err);
            toast.error('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    if (configLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground text-sm">Cargando configuración...</p>
                </div>
            </div>
        );
    }

    return (
        <PageTransition className="space-y-6 max-w-5xl mx-auto">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 p-6 md:p-8 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.2),transparent_60%)]" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
                                <Settings className="h-6 w-6" />
                            </div>
                            {t.sections.system.title}
                        </h2>
                        <p className="text-sm text-blue-200 mt-2 max-w-lg">
                            {t.sections.system.subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                            </span>
                            Sistema Operacional
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Estado del Sistema',
                        value: 'Operacional',
                        icon: Activity,
                        color: 'text-emerald-500',
                        bg: 'bg-emerald-500/10',
                        border: 'border-emerald-500/20',
                        pulse: true
                    },
                    {
                        label: 'Tiempo de Actividad',
                        value: '99.8%',
                        icon: Clock,
                        color: 'text-blue-500',
                        bg: 'bg-blue-500/10',
                        border: 'border-blue-500/20'
                    },
                    {
                        label: 'Base de Datos',
                        value: 'PostgreSQL',
                        icon: HardDrive,
                        color: 'text-violet-500',
                        bg: 'bg-violet-500/10',
                        border: 'border-violet-500/20'
                    },
                    {
                        label: 'Usuarios Activos',
                        value: '2',
                        icon: Users,
                        color: 'text-amber-500',
                        bg: 'bg-amber-500/10',
                        border: 'border-amber-500/20'
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn("p-4 rounded-xl border bg-card", stat.border)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", stat.bg)}>
                                <stat.icon className={cn("h-5 w-5", stat.color)} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                                <p className="text-lg font-bold flex items-center gap-1.5">
                                    {stat.value}
                                    {stat.pulse && (
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tab Selector */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-background text-foreground shadow-sm border"
                                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {/* ─── GENERAL TAB ─── */}
                {activeTab === 'general' && (
                    <motion.div
                        key="general"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {/* Region Settings */}
                        <AnimatedCard className="p-6">
                            <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-blue-500/10">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                </div>
                                {t.sections.system.regionSettings}
                            </h3>
                            <div className="space-y-0">
                                {[
                                    { label: t.sections.system.activeRegion, value: config?.region || 'MX-CHH' },
                                    { label: t.sections.system.currency, value: `${config?.currency || 'MXN'} (${t.sections.system.pesos})` },
                                    { label: t.sections.system.timezone, value: config?.timezone || 'America/Chihuahua' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-mono font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                            <AnimatedButton
                                variant="secondary"
                                onClick={() => setShowRegionModal(true)}
                                className="mt-5 w-full justify-center text-sm"
                            >
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                {t.sections.system.editDefaults}
                            </AnimatedButton>
                        </AnimatedCard>

                        {/* System Info */}
                        <AnimatedCard className="p-6" index={1}>
                            <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-violet-500/10">
                                    <Server className="h-4 w-4 text-violet-500" />
                                </div>
                                Información del Sistema
                            </h3>
                            <div className="space-y-0">
                                {[
                                    { label: 'Versión', value: 'v2.1.0' },
                                    { label: 'Entorno', value: 'Producción' },
                                    { label: 'Motor de Reglas', value: 'v1.5.0' },
                                    { label: 'API', value: 'REST + WebSocket' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-mono font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* ─── USERS TAB ─── */}
                {activeTab === 'users' && (
                    <motion.div
                        key="users"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnimatedCard className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-amber-500/10">
                                        <Users className="h-4 w-4 text-amber-500" />
                                    </div>
                                    {t.sections.system.userDirectory}
                                </h3>
                                <AnimatedButton
                                    variant="primary"
                                    className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20"
                                    onClick={() => setShowUserModal(true)}
                                >
                                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar Usuario
                                </AnimatedButton>
                            </div>

                            <div className="space-y-3">
                                {[
                                    {
                                        initials: 'BA',
                                        name: t.common.brokerAdmin,
                                        email: 'admin@remax.com',
                                        org: 'RE/MAX Polanco',
                                        color: 'bg-blue-500/20 text-blue-500',
                                        role: 'Administrador',
                                        roleColor: 'bg-blue-50 text-blue-700 border-blue-200',
                                        online: true,
                                    },
                                    {
                                        initials: 'SA',
                                        name: t.common.systemAdmin,
                                        email: 'admin@bluejax.ai',
                                        org: 'Blue Jax Core',
                                        color: 'bg-violet-500/20 text-violet-500',
                                        role: 'Super Admin',
                                        roleColor: 'bg-violet-50 text-violet-700 border-violet-200',
                                        online: false,
                                    },
                                ].map((user, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm", user.color)}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email} • {user.org}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", user.roleColor)}>
                                                {user.role}
                                            </span>
                                            <span className={cn(
                                                "flex items-center gap-1.5 text-xs px-2 py-1 rounded-full",
                                                user.online ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                                            )}>
                                                <span className={cn("h-1.5 w-1.5 rounded-full", user.online ? "bg-emerald-500" : "bg-gray-400")} />
                                                {user.online ? t.common.online : t.common.offline}
                                            </span>
                                            <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowUserModal(true)}
                                className="mt-4 w-full p-3 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                <Plus className="h-4 w-4" /> Agregar Nuevo Usuario
                            </button>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* ─── DATABASE TAB ─── */}
                {activeTab === 'database' && (
                    <motion.div
                        key="database"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <AnimatedCard className="p-6">
                            <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                                    <Database className="h-4 w-4 text-emerald-500" />
                                </div>
                                Estado de Base de Datos
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <Check className="h-5 w-5 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-800">Conexión Activa</p>
                                        <p className="text-xs text-emerald-600">PostgreSQL (Prisma ORM)</p>
                                    </div>
                                </div>
                                {[
                                    { label: 'Proveedor', value: 'PostgreSQL 15' },
                                    { label: 'ORM', value: 'Prisma v5.x' },
                                    { label: 'Migraciones', value: 'Sincronizadas' },
                                    { label: 'Pool de Conexiones', value: '10 máx.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className="text-sm font-mono font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>

                        <AnimatedCard className="p-6" index={1}>
                            <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-blue-500/10">
                                    <Cpu className="h-4 w-4 text-blue-500" />
                                </div>
                                Rendimiento
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Tiempo de Respuesta', value: '~45ms', percent: 25, color: 'bg-emerald-500' },
                                    { label: 'Uso de CPU', value: '12%', percent: 12, color: 'bg-blue-500' },
                                    { label: 'Memoria', value: '384 MB', percent: 38, color: 'bg-violet-500' },
                                    { label: 'Almacenamiento', value: '2.1 GB', percent: 21, color: 'bg-amber-500' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">{item.label}</span>
                                            <span className="font-mono font-medium">{item.value}</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.percent}%` }}
                                                transition={{ delay: i * 0.15, duration: 0.6, ease: 'easeOut' }}
                                                className={cn("h-full rounded-full", item.color)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}

                {/* ─── SECURITY TAB ─── */}
                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnimatedCard className="p-6">
                            <h3 className="font-semibold text-sm flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-red-500/10">
                                    <Shield className="h-4 w-4 text-red-500" />
                                </div>
                                Seguridad y Acceso
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    {
                                        title: 'Autenticación',
                                        description: 'NextAuth.js con JWT tokens y sesiones de servidor',
                                        status: 'Activo',
                                        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                                        icon: Shield,
                                    },
                                    {
                                        title: 'Motor de Reglas',
                                        description: 'Gobernanza activa con evaluación de reglas en tiempo real',
                                        status: 'Activo',
                                        statusColor: 'text-blue-600 bg-blue-50 border-blue-200',
                                        icon: Zap,
                                    },
                                    {
                                        title: 'Cifrado en Tránsito',
                                        description: 'TLS/SSL habilitado para todas las conexiones',
                                        status: 'Habilitado',
                                        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                                        icon: Shield,
                                    },
                                    {
                                        title: 'Auditoría',
                                        description: 'Registro completo de acciones en el motor de gobernanza',
                                        status: 'Activo',
                                        statusColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                                        icon: Activity,
                                    },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 border rounded-xl hover:bg-muted/20 transition-colors"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-semibold">{item.title}</span>
                                                </div>
                                                <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", item.statusColor)}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </AnimatedCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── REGION SETTINGS MODAL ─── */}
            <AnimatePresence>
                {showRegionModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowRegionModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-background border rounded-2xl shadow-2xl max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                    <h3 className="font-bold">Configuración Regional</h3>
                                </div>
                                <button
                                    onClick={() => setShowRegionModal(false)}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                {[
                                    {
                                        label: 'Región Activa',
                                        value: formRegion,
                                        setter: setFormRegion,
                                        options: [
                                            { value: 'MX-CHH', label: 'Chihuahua (MX-CHH)' },
                                            { value: 'MX-CJS', label: 'Ciudad Juárez (MX-CJS)' },
                                            { value: 'MX-NLE', label: 'Monterrey (MX-NLE)' },
                                        ]
                                    },
                                    {
                                        label: 'Moneda',
                                        value: formCurrency,
                                        setter: setFormCurrency,
                                        options: [
                                            { value: 'MXN', label: 'MXN - Peso Mexicano' },
                                            { value: 'USD', label: 'USD - Dólar Americano' },
                                        ]
                                    },
                                    {
                                        label: 'Zona Horaria',
                                        value: formTimezone,
                                        setter: setFormTimezone,
                                        options: [
                                            { value: 'America/Chihuahua', label: 'America/Chihuahua (UTC-7)' },
                                            { value: 'America/Mexico_City', label: 'America/Mexico_City (UTC-6)' },
                                            { value: 'America/Tijuana', label: 'America/Tijuana (UTC-8)' },
                                        ]
                                    }
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label className="text-sm font-medium mb-2 block">{field.label}</label>
                                        <select
                                            className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            value={field.value}
                                            onChange={(e) => field.setter(e.target.value)}
                                        >
                                            {field.options.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t flex gap-2">
                                <AnimatedButton
                                    variant="ghost"
                                    onClick={() => setShowRegionModal(false)}
                                    className="flex-1 justify-center"
                                >
                                    Cancelar
                                </AnimatedButton>
                                <AnimatedButton
                                    variant="primary"
                                    onClick={handleSaveConfig}
                                    disabled={saving}
                                    className="flex-1 justify-center bg-gradient-to-r from-blue-600 to-indigo-600"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Guardar Cambios
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── USER MANAGEMENT MODAL ─── */}
            <AnimatePresence>
                {showUserModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowUserModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-background border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b sticky top-0 bg-background z-10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-amber-500" />
                                    <h3 className="font-bold">Gestión de Usuarios</h3>
                                </div>
                                <button
                                    onClick={() => setShowUserModal(false)}
                                    className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-3">
                                {[
                                    { initials: 'BA', name: 'Broker Admin', email: 'admin@remax.com', org: 'RE/MAX Polanco', color: 'bg-blue-500/20 text-blue-500', online: true },
                                    { initials: 'SA', name: 'System Admin', email: 'admin@bluejax.ai', org: 'Blue Jax Core', color: 'bg-violet-500/20 text-violet-500', online: false },
                                ].map((user, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm", user.color)}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email} • {user.org}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-xs px-2 py-1 rounded-full",
                                                user.online ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"
                                            )}>
                                                {user.online ? 'En línea' : 'Fuera de línea'}
                                            </span>
                                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => toast('Función próximamente disponible', { icon: '🚧' })}
                                    className="w-full p-3 border-2 border-dashed rounded-xl hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground"
                                >
                                    <Plus className="h-4 w-4" /> Agregar Nuevo Usuario
                                </button>
                            </div>

                            <div className="p-6 border-t">
                                <AnimatedButton
                                    variant="ghost"
                                    onClick={() => setShowUserModal(false)}
                                    className="w-full justify-center"
                                >
                                    Cerrar
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransition>
    );
}
