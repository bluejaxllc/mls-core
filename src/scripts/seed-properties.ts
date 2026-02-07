import { db } from './db';

/**
 * Seed script para generar dummy data de propiedades observadas
 * Ejecutar con: npx tsx src/scripts/seed-properties.ts
 */

// Direcciones reales de Chihuahua, México
const addresses = {
    Chihuahua: [
        'Calle Revolución #1234, Col. Centro',
        'Av. Universidad #567, Col. Panamericana',
        'Calle Juárez #890, Col. Nombre de Dios',
        'Calle Independencia #234, Col. Zarco',
        'Av. Tecnológico #456, Col. Granjas',
        'Calle Victoria #789, Col. Santa Rita',
        'Av. Colón #1011, Col. San Felipe',
        'Calle Ojinaga #1213, Col. Juventud',
        'Periférico de la Juventud #1415, Col. Quintas del Sol',
        'Av. Mirador #1617, Col. Bosques del Valle',
        'Calle Teófilo Borunda #1819, Col. Pacífico',
        'Av. División del Norte #2021, Col. Dale',
        'Calle 20 de Noviembre #2223, Col. Centro',
        'Av. Ocampo #2425, Col. Obrera',
        'Calle Escudero #2627, Col. Palomas',
        'Periférico R. Almada #2829, Col. Campestre Virreyes',
        'Av. Américas #3031, Col. San Ángel',
        'Calle Privada del Sur #3233, Col. Satélite',
        'Av. Lombardo Toledano #3435, Col. Mármol III',
        'Calle Río Sacramento #3637, Col. Jardines de San Francisco',
    ],
    'Juárez': [
        'Av. 16 de Septiembre #1234, Col. Centro',
        'Blvd. Tomás Fernández #456, Col. Campestre',
        'Av. López Mateos #789, Col. Partido Romero',
        'Calle Ignacio Mejía #1011, Col. San Lorenzo',
        'Av. Insurgentes #1213, Col. Infonavit Casas Grandes',
        'Blvd. Independencia #1415, Col. Jarudo',
        'Av. Heroico Colegio Militar #1617, Col. Azteca',
        'Calle Valle de los Aztecas #1819, Col. Valle del Sol',
        'Av. Tecnológico #2021, Col. Plutarco Elías Calles',
        'Calle Manuel Acuña #2223, Col. Burócrata Federal',
    ],
    Delicias: [
        'Av. Tercera Norte #234, Col. Centro',
        'Calle Octava Poniente #567, Col. San Isidro',
        'Av. Primera Oriente #890, Col. Campo Navarro',
        'Calle Cuarta Sur #1112, Col. Ejidal',
        'Av. Sexta Norte #1314, Col. Periodistas',
        'Calle Segunda Poniente #1516, Col. Riveras del Sacramento',
        'Av. Quinta Oriente #1718, Col. Mirador',
        'Calle Séptima Norte #1920, Col. Morelos',
    ],
    Cuauhtémoc: [
        'Av. Allende #345, Col. Centro',
        'Calle Juárez #678, Col. Álamos',
        'Av. Universidad #901, Col. Insurgentes',
        'Calle Morelos #1234, Col. San Antonio',
        'Av. Hidalgo #1567, Col. El Ranchito',
    ],
    Parral: [
        'Av. Independencia #456, Col. Centro',
        'Calle Maclovio Herrera #789, Col. Fatima',
        'Av. José Ma. Morelos #1012, Col. Del Valle',
        'Calle Pedro Leal #1345, Col. Palmas',
    ],
};

// Títulos realistas
const propertyTitles = [
    (addr: string, type: 'RENT' | 'SALE', propType: string) => {
        const action = type === 'RENT' ? 'Renta de' : 'Venta de';
        const types = {
            HOUSE: ['Casa', 'Hermosa Casa', 'Casa Amplia', 'Casa Residencial'],
            APARTMENT: ['Departamento', 'Depa Moderno', 'Apartamento', 'Departamento Amueblado'],
            COMMERCIAL: ['Local Comercial', 'Oficina', 'Local en Renta', 'Espacio Comercial'],
            LAND: ['Terreno', 'Lote', 'Terreno Residencial', 'Lote Comercial'],
        };
        const typeDesc = types[propType as keyof typeof types]?.[Math.floor(Math.random() * 4)] || 'Propiedad';
        return `${action} ${typeDesc}`;
    },
];

// Descripciones
const descriptions = {
    HOUSE: [
        'Hermosa casa con acabados de primera, amplia sala, comedor, cocina integral, 3 recámaras, 2 baños, estacionamiento para 2 autos.',
        'Casa en excelente ubicación, cerca de escuelas y centros comerciales. Cuenta con jardín, cochera techada y cisterna.',
        'Casa residencial con amplios espacios, pisos de porcelanato, cocina equipada, cuarto de servicio.',
        'Propiedad en privada cerrada, 4 recámaras, 2.5 baños, sala de TV, área de lavado.',
    ],
    APARTMENT: [
        'Departamento moderno en segundo piso, 2 recámaras, 1 baño, cocina integral, área de lavandería.',
        'Depa amueblado con excelente vista, 1 recámara, clóset amplio, baño completo, cocina equipada.',
        'Apartamento nuevo en zona tranquila, 3 recámaras, 2 baños, balcón, estacionamiento.',
        'Departamento céntrico, cerca de todo, 2 rec, 1 baño, cocina, sala comedor.',
    ],
    COMMERCIAL: [
        'Local comercial en zona de alto tráfico, 120m², ideal para negocio.',
        'Oficina ejecutiva en edificio corporativo, incluye recepción, 2 privados, sala de juntas.',
        'Excelente local sobre avenida principal, 200m², estacionamiento, bodega.',
        'Espacio comercial en plaza reconocida, acabados modernos, baño.',
    ],
    LAND: [
        'Terreno residencial plano, 250m², todos los servicios, escrituras al corriente.',
        'Lote comercial sobre carretera, 500m², uso de suelo mixto, excelente inversión.',
        'Terreno en zona en desarrollo, 300m², agua, luz, drenaje disponibles.',
        'Lote esquinero, 400m², ideal para construcción de casa o comercio.',
    ],
};

// Generar dummy data
async function seedProperties() {
    console.log('🌱 Starting property seeding...');

    const properties = [];
    let count = 0;

    // Generar 100 propiedades
    for (const city in addresses) {
        const cityAddresses = addresses[city as keyof typeof addresses];

        for (let i = 0; i < cityAddresses.length; i++) {
            const address = cityAddresses[i];
            const propertyTypes = ['HOUSE', 'APARTMENT', 'COMMERCIAL', 'LAND'];
            const listingTypes: ('RENT' | 'SALE')[] = ['RENT', 'SALE'];
            const sources = ['MercadoLibre', 'Vivanuncios', 'Inmuebles24', 'Lamudi', 'PropiedadesMX'];

            // Propiedades en renta y venta
            const listingType = i % 2 === 0 ? 'RENT' : 'SALE';
            const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const source = sources[Math.floor(Math.random() * sources.length)];

            // Precios realistas según tipo y ciudad
            let basePrice = 0;
            if (propertyType === 'HOUSE') {
                basePrice = listingType === 'RENT' ? 8000 + Math.random() * 12000 : 800000 + Math.random() * 2200000;
            } else if (propertyType === 'APARTMENT') {
                basePrice = listingType === 'RENT' ? 4000 + Math.random() * 8000 : 400000 + Math.random() * 1100000;
            } else if (propertyType === 'COMMERCIAL') {
                basePrice = listingType === 'RENT' ? 12000 + Math.random() * 28000 : 1200000 + Math.random() * 3800000;
            } else {
                basePrice = 250000 + Math.random() * 1250000; // Land only for sale
            }

            const price = Math.round(basePrice / 1000) * 1000; // Redondear

            // Solo crear terrenos para venta
            if (propertyType === 'LAND' && listingType === 'RENT') {
                continue;
            }

            const title = propertyTitles[0](address, listingType, propertyType);
            const description = descriptions[propertyType as keyof typeof descriptions][
                Math.floor(Math.random() * descriptions[propertyType as keyof typeof descriptions].length)
            ];

            const confidence = 0.7 + Math.random() * 0.25; // 70-95% confidence

            properties.push({
                id: `obs-${city.toLowerCase()}-${count++}`,
                type: 'OBSERVED',
                title,
                description,
                price,
                address,
                city,
                status: listingType,
                propertyType,
                image: null, // Se pueden agregar URLs de imágenes placeholder
                trustScore: Math.round(60 + Math.random() * 35), // 60-95
                source,
                sourceUrl: `https://example.com/${source.toLowerCase()}/listing-${count}`,
                confidence,
                updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 7 días
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 30 días
            });
        }
    }

    console.log(`✅ Generated ${properties.length} properties`);
    console.log('📊 Sample property:', JSON.stringify(properties[0], null, 2));

    // Guardar en archivo JSON para referencia
    const fs = require('fs');
    const path = require('path');

    const outputPath = path.join(__dirname, '../../dummy-data/properties.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2));
    console.log(`💾 Saved to ${outputPath}`);

    // Aquí insertarías en la base de datos
    // Por ahora solo generamos el JSON

    return properties;
}

// Ejecutar
seedProperties()
    .then((props) => {
        console.log(`\n✨ Seeding complete! ${props.length} properties created.`);
        console.log('\n📋 Breakdown by city:');
        const byCity = props.reduce((acc, p) => {
            acc[p.city] = (acc[p.city] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        Object.entries(byCity).forEach(([city, count]) => {
            console.log(`   ${city}: ${count} properties`);
        });

        console.log('\n📋 Breakdown by type:');
        const byType = props.reduce((acc, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        Object.entries(byType).forEach(([type, count]) => {
            console.log(`   ${type}: ${count} properties`);
        });
    })
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    });
