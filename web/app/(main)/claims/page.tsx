import { AlertTriangle, ChevronRight, Inbox, Clock, CheckCircle } from 'lucide-react';
import { PageTransition, AnimatedButton } from '@/components/ui/animated';

export default function ClaimsPage() {
    return (
        <PageTransition className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Claims & Disputes</h2>
                    <p className="text-muted-foreground">Manage ownership conflicts and data accuracy reports.</p>
                </div>
                <div className="flex gap-2">
                    <AnimatedButton variant="secondary" className="text-sm font-medium">Archived</AnimatedButton>
                    <AnimatedButton variant="primary" className="text-sm font-medium">+ Open Claim</AnimatedButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-4">
                    {/* Claim Item - Critical */}
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        Ownership Dispute: Listing #3992
                                        <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[10px] rounded uppercase">Action Required</span>
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">Broker B claims Exclusivity Agreement uploaded 2 days ago conflicts with your listing.</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due in 24h</span>
                                        <span>Claim ID: CLM-2024-883</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                        </div>
                    </div>

                    {/* Claim Item - Active */}
                    <div className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer group relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <Inbox className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        Duplicate Listing Report
                                        <span className="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 text-[10px] rounded uppercase">Under Review</span>
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1">System detected 98% match with Listing #1120. Pending moderation.</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Submitted 2 days ago</span>
                                        <span>Claim ID: CLM-2024-812</span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                        </div>
                    </div>

                    {/* Claim Item - Resolved */}
                    <div className="p-4 rounded-lg border bg-card opacity-60 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="mt-1">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">Data Accuracy Check - Resolved</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Lot size corrected on canonical record.</p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span>Closed 1 week ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-4 border rounded-lg bg-card">
                        <h4 className="font-semibold text-sm mb-3">Governance Stats</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Claims Open</span>
                                <span className="font-mono">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Resolution</span>
                                <span className="font-mono">48h</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Dispute Win Rate</span>
                                <span className="font-mono text-green-500">85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
