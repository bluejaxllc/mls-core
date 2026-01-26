import { PropertyHeader } from '@/components/property/PropertyHeader';

export default function PropertyPage({ params }: { params: { id: string } }) {
    return (
        <div className="space-y-6">
            <PropertyHeader id={params.id} />

            <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="h-4 w-1 bg-blue-500 rounded-full"></span>
                    Associated Commercial Listings
                </h3>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium">
                            <tr>
                                <th className="px-4 py-3">Listing ID</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Broker</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <tr className="bg-card hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-blue-400">LIST_9921</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-green-900/30 text-green-400 text-[10px] border border-green-800">ACTIVE</span></td>
                                <td className="px-4 py-3">RE/MAX Polanco</td>
                                <td className="px-4 py-3 font-mono">$45,000,000 MXN</td>
                                <td className="px-4 py-3 text-muted-foreground">2 hrs ago</td>
                            </tr>
                            <tr className="bg-card hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-blue-400">LIST_1120</td>
                                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 text-[10px] border border-red-800">SUSPENDED</span></td>
                                <td className="px-4 py-3">Century 21</td>
                                <td className="px-4 py-3 font-mono">$42,500,000 MXN</td>
                                <td className="px-4 py-3 text-muted-foreground">1 day ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
