'use client';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    Save, ArrowLeft, Sparkles, Video, MapPin, AlertTriangle, Heart,
    Pencil, Eye, Building2, Calendar, Globe, Share2, ChevronLeft, ChevronRight,
    X, DollarSign, Tag, Clock, ShieldCheck, Camera, ExternalLink, Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PageTransition, AnimatedCard, AnimatedButton, AnimatedInput, staggerContainer } from '@/components/ui/animated';
import { motion, AnimatePresence } from 'framer-motion';
import { TrustBadge } from '@/components/ui/TrustBadge';
import { LeadForm } from '@/components/listings/LeadForm';
import { cn } from '@/lib/utils';

// ─── STATUS CONFIG ──────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
    VERIFIED: { label: 'Verificado', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    DRAFT: { label: 'Borrador', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' },
    PENDING_REVIEW: { label: 'En Revisión', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    SUSPENDED: { label: 'Suspendido', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    ARCHIVED: { label: 'Archivado', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
    active: { label: 'Activo', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

const TYPE_LABELS: Record<string, string> = {
    commercial: 'Comercial',
    residential: 'Residencial',
    industrial: 'Industrial',
    land: 'Terreno',
    office: 'Oficina',
};

// ─── HERO IMAGE GALLERY ─────────────────────────────────────
function HeroGallery({ images, title }: { images: string[]; title: string }) {
    const [current, setCurrent] = useState(0);
    const [lightbox, setLightbox] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <div className="text-center text-slate-400">
                    <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Sin imágenes disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Main Hero */}
            <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden group bg-black/5 shadow-lg">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={images[current]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full object-cover cursor-pointer"
                        alt={`${title} - Foto ${current + 1}`}
                        onClick={() => setLightbox(true)}
                    />
                </AnimatePresence>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrent(p => (p === 0 ? images.length - 1 : p - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 backdrop-blur-sm"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrent(p => (p + 1 === images.length ? 0 : p + 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110 backdrop-blur-sm"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {/* Counter */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    {current + 1} / {images.length}
                </div>

                {/* Expand button */}
                <button
                    onClick={() => setLightbox(true)}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-medium shadow-lg hover:bg-black/70 transition-all flex items-center gap-1.5 backdrop-blur-sm"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Ver Galería
                </button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all",
                                idx === current
                                    ? "border-blue-500 ring-2 ring-blue-500/20 scale-105"
                                    : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <button
                            onClick={() => setLightbox(false)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-sm z-10"
                        >
                            <X className="h-7 w-7" />
                        </button>
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrent(p => (p === 0 ? images.length - 1 : p - 1)); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCurrent(p => (p + 1 === images.length ? 0 : p + 1)); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                        <img
                            src={images[current]}
                            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                            alt=""
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
                                    className={cn(
                                        "w-2.5 h-2.5 rounded-full transition-all",
                                        idx === current ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
                                    )}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ─── MAIN PAGE COMPONENT ────────────────────────────────────
export default function ListingDetailPage({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    const router = useRouter();
    const { data: session }: any = useSession();
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGenAddress, setLastGenAddress] = useState('');
    const [governanceErrors, setGovernanceErrors] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        price: string;
        description: string;
        address: string;
        status: string;
        type: string;
        mapUrl?: string;
        images?: string[];
        videos?: string[];
        source?: string;
    }>({
        title: '',
        price: '',
        description: '',
        address: '',
        status: '',
        type: 'commercial',
        mapUrl: '',
        images: [],
        videos: [],
        source: 'MANUAL'
    });

    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentNotes, setAppointmentNotes] = useState('');

    const handleSchedule = async () => {
        try {
            const startDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

            const res = await fetch('/api/protected/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: params.id,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    notes: appointmentNotes
                })
            });

            if (res.ok) {
                setIsScheduleOpen(false);
                setAppointmentNotes('');
                toast.success('Solicitud de visita enviada correctamente');
            } else {
                toast.error('Error al agendar visita');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al agendar visita');
        }
    };

    useEffect(() => {
        if (session?.accessToken && params.id) {
            fetchListing();
            fetch('/api/analytics/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: params.id,
                    viewerId: session.user?.id,
                    device: 'desktop'
                })
            }).catch(err => console.error('Analytics error:', err));
        }
    }, [session, params.id]);

    const fetchListing = async () => {
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/protected/listings/${params.id}`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });

            if (res.ok) {
                const data = await res.json();
                setFormData({
                    title: data.title || '',
                    price: data.price?.toString() || '',
                    description: data.description || '',
                    address: data.address || '',
                    status: data.status || 'DRAFT',
                    type: data.propertyType || 'commercial',
                    mapUrl: data.mapUrl || '',
                    images: data.images || [],
                    videos: data.videos || [],
                    source: data.source || 'MANUAL'
                });
                setLastGenAddress(data.address || '');
            } else {
                console.error('Fetch failed', await res.text());
            }
        } catch (error) {
            console.error('Error fetching listing:', error);
        } finally {
            setLoading(false);
        }
    };

    const buildStreetViewAndSatelliteUrls = (lat: number, lng: number): string[] => {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
        if (!key) return [];
        const size = '800x600';
        return [
            `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&heading=0&key=${key}`,
            `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&heading=180&key=${key}`,
            `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=${size}&maptype=satellite&key=${key}`
        ];
    };

    const generateAIContent = async (currentAddress: string, currentType: string) => {
        setIsGenerating(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/ai/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: currentAddress, type: currentType })
            });

            if (res.ok) {
                const data = await res.json();
                const lat = data.lat;
                const lng = data.lng;
                const newImages = (lat != null && lng != null)
                    ? buildStreetViewAndSatelliteUrls(lat, lng)
                    : null;
                setFormData(prev => ({
                    ...prev,
                    title: data.title || prev.title,
                    description: data.description || prev.description,
                    price: data.price != null ? String(data.price) : prev.price,
                    images: newImages?.length ? newImages : prev.images || []
                }));
            }
        } catch (error) {
            console.error('AI Gen failed', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddressBlur = async () => {
        if (!formData.address) return;
        if (!formData.mapUrl) {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
            setFormData(prev => ({ ...prev, mapUrl: url }));
        }
        if (formData.address !== lastGenAddress) {
            setLastGenAddress(formData.address);
            await generateAIContent(formData.address, formData.type);
        }
    };

    const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setFormData(prev => ({ ...prev, type: newType }));
        if (formData.address) {
            await generateAIContent(formData.address, newType);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGovernanceErrors([]);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${API_URL}/api/protected/listings/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Listado actualizado exitosamente');
                setMode('view');
            } else {
                const errorData = await res.json();
                if (res.status === 400 && errorData.error === 'Governance Block') {
                    setGovernanceErrors(errorData.details || ['Rule Violation']);
                    toast.error('Acción bloqueada por reglas de gobernanza');
                } else {
                    toast.error('Error al actualizar listado');
                }
            }
        } catch (error) {
            console.error('Update failed:', error);
            toast.error('Error al actualizar listado');
        }
    };

    const toggleFavorite = () => setIsFavorite(!isFavorite);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Enlace copiado al portapapeles');
    };

    const formatPrice = (price: string) => {
        const num = parseFloat(price);
        if (isNaN(num)) return price;
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-muted-foreground text-sm">Cargando propiedad...</p>
                </div>
            </div>
        );
    }

    const isVerified = formData.status === 'VERIFIED';
    const statusConfig = STATUS_CONFIG[formData.status] || STATUS_CONFIG.active;

    // ─── VIEW MODE ──────────────────────────────────────────
    if (mode === 'view') {
        return (
            <PageTransition className="max-w-6xl mx-auto space-y-6 pb-20">
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-lg border bg-card hover:bg-muted transition-colors"
                            title="Compartir"
                        >
                            <Share2 className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                            onClick={toggleFavorite}
                            className={cn(
                                "p-2 rounded-lg border transition-all",
                                isFavorite
                                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                                    : "bg-card border-border text-muted-foreground hover:text-red-400"
                            )}
                        >
                            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                        </button>
                        <AnimatedButton
                            variant="secondary"
                            onClick={() => setMode('edit')}
                            className="text-sm flex items-center gap-2"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                        </AnimatedButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image Gallery */}
                        <HeroGallery images={formData.images || []} title={formData.title} />

                        {/* Property Header */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                                    statusConfig.bg, statusConfig.color, statusConfig.border
                                )}>
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    {statusConfig.label}
                                </span>
                                <TrustBadge source={formData.source || 'MANUAL'} />
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                    {TYPE_LABELS[formData.type] || formData.type}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {formData.title || 'Propiedad Sin Título'}
                            </h1>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span className="text-sm">{formData.address || 'Sin dirección'}</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                    {formData.price ? formatPrice(formData.price) : 'Precio no definido'}
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">MXN</span>
                            </div>
                        </div>

                        {/* Description */}
                        <AnimatedCard className="p-6 space-y-3">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                Descripción
                                {formData.source === 'MANUAL' && (
                                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
                                        ✨ Generado por IA
                                    </span>
                                )}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {formData.description || 'Sin descripción disponible.'}
                            </p>
                        </AnimatedCard>

                        {/* Embedded Map */}
                        {formData.address && (
                            <AnimatedCard className="overflow-hidden">
                                <div className="p-4 border-b">
                                    <h2 className="text-lg font-semibold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-500" />
                                        Ubicación
                                    </h2>
                                </div>
                                <div className="h-[300px] bg-muted">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                        frameBorder="0"
                                        scrolling="no"
                                        className="w-full h-full"
                                    />
                                </div>
                            </AnimatedCard>
                        )}

                        {/* Property ID & Metadata */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground px-1">
                            <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" /> ID: <code className="font-mono bg-muted px-1 rounded">{params.id}</code>
                            </span>
                            {formData.mapUrl && (
                                <a
                                    href={formData.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <Globe className="h-3 w-3" /> Ver en Google Maps
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Contact Sidebar */}
                    <div className="space-y-4">
                        {/* Lead Form */}
                        <div className="sticky top-6">
                            <LeadForm listingId={params.id} listingTitle={formData.title} />

                            {/* Schedule Visit */}
                            <div className="mt-4">
                                <AnimatedButton
                                    type="button"
                                    variant="secondary"
                                    className="w-full bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 hover:from-indigo-100 hover:to-violet-100 border-indigo-200 font-semibold shadow-sm"
                                    onClick={() => setIsScheduleOpen(true)}
                                >
                                    <Video className="h-4 w-4 mr-2" /> Agendar Visita
                                </AnimatedButton>
                            </div>

                            {/* Quick Info Card */}
                            <AnimatedCard className="mt-4 p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Detalles Rápidos</h4>
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Building2 className="h-3.5 w-3.5" /> Tipo
                                        </span>
                                        <span className="font-medium">{TYPE_LABELS[formData.type] || formData.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <DollarSign className="h-3.5 w-3.5" /> Precio
                                        </span>
                                        <span className="font-semibold text-blue-600">{formData.price ? formatPrice(formData.price) : '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <ShieldCheck className="h-3.5 w-3.5" /> Estado
                                        </span>
                                        <span className={cn("font-medium", statusConfig.color)}>{statusConfig.label}</span>
                                    </div>
                                </div>
                            </AnimatedCard>
                        </div>
                    </div>
                </div>

                {/* SCHEDULE MODAL */}
                <AnimatePresence>
                    {isScheduleOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-background border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4"
                            >
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-indigo-500" />
                                    Agendar Visita
                                </h3>
                                <p className="text-sm text-muted-foreground">Selecciona fecha y hora para visitar esta propiedad.</p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Fecha</label>
                                            <input
                                                type="date"
                                                className="w-full p-2.5 rounded-lg border bg-muted/30 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                value={appointmentDate}
                                                onChange={(e) => setAppointmentDate(e.target.value)}
                                                min={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Hora</label>
                                            <input
                                                type="time"
                                                className="w-full p-2.5 rounded-lg border bg-muted/30 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                value={appointmentTime}
                                                onChange={(e) => setAppointmentTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Notas Adicionales</label>
                                        <textarea
                                            className="w-full p-2.5 rounded-lg border bg-muted/30 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                            placeholder="Mensaje para el agente..."
                                            rows={3}
                                            value={appointmentNotes}
                                            onChange={(e) => setAppointmentNotes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <AnimatedButton
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsScheduleOpen(false)}
                                        className="px-4 py-2 text-sm text-muted-foreground"
                                    >
                                        Cancelar
                                    </AnimatedButton>
                                    <AnimatedButton
                                        type="button"
                                        variant="primary"
                                        onClick={handleSchedule}
                                        className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-violet-600"
                                        disabled={!appointmentDate || !appointmentTime}
                                    >
                                        Enviar Solicitud
                                    </AnimatedButton>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </PageTransition>
        );
    }

    // ─── EDIT MODE ──────────────────────────────────────────
    return (
        <PageTransition className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Top Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMode('view')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Vista
                    </button>
                    <span className="text-xs bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20 font-medium flex items-center gap-1">
                        <Pencil className="h-3 w-3" /> Modo Edición
                    </span>
                </div>
                <AnimatedButton
                    variant="secondary"
                    onClick={() => setMode('view')}
                    className="text-sm flex items-center gap-2"
                >
                    <Eye className="h-3.5 w-3.5" />
                    Vista Previa
                </AnimatedButton>
            </div>

            {/* Governance Error Alert */}
            {governanceErrors.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-600"
                >
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h3 className="font-semibold text-sm">Acción Bloqueada por Reglas de Gobernanza</h3>
                        <ul className="text-sm list-disc pl-4 space-y-0.5">
                            {governanceErrors.map((err, i) => (
                                <li key={i}>{typeof err === 'string' ? err : JSON.stringify(err)}</li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            )}

            <motion.form
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Address Section */}
                <AnimatedCard className={cn(
                    "p-6 space-y-4",
                    isVerified ? "bg-muted/50" : "bg-gradient-to-r from-blue-500/5 to-indigo-500/5"
                )}>
                    <label className="text-sm font-semibold text-blue-400 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Dirección de la Propiedad
                        </span>
                        {isVerified && (
                            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">
                                🔒 Verificado y Bloqueado
                            </span>
                        )}
                        {isGenerating && (
                            <span className="text-blue-600 text-xs animate-pulse font-mono flex items-center gap-1">
                                <Sparkles className="h-3 w-3" /> Analizando Mercado...
                            </span>
                        )}
                    </label>
                    <AnimatedInput
                        type="text"
                        required
                        autoComplete="off"
                        disabled={isVerified}
                        placeholder="Ingresa la dirección completa..."
                        value={formData.address || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        onBlur={handleAddressBlur}
                        className={cn(
                            "w-full py-3 text-lg",
                            isVerified && "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                    />
                    {formData.address && (
                        <div className="h-48 rounded-xl border shadow-sm overflow-hidden bg-muted">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address)}&t=&z=18&ie=UTF8&iwloc=&output=embed`}
                                frameBorder="0"
                                scrolling="no"
                            />
                        </div>
                    )}
                </AnimatedCard>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedCard className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Título de la Propiedad</label>
                            <AnimatedInput
                                type="text"
                                required
                                autoComplete="off"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Precio (MXN) {isVerified && '🔒'}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <AnimatedInput
                                        type="number"
                                        required
                                        autoComplete="off"
                                        disabled={isVerified}
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className={cn("w-full pl-7", isVerified && "bg-muted cursor-not-allowed")}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Propiedad</label>
                                <select
                                    value={formData.type || 'commercial'}
                                    onChange={handleTypeChange}
                                    className="w-full px-4 py-3 bg-card border border-blue-500/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] transition-all"
                                >
                                    <option value="commercial">Comercial</option>
                                    <option value="residential">Residencial</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="land">Terreno</option>
                                    <option value="office">Oficina</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Descripción</label>
                            <textarea
                                required
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={8}
                                className="w-full px-4 py-3 bg-card border border-blue-500/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] transition-all"
                            />
                        </div>
                    </AnimatedCard>

                    <div className="space-y-5">
                        <AnimatedCard className="p-6 space-y-3">
                            <label className="text-sm font-medium">Galería (Auto-Generada + Subidas)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (!e.target.files?.[0]) return;
                                    const file = e.target.files[0];
                                    const form = new FormData();
                                    form.append('file', file);
                                    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                    const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: form });
                                    const data = await res.json();
                                    setFormData(prev => ({
                                        ...prev,
                                        images: [...(prev.images || []), data.url]
                                    }));
                                }}
                                className="w-full text-sm"
                            />
                            {formData.images && formData.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {formData.images.map((img: string, i: number) => (
                                        <div key={i} className="relative group aspect-video rounded-lg overflow-hidden border">
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images?.filter((_, index) => index !== i)
                                                }))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-muted/20 text-sm">
                                    Las fotos aparecerán aquí...
                                </div>
                            )}
                        </AnimatedCard>

                        <AnimatedCard className="p-6 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">URL del Mapa (Referencia)</label>
                            <AnimatedInput
                                type="url"
                                value={formData.mapUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                                className="w-full text-xs text-muted-foreground bg-muted/30"
                                readOnly
                            />
                        </AnimatedCard>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <AnimatedButton
                        type="button"
                        variant="ghost"
                        onClick={() => setMode('view')}
                        className="text-sm"
                    >
                        Cancelar
                    </AnimatedButton>
                    <AnimatedButton
                        type="submit"
                        variant="primary"
                        className="text-sm font-medium flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20"
                    >
                        <Save className="h-4 w-4" /> Guardar Cambios
                    </AnimatedButton>
                </div>
            </motion.form>
        </PageTransition>
    );
}
