'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mail, Globe, Award, Building2, Calendar, Loader2, BadgeCheck, MapPin, MessageCircle } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import Link from 'next/link';

interface AgentDetail {
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
    stats: {
        activeListings: number;
        soldListings: number;
    };
}

interface AgentListing {
    id: string;
    propertyId: string;
    title: string | null;
    price: number | null;
    address: string | null;
    city: string | null;
    images: string;
    propertyType: string;
    createdAt: string;
}

export default function AgentProfilePage() {
    const { id } = useParams();
    const [agent, setAgent] = useState<AgentDetail | null>(null);
    const [listings, setListings] = useState<AgentListing[]>([]);
    const [loading, setLoading] = useState(true);

    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (!id) return;
        Promise.all([
            fetch(`${API}/api/public/agents/${id}`).then(r => r.json()),
            fetch(`${API}/api/public/agents/${id}/listings`).then(r => r.json()),
        ])
            .then(([a, l]) => {
                setAgent(a);
                setListings(Array.isArray(l) ? l : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const getInitials = (a: AgentDetail) => {
        const f = a.firstName?.[0] || '';
        const l = a.lastName?.[0] || '';
        return (f + l).toUpperCase() || a.email[0].toUpperCase();
    };

    const parseSpecialties = (s: string): string[] => {
        try { return JSON.parse(s); } catch { return []; }
    };

    const parseImages = (s: string): string[] => {
        try { return JSON.parse(s); } catch { return []; }
    };

    const fmtPrice = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    const memberSince = (d: string) => new Date(d).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="py-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-emerald-500" />
                <p className="text-muted-foreground text-sm">Cargando perfil...</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="py-24 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-bold mb-1">Agente no encontrado</h3>
                <Link href="/agents" className="text-sm text-emerald-600 hover:underline mt-2 inline-block">
                    Volver al directorio
                </Link>
            </div>
        );
    }

    const specs = parseSpecialties(agent.specialties);
    const fullName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || agent.email;

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Directorio
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl md:text-3xl font-bold backdrop-blur-sm shadow-lg">
                            {getInitials(agent)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{fullName}</h1>
                                {agent.mlsStatus === 'ACTIVE' && (
                                    <BadgeCheck className="h-6 w-6 text-white/80" />
                                )}
                            </div>
                            {agent.licenseNumber && (
                                <p className="text-white/70 text-sm flex items-center gap-1.5 mt-1">
                                    <Award className="h-3.5 w-3.5" />
                                    Licencia: {agent.licenseNumber}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column — Info */}
                <div className="space-y-4">
                    {/* Stats */}
                    <AnimatedCard className="p-5" index={0}>
                        <h3 className="text-sm font-semibold mb-3">Estadísticas</h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                                <p className="text-xl font-black text-emerald-600">{agent.stats.activeListings}</p>
                                <p className="text-[10px] text-muted-foreground">Activos</p>
                            </div>
                            <div>
                                <p className="text-xl font-black text-blue-600">{agent.stats.soldListings}</p>
                                <p className="text-[10px] text-muted-foreground">Vendidos</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold">{memberSince(agent.createdAt)}</p>
                                <p className="text-[10px] text-muted-foreground">Miembro desde</p>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* Contact */}
                    <AnimatedCard className="p-5" index={1}>
                        <h3 className="text-sm font-semibold mb-3">Contacto</h3>
                        <div className="space-y-2.5">
                            <a href={`mailto:${agent.email}`} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <Mail className="h-4 w-4 text-blue-500" />
                                {agent.email}
                            </a>
                            {agent.phoneNumber && (
                                <a href={`tel:${agent.phoneNumber}`} className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Phone className="h-4 w-4 text-emerald-500" />
                                    {agent.phoneNumber}
                                </a>
                            )}
                            {agent.whatsapp && (
                                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <MessageCircle className="h-4 w-4 text-green-500" />
                                    WhatsApp
                                </a>
                            )}
                            {agent.instagram && (
                                <a href={`https://instagram.com/${agent.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Globe className="h-4 w-4 text-pink-500" />
                                    @{agent.instagram.replace('@', '')}
                                </a>
                            )}
                        </div>
                    </AnimatedCard>

                    {/* Specialties */}
                    {specs.length > 0 && (
                        <AnimatedCard className="p-5" index={2}>
                            <h3 className="text-sm font-semibold mb-3">Especialidades</h3>
                            <div className="flex flex-wrap gap-2">
                                {specs.map(s => (
                                    <span key={s} className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                            {agent.languages && (
                                <div className="mt-3 pt-3 border-t">
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Idiomas:</span> {agent.languages}
                                    </p>
                                </div>
                            )}
                        </AnimatedCard>
                    )}
                </div>

                {/* Right Column — Bio + Listings */}
                <div className="md:col-span-2 space-y-4">
                    {/* Bio */}
                    {agent.bio && (
                        <AnimatedCard className="p-5" index={0}>
                            <h3 className="text-sm font-semibold mb-2">Acerca de</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{agent.bio}</p>
                        </AnimatedCard>
                    )}

                    {/* Listings */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-emerald-500" />
                            Propiedades Activas ({listings.length})
                        </h3>
                        {listings.length === 0 ? (
                            <AnimatedCard className="p-8 text-center" index={1}>
                                <Building2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                                <p className="text-sm text-muted-foreground">Sin propiedades activas</p>
                            </AnimatedCard>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {listings.map((listing, idx) => {
                                    const images = parseImages(listing.images);
                                    return (
                                        <motion.div
                                            key={listing.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link href={`/listings/${listing.id}`}>
                                                <AnimatedCard className="p-0 overflow-hidden cursor-pointer" index={idx}>
                                                    <div className="h-36 bg-muted">
                                                        {images[0] ? (
                                                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Building2 className="h-8 w-8 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3">
                                                        <h4 className="font-bold text-sm truncate">{listing.title || 'Sin título'}</h4>
                                                        {listing.address && (
                                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                                                                <MapPin className="h-3 w-3 shrink-0" />
                                                                {listing.address}
                                                            </p>
                                                        )}
                                                        {listing.price && (
                                                            <p className="text-sm font-bold text-emerald-600 mt-1">{fmtPrice(listing.price)} MXN</p>
                                                        )}
                                                    </div>
                                                </AnimatedCard>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
