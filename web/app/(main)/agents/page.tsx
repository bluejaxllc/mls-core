'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MapPin, Award, Phone, Loader2, ChevronRight, Building2, BadgeCheck } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import Link from 'next/link';

interface Agent {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    bio: string | null;
    licenseNumber: string | null;
    specialties: string;
    languages: string;
    phoneNumber: string | null;
    whatsapp: string | null;
    instagram: string | null;
    mlsStatus: string;
    locationId: string | null;
    createdAt: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');

    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (specialty) params.set('specialty', specialty);
            const res = await fetch(`${API}/api/public/agents?${params}`);
            if (res.ok) setAgents(await res.json());
        } catch (err) {
            console.error('Error fetching agents:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [specialty]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchAgents();
    };

    const getInitials = (a: Agent) => {
        const f = a.firstName?.[0] || '';
        const l = a.lastName?.[0] || '';
        return (f + l).toUpperCase() || a.email[0].toUpperCase();
    };

    const parseSpecialties = (s: string): string[] => {
        try {
            return JSON.parse(s);
        } catch {
            return [];
        }
    };

    const SPECIALTIES = [
        'Residencial', 'Comercial', 'Industrial', 'Terrenos', 'Lujo', 'Inversión', 'Renta'
    ];

    const COLORS = [
        'from-blue-500 to-cyan-500',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-teal-500',
        'from-orange-500 to-amber-500',
        'from-rose-500 to-red-500',
        'from-indigo-500 to-violet-500',
    ];

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Users className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Directorio de Agentes</h1>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-xl">Encuentra agentes inmobiliarios certificados en tu zona</p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mt-4 flex gap-2 max-w-lg">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nombre o email..."
                                className="w-full pl-9 pr-4 py-2.5 bg-white/15 border border-white/20 rounded-xl text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2.5 bg-white text-emerald-700 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
                        >
                            Buscar
                        </button>
                    </form>
                </div>
            </div>

            {/* Specialty Filters */}
            <div className="flex items-center gap-2 flex-wrap">
                <Award className="h-4 w-4 text-muted-foreground" />
                <button
                    onClick={() => setSpecialty('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!specialty ? 'bg-emerald-600 text-white shadow' : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Todos
                </button>
                {SPECIALTIES.map(s => (
                    <button
                        key={s}
                        onClick={() => setSpecialty(specialty === s ? '' : s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${specialty === s ? 'bg-emerald-600 text-white shadow' : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Agent Cards */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                    <p className="text-muted-foreground text-sm">Cargando agentes...</p>
                </div>
            ) : agents.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin resultados</h3>
                    <p className="text-muted-foreground text-sm">No se encontraron agentes con estos criterios</p>
                </AnimatedCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent, idx) => {
                        const specs = parseSpecialties(agent.specialties);
                        const colorClass = COLORS[idx % COLORS.length];
                        return (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/agents/${agent.id}`}>
                                    <AnimatedCard className="p-5 cursor-pointer h-full" index={idx}>
                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg`}>
                                                {getInitials(agent)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h3 className="font-bold text-sm truncate">
                                                        {agent.firstName || ''} {agent.lastName || ''}
                                                    </h3>
                                                    {agent.mlsStatus === 'ACTIVE' && (
                                                        <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{agent.email}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                                        </div>

                                        {/* Bio */}
                                        {agent.bio && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-3">{agent.bio}</p>
                                        )}

                                        {/* Specialties */}
                                        {specs.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {specs.slice(0, 3).map(s => (
                                                    <span key={s} className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-medium">
                                                        {s}
                                                    </span>
                                                ))}
                                                {specs.length > 3 && (
                                                    <span className="text-[10px] text-muted-foreground">+{specs.length - 3}</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
                                            {agent.licenseNumber && (
                                                <span className="flex items-center gap-1">
                                                    <Award className="h-3 w-3" />
                                                    Lic. {agent.licenseNumber}
                                                </span>
                                            )}
                                            {agent.phoneNumber && (
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {agent.phoneNumber}
                                                </span>
                                            )}
                                        </div>
                                    </AnimatedCard>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </PageTransition>
    );
}
