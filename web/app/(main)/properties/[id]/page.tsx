'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft, MapPin, DollarSign, Building2, Heart, Share2, FileText,
    MessageCircle, Calendar, Phone, Mail, Shield, Eye, Star, ExternalLink,
    ChevronRight, Globe
} from 'lucide-react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { VersionTimeline } from '@/components/history/VersionTimeline';
import Link from 'next/link';

interface ListingData {
    id: string;
    propertyId?: string;
    title: string;
    description: string;
    address: string;
    city?: string;
    state?: string;
    propertyType: string;
    status: string;
    price: number;
    source: string;
    trustScore?: number;
    mapUrl?: string;
    images: string[];
    videos: string[];
    lastVerifiedAt?: string;
    createdAt?: string;
    isObserved?: boolean;
    agent?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        whatsapp?: string;
        bio?: string;
        licenseNumber?: string;
        languages?: string;
        specialties?: string;
    } | null;
}

export default function PropertyShowcasePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data: session }: any = useSession();
    const [listing, setListing] = useState<ListingData | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [similar, setSimilar] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeTab, setActiveTab] = useState<'descripcion' | 'mapa' | 'historial'>('descripcion');
    const [descExpanded, setDescExpanded] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchListing();
        fetchHistory();
        fetchSimilar();
        checkFavorite();
    }, [params.id]);

    // Track view for analytics
    useEffect(() => {
        const recordView = async () => {
            try {
                const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
                await fetch(`${API_URL}/api/public/listings/${params.id}/view`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        listingId: params.id,
                        viewerId: (session as any)?.user?.id || undefined,
                        device: isMobile ? 'mobile' : 'desktop'
                    })
                });
            } catch (err) {
                console.error('Analytics error:', err);
            }
        };
        recordView();
    }, [params.id]);

    const fetchListing = async () => {
        try {
            const res = await fetch(`${API_URL}/api/public/listings/${params.id}`);
            if (res.ok) {
                setListing(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch listing:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/public/listings/${params.id}/history`);
            if (res.ok) {
                setHistory(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchSimilar = async () => {
        try {
            const res = await fetch(`${API_URL}/api/public/listings/${params.id}/similar`);
            if (res.ok) {
                setSimilar(await res.json());
            }
        } catch { } // Silently fail
    };

    const checkFavorite = async () => {
        if (!session?.accessToken) return;
        try {
            const res = await fetch(`${API_URL}/api/protected/favorites/ids`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                const ids = await res.json();
                setIsFavorite(Array.isArray(ids) && ids.includes(params.id));
            }
        } catch { } // Silently fail
    };

    const toggleFavorite = async () => {
        if (!session?.accessToken) {
            toast.error('Inicia sesión para guardar favoritos');
            return;
        }
        try {
            const method = isFavorite ? 'DELETE' : 'POST';
            const res = await fetch(`${API_URL}/api/protected/favorites`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`
                },
                body: JSON.stringify({ listingId: params.id })
            });
            if (res.ok) {
                setIsFavorite(!isFavorite);
                toast.success(isFavorite ? 'Eliminado de favoritos' : 'Guardado en favoritos');
            }
        } catch {
            toast.error('Error al actualizar favoritos');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: listing?.title, url });
            } catch { } // User cancelled
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Enlace copiado al portapapeles');
        }
    };

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    const statusBadge = (status: string) => {
        const map: Record<string, { text: string; color: string }> = {
            'SALE': { text: 'EN VENTA', color: 'bg-blue-500' },
            'RENT': { text: 'EN RENTA', color: 'bg-purple-500' },
            'ACTIVE': { text: 'ACTIVO', color: 'bg-emerald-500' },
            'DRAFT': { text: 'BORRADOR', color: 'bg-gray-500' },
            'SUSPENDED': { text: 'SUSPENDIDO', color: 'bg-red-500' },
            'VERIFIED': { text: 'VERIFICADO', color: 'bg-emerald-600' },
        };
        const badge = map[status] || { text: status, color: 'bg-gray-500' };
        return (
            <span className={`${badge.color} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>
                {badge.text}
            </span>
        );
    };

    const typeName = (type: string) => {
        const map: Record<string, string> = {
            commercial: 'Comercial', residential: 'Residencial', industrial: 'Industrial',
            land: 'Terreno', office: 'Oficinas', casa: 'Casa', departamento: 'Departamento'
        };
        return map[type?.toLowerCase()] || type;
    };

    if (loading) {
        return (
            <PageTransition className="space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-[500px] bg-muted rounded-2xl" />
                    <div className="h-8 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-2 h-64 bg-muted rounded-xl" />
                        <div className="h-64 bg-muted rounded-xl" />
                    </div>
                </div>
            </PageTransition>
        );
    }

    if (!listing) {
        return (
            <PageTransition className="flex flex-col items-center justify-center py-20">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-2">Propiedad no encontrada</h2>
                <p className="text-muted-foreground mb-6">Esta propiedad no existe o ha sido eliminada.</p>
                <AnimatedButton onClick={() => router.push('/properties')} variant="primary">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Volver a búsqueda
                </AnimatedButton>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="space-y-6 pb-12">
            {/* Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <AnimatedButton
                    variant="ghost"
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-muted"
                >
                    <ArrowLeft className="h-5 w-5" />
                </AnimatedButton>
                <span className="text-sm text-muted-foreground">Volver</span>
            </motion.div>

            {/* Hero Gallery */}
            <PropertyGallery
                images={listing.images}
                title={listing.title}
                address={listing.address}
            />

            {/* Property Info + Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {statusBadge(listing.status)}
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {typeName(listing.propertyType)}
                        </span>
                        {listing.source && listing.source !== 'MANUAL' && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {listing.source}
                            </span>
                        )}
                        {listing.trustScore != null && (
                            <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {listing.trustScore}% confianza
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{listing.title}</h1>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                        {listing.address}
                    </p>
                </div>

                {/* Price + Actions */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {listing.price ? fmt(listing.price) : 'Consultar'}
                        </p>
                        <p className="text-xs text-muted-foreground">MXN</p>
                    </div>
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleFavorite}
                            className={`p-3 rounded-full border transition-all ${isFavorite
                                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-500'
                                : 'bg-card border-border text-muted-foreground hover:text-red-400'}`}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleShare}
                            className="p-3 rounded-full border bg-card text-muted-foreground hover:text-blue-500 transition-colors"
                        >
                            <Share2 className="h-5 w-5" />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column — Tabs & Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
                        {[
                            { key: 'descripcion' as const, label: 'Descripción', icon: FileText },
                            { key: 'mapa' as const, label: 'Mapa', icon: MapPin },
                            { key: 'historial' as const, label: 'Historial', icon: Eye },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'descripcion' && (
                        <AnimatedCard className="p-6 rounded-xl border bg-card">
                            <h3 className="text-lg font-semibold mb-4">Descripción</h3>
                            <div className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap ${!descExpanded ? 'max-h-48 overflow-hidden relative' : ''}`}>
                                {listing.description || 'Sin descripción disponible.'}
                                {!descExpanded && listing.description && listing.description.length > 300 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                                )}
                            </div>
                            {listing.description && listing.description.length > 300 && (
                                <button
                                    onClick={() => setDescExpanded(!descExpanded)}
                                    className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-3 flex items-center gap-1"
                                >
                                    {descExpanded ? 'Ver menos' : 'Leer más'}
                                    <ChevronRight className={`h-3 w-3 transition-transform ${descExpanded ? 'rotate-90' : ''}`} />
                                </button>
                            )}

                            {/* Property Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                                <DetailItem icon={Building2} label="Tipo" value={typeName(listing.propertyType)} />
                                <DetailItem icon={DollarSign} label="Precio" value={listing.price ? fmt(listing.price) : 'Consultar'} />
                                <DetailItem icon={MapPin} label="Zona" value={listing.city || listing.address?.split(',').pop()?.trim() || '-'} />
                                {listing.trustScore != null && (
                                    <DetailItem icon={Shield} label="Confianza" value={`${listing.trustScore}%`} />
                                )}
                                {listing.createdAt && (
                                    <DetailItem icon={Calendar} label="Publicado" value={new Date(listing.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })} />
                                )}
                                {listing.source && (
                                    <DetailItem icon={Globe} label="Fuente" value={listing.source} />
                                )}
                            </div>
                        </AnimatedCard>
                    )}

                    {activeTab === 'mapa' && (
                        <AnimatedCard className="rounded-xl border bg-card overflow-hidden">
                            <div className="h-[400px] md:h-[500px]">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                    frameBorder="0"
                                    scrolling="no"
                                    loading="lazy"
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="p-4 border-t flex items-center justify-between">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    {listing.address}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 font-medium"
                                >
                                    Abrir en Google Maps <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </AnimatedCard>
                    )}

                    {activeTab === 'historial' && (
                        <VersionTimeline entries={history} loading={historyLoading} />
                    )}
                </div>

                {/* Right Column — Agent Card & Actions */}
                <div className="space-y-6">
                    {/* Agent Contact Card */}
                    <AnimatedCard className="p-6 rounded-xl border bg-card" index={1}>
                        <h3 className="text-lg font-semibold mb-4">Contactar Agente</h3>
                        {listing.agent ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                                        {listing.agent.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{listing.agent.name}</p>
                                        {listing.agent.licenseNumber && (
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                Lic. {listing.agent.licenseNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {listing.agent.bio && (
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{listing.agent.bio}</p>
                                )}

                                <div className="space-y-2">
                                    {listing.agent.phone && (
                                        <a href={`tel:${listing.agent.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            <Phone className="h-4 w-4" /> {listing.agent.phone}
                                        </a>
                                    )}
                                    {listing.agent.email && (
                                        <a href={`mailto:${listing.agent.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            <Mail className="h-4 w-4" /> {listing.agent.email}
                                        </a>
                                    )}
                                    {listing.agent.whatsapp && (
                                        <a href={`https://wa.me/${listing.agent.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
                                            <MessageCircle className="h-4 w-4" /> WhatsApp
                                        </a>
                                    )}
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Link href={`/messages?to=${listing.agent.id}&listing=${listing.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <MessageCircle className="h-4 w-4" /> Enviar Mensaje
                                        </motion.button>
                                    </Link>
                                    <Link href={`/listings/${listing.id}`}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 border border-indigo-200 dark:border-indigo-800 mt-2"
                                        >
                                            <Calendar className="h-4 w-4" /> Agendar Visita
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                    <Building2 className="h-7 w-7 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">Agente no asignado</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">Contacte directamente via la plataforma</p>
                                <Link href={`/listings/${listing.id}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg mt-4"
                                    >
                                        <Eye className="h-4 w-4" /> Ver Listado Completo
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </AnimatedCard>

                    {/* Lead Inquiry Form */}
                    <AnimatedCard className="p-5 rounded-xl border" index={2}>
                        <h3 className="text-lg font-semibold mb-4">Enviar Consulta</h3>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const fd = new FormData(form);
                                try {
                                    const res = await fetch(`${API_URL}/api/public/leads`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            listingId: listing.id,
                                            name: fd.get('name'),
                                            email: fd.get('email'),
                                            phone: fd.get('phone') || undefined,
                                            message: fd.get('message') || undefined,
                                        })
                                    });
                                    if (res.ok) {
                                        toast.success('¡Consulta enviada! El agente te contactará pronto.');
                                        form.reset();
                                    } else {
                                        toast.error('Error al enviar consulta');
                                    }
                                } catch {
                                    toast.error('Error de conexión');
                                }
                            }}
                            className="space-y-3"
                        >
                            <input
                                name="name"
                                required
                                placeholder="Tu nombre *"
                                className="w-full p-2.5 border rounded-lg bg-background text-sm"
                            />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Tu correo *"
                                className="w-full p-2.5 border rounded-lg bg-background text-sm"
                            />
                            <input
                                name="phone"
                                placeholder="Tu teléfono (opcional)"
                                className="w-full p-2.5 border rounded-lg bg-background text-sm"
                            />
                            <textarea
                                name="message"
                                rows={3}
                                placeholder="Mensaje (opcional)"
                                className="w-full p-2.5 border rounded-lg bg-background text-sm resize-none"
                            />
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <Mail className="h-4 w-4" /> Enviar Consulta
                            </motion.button>
                        </form>
                    </AnimatedCard>

                    {/* Quick Stats Mini-Card */}
                    <AnimatedCard className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20" index={2}>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-background/60 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{listing.images?.length || 0}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fotos</p>
                            </div>
                            <div className="text-center p-3 bg-background/60 rounded-lg">
                                <p className="text-2xl font-bold text-emerald-600">{history.length}</p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Eventos</p>
                            </div>
                        </div>
                    </AnimatedCard>
                </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
                <div className="space-y-4 pt-6 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Propiedades Similares</h3>
                        <Link href="/properties" className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                            Ver todas <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {similar.map((item, i) => (
                            <Link key={item.id} href={`/properties/${item.id}`}>
                                <AnimatedCard className="overflow-hidden group" index={i + 5}>
                                    <div className="h-40 bg-muted relative overflow-hidden">
                                        {item.images?.[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Building2 className="h-8 w-8" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded font-bold">
                                            {item.price ? fmt(item.price) : 'N/A'}
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {item.address}
                                        </p>
                                    </div>
                                </AnimatedCard>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </PageTransition>
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}
