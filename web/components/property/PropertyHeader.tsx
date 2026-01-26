import { MapPin, ShieldCheck, Database, Link as LinkIcon } from 'lucide-react';

export function PropertyHeader({ id }: { id: string }) {
    return (
        <div className="bg-card border-b p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-200 text-[10px] font-mono border border-blue-800">
                            CANONICAL PROPERTY
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">ID: {id}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        Av. Paseo de la Reforma 483, Cuauhtémoc
                    </h1>
                    <p className="text-muted-foreground text-sm ml-7">Mexico City, CDMX 06500</p>
                </div>

                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase">Confidence</p>
                        <div className="flex items-center gap-1 justify-end text-green-500">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="font-bold">High (3 Sources)</span>
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
