
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Phone, Award, Star } from 'lucide-react';

interface AgentCardProps {
    agent: any;
    className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
    const specialties = agent.specialties ? JSON.parse(agent.specialties) : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group ${className}`}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-blue-600 border-2 border-white shadow-sm">
                            {agent.firstName?.[0]}{agent.lastName?.[0]}
                        </div>
                        {agent.mlsStatus === 'ACTIVE' && (
                            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white" title="Active Member" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <Link href={`/agents/${agent.id}`} className="group-hover:text-blue-600 transition-colors">
                            <h3 className="text-lg font-bold truncate">
                                {agent.firstName} {agent.lastName}
                            </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{agent.locationId || 'Chihuahua, MX'}</span>
                        </div>

                        {agent.licenseNumber && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Award className="h-3.5 w-3.5 text-amber-500" />
                                <span>Lic: {agent.licenseNumber}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {agent.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                            {agent.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {specialties.slice(0, 3).map((spec: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">5.0</span>
                        <span className="text-xs text-muted-foreground">(12)</span>
                    </div>

                    <Link href={`/agents/${agent.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                        Ver Perfil
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
