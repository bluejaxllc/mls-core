'use client';
import { useLanguage } from '@/lib/i18n';
import { authFetch } from '@/lib/api';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Download, Database, Zap, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function IngestionPage() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: number; errors: any[] } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const data = await authFetch('/api/ingest/sync', { method: 'POST' }, (session as any)?.accessToken);
            toast.success(`¡Sincronización iniciada! Job ID: ${data.job.id}`);
        } catch (error: any) {
            console.error('Sync Error:', error);
            toast.error(`Error al iniciar sincronización: ${error.error || error.message}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDownloadTemplate = () => {
        window.open(`${API_URL}/api/import/template`, '_blank');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        setUploadResult(null);

        try {
            const token = (session as any)?.accessToken || 'mock-jwt-token';
            const res = await fetch(`${API_URL}/api/import/csv`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) {
                const err = await res.text();
                throw new Error(err || 'Error de carga');
            }

            const data = await res.json();
            setUploadResult({
                success: data.successCount,
                errors: data.errors || []
            });
            toast.success(`Se importaron ${data.successCount} listados exitosamente`);

        } catch (error: any) {
            console.error('Upload Error:', error);
            toast.error(`Error al subir archivo: ${error.message}`);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const feeds = [
        {
            name: 'RE/MAX Global Feed',
            lastSync: 'Última sincronización: hace 10 min',
            records: '1,204 Registros',
            status: 'healthy' as const,
            statusLabel: 'Saludable',
        },
        {
            name: 'Century 21 Legacy',
            lastSync: 'Última sincronización: hace 4 horas',
            records: '84 Registros',
            status: 'degraded' as const,
            statusLabel: 'Degradado',
        },
    ];

    const logs = [
        { icon: 'success' as const, title: 'Lote #9923 Procesado', detail: 'Éxito: 45 | Omitidos: 2' },
        { icon: 'error' as const, title: 'Bot Scraper 4 Detectado', detail: '15 listados bloqueados — Regla: ScrapedDataDowngrade' },
        { icon: 'success' as const, title: 'Valores Actualizados', detail: 'Propiedad PROP_8829 actualizada desde Fuente: MLS' },
    ];

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Database className="h-5 w-5" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t.sections.ingestion.title}</h2>
                        </div>
                        <p className="text-white/80 text-sm md:text-base max-w-xl">{t.sections.ingestion.subtitle}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                        <AnimatedButton
                            variant="secondary"
                            onClick={handleDownloadTemplate}
                            className="flex items-center justify-center gap-2 text-sm bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-sm"
                        >
                            <Download className="h-4 w-4" />
                            <span className="hidden sm:inline">Descargar</span> Plantilla
                        </AnimatedButton>
                        <AnimatedButton
                            variant="primary"
                            onClick={handleSync}
                            isLoading={isSyncing}
                            className="flex items-center justify-center gap-2 text-sm bg-white text-blue-700 hover:bg-white/90 font-semibold"
                        >
                            {!isSyncing && <RefreshCw className="h-4 w-4" />}
                            Sincronizar<span className="hidden sm:inline"> Ahora</span>
                        </AnimatedButton>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Feeds Activos', value: '2', icon: Zap, color: 'text-blue-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20' },
                    { label: 'Registros Totales', value: '1,288', icon: Database, color: 'text-emerald-500', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20' },
                    { label: 'Reglas Activas', value: '12', icon: Shield, color: 'text-purple-500', bg: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20' },
                    { label: 'Última Import.', value: 'Hoy', icon: CheckCircle, color: 'text-orange-500', bg: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20' },
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className={`relative p-4 rounded-xl border bg-gradient-to-br ${stat.bg} overflow-hidden group hover:shadow-md transition-shadow`}
                    >
                        <div className="absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.03] rounded-full -mr-4 -mt-4 group-hover:scale-125 transition-transform" />
                        <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-bold">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-2 space-y-4">
                    <motion.label
                        whileHover={{ scale: 1.005 }}
                        className={`border-2 border-dashed rounded-xl p-8 md:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isUploading
                            ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 opacity-70 cursor-not-allowed'
                            : 'border-muted-foreground/20 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <motion.div
                            animate={isUploading ? { rotate: 360 } : {}}
                            transition={isUploading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                            className="h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20"
                        >
                            {isUploading ? <RefreshCw className="h-7 w-7 text-white" /> : <Upload className="h-7 w-7 text-white" />}
                        </motion.div>
                        <h3 className="font-semibold text-lg">{isUploading ? 'Subiendo...' : t.sections.ingestion.upload}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{isUploading ? 'Procesando registros CSV...' : 'Click para seleccionar archivo .csv'}</p>
                        <p className="text-xs text-muted-foreground/60 mt-3">Tamaño máximo: 10MB • Formato: CSV</p>
                    </motion.label>

                    {/* Upload Result */}
                    <AnimatePresence>
                        {uploadResult && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className={`p-5 rounded-xl border-2 ${uploadResult.errors.length === 0
                                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800'
                                    : 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800'
                                    }`}>
                                    <h4 className="font-semibold flex items-center gap-2 text-base">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        Importación Completa
                                    </h4>
                                    <p className="text-sm mt-1">
                                        Se crearon exitosamente <span className="font-bold text-green-700">{uploadResult.success}</span> listados.
                                    </p>
                                    {uploadResult.errors.length > 0 && (
                                        <div className="mt-3 p-3 bg-white/50 dark:bg-black/20 rounded-lg border">
                                            <p className="text-sm font-medium text-red-600 mb-1">Errores ({uploadResult.errors.length}):</p>
                                            <ul className="text-xs text-red-600/80 list-disc list-inside max-h-32 overflow-y-auto space-y-0.5">
                                                {uploadResult.errors.map((e, idx) => (
                                                    <li key={idx}>Fila {e.row}: {e.error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Active Feeds */}
                    <AnimatedCard className="overflow-hidden" index={1}>
                        <div className="p-4 border-b font-semibold text-sm flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-500" />
                            Feeds Activos
                        </div>
                        <div className="divide-y divide-border">
                            {feeds.map((feed, idx) => (
                                <motion.div
                                    key={feed.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${feed.status === 'healthy' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-medium">{feed.name}</p>
                                            <p className="text-xs text-muted-foreground">{feed.lastSync} • {feed.records}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${feed.status === 'healthy'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                                        }`}>
                                        {feed.statusLabel}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatedCard>
                </div>

                {/* Validation Log */}
                <AnimatedCard className="h-fit" index={2}>
                    <div className="p-4 border-b font-semibold text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        Registro de Validación
                    </div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-auto">
                        {logs.map((log, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.08 }}
                                className="flex gap-3 text-sm p-3 rounded-lg hover:bg-muted/30 transition-colors group"
                            >
                                {log.icon === 'success' ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1">
                                    <p className="font-medium group-hover:text-foreground transition-colors">{log.title}</p>
                                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                                </div>
                                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all shrink-0 mt-1" />
                            </motion.div>
                        ))}
                    </div>
                </AnimatedCard>
            </div>
        </PageTransition>
    );
}
