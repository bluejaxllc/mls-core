'use client';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Sparkles, Video, MapPin } from 'lucide-react';
import { PageTransition, AnimatedCard, AnimatedButton, AnimatedInput, staggerContainer } from '@/components/ui/animated';
import { motion } from 'framer-motion';

export default function EditListingPage({ params }: { params: { id: string } }) {
    const { t } = useLanguage();
    const router = useRouter();
    const { data: session }: any = useSession();
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGenAddress, setLastGenAddress] = useState('');
    const [formData, setFormData] = useState<{
        title: string;
        price: string;
        description: string;
        address: string;
        type: string;
        mapUrl?: string;
        images?: string[];
        videos?: string[];
    }>({
        title: '',
        price: '',
        description: '',
        address: '',
        type: 'commercial',
        mapUrl: '',
        images: [],
        videos: []
    });

    useEffect(() => {
        if (session?.accessToken && params.id) {
            fetchListing();
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
                    type: data.propertyType || 'commercial',
                    mapUrl: data.mapUrl || '',
                    images: data.images || [],
                    videos: data.videos || []
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

        // Auto-generate Map URL
        if (!formData.mapUrl) {
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.address)}`;
            setFormData(prev => ({ ...prev, mapUrl: url }));
        }

        // Auto-generate AI Content (Title/Desc/Price/Photos) on Address CHANGE
        if (formData.address !== lastGenAddress) {
            setLastGenAddress(formData.address); // Mark as handled
            await generateAIContent(formData.address, formData.type);
        }
    };

    const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setFormData(prev => ({ ...prev, type: newType }));

        // Regenerate content if address exists
        if (formData.address) {
            await generateAIContent(formData.address, newType);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                router.push('/listings');
                router.refresh();
            } else {
                alert('Error al actualizar listado');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Error al actualizar listado');
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;

    return (
        <PageTransition className="space-y-6">
            <div className="flex items-center gap-4">
                <AnimatedButton
                    variant="ghost"
                    onClick={() => router.back()}
                    className="p-2 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </AnimatedButton>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Editar Listado</h2>
                    <p className="text-muted-foreground">Actualizar detalles y medios de la propiedad</p>
                </div>
            </div>

            <motion.form
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto space-y-8 relative z-10 pb-20"
            >

                {/* HERO ADDRESS INPUT */}
                <div className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100 shadow-sm relative z-20">
                    <label className="text-lg font-semibold text-blue-900 flex justify-between items-center">
                        Dirección de la Propiedad (Comienza Aquí)
                        {isGenerating && <span className="text-blue-600 text-sm animate-pulse font-mono">✨ Analizando Mercado y Generando Recursos...</span>}
                    </label>
                    <motion.div className="relative" whileHover={{ scale: 1.005 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-6 w-6 z-10" />
                        <AnimatedInput
                            type="text"
                            required
                            autoComplete="off"
                            placeholder="Ingresa la dirección completa..."
                            value={formData.address || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                            onBlur={handleAddressBlur}
                            className="w-full pl-12 pr-4 py-4 text-xl bg-white text-gray-900 border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-blue-200/70"
                        />
                    </motion.div>
                    {formData.address && (
                        <div className="mt-4 h-64 rounded-lg border-2 border-white shadow-md overflow-hidden bg-gray-100">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.address)}&t=&z=18&ie=UTF8&iwloc=&output=embed`}
                                frameBorder="0"
                                scrolling="no"
                            ></iframe>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Título de la Propiedad</label>
                            <AnimatedInput
                                type="text"
                                required
                                autoComplete="off"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-card relative z-20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Precio (MXN)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <AnimatedInput
                                        type="number"
                                        required
                                        autoComplete="off"
                                        value={formData.price || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                        className="w-full pl-7 bg-card relative z-20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tipo de Propiedad</label>
                                <select
                                    value={formData.type || 'commercial'}
                                    onChange={handleTypeChange}
                                    className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                                >
                                    <option value="commercial">Comercial</option>
                                    <option value="residential">Residencial</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="land">Terreno / Land</option>
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
                                className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">URL de Mapa Interno</label>
                            <AnimatedInput
                                type="url"
                                value={formData.mapUrl || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                                className="w-full bg-card text-sm text-muted-foreground bg-muted/50 relative z-20"
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
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
                                className="w-full relative z-20"
                            />
                            {formData.images && formData.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {formData.images.map((img: string, i: number) => (
                                        <div key={i} className="relative group aspect-video">
                                            <img src={img} className="w-full h-full object-cover rounded border" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    images: prev.images?.filter((_, index) => index !== i)
                                                }))}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm relative z-30"
                                            >
                                                <div className="h-3 w-3 flex items-center justify-center text-[10px] font-bold">✕</div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground bg-muted/20">
                                    Las fotos aparecerán aquí...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <AnimatedButton
                        type="submit"
                        variant="primary"
                        className="text-sm font-medium flex items-center gap-2 relative z-20"
                    >
                        <Save className="h-4 w-4" /> Guardar Cambios
                    </AnimatedButton>
                </div>
            </motion.form>
        </PageTransition>
    );
}
