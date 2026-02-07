import { z } from 'zod';

// Zod Schema for Source Profile Configuration
// This is stored as a JSON string in the DB
export const SourceConfigSchema = z.object({
    selectors: z.object({
        listWrapper: z.string(),
        listItem: z.string(),
        listingTitle: z.string(),
        listingPrice: z.string(),
        listingAddress: z.string().optional(),
        listingImage: z.string().optional(),
        nextPage: z.string().optional(),
        detailLink: z.string().optional(),
    }),
    pagination: z.object({
        strategy: z.enum(['NEXT_BUTTON', 'SCROLL', 'PARAM_INCREMENT']),
        maxPages: z.number().default(5),
        paramName: z.string().optional(), // for PARAM_INCREMENT
    }).optional(),
    auth: z.object({
        required: z.boolean().default(false),
        loginUrl: z.string().optional(),
        username: z.string().optional(),
        password: z.string().optional(), // Use env var reference in real usage
    }).optional(),
    antiBot: z.object({
        useProxies: z.boolean().default(true),
        delayRange: z.tuple([z.number(), z.number()]).default([1000, 3000]),
        stealthMode: z.boolean().default(true),
    }).default({
        useProxies: true,
        delayRange: [1000, 3000],
        stealthMode: true
    }),
});

export type SourceConfig = z.infer<typeof SourceConfigSchema>;

export enum SourceType {
    PORTAL = 'PORTAL',
    BROKERAGE = 'BROKERAGE',
    REGISTRY = 'REGISTRY',
    CLASSIFIEDS = 'CLASSIFIEDS',
}

export interface CrawlJob {
    id: string;
    sourceId: string;
    url: string;
    profileName: string; // snapshot of name at time of job
    config: SourceConfig;
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
    startedAt?: Date;
    completedAt?: Date;
    attempt: number;
}
