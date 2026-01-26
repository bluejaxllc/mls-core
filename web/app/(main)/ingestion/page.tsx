'use client';
import { useLanguage } from '@/lib/i18n';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function IngestionPage() {
    const { t } = useLanguage();

    const handleSync = () => {
        // TODO: Replace with actual sync logic
        alert('Sync initiated! Feed updates will be processed in the background.');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // TODO: Replace with actual file upload logic
            alert(`Uploading ${files.length} file(s): ${Array.from(files).map(f => f.name).join(', ')}`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t.sections.ingestion.title}</h2>
                    <p className="text-muted-foreground">{t.sections.ingestion.subtitle}</p>
                </div>
                <button
                    onClick={handleSync}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" /> Sync Now
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Area */}
                <div className="lg:col-span-2 space-y-4">
                    <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-muted/5 transition-colors cursor-pointer">
                        <input
                            type="file"
                            multiple
                            accept=".csv,.xml"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                            <Upload className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg">{t.sections.ingestion.upload}</h3>
                        <p className="text-muted-foreground text-sm mt-1">{t.sections.ingestion.dragDrop}</p>
                    </label>

                    <div className="border rounded-md bg-card">
                        <div className="p-4 border-b font-medium text-sm">Active Feeds</div>
                        <div className="divide-y divide-border">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <div>
                                        <p className="text-sm font-medium">RE/MAX Global Feed</p>
                                        <p className="text-xs text-muted-foreground">Last sync: 10 mins ago • 1204 Records</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-800">Healthy</span>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                    <div>
                                        <p className="text-sm font-medium">Century 21 Legacy</p>
                                        <p className="text-xs text-muted-foreground">Last sync: 4 hours ago • 84 Records</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded border border-yellow-800">Degraded</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Validation Log */}
                <div className="border rounded-md bg-card h-fit">
                    <div className="p-4 border-b font-medium text-sm">Validation Log</div>
                    <div className="p-4 space-y-4 max-h-[500px] overflow-auto">
                        <div className="flex gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Batch #9923 Processed</p>
                                <p className="text-xs text-muted-foreground">Success: 45 | Skipped: 2</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Scraper Bot 4 Detected</p>
                                <p className="text-xs text-muted-foreground">Blocked 15 listings due to Rule: ScrapedDataDowngrade</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Values Updated</p>
                                <p className="text-xs text-muted-foreground">Property PROP_8829 updated from Source: MLS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
