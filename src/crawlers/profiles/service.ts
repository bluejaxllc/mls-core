import { prismaIntelligence } from '../../lib/intelligencePrisma';
import { SourceConfigSchema, SourceConfig, SourceType } from '../types';

export class SourceProfileService {

    async createProfile(data: {
        name: string;
        type: SourceType;
        baseUrl: string;
        trustScore?: number;
        config: SourceConfig;
    }) {
        // Validate Config
        const validConfig = SourceConfigSchema.parse(data.config);

        return await prismaIntelligence.sourceProfile.create({
            data: {
                name: data.name,
                type: data.type,
                baseUrl: data.baseUrl,
                trustScore: data.trustScore || 10,
                config: JSON.stringify(validConfig),
            },
        });
    }

    async getProfile(id: string) {
        const profile = await prismaIntelligence.sourceProfile.findUnique({
            where: { id },
        });
        if (!profile) return null;

        return {
            ...profile,
            config: JSON.parse(profile.config) as SourceConfig,
        };
    }

    async listProfiles() {
        const profiles = await prismaIntelligence.sourceProfile.findMany();
        return profiles.map((p: any) => ({
            ...p,
            config: JSON.parse(p.config) as SourceConfig,
        }));
    }

    async updateConfig(id: string, newConfig: SourceConfig) {
        const validConfig = SourceConfigSchema.parse(newConfig);

        return await prismaIntelligence.sourceProfile.update({
            where: { id },
            data: {
                config: JSON.stringify(validConfig),
            },
        });
    }
}

export const sourceProfileService = new SourceProfileService();
