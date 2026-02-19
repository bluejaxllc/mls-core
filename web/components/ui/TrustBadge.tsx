import { ShieldCheck, ShieldAlert, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

type TrustLevel = 'VERIFIED' | 'SCRAPED' | 'UNKNOWN';

interface TrustBadgeProps {
    source: string;
}

export function TrustBadge({ source }: TrustBadgeProps) {
    let level: TrustLevel = 'UNKNOWN';
    let label = source;
    let color = 'bg-gray-100 text-gray-600 border-gray-200';
    let Icon = Globe;

    const normalizedSource = source?.toUpperCase() || 'UNKNOWN';

    if (normalizedSource === 'MANUAL' || normalizedSource === 'MLS_FEED' || normalizedSource.includes('FEED')) {
        level = 'VERIFIED';
        label = normalizedSource === 'MANUAL' ? 'Agents Verified' : 'MLS Feed';
        color = 'bg-green-50 text-green-700 border-green-200';
        Icon = ShieldCheck;
    } else if (normalizedSource === 'SCRAPER' || normalizedSource.includes('CRAWL')) {
        level = 'SCRAPED';
        label = 'AI Detected';
        color = 'bg-amber-50 text-amber-700 border-amber-200';
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
