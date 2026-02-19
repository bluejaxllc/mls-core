import { Sidebar } from '@/components/shell/Sidebar'
import { TopBar } from '@/components/shell/TopBar'
import { RightPanel } from '@/components/shell/RightPanel'
import { ComparisonProvider } from '@/lib/comparison-context'
import { ComparisonBar } from '@/components/compare/ComparisonBar'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ComparisonProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                    <TopBar />
                    <div className="flex flex-1 overflow-hidden">
                        <main className="flex-1 overflow-auto p-3 md:p-6">
                            {children}
                        </main>
                        <RightPanel />
                    </div>
                </div>
            </div>
            <ComparisonBar />
        </ComparisonProvider>
    )
}

