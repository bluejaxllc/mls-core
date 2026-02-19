
'use client';

import { useEffect, useState } from 'react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useSession } from 'next-auth/react';
import {
    Trash2, Bell, Clock, Search, Plus, X, Filter,
    MapPin, DollarSign, Home, Tag, ChevronDown,
    BellRing, BellOff, Eye, Zap, TrendingUp, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SavedSearch {
    id: string;
    name: string;
    criteria: string;
    frequency: string;
    lastRunAt: string;
    createdAt: string;
    matchCount: number;
}

const FREQUENCY_OPTIONS = [
    { value: 'INSTANT', label: 'Instantánea', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10' },
    { value: 'DAILY', label: 'Diaria', icon: BellRing, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { value: 'WEEKLY', label: 'Semanal', icon: Bell, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { value: 'OFF', label: 'Desactivada', icon: BellOff, color: 'text-gray-500', bg: 'bg-gray-500/10' },
];

const PROPERTY_TYPES = [
    { value: '', label: 'Todos' },
    { value: 'residential', label: 'Residencial' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'land', label: 'Terreno' },
    { value: 'industrial', label: 'Industrial' },
];

export default function SavedSearchesPage() {
    const { data: session }: any = useSession();
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [openFrequency, setOpenFrequency] = useState<string | null>(null);

    // Create form state
    const [newName, setNewName] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newMinPrice, setNewMinPrice] = useState('');
    const [newMaxPrice, setNewMaxPrice] = useState('');
    const [newPropertyType, setNewPropertyType] = useState('');
    const [newKeyword, setNewKeyword] = useState('');
    const [newFrequency, setNewFrequency] = useState('INSTANT');
    const [creating, setCreating] = useState(false);

    const API_URL = '';

    useEffect(() => {
        if (session?.accessToken) fetchSearches();
        else if (session !== undefined) setLoading(false);
    }, [session]);

    const fetchSearches = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/saved-searches`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                setSearches(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createSearch = async () => {
        if (!newName.trim()) {
            toast.error('Ingresa un nombre para la búsqueda');
            return;
        }

        setCreating(true);
        const criteria: any = {};
        if (newCity.trim()) criteria.city = newCity.trim();
        if (newMinPrice) criteria.minPrice = Number(newMinPrice);
        if (newMaxPrice) criteria.maxPrice = Number(newMaxPrice);
        if (newPropertyType) criteria.propertyType = newPropertyType;
        if (newKeyword.trim()) criteria.keyword = newKeyword.trim();

        try {
            const res = await fetch(`${API_URL}/api/protected/saved-searches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName.trim(),
                    criteria: JSON.stringify(criteria),
                    frequency: newFrequency
                })
            });
            if (res.ok) {
                const created = await res.json();
                setSearches(prev => [created, ...prev]);
                toast.success('Búsqueda guardada');
                resetForm();
                setShowCreate(false);
            } else {
                toast.error('Error al crear búsqueda');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setCreating(false);
        }
    };

    const resetForm = () => {
        setNewName('');
        setNewCity('');
        setNewMinPrice('');
        setNewMaxPrice('');
        setNewPropertyType('');
        setNewKeyword('');
        setNewFrequency('INSTANT');
    };

    const updateFrequency = async (id: string, frequency: string) => {
        try {
            const res = await fetch(`${API_URL}/api/protected/saved-searches/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ frequency })
            });
            if (res.ok) {
                setSearches(prev => prev.map(s =>
                    s.id === id ? { ...s, frequency } : s
                ));
                toast.success('Frecuencia actualizada');
            }
        } catch (error) {
            toast.error('Error al actualizar');
        }
        setOpenFrequency(null);
    };

    const deleteSearch = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta alerta?')) return;

        try {
            const res = await fetch(`${API_URL}/api/protected/saved-searches/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                setSearches(searches.filter(s => s.id !== id));
                toast.success('Búsqueda eliminada');
            }
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    const parseCriteria = (criteriaStr: string): Record<string, any> => {
        try {
            return JSON.parse(criteriaStr || '{}');
        } catch {
            return {};
        }
    };

    const formatPrice = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    const totalMatches = searches.reduce((sum, s) => sum + (s.matchCount || 0), 0);
    const activeAlerts = searches.filter(s => s.frequency !== 'OFF').length;

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">
                                Búsquedas Guardadas
                            </span>
                            <Bell className="h-5 w-5 text-blue-500" />
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Crea alertas inteligentes y recibe notificaciones cuando nuevos listados coincidan.
                        </p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow font-medium text-sm"
                >
                    <Plus className="h-4 w-4" />
                    Nueva Búsqueda
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Búsquedas', value: searches.length, icon: Search, gradient: 'from-blue-500/10 to-cyan-500/10', iconColor: 'text-blue-500' },
                    { label: 'Alertas Activas', value: activeAlerts, icon: BellRing, gradient: 'from-green-500/10 to-emerald-500/10', iconColor: 'text-green-500' },
                    { label: 'Coincidencias', value: totalMatches, icon: TrendingUp, gradient: 'from-purple-500/10 to-pink-500/10', iconColor: 'text-purple-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br ${stat.gradient} border border-white/10 rounded-xl p-4 flex items-center gap-4`}
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

            {/* Create Search Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border border-blue-500/20 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-blue-500" />
                                    Crear Nueva Búsqueda
                                </h3>
                                <button
                                    onClick={() => { setShowCreate(false); resetForm(); }}
                                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Name */}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Nombre de la Alerta *</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    placeholder="Ej: Casas en Chihuahua centro"
                                    className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            {/* Filters grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> Ciudad
                                    </label>
                                    <input
                                        type="text"
                                        value={newCity}
                                        onChange={e => setNewCity(e.target.value)}
                                        placeholder="Ej: Chihuahua"
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" /> Precio Mín
                                    </label>
                                    <input
                                        type="number"
                                        value={newMinPrice}
                                        onChange={e => setNewMinPrice(e.target.value)}
                                        placeholder="Ej: 500000"
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" /> Precio Máx
                                    </label>
                                    <input
                                        type="number"
                                        value={newMaxPrice}
                                        onChange={e => setNewMaxPrice(e.target.value)}
                                        placeholder="Ej: 5000000"
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Home className="h-3 w-3" /> Tipo
                                    </label>
                                    <select
                                        value={newPropertyType}
                                        onChange={e => setNewPropertyType(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        {PROPERTY_TYPES.map(pt => (
                                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Keyword + Frequency */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Tag className="h-3 w-3" /> Palabra clave
                                    </label>
                                    <input
                                        type="text"
                                        value={newKeyword}
                                        onChange={e => setNewKeyword(e.target.value)}
                                        placeholder="Ej: piscina, esquina, nuevo"
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        <Bell className="h-3 w-3" /> Frecuencia de Alerta
                                    </label>
                                    <select
                                        value={newFrequency}
                                        onChange={e => setNewFrequency(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        {FREQUENCY_OPTIONS.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => { setShowCreate(false); resetForm(); }}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancelar
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={createSearch}
                                    disabled={creating}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium text-sm disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                >
                                    {creating ? 'Guardando...' : 'Guardar Búsqueda'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-gradient-to-br from-blue-950/5 via-card/40 to-card/20 border border-blue-500/10 rounded-xl p-5 space-y-3">
                                <div className="h-5 bg-muted/50 rounded w-2/3" />
                                <div className="h-3 bg-muted/50 rounded w-1/2" />
                                <div className="h-8 bg-muted/50 rounded w-full" />
                            </div>
                        ))}
                    </>
                ) : searches.length === 0 ? (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-muted/5">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="font-semibold text-lg mb-1">No tienes búsquedas guardadas</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            Crea tu primera alerta para recibir notificaciones cuando nuevos listados coincidan con tus criterios.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreate(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium text-sm"
                        >
                            <Plus className="h-4 w-4" />
                            Crear Primera Búsqueda
                        </motion.button>
                    </div>
                ) : (
                    searches.map((search, i) => {
                        const criteria = parseCriteria(search.criteria);
                        const freqOption = FREQUENCY_OPTIONS.find(f => f.value === search.frequency) || FREQUENCY_OPTIONS[3];
                        const FreqIcon = freqOption.icon;
                        const hasCriteria = Object.keys(criteria).length > 0;

                        return (
                            <AnimatedCard
                                key={search.id}
                                index={i}
                                className="p-5 flex flex-col justify-between group hover:border-blue-500/30 transition-all"
                            >
                                {/* Top section */}
                                <div className="space-y-3">
                                    {/* Name + Match count */}
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-bold text-base leading-tight">{search.name}</h3>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${search.matchCount > 0
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-muted/50 text-muted-foreground'
                                                }`}
                                        >
                                            {search.matchCount} coincidencia{search.matchCount !== 1 ? 's' : ''}
                                        </motion.div>
                                    </div>

                                    {/* Criteria tags */}
                                    {hasCriteria ? (
                                        <div className="flex flex-wrap gap-1.5">
                                            {criteria.city && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-medium">
                                                    <MapPin className="h-2.5 w-2.5" /> {criteria.city}
                                                </span>
                                            )}
                                            {(criteria.minPrice || criteria.maxPrice) && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-[10px] font-medium">
                                                    <DollarSign className="h-2.5 w-2.5" />
                                                    {criteria.minPrice ? formatPrice(criteria.minPrice) : '$0'}
                                                    {' - '}
                                                    {criteria.maxPrice ? formatPrice(criteria.maxPrice) : '∞'}
                                                </span>
                                            )}
                                            {criteria.propertyType && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px] font-medium">
                                                    <Home className="h-2.5 w-2.5" /> {criteria.propertyType}
                                                </span>
                                            )}
                                            {criteria.keyword && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-medium">
                                                    <Tag className="h-2.5 w-2.5" /> {criteria.keyword}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">Sin filtros específicos</p>
                                    )}
                                </div>

                                {/* Bottom section */}
                                <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                                    {/* Frequency selector */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenFrequency(openFrequency === search.id ? null : search.id)}
                                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${freqOption.bg} ${freqOption.color} hover:opacity-80`}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <FreqIcon className="h-3 w-3" />
                                                Alerta: {freqOption.label}
                                            </span>
                                            <ChevronDown className={`h-3 w-3 transition-transform ${openFrequency === search.id ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {openFrequency === search.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute bottom-full left-0 right-0 mb-1 bg-card border rounded-lg shadow-xl z-10 py-1 overflow-hidden"
                                                >
                                                    {FREQUENCY_OPTIONS.map(opt => (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => updateFrequency(search.id, opt.value)}
                                                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-muted/50 transition-colors ${opt.value === search.frequency ? 'bg-muted/30 font-bold' : ''
                                                                }`}
                                                        >
                                                            <opt.icon className={`h-3 w-3 ${opt.color}`} />
                                                            <span>{opt.label}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Actions row */}
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(search.createdAt).toLocaleDateString('es-MX')}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {search.matchCount > 0 && (
                                                <Link
                                                    href={`/listings?savedSearch=${search.id}`}
                                                    className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                                                    title="Ver Resultados"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => deleteSearch(search.id)}
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedCard>
                        );
                    })
                )}
            </div>
        </PageTransition>
    );
}
