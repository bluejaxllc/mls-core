'use client';
import { useLanguage } from '@/lib/i18n';
import { Plus, Building2, MoreHorizontal, Globe, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function myListingsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'history'>('active');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t.sections.listings.title}</h2>
                    <p className="text-muted-foreground">{t.sections.listings.subtitle}</p>
                </div>
                <button
                    onClick={() => router.push('/listings/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> {t.sections.listings.create}
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b flex gap-6 text-sm font-medium text-muted-foreground">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 border-b-2 transition-colors ${activeTab === 'active' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground hover:border-border'}`}
                >
                    {t.sections.listings.tabs.active} (2)
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`pb-3 border-b-2 transition-colors ${activeTab === 'drafts' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground hover:border-border'}`}
                >
                    {t.sections.listings.tabs.drafts} (1)
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-3 border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-foreground' : 'border-transparent hover:text-foreground hover:border-border'}`}
                >
                    {t.sections.listings.tabs.history}
                </button>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Listing Card 1 */}
                <div className="border rounded-lg bg-card overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="h-48 bg-muted relative">
                        <div className="absolute top-3 left-3 px-2 py-1 bg-green-900/80 text-green-300 text-[10px] font-mono rounded border border-green-800 backdrop-blur-sm">
                            VERIFIED • MLS
                        </div>
                        <div className="absolute top-3 right-3 text-white/50">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building2 className="h-12 w-12 opacity-20" />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold truncate pr-4">Luxury Office Floor in Reforma</h3>
                            <button>
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground mb-4">ID: LIST_9921 • $45,000,000 MXN</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                            <span className="flex items-center gap-1">
                                <Lock className="h-3 w-3" /> Address Locked
                            </span>
                            <span className="mx-1">•</span>
                            <span>Updated 2 hrs ago</span>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs flex justify-between items-center border-t">
                        <span className="text-green-500 font-medium">94 Trust Score</span>
                        <a href="/listings/LIST_9921" className="hover:underline">Edit Listing →</a>
                    </div>
                </div>

                {/* Listing Card 2 */}
                <div className="border rounded-lg bg-card overflow-hidden group hover:border-blue-500/50 transition-colors opacity-75">
                    <div className="h-48 bg-muted relative">
                        <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-900/80 text-yellow-300 text-[10px] font-mono rounded border border-yellow-800 backdrop-blur-sm">
                            PENDING REVIEW
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Building2 className="h-12 w-12 opacity-20" />
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold truncate pr-4">Industrial Warehouse</h3>
                            <button>
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            </button>
                        </div>
                        <p className="text-xs font-mono text-muted-foreground mb-4">ID: LIST_DRAFT_88 • $12,500,000 MXN</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-3">
                            <span>Draft Version 1</span>
                            <span className="mx-1">•</span>
                            <span>Created 1 day ago</span>
                        </div>
                    </div>
                    <div className="bg-muted/30 px-4 py-2 text-xs flex justify-between items-center border-t">
                        <span className="text-yellow-500 font-medium">-- Trust Score</span>
                        <button className="hover:underline">Continue Editing →</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
