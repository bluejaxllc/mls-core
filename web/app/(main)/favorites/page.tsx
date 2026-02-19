'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Building2, MapPin, ExternalLink, FolderPlus, Folder, Plus, X } from 'lucide-react';
import Link from 'next/link';

interface FavoriteWithListing {
    id: string;
    listingId: string;
    notes?: string;
    createdAt: string;
    listing: {
        id: string;
        title: string;
        price: number;
        address: string;
        city: string;
        images: string;
        propertyType: string;
        status: string;
    };
}

interface Collection {
    id: string;
    name: string;
    description?: string;
    color: string;
    listingIds: string[];
    count: number;
}

export default function FavoritesPage() {
    const { data: session }: any = useSession();
    const [favorites, setFavorites] = useState<FavoriteWithListing[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'collections'>('all');
    const [showNewCollection, setShowNewCollection] = useState(false);
    const [newCollName, setNewCollName] = useState('');
    const [newCollColor, setNewCollColor] = useState('#3B82F6');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (session?.accessToken) {
            fetchFavorites();
            fetchCollections();
        }
    }, [session]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/favorites`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) setFavorites(await res.json());
        } catch (e) {
            console.error('Failed to fetch favorites', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollections = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/favorites/collections`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) setCollections(await res.json());
        } catch (e) {
            console.error('Failed to fetch collections', e);
        }
    };

    const removeFavorite = async (listingId: string) => {
        try {
            await fetch(`${API_URL}/api/protected/favorites`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ listingId })
            });
            setFavorites(prev => prev.filter(f => f.listingId !== listingId));
        } catch (e) {
            console.error('Failed to remove favorite', e);
        }
    };

    const createCollection = async () => {
        if (!newCollName.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/protected/favorites/collections`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCollName, color: newCollColor })
            });
            if (res.ok) {
                const coll = await res.json();
                setCollections(prev => [{ ...coll, listingIds: [], count: 0 }, ...prev]);
                setNewCollName('');
                setShowNewCollection(false);
            }
        } catch (e) {
            console.error('Failed to create collection', e);
        }
    };

    const deleteCollection = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/protected/favorites/collections/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            setCollections(prev => prev.filter(c => c.id !== id));
        } catch (e) {
            console.error('Failed to delete collection', e);
        }
    };

    const parseImages = (imagesStr: string): string[] => {
        try {
            const parsed = JSON.parse(imagesStr);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const PALETTE = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#06B6D4', '#6366F1'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Mis Favoritos
                    </h1>
                    <p className="text-muted-foreground mt-1">{favorites.length} propiedades guardadas</p>
                </div>
                <button
                    onClick={() => setShowNewCollection(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                    <FolderPlus className="h-4 w-4" />
                    <span className="hidden md:inline">Nueva Colección</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b flex gap-6 text-sm font-medium">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-2 border-b-2 transition-all ${activeTab === 'all'
                        ? 'border-red-500 text-red-600 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Heart className="h-4 w-4 inline mr-1" />
                    Todos ({favorites.length})
                </button>
                <button
                    onClick={() => setActiveTab('collections')}
                    className={`pb-2 border-b-2 transition-all ${activeTab === 'collections'
                        ? 'border-blue-500 text-blue-600 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <Folder className="h-4 w-4 inline mr-1" />
                    Colecciones ({collections.length})
                </button>
            </div>

            {/* New Collection Modal */}
            <AnimatePresence>
                {showNewCollection && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-card border rounded-xl p-4 flex items-end gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium">Nombre de la colección</label>
                                <input
                                    value={newCollName}
                                    onChange={e => setNewCollName(e.target.value)}
                                    placeholder="Ej. Casas de Playa"
                                    className="w-full p-2 border rounded-lg bg-background text-sm"
                                    onKeyDown={e => e.key === 'Enter' && createCollection()}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Color</label>
                                <div className="flex gap-1">
                                    {PALETTE.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setNewCollColor(c)}
                                            className={`h-6 w-6 rounded-full transition-all ${newCollColor === c ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={createCollection}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                Crear
                            </button>
                            <button
                                onClick={() => setShowNewCollection(false)}
                                className="p-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            {activeTab === 'all' ? (
                <div>
                    {loading ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                            Cargando favoritos...
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="py-16 text-center border-2 border-dashed rounded-xl">
                            <Heart className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-1">Sin favoritos aún</h3>
                            <p className="text-muted-foreground text-sm mb-4">Explora listados y toca el ❤️ para guardar</p>
                            <Link
                                href="/listings"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                                Ver Listados
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {favorites.map((fav, idx) => {
                                const images = parseImages(fav.listing.images);
                                const mainImage = images[0];
                                return (
                                    <motion.div
                                        key={fav.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-card border rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative h-44 bg-muted overflow-hidden">
                                            {mainImage ? (
                                                <img src={mainImage} alt={fav.listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Building2 className="h-12 w-12 text-muted-foreground/20" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeFavorite(fav.listingId)}
                                                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-red-600/80 transition-colors group/btn"
                                            >
                                                <Heart className="h-4 w-4 text-red-500 fill-red-500 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <span className="text-white font-bold text-lg">
                                                    ${fav.listing.price?.toLocaleString() || '—'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold truncate mb-1">{fav.listing.title || 'Propiedad'}</h3>
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                                <MapPin className="h-3 w-3" />
                                                {fav.listing.address || fav.listing.city || 'Sin dirección'}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs bg-muted px-2 py-1 rounded capitalize">
                                                    {fav.listing.propertyType}
                                                </span>
                                                <Link
                                                    href={`/listings/${fav.listingId}`}
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                                >
                                                    Ver Detalles <ExternalLink className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.length === 0 ? (
                        <div className="col-span-3 py-16 text-center border-2 border-dashed rounded-xl">
                            <Folder className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-1">Sin colecciones</h3>
                            <p className="text-muted-foreground text-sm">Crea una colección para organizar tus favoritos</p>
                        </div>
                    ) : (
                        collections.map((coll, idx) => (
                            <motion.div
                                key={coll.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card border rounded-xl p-5 hover:shadow-lg transition-shadow group relative"
                            >
                                <button
                                    onClick={() => deleteCollection(coll.id)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                                <div
                                    className="h-3 w-12 rounded-full mb-4"
                                    style={{ backgroundColor: coll.color }}
                                />
                                <h3 className="font-bold text-lg mb-1">{coll.name}</h3>
                                {coll.description && (
                                    <p className="text-sm text-muted-foreground mb-3">{coll.description}</p>
                                )}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Building2 className="h-4 w-4" />
                                    {coll.count} {coll.count === 1 ? 'propiedad' : 'propiedades'}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
