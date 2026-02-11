'use client';
import { useLanguage } from '@/lib/i18n';
import { Settings, Users, Database, Globe, Edit, Plus, X } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useState } from 'react';

export default function SystemPage() {
    const { t } = useLanguage();
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    return (
        <PageTransition className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.sections.system.title}</h2>
                <p className="text-sm md:text-base text-muted-foreground">{t.sections.system.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Region Settings */}
                <AnimatedCard className="border rounded-lg bg-card p-6">
                    <h3 className="font-medium text-sm flex items-center gap-2 mb-4">
                        <Globe className="h-4 w-4" /> {t.sections.system.regionSettings}
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">{t.sections.system.activeRegion}</span>
                            <span className="font-mono">Chihuahua (MX-CHH)</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">{t.sections.system.currency}</span>
                            <span className="font-mono">MXN ({t.sections.system.pesos})</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">{t.sections.system.timezone}</span>
                            <span className="font-mono">America/Chihuahua</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowRegionModal(true)}
                        className="mt-4 w-full border border-dashed py-2 text-xs rounded text-muted-foreground hover:bg-muted hover:border-primary transition-all flex items-center justify-center gap-2"
                    >
                        <Edit className="h-3 w-3" />
                        {t.sections.system.editDefaults}
                    </button>
                </AnimatedCard>

                {/* User Management */}
                <AnimatedCard className="border rounded-lg bg-card p-6" index={1}>
                    <h3 className="font-medium text-sm flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4" /> {t.sections.system.userDirectory}
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                                    BA
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">{t.common.brokerAdmin}</p>
                                    <p className="text-xs text-muted-foreground">RE/MAX Polanco</p>
                                </div>
                            </div>
                            <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded">{t.common.online}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs">
                                    SA
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">{t.common.systemAdmin}</p>
                                    <p className="text-xs text-muted-foreground">Blue Jax Core</p>
                                </div>
                            </div>
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{t.common.offline}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUserModal(true)}
                        className="mt-8 w-full border py-2 text-xs rounded hover:bg-muted transition-colors flex items-center justify-center gap-2"
                    >
                        <Users className="h-3 w-3" />
                        {t.sections.system.manageRoles}
                    </button>
                </AnimatedCard>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimatedCard className="border rounded-lg bg-card p-4" index={2}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Database className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Database Status</p>
                            <p className="text-sm font-bold text-green-500">Operational</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="border rounded-lg bg-card p-4" index={3}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Settings className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">System Uptime</p>
                            <p className="text-sm font-bold">99.8%</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="border rounded-lg bg-card p-4" index={4}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Active Users</p>
                            <p className="text-sm font-bold">2</p>
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Region Settings Modal */}
            {showRegionModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowRegionModal(false)}
                >
                    <div
                        className="bg-card border rounded-lg max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                <h3 className="font-bold">Configuración Regional</h3>
                            </div>
                            <button
                                onClick={() => setShowRegionModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Región Activa</label>
                                <select className="w-full p-2 border rounded bg-background">
                                    <option>Chihuahua (MX-CHH)</option>
                                    <option>Ciudad Juárez (MX-CJS)</option>
                                    <option>Monterrey (MX-NLE)</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Moneda</label>
                                <select className="w-full p-2 border rounded bg-background">
                                    <option>MXN - Peso Mexicano</option>
                                    <option>USD - Dólar Americano</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Zona Horaria</label>
                                <select className="w-full p-2 border rounded bg-background">
                                    <option>America/Chihuahua (UTC-7)</option>
                                    <option>America/Mexico_City (UTC-6)</option>
                                    <option>America/Tijuana (UTC-8)</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t flex gap-2">
                            <button
                                onClick={() => setShowRegionModal(false)}
                                className="flex-1 px-4 py-2 border rounded hover:bg-muted transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    alert('Configuración guardada exitosamente');
                                    setShowRegionModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Management Modal */}
            {showUserModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowUserModal(false)}
                >
                    <div
                        className="bg-card border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-card">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <h3 className="font-bold">Gestión de Usuarios</h3>
                            </div>
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* User List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                                            BA
                                        </div>
                                        <div>
                                            <p className="font-medium">Broker Admin</p>
                                            <p className="text-xs text-muted-foreground">admin@remax.com • RE/MAX Polanco</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">En línea</span>
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">
                                            SA
                                        </div>
                                        <div>
                                            <p className="font-medium">System Admin</p>
                                            <p className="text-xs text-muted-foreground">admin@bluejax.ai • Blue Jax Core</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Fuera de línea</span>
                                        <button className="text-muted-foreground hover:text-foreground">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Add User Button */}
                            <button
                                onClick={() => alert('Función para agregar usuario - Próximamente')}
                                className="w-full p-3 border border-dashed rounded hover:bg-muted transition-colors flex items-center justify-center gap-2 text-muted-foreground"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Nuevo Usuario
                            </button>
                        </div>

                        <div className="p-6 border-t">
                            <button
                                onClick={() => setShowUserModal(false)}
                                className="w-full px-4 py-2 border rounded hover:bg-muted transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageTransition>
    )
}
