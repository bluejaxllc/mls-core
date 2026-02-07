import { IntelligenceDashboard } from '@/components/admin/IntelligenceDashboard';
import { SignalReview } from '@/components/admin/SignalReview';

export default function AdminIntelligencePage() {
    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Intelligence Control Room</h1>
                <p className="text-muted-foreground text-lg">
                    Monitor external data ingestion, crawler health, and signal governance.
                </p>
            </div>

            <div className="space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Active Signals & Governance</h2>
                    </div>
                    <SignalReview />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Crawler Operations</h2>
                    </div>
                    <IntelligenceDashboard />
                </section>
            </div>
        </div>
    );
}
