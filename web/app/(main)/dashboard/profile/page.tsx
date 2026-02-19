
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Award, Globe, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

const profileSchema = z.object({
    firstName: z.string().min(2, 'El nombre es muy corto'),
    lastName: z.string().min(2, 'El apellido es muy corto'),
    bio: z.string().optional(),
    phoneNumber: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    licenseNumber: z.string().optional(),
    locationId: z.string().optional(),
    specialties: z.string().optional(), // Comma separated for input
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettingsPage() {
    const { data: session, update }: any = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            bio: '',
            phoneNumber: '',
            whatsapp: '',
            instagram: '',
            licenseNumber: '',
            locationId: '',
            specialties: '',
        }
    });

    // Fetch current data
    useEffect(() => {
        if ((session as any)?.user?.id) {
            // We need to fetch the full user profile as session might be stale or incomplete
            fetch(`${API_URL}/api/public/agents/${session.user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        const specs = data.specialties ? JSON.parse(data.specialties).join(', ') : '';
                        form.reset({
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            bio: data.bio || '',
                            phoneNumber: data.phoneNumber || '',
                            whatsapp: data.whatsapp || '',
                            instagram: data.instagram || '',
                            licenseNumber: data.licenseNumber || '',
                            locationId: data.locationId || '',
                            specialties: specs,
                        });
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load profile", err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [session, form]);

    const onSubmit = async (data: ProfileFormValues) => {
        setSaving(true);
        try {
            // Convert specialties string back to array
            const specialtiesArray = data.specialties
                ? data.specialties.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            const payload = {
                ...data,
                specialties: JSON.stringify(specialtiesArray)
            };

            const res = await fetch(`${API_URL}/api/protected/me/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.accessToken}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to update profile');

            toast.success('Perfil actualizado correctamente');
            update();
        } catch (error) {
            toast.error('Error al actualizar el perfil');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="max-w-4xl mx-auto py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold mb-2">Editar Perfil</h1>
                <p className="text-muted-foreground mb-8">Administra tu información pública visible para los clientes.</p>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            Información Básica
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre</label>
                                <input {...form.register('firstName')} className="w-full p-2 border rounded-lg bg-background" />
                                {form.formState.errors.firstName && <p className="text-red-500 text-xs">{form.formState.errors.firstName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apellido</label>
                                <input {...form.register('lastName')} className="w-full p-2 border rounded-lg bg-background" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Ciudad / Ubicación</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input {...form.register('locationId')} className="w-full p-2 pl-9 border rounded-lg bg-background" placeholder="Ej. Chihuahua, MX" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Licencia Inmobiliaria</label>
                                <div className="relative">
                                    <Award className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input {...form.register('licenseNumber')} className="w-full p-2 pl-9 border rounded-lg bg-background" placeholder="Ej. LIC-12345" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium">Biografía</label>
                            <textarea
                                {...form.register('bio')}
                                className="w-full p-3 border rounded-lg bg-background h-32 resize-none"
                                placeholder="Cuéntales a tus clientes sobre tu experiencia y pasión..."
                            />
                        </div>

                        <div className="mt-6 space-y-2">
                            <label className="text-sm font-medium">Especialidades (separadas por coma)</label>
                            <input
                                {...form.register('specialties')}
                                className="w-full p-2 border rounded-lg bg-background"
                                placeholder="Ej. Residencial, Locales Comerciales, Lujo"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Phone className="h-5 w-5 text-green-600" />
                            Contacto y Redes
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Teléfono</label>
                                <input {...form.register('phoneNumber')} className="w-full p-2 border rounded-lg bg-background" placeholder="+52 ..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">WhatsApp</label>
                                <input {...form.register('whatsapp')} className="w-full p-2 border rounded-lg bg-background" placeholder="+52 ..." />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instagram</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input {...form.register('instagram')} className="w-full p-2 pl-9 border rounded-lg bg-background" placeholder="@usuario" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="h-5 w-5" />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
