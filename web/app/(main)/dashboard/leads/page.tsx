'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Mail, Phone, Calendar, Search, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { PageTransition, AnimatedCard, AnimatedInput, AnimatedButton } from '@/components/ui/animated';
import { toast } from 'react-hot-toast';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message?: string;
    listingId: string;
    listingTitle?: string;
    status: string;
    createdAt: string;
}

export default function LeadsDashboard() {
    const { data: session }: any = useSession();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (session?.accessToken) {
            fetchLeads();
        }
    }, [session]);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/leads`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                setLeads(await res.json());
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        try {
            const res = await fetch(`${API_URL}/api/protected/leads/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                const updated = await res.json();
                setLeads(leads.map(l => l.id === id ? { ...l, status: updated.status } : l));
                toast.success(`Lead marcado como ${status === 'CONTACTED' ? 'Contactado' : 'Cerrado'}`);
            }
        } catch (error) {
            toast.error('Error al actualizar lead');
        } finally {
            setUpdating(null);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.listingTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusColor = (status: string) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500/10 text-blue-500';
            case 'CONTACTED': return 'bg-amber-500/10 text-amber-500';
            case 'CLOSED': return 'bg-green-500/10 text-green-500';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const statusLabel = (status: string) => {
        switch (status) {
            case 'NEW': return 'Nuevo';
            case 'CONTACTED': return 'Contactado';
            case 'CLOSED': return 'Cerrado';
            default: return status;
        }
    };

    return (
        <PageTransition className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Leads & Consultas
                    </h1>
                    <p className="text-muted-foreground">Gestiona los interesados en tus propiedades.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <AnimatedInput
                        placeholder="Buscar leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed rounded-xl">
                    <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <h3 className="font-semibold text-lg">No hay leads</h3>
                    <p className="text-muted-foreground text-sm">Los contactos de tus propiedades aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredLeads.map((lead, i) => (
                        <AnimatedCard key={lead.id} index={i} className="p-6 flex flex-col md:flex-row gap-6 hover:border-blue-200 transition-colors">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg">{lead.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusColor(lead.status)}`}>
                                        {statusLabel(lead.status)}
                                    </span>
                                </div>
                                {lead.listingTitle && (
                                    <p className="text-xs text-muted-foreground">
                                        Propiedad: <span className="font-medium text-foreground">{lead.listingTitle}</span>
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" /> {lead.email}
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" /> {lead.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" /> {new Date(lead.createdAt).toLocaleDateString('es-MX')}
                                    </div>
                                </div>
                                {lead.message && (
                                    <div className="bg-muted/30 p-3 rounded-md text-sm italic border-l-4 border-blue-200">
                                        &quot;{lead.message}&quot;
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col justify-center gap-2 min-w-[160px]">
                                {lead.status === 'NEW' && (
                                    <AnimatedButton
                                        variant="primary"
                                        className="w-full text-sm py-2"
                                        onClick={() => updateStatus(lead.id, 'CONTACTED')}
                                        disabled={updating === lead.id}
                                    >
                                        <UserCheck className="h-4 w-4 mr-1" />
                                        Marcar Contactado
                                    </AnimatedButton>
                                )}
                                {lead.status === 'CONTACTED' && (
                                    <AnimatedButton
                                        variant="primary"
                                        className="w-full text-sm py-2"
                                        onClick={() => updateStatus(lead.id, 'CLOSED')}
                                        disabled={updating === lead.id}
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Cerrar Lead
                                    </AnimatedButton>
                                )}
                                {lead.status === 'CLOSED' && (
                                    <span className="text-xs text-center text-green-600 font-medium flex items-center justify-center gap-1">
                                        <CheckCircle className="h-4 w-4" /> Completado
                                    </span>
                                )}
                                <a
                                    href={`mailto:${lead.email}`}
                                    className="text-center text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Enviar Email
                                </a>
                            </div>
                        </AnimatedCard>
                    ))}
                </div>
            )}
        </PageTransition>
    );
}
