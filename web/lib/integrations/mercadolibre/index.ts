import { MercadoLibreAuth } from './auth';
import { MercadoLibreClient } from './client';
import { MercadoLibreCrawler } from './crawler';

const globalForML = globalThis as unknown as {
    mlAuth: MercadoLibreAuth | undefined;
};

export const mlAuth = globalForML.mlAuth ?? new MercadoLibreAuth();

if (process.env.NODE_ENV !== 'production') globalForML.mlAuth = mlAuth;

export const mlClient = new MercadoLibreClient(mlAuth);
export const mlCrawler = new MercadoLibreCrawler(mlAuth);

export * from './auth';
export * from './client';
export * from './crawler';
export * from './normalizer';
