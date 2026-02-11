'use client';
import { useLanguage } from '@/lib/i18n';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function IngestionPage() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: number; errors: any[] } | null>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const handleSync = () => {
        // TODO: Replace with actual sync logic
        alert('¡Sincronización iniciada! Las actualizaciones del feed se procesarán en segundo plano.');
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
            // Dev Auth Fallback
            const token = (session as any)?.accessToken || 'mock-jwt-token';

            const res = await fetch(`${API_URL}/api/import/csv`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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

        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(`Error al subir archivo: ${error.message}`);
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.sections.ingestion.title}</h2>
                    <p className="text-sm md:text-base text-muted-foreground">{t.sections.ingestion.subtitle}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <button
                        onClick={handleDownloadTemplate}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 border border-slate-200"
                    >
                        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Descargar</span> Plantilla
                    </button>
                    <button
                        onClick={handleSync}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" /> Sincronizar<span className="hidden sm:inline"> Ahora</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-2 space-y-4">
                    <label className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                            {isUploading ? <RefreshCw className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                        </div>
                        <h3 className="font-semibold text-lg">{isUploading ? 'Subiendo...' : t.sections.ingestion.upload}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{isUploading ? 'Procesando registros CSV...' : 'Click para seleccionar archivo .csv'}</p>
                    </label>

                    {/* Basic Upload Stats / Feedback */}
                    {uploadResult && (
                        <div className={`p-4 rounded-md border ${uploadResult.errors.length === 0 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Importación Completa
                            </h4>
                            <p className="text-sm mt-1">
                                Se crearon exitosamente <span className="font-bold">{uploadResult.success}</span> listados.
                            </p>
                            {uploadResult.errors.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-red-600 mb-1">Errores ({uploadResult.errors.length}):</p>
                                    <ul className="text-xs text-red-600/80 list-disc list-inside max-h-32 overflow-y-auto">
                                        {uploadResult.errors.map((e, idx) => (
                                            <li key={idx}>Fila {e.row}: {e.error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border rounded-md bg-card">
                        <div className="p-4 border-b font-medium text-sm">Feeds Activos</div>
                        <div className="divide-y divide-border">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="text-sm font-medium">RE/MAX Global Feed</p>
                                        <p className="text-xs text-muted-foreground">Última sincronización: hace 10 min • 1204 Registros</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-800">Saludable</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                    <div>
                                        <p className="text-sm font-medium">Century 21 Legacy</p>
                                        <p className="text-xs text-muted-foreground">Última sincronización: hace 4 horas • 84 Registros</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded border border-yellow-800">Degradado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation Log */}
                <div className="border rounded-md bg-card h-fit">
                    <div className="p-4 border-b font-medium text-sm">Registro de Validación</div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-auto">
                        {/* Show recent upload success in log too if desired, otherwise keeping static for demo + dynamic result above */}
                        <div className="flex gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Lote #9923 Procesado</p>
                                <p className="text-xs text-muted-foreground">Éxito: 45 | Omitidos: 2</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Bot Scraper 4 Detectado</p>
                                <p className="text-xs text-muted-foreground">15 listados bloqueados debido a Regla: ScrapedDataDowngrade</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Valores Actualizados</p>
                                <p className="text-xs text-muted-foreground">Propiedad PROP_8829 actualizada desde Fuente: MLS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
