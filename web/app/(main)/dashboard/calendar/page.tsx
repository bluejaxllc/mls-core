
'use client';

import { useEffect, useState } from 'react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useSession } from 'next-auth/react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    notes: string;
    listing: {
        title: string;
        address: string;
    };
    visitorId: string;
}

export default function CalendarPage() {
    const { data: session }: any = useSession();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewRole, setViewRole] = useState<'visitor' | 'agent'>('agent');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        if (session?.accessToken) fetchAppointments();
    }, [session, viewRole]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/protected/appointments?role=${viewRole}`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                setAppointments(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
        try {
            const res = await fetch(`${API_URL}/api/protected/appointments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(status === 'CONFIRMED' ? 'Cita confirmada' : 'Cita cancelada');
                fetchAppointments();
            }
        } catch (error) {
            toast.error('Error al actualizar cita');
        }
    };

    return (
        <PageTransition className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Calendario de Visitas</h2>
                    <p className="text-muted-foreground">Gestiona tus próximas citas y solicitudes.</p>
                </div>
                <div className="flex bg-muted/50 p-1 rounded-lg border">
                    <button
                        onClick={() => setViewRole('agent')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${viewRole === 'agent' ? 'bg-white shadow text-blue-600 font-medium' : 'text-muted-foreground'}`}
                    >
                        Soy Agente (Mis Propiedades)
                    </button>
                    <button
                        onClick={() => setViewRole('visitor')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all ${viewRole === 'visitor' ? 'bg-white shadow text-blue-600 font-medium' : 'text-muted-foreground'}`}
                    >
                        Soy Visitante (Mis Solicitudes)
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <p>Cargando calendario...</p>
                ) : appointments.length === 0 ? (
                    <div className="p-12 text-center border-2 border-dashed rounded-xl">
                        <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">No hay citas programadas</h3>
                    </div>
                ) : (
                    appointments.map((apt, i) => (
                        <AnimatedCard key={apt.id} index={i} className="p-5 border rounded-xl flex flex-col md:flex-row justify-between gap-4 md:items-center group hover:border-blue-200 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full flex-shrink-0 ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-600' :
                                    apt.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                        'bg-amber-100 text-amber-600'
                                    }`}>
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{apt.listing.title}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                                        <MapPin className="h-3 w-3" /> {apt.listing.address}
                                    </p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(apt.startTime).toLocaleDateString('es-MX')} &nbsp;•&nbsp;
                                        {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(apt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    {apt.notes && (
                                        <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                                            &quot;{apt.notes}&quot;
                                        </p>
                                    )}
                                </div>
                            </div>

                            {viewRole === 'agent' && apt.status === 'PENDING' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(apt.id, 'CONFIRMED')}
                                        className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <CheckCircle className="h-4 w-4" /> Confirmar
                                    </button>
                                    <button
                                        onClick={() => updateStatus(apt.id, 'CANCELLED')}
                                        className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <XCircle className="h-4 w-4" /> Rechazar
                                    </button>
                                </div>
                            )}
                        </AnimatedCard>
                    ))
                )}
            </div>
        </PageTransition>
    );
}
