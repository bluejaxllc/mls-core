import { ShieldCheck, ShieldAlert, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

type TrustLevel = 'VERIFIED' | 'SCRAPED' | 'UNKNOWN';

interface TrustBadgeProps {
    source: string;
}

export function TrustBadge({ source }: TrustBadgeProps) {
    let level: TrustLevel = 'UNKNOWN';
    let label = source;
    let color = 'bg-muted text-muted-foreground border-border';
    let Icon = Globe;

    const normalizedSource = source?.toUpperCase() || 'UNKNOWN';

    if (normalizedSource === 'MANUAL' || normalizedSource === 'MLS_FEED' || normalizedSource.includes('FEED')) {
        level = 'VERIFIED';
        label = normalizedSource === 'MANUAL' ? 'Agents Verified' : 'MLS Feed';
        color = 'bg-green-500/10 text-green-500 border-green-500/20';
        Icon = ShieldCheck;
    } else if (normalizedSource === 'SCRAPER' || normalizedSource.includes('CRAWL')) {
        level = 'SCRAPED';
        label = 'AI Detected';
        color = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        Icon = ShieldAlert;
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}
            title={`Source: ${source}`}
        >
            <Icon className="h-3.5 w-3.5" />
            {label}
        </motion.div>
    );
}
