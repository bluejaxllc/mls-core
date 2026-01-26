'use client';
import { useLanguage } from '@/lib/i18n';
import { Settings, Users, Database, Globe } from 'lucide-react';

export default function SystemPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{t.sections.system.title}</h2>
                <p className="text-muted-foreground">{t.sections.system.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Region Settings */}
                <div className="border rounded-lg bg-card p-6">
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
                    <button className="mt-4 w-full border border-dashed py-2 text-xs rounded text-muted-foreground hover:bg-muted">
                        {t.sections.system.editDefaults}
                    </button>
                </div>

                {/* User Management */}
                <div className="border rounded-lg bg-card p-6">
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
                    <button className="mt-8 w-full border py-2 text-xs rounded hover:bg-muted">
                        {t.sections.system.manageRoles}
                    </button>
                </div>
            </div>
        </div>
    )
}
