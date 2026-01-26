'use client';
import { useLanguage } from '@/lib/i18n';
import { Search, Filter, MapPin, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { FiltersModal } from '@/components/filters/FiltersModal';
import { useState } from 'react';

export default function PropertiesPage() {
    const { t } = useLanguage();
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{t.sections.properties.title}</h2>
                <p className="text-muted-foreground">{t.sections.properties.subtitle}</p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        placeholder={t.sections.properties.searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2 bg-card border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 border rounded-md bg-card hover:bg-muted text-sm font-medium"
                >
                    <Filter className="h-4 w-4" /> Filters
                </button>
            </div>

            <FiltersModal isOpen={showFilters} onClose={() => setShowFilters(false)} />

            {/* Results Table */}
            <div className="border rounded-md bg-card">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 border-b text-muted-foreground font-medium">
                        <tr>
                            <th className="px-4 py-3">{t.sections.properties.columns.id}</th>
                            <th className="px-4 py-3">{t.sections.properties.columns.address}</th>
                            <th className="px-4 py-3">{t.sections.properties.columns.listings}</th>
                            <th className="px-4 py-3">{t.sections.properties.columns.confidence}</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr className="group hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-blue-400">PROP_8829</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Av. Paseo de la Reforma 483
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1 text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded w-fit border border-blue-800">
                                    <LinkIcon className="h-3 w-3" /> 2 Active
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1 text-green-500 font-medium">
                                    <ShieldCheck className="h-4 w-4" /> High
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <a href="/properties/PROP_8829" className="text-xs border px-3 py-1.5 rounded hover:bg-white/10 no-underline">View Details</a>
                            </td>
                        </tr>
                        <tr className="group hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-mono text-blue-400">PROP_1102</td>
                            <td className="px-4 py-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                Calle Orizaba 12, Roma Norte
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded w-fit">
                                    <LinkIcon className="h-3 w-3" /> 0 Active
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1 text-yellow-500 font-medium">
                                    <ShieldCheck className="h-4 w-4" /> Medium
                                </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                                <button className="text-xs border px-3 py-1.5 rounded hover:bg-white/10">View Details</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
