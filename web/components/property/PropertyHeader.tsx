import { MapPin, ShieldCheck, Database, Link as LinkIcon, AlertTriangle, CheckCircle, Ban, FileWarning } from 'lucide-react';

interface PropertyHeaderProps {
    id: string;
    status: string;
    title: string;
    address: string;
}

export function PropertyHeader({ id, status, title, address }: PropertyHeaderProps) {
    const getStatusBadge = (status: string) => {
        const styles = {
            SUSPENDED: "bg-red-500/10 text-red-600 border-red-500/20",
            PENDING_REVIEW: "bg-orange-500/10 text-orange-600 border-orange-500/20",
            VERIFIED: "bg-green-500/10 text-green-600 border-green-500/20",
            DRAFT: "bg-gray-500/10 text-muted-foreground border-border",
            ARCHIVED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
            active: "bg-blue-500/10 text-blue-600 border-blue-500/20"
        };

        const icons = {
            SUSPENDED: Ban,
            PENDING_REVIEW: AlertTriangle,
            VERIFIED: CheckCircle,
            DRAFT: FileWarning,
            ARCHIVED: Database,
            active: ShieldCheck
        };

        const normalizedStatus = status?.toUpperCase() || 'DRAFT';
        // @ts-ignore
        const style = styles[normalizedStatus] || styles.active;
        // @ts-ignore
        const Icon = icons[normalizedStatus] || icons.active;

        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${style}`}>
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{normalizedStatus.replace('_', ' ')}</span>
            </div>
        );
    };

    return (
        <div className="bg-card border-b p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(status)}
                        <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-200 text-[10px] font-mono border border-blue-800">
                            CANONICAL PROPERTY
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">ID: {id}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        {title || 'Propiedad Sin Título'}
                    </h1>
                    <p className="text-muted-foreground text-sm ml-7">{address || 'Dirección No Disponible'}</p>
                </div>

                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">Confidence</p>
                        <div className="flex items-center gap-1 justify-end text-green-500">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="font-bold">High (3 Sources)</span>
                        </div>
                    </div>
                    <div className="text-right pl-4 border-l">
                        <p className="text-xs text-muted-foreground uppercase">Quality</p>
                        <div className="flex items-center gap-1 justify-end text-blue-500">
                            <Database className="h-4 w-4" />
                            <span className="font-bold">Good (85%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm mt-6">
                <div className="p-3 bg-muted/30 border rounded">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Lot Size</p>
                    <p className="font-mono">820 m²</p>
                </div>
                <div className="p-3 bg-muted/30 border rounded">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Construction</p>
                    <p className="font-mono">1,240 m²</p>
                </div>
                <div className="p-3 bg-muted/30 border rounded">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Zoning</p>
                    <p className="font-mono">H/20/30 (Commercial)</p>
                </div>
                <div className="p-3 bg-muted/30 border rounded flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">Linked Listings</p>
                        <p className="font-mono">2 Active, 5 Hist</p>
                    </div>
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    );
}
