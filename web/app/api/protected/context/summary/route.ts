import { NextResponse } from 'next/server';

export async function GET() {
    // Return mock context data for the RightPanel UI
    return NextResponse.json({
        trustScore: 85,
        trustLabel: 'Nivel Óptimo',
        trustBreakdown: [
            { category: 'Verificación de Identidad', score: 100, max: 100 },
            { category: 'Historial de Publicaciones', score: 85, max: 100 },
            { category: 'Calidad de Datos', score: 70, max: 100 }
        ],
        ruleResults: [
            { name: 'Scraping de Precios', status: 'PASS', color: 'green' },
            { name: 'Detección de Duplicados', status: 'PASS', color: 'green' },
            { name: 'Calidad de Imágenes', status: 'WARN', color: 'yellow' }
        ],
        activity: [
            {
                id: 'act_1',
                type: 'CRAWL',
                description: 'Crawl de Mercado Libre',
                timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
                source: 'SYSTEM',
                outcome: 'PASS'
            },
            {
                id: 'act_2',
                type: 'CRAWL',
                description: 'Crawl de Facebook',
                timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                source: 'SYSTEM',
                outcome: 'PASS'
            },
            {
                id: 'act_3',
                type: 'FILTER',
                description: 'Propósito sospechoso filtrado',
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
                source: 'SYSTEM',
                outcome: 'BLOCK'
            }
        ],
        stats: {
            totalListings: 1250,
            activeListings: 843,
            unreadNotifications: 3
        }
    });
}
