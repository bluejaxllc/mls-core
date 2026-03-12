/**
 * Seed Script: Populates the MLS database with realistic Chihuahua real estate data.
 * Run: npx tsx scripts/seed-data.ts
 */
import { prismaCore as prisma } from './prisma-core';
import { randomUUID } from 'crypto';


// ─── Current logged-in user ID (from JWT in auth.ts) ───
const CURRENT_USER_ID = 'OxSwavzjG950Ub4m3tIY';

// ─── Users ───
const agents = [
    {
        id: CURRENT_USER_ID,
        email: 'admin@remax-polanco.mx',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        roles: 'admin,agent',
        mlsStatus: 'ACTIVE',
        bio: 'Agente inmobiliario con más de 15 años de experiencia en el mercado de Chihuahua. Especializado en propiedades residenciales de lujo y terrenos de inversión.',
        licenseNumber: 'CHH-AG-2019-0847',
        phoneNumber: '+52 614 123 4567',
        whatsapp: '+52 614 123 4567',
        instagram: '@carlosmendoza_realty',
        languages: 'Spanish,English',
        specialties: JSON.stringify(['Residencial de Lujo', 'Terrenos', 'Inversión']),
    },
    {
        id: randomUUID(),
        email: 'sofia.ramirez@century21chih.mx',
        firstName: 'Sofía',
        lastName: 'Ramírez',
        roles: 'agent',
        mlsStatus: 'ACTIVE',
        bio: 'Especialista en propiedades comerciales y oficinas en la zona centro y periférico de Chihuahua.',
        licenseNumber: 'CHH-AG-2020-1293',
        phoneNumber: '+52 614 234 5678',
        whatsapp: '+52 614 234 5678',
        specialties: JSON.stringify(['Comercial', 'Oficinas', 'Renta']),
    },
    {
        id: randomUUID(),
        email: 'jorge.villa@inmobiliariachih.mx',
        firstName: 'Jorge',
        lastName: 'Villanueva',
        roles: 'agent',
        mlsStatus: 'ACTIVE',
        bio: 'Corredor certificado AMPI con conocimiento profundo del mercado de terrenos en las zonas de expansión de Chihuahua.',
        licenseNumber: 'CHH-AG-2018-0562',
        phoneNumber: '+52 614 345 6789',
        specialties: JSON.stringify(['Terrenos', 'Desarrollos', 'Industrial']),
    },
    {
        id: randomUUID(),
        email: 'mariana.lopez@kw-chihuahua.mx',
        firstName: 'Mariana',
        lastName: 'López Ochoa',
        roles: 'agent',
        mlsStatus: 'ACTIVE',
        bio: 'Apasionada por ayudar a familias a encontrar su hogar ideal. 8 años de experiencia en el sector residencial.',
        licenseNumber: 'CHH-AG-2021-1837',
        phoneNumber: '+52 614 456 7890',
        whatsapp: '+52 614 456 7890',
        instagram: '@mariana_realestate',
        specialties: JSON.stringify(['Residencial', 'Familias', 'Primera Vivienda']),
    },
    {
        id: randomUUID(),
        email: 'roberto.garcia@sothebys-chih.mx',
        firstName: 'Roberto',
        lastName: 'García Terrazas',
        roles: 'agent',
        mlsStatus: 'ACTIVE',
        bio: 'Asesor de bienes raíces premium. Miembro del Top 5% de agentes en Chihuahua por volumen de ventas.',
        licenseNumber: 'CHH-AG-2017-0319',
        phoneNumber: '+52 614 567 8901',
        specialties: JSON.stringify(['Lujo', 'Inversión Internacional', 'Propiedades Premium']),
    },
];

const clients = [
    {
        id: randomUUID(),
        email: 'ana.martinez@gmail.com',
        firstName: 'Ana',
        lastName: 'Martínez',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
    {
        id: randomUUID(),
        email: 'pedro.hernandez@outlook.com',
        firstName: 'Pedro',
        lastName: 'Hernández',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
    {
        id: randomUUID(),
        email: 'lucia.torres@hotmail.com',
        firstName: 'Lucía',
        lastName: 'Torres',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
    {
        id: randomUUID(),
        email: 'miguel.sanchez@yahoo.com',
        firstName: 'Miguel',
        lastName: 'Sánchez',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
    {
        id: randomUUID(),
        email: 'carmen.diaz@gmail.com',
        firstName: 'Carmen',
        lastName: 'Díaz',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
    {
        id: randomUUID(),
        email: 'fernando.ruiz@gmail.com',
        firstName: 'Fernando',
        lastName: 'Ruiz',
        roles: 'user',
        mlsStatus: 'ACTIVE',
    },
];

// ─── Listings - Real Chihuahua addresses with Mexican property images ───
const listings = [
    {
        propertyId: 'CHH-RES-001',
        title: 'Residencia de Lujo en Campestre',
        description: 'Espectacular residencia de 450m² de construcción en una de las colonias más exclusivas de Chihuahua. Cuenta con 4 recámaras, 3.5 baños, sala de estar, estudio, cocina integral con isla, cuarto de servicio y jardín amplio con alberca.',
        address: 'Av. Campestre #1245, Col. Campestre',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31238',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 12500000,
        source: 'MANUAL',
        trustScore: 92,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1700404270770-a711e578044d?w=800&fit=crop',
            'https://images.unsplash.com/photo-1609859419269-c69d2f5d1bc7?w=800&fit=crop',
            'https://images.unsplash.com/photo-1700404270536-295a9ed7ff52?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-002',
        title: 'Casa en Quintas del Sol',
        description: 'Hermosa casa de 280m² en fraccionamiento con seguridad 24/7. 3 recámaras, 2.5 baños, cocina moderna, sala-comedor amplio y cochera para 2 autos.',
        address: 'Calle Quintas del Sol #389, Fracc. Quintas del Sol',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31214',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 4800000,
        source: 'MANUAL',
        trustScore: 88,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1592632471766-b082b3fba785?w=800&fit=crop',
            'https://images.unsplash.com/photo-1584914187677-d16f6ba24a5c?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-003',
        title: 'Departamento Moderno en Cantera',
        description: 'Departamento nuevo de 120m² con acabados de primera. 2 recámaras, 2 baños, estudio, cocina integral y balcón con vista a la Sierra. Amenidades: gym, roof garden, salón de eventos.',
        address: 'Blvd. Antonio Ortiz Mena #3200, Col. Cantera',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31204',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 3200000,
        source: 'MANUAL',
        trustScore: 85,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1611533050192-80ddec37a9f2?w=800&fit=crop',
            'https://images.unsplash.com/photo-1722632143847-32d0b95b82fe?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-004',
        title: 'Casa Familiar en San Felipe',
        description: 'Casa de 200m² ideal para familia. 3 recámaras, 2 baños, patio trasero amplio, cochera techada. Cerca de escuelas y centros comerciales.',
        address: 'Calle 48a #1520, Col. San Felipe',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31203',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 2850000,
        source: 'MANUAL',
        trustScore: 80,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1609859419072-9bf20f29b828?w=800&fit=crop',
            'https://images.unsplash.com/photo-1609861361249-d1b20c4b508e?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-005',
        title: 'Residencia Premium en Las Haciendas',
        description: 'Lujosa residencia de 520m² con arquitectura contemporánea. 5 recámaras con baño, biblioteca, cava, sala de cine, alberca infinity y jardín con palapa.',
        address: 'Priv. de las Haciendas #78, Fracc. Las Haciendas',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31238',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 15000000,
        source: 'MANUAL',
        trustScore: 95,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1700404270273-a87d4c84d7fc?w=800&fit=crop',
            'https://images.unsplash.com/photo-1699491039926-d1d75e39f169?w=800&fit=crop',
            'https://images.unsplash.com/photo-1643314163304-508f16481525?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-COM-001',
        title: 'Local Comercial en Periférico de la Juventud',
        description: 'Excelente local comercial de 180m² en zona de alto tráfico. Ideal para restaurante, clínica o showroom. Cuenta con estacionamiento para 8 autos.',
        address: 'Periférico de la Juventud #7800, Col. Saucito',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31110',
        propertyType: 'commercial',
        status: 'ACTIVE',
        price: 6500000,
        source: 'MANUAL',
        trustScore: 82,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1769882869255-aa3617f2f7f3?w=800&fit=crop',
            'https://images.unsplash.com/photo-1764258492945-96d083b455df?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-COM-002',
        title: 'Oficinas Corporativas en Punto Alto',
        description: 'Piso completo de oficinas de 350m² con acabados AAA. Recepción, 6 privados, sala de juntas, cocineta y baños independientes. Edificio inteligente con fibra óptica.',
        address: 'Av. Teófilo Borunda #11450, Punto Alto Business Park',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31125',
        propertyType: 'commercial',
        status: 'ACTIVE',
        price: 8900000,
        source: 'MANUAL',
        trustScore: 90,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1760415317943-e528cc71e54d?w=800&fit=crop',
            'https://images.unsplash.com/photo-1759299596344-cc2e0c26003a?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-COM-003',
        title: 'Plaza Comercial en Zona Centro',
        description: 'Plaza comercial de 800m² con 6 locales rentados. Excelente inversión con flujo de renta mensual establecido. Ubicación privilegiada sobre avenida principal.',
        address: 'Av. Independencia #1803, Col. Centro',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31000',
        propertyType: 'commercial',
        status: 'ACTIVE',
        price: 14200000,
        source: 'MANUAL',
        trustScore: 87,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1760489060455-7a22e7ac1246?w=800&fit=crop',
            'https://images.unsplash.com/photo-1761639348154-a2e67a9ff7a4?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-TER-001',
        title: 'Terreno en Valle de la Sierra',
        description: 'Terreno de 1,200m² con vista panorámica a la Sierra Madre. Zona residencial en desarrollo con todos los servicios. Ideal para construir la casa de tus sueños.',
        address: 'Lote 45, Fracc. Valle de la Sierra',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31310',
        propertyType: 'land',
        status: 'ACTIVE',
        price: 1800000,
        source: 'MANUAL',
        trustScore: 75,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1662158950832-c2d98f6b23dc?w=800&fit=crop',
            'https://images.unsplash.com/photo-1544749123-770c758b04eb?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-TER-002',
        title: 'Terreno Comercial en Carretera a Delicias',
        description: 'Amplio terreno de 5,000m² sobre carretera principal. Uso de suelo mixto, ideal para desarrollo comercial o bodega. Servicios de agua y electricidad disponibles.',
        address: 'Carretera Chihuahua-Delicias Km 12.5',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31600',
        propertyType: 'land',
        status: 'ACTIVE',
        price: 4500000,
        source: 'MANUAL',
        trustScore: 70,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1662570267584-2dd2319a1052?w=800&fit=crop',
            'https://images.unsplash.com/photo-1611701119687-d8de5469c49f?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-TER-003',
        title: 'Lote Premium en Club de Golf',
        description: 'Exclusivo terreno de 800m² dentro del Club Campestre de Chihuahua. Vista al campo de golf, seguridad 24/7. Plusvalía garantizada.',
        address: 'Lote 18, Club Campestre de Chihuahua',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31238',
        propertyType: 'land',
        status: 'ACTIVE',
        price: 5200000,
        source: 'MANUAL',
        trustScore: 93,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1728696424974-3ace0e05fe4d?w=800&fit=crop',
            'https://images.unsplash.com/photo-1646725715964-20de5de7ca3e?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-IND-001',
        title: 'Nave Industrial en Complejo Industrial',
        description: 'Nave industrial de 2,500m² con oficinas administrativas de 200m². Andén de carga y descarga, patio de maniobras, estacionamiento para 30 vehículos.',
        address: 'Complejo Industrial Chihuahua, Nave 12',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31137',
        propertyType: 'industrial',
        status: 'ACTIVE',
        price: 11000000,
        source: 'MANUAL',
        trustScore: 85,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1664231323173-d04a1ebbbb22?w=800&fit=crop',
            'https://images.unsplash.com/photo-1602058981090-e7524678b32e?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-006',
        title: 'Casa Moderna en Colinas del Valle',
        description: 'Casa nueva de 240m² con diseño minimalista. 3 recámaras, family room, cocina con isla de granito, jardín con porche y asador. Fraccionamiento con acceso controlado.',
        address: 'Calle Colinas #567, Fracc. Colinas del Valle',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31214',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 4200000,
        source: 'MANUAL',
        trustScore: 86,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1708380134516-5ac5631c22d7?w=800&fit=crop',
            'https://images.unsplash.com/photo-1586018090738-76ac7d737f5e?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-007',
        title: 'Penthouse en Torres Lumina',
        description: 'Espectacular penthouse de 300m² en el piso 15. Vista 360° de la ciudad, terraza amplia, 3 recámaras con vestidor, jacuzzi y 3 cajones de estacionamiento.',
        address: 'Blvd. Ortiz Mena #4500, Torres Lumina, PH-2',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31204',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 9800000,
        source: 'MANUAL',
        trustScore: 91,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1548402535-0770e9f5d899?w=800&fit=crop',
            'https://images.unsplash.com/photo-1637011622402-e2efe6e08d71?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-008',
        title: 'Casa en Cumbres de Majalca',
        description: 'Acogedora casa de campo de 180m² a 30 min de la ciudad. 2 recámaras, chimenea, terraza con vista a bosque de pinos, ideal para descanso o Airbnb.',
        address: 'Km 8 Carretera a Majalca, Cumbres de Majalca',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31500',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 2200000,
        source: 'MANUAL',
        trustScore: 72,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1609858402800-56939643cb13?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-009',
        title: 'Duplex en Jardines de San Francisco',
        description: 'Duplex de 160m² por nivel. Planta baja: sala, comedor, cocina, medio baño. Planta alta: 3 recámaras, 2 baños. Patio y cochera para 2 autos.',
        address: 'Calle Jardines #1290, Col. Jardines de San Francisco',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31115',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 3500000,
        source: 'MANUAL',
        trustScore: 78,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1644257695072-de3b5c661383?w=800&fit=crop',
            'https://images.unsplash.com/photo-1547700262-76071d761716?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-DRAFT-001',
        title: 'Proyecto Residencial en Sacramento',
        description: 'Desarrollo de 12 casas residenciales tipo mediterráneo. Pre-venta con precios especiales. Entrega estimada: Diciembre 2026.',
        address: 'Fracc. Sacramento, Etapa V',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31184',
        propertyType: 'residential',
        status: 'DRAFT',
        price: 3800000,
        source: 'MANUAL',
        trustScore: 60,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1743428914675-cbaab13e5483?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-DRAFT-002',
        title: 'Bodega en Parque Industrial Ávalos',
        description: 'Bodega de 1,800m² con altura de 8m, piso de concreto industrial. En proceso de remodelación. Disponible Q2 2026.',
        address: 'Parque Industrial Ávalos, Bodega J-7',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31090',
        propertyType: 'industrial',
        status: 'DRAFT',
        price: 7500000,
        source: 'MANUAL',
        trustScore: 55,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1674584233496-e77a8aed9ce1?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-RES-010',
        title: 'Casa de Autor en Bosques de San Francisco',
        description: 'Casa diseñada por arquitecto reconocido. 380m² de construcción, doble altura, muros de cristal, jardín zen, alberca climatizada. Una obra de arte habitable.',
        address: 'Priv. de los Bosques #23, Fracc. Bosques de San Francisco',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31236',
        propertyType: 'residential',
        status: 'ACTIVE',
        price: 13500000,
        source: 'MANUAL',
        trustScore: 94,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1609858402644-7b842d87a47f?w=800&fit=crop',
            'https://images.unsplash.com/photo-1700404270536-295a9ed7ff52?w=800&fit=crop',
            'https://images.unsplash.com/photo-1609859419269-c69d2f5d1bc7?w=800&fit=crop',
        ]),
    },
    {
        propertyId: 'CHH-COM-004',
        title: 'Restaurante Equipado en Zona Dorada',
        description: 'Local de 220m² totalmente equipado como restaurante. Cocina industrial, barra, terraza, mobiliario incluido. Excelente ubicación con alto flujo peatonal.',
        address: 'Av. Juárez #2340, Col. Centro',
        city: 'Chihuahua',
        state: 'Chihuahua',
        zipCode: '31000',
        propertyType: 'commercial',
        status: 'ACTIVE',
        price: 5800000,
        source: 'MANUAL',
        trustScore: 83,
        images: JSON.stringify([
            'https://images.unsplash.com/photo-1606847279238-dd0c695b16c7?w=800&fit=crop',
            'https://images.unsplash.com/photo-1599795037171-b95463da9705?w=800&fit=crop',
        ]),
    },
];

// ─── Reviews (Spanish) ───
function buildReviews(agentIds: string[], clientIds: string[]) {
    const reviewData = [
        // Reviews RECEIVED by current user (agentId = CURRENT_USER_ID) — indices 0,5,7,10,12
        { agentIdx: 0, clientIdx: 0, rating: 5, title: 'Excelente servicio', comment: 'Carlos nos ayudó a encontrar nuestra casa ideal en menos de un mes. Muy profesional y atento a nuestras necesidades. Totalmente recomendado.', response: '¡Muchas gracias Ana! Fue un placer ayudarles a encontrar su nuevo hogar. ¡Les deseo lo mejor!' },
        { agentIdx: 1, clientIdx: 1, rating: 5, title: 'El mejor agente de Chihuahua', comment: 'Sin duda el mejor agente con el que hemos trabajado. Conoce perfectamente el mercado y negoció un precio increíble por nosotros.', response: null },
        { agentIdx: 1, clientIdx: 2, rating: 4, title: 'Muy buen trabajo', comment: 'Sofía fue muy paciente con nosotros durante todo el proceso. Nos mostró varias opciones hasta que encontramos la indicada. Solo un poco lento en el papeleo.', response: 'Gracias Pedro, aprecio mucho tu retroalimentación. Estoy mejorando los tiempos de documentación.' },
        { agentIdx: 2, clientIdx: 3, rating: 5, title: 'Profesional y honesto', comment: 'Jorge nos asesoró perfectamente en la compra de nuestro terreno. Nos advirtió sobre zonificación y nos ahorró un problema. Muy agradecidos.', response: null },
        { agentIdx: 3, clientIdx: 4, rating: 4, title: 'Buena experiencia', comment: 'Mariana es muy amable y conoce bien las colonias de Chihuahua. Nos ayudó a escoger el mejor barrio para nuestra familia.', response: '¡Gracias Miguel! Me da gusto saber que están contentos en su nuevo barrio.' },
        { agentIdx: 0, clientIdx: 5, rating: 3, title: 'Correcto pero mejorable', comment: 'El servicio fue adecuado pero siento que pudo habernos mostrado más opciones dentro de nuestro presupuesto. La comunicación tardaba un poco.', response: 'Agradezco tu comentario Fernando, lo tomaré en cuenta para mejorar mi servicio.' },
        { agentIdx: 4, clientIdx: 0, rating: 5, title: 'Vendió mi propiedad rapidísimo', comment: 'Puse mi casa en venta con Roberto y en 3 semanas ya tenía comprador. La estrategia de marketing fue excelente y consiguió precio por encima del avalúo.', response: '¡Gracias Ana! Tu propiedad en Campestre se vendió sola, era una joya.' },
        { agentIdx: 0, clientIdx: 1, rating: 4, title: 'Recomendable', comment: 'Carlos nos guió paso a paso en la compra de nuestra primera propiedad. Muy didáctico explicando el proceso legal y financiero.', response: null },
        { agentIdx: 1, clientIdx: 2, rating: 5, title: 'Más que un agente, un asesor', comment: 'Sofía nos ayudó no solo a encontrar oficina sino a planificar la distribución. Tiene un ojo increíble para los espacios comerciales.', response: '¡Qué bonito comentario Lucía! Me encanta cuando puedo aportar más allá de la transacción.' },
        { agentIdx: 2, clientIdx: 3, rating: 4, title: 'Buen conocimiento del mercado', comment: 'Jorge conoce cada terreno disponible en Chihuahua. Nos presentó opciones que ni sabíamos que existían. Muy recomendable para terrenos.', response: null },
        { agentIdx: 0, clientIdx: 4, rating: 5, title: 'Compra perfecta', comment: 'Todo el proceso fue impecable. Desde la primera visita hasta la firma en notaría, Carlos estuvo presente y disponible. 10/10.', response: '¡Fue un placer trabajar contigo Carmen! ¡Disfruten su nuevo hogar!' },
        { agentIdx: 4, clientIdx: 5, rating: 5, title: 'Inversión exitosa', comment: 'Roberto me asesoró para comprar un local comercial como inversión. Ya tengo inquilino y el retorno es exactamente lo que me prometió. Excelente.', response: null },
        { agentIdx: 0, clientIdx: 2, rating: 4, title: 'Muy atento', comment: 'Carlos siempre estuvo disponible por WhatsApp para resolver dudas. El proceso tomó un poco más de lo esperado pero el resultado valió la pena.', response: 'Gracias Lucía, los tiempos a veces dependen de notaría pero me alegra que estés satisfecha con el resultado.' },
        { agentIdx: 3, clientIdx: 3, rating: 3, title: 'Aceptable', comment: 'El agente cumplió con lo básico pero no sentí un servicio personalizado. Hubiera esperado más seguimiento post-venta.', response: null },
        { agentIdx: 4, clientIdx: 1, rating: 5, title: 'Experiencia de primer nivel', comment: 'Desde el primer contacto hasta la entrega de llaves, todo fue de primer nivel. Roberto se merece cada estrella. Recomendado 100%.', response: 'Gracias Pedro, clientes como tú hacen que ame mi trabajo. ¡Bienvenido a tu nuevo hogar!' },
    ];

    // Reviews written BY the current user (as reviewerId)
    const userWrittenReviews = [
        { agentIdx: 1, rating: 5, title: 'Gran colega y profesional', comment: 'Trabajé con Sofía en una operación compartida y su profesionalismo fue excepcional. Recomendada para cualquier tipo de propiedad comercial.', response: '¡Gracias Carlos! Siempre es un placer colaborar contigo.' },
        { agentIdx: 2, rating: 4, title: 'Experto en terrenos', comment: 'Jorge me refirió a un cliente para un terreno en Valle de la Sierra. El seguimiento fue impecable y cerró la operación en tiempo récord.', response: null },
        { agentIdx: 4, rating: 5, title: 'El mejor en el segmento premium', comment: 'Roberto maneja el segmento de lujo como nadie. Su red de contactos y su conocimiento del mercado son invaluables.', response: '¡Muchas gracias Carlos! Siempre es un honor recibir reconocimiento de colegas.' },
    ];

    const reviews = reviewData.map((r) => ({
        id: randomUUID(),
        agentId: agentIds[r.agentIdx],
        reviewerId: clientIds[r.clientIdx],
        listingId: null,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        response: r.response,
    }));

    // Add reviews written by the current user
    for (const r of userWrittenReviews) {
        reviews.push({
            id: randomUUID(),
            agentId: agentIds[r.agentIdx],
            reviewerId: CURRENT_USER_ID,
            listingId: null,
            rating: r.rating,
            title: r.title,
            comment: r.comment,
            response: r.response,
        });
    }

    return reviews;
}

async function main() {
    console.log('🌱 Starting MLS data seed...\n');

    // Clear existing data (in reverse dependency order)
    console.log('🗑️  Clearing existing data...');
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.listingView.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.savedSearch.deleteMany();
    await prisma.claim.deleteMany();
    await prisma.review.deleteMany();
    await prisma.favorite.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    console.log('   ✓ Cleared\n');

    // 1. Create Users
    console.log('👥 Creating users...');
    const allUsers = [...agents, ...clients];
    for (const u of allUsers) {
        await prisma.user.create({ data: u as any });
    }
    console.log(`   ✓ Created ${allUsers.length} users (${agents.length} agents + ${clients.length} clients)\n`);

    // 2. Create Listings
    console.log('🏠 Creating listings...');
    const createdListings: any[] = [];
    for (let i = 0; i < listings.length; i++) {
        const listing = await prisma.listing.create({
            data: {
                ...listings[i],
                ownerId: agents[i % agents.length].id,
            },
        });
        createdListings.push(listing);
    }
    console.log(`   ✓ Created ${createdListings.length} listings\n`);

    // 3. Create Favorites (8 listings favorited by current user)
    console.log('❤️  Creating favorites...');
    const favNotes = [
        'Me encantó la alberca y el jardín',
        'Buen precio para la zona',
        'Ideal para mi negocio',
        'Perfecta para la familia',
        null,
        'Ver terreno el fin de semana',
        null,
        'Preguntar por financiamiento',
    ];
    const favoriteListings = createdListings.filter(l => l.status === 'ACTIVE').slice(0, 8);
    for (let i = 0; i < favoriteListings.length; i++) {
        await prisma.favorite.create({
            data: {
                userId: CURRENT_USER_ID,
                listingId: favoriteListings[i].id,
                notes: favNotes[i],
            },
        });
    }
    console.log(`   ✓ Created ${favoriteListings.length} favorites\n`);

    // 4. Create Collections
    console.log('📁 Creating collections...');
    const collections = [
        {
            userId: CURRENT_USER_ID,
            name: 'Mis Favoritas Residenciales',
            description: 'Las mejores opciones residenciales que he visto',
            color: '#3B82F6',
            listingIds: JSON.stringify(favoriteListings.filter(l => l.propertyType === 'residential').map((l: any) => l.id)),
        },
        {
            userId: CURRENT_USER_ID,
            name: 'Para Inversión',
            description: 'Propiedades comerciales con buen rendimiento',
            color: '#10B981',
            listingIds: JSON.stringify(favoriteListings.filter(l => l.propertyType === 'commercial').map((l: any) => l.id)),
        },
        {
            userId: CURRENT_USER_ID,
            name: 'Terrenos',
            description: 'Terrenos para desarrollo futuro',
            color: '#F59E0B',
            listingIds: JSON.stringify(favoriteListings.filter(l => l.propertyType === 'land').map((l: any) => l.id)),
        },
    ];
    for (const c of collections) {
        await prisma.collection.create({ data: c });
    }
    console.log(`   ✓ Created ${collections.length} collections\n`);

    // 5. Create Reviews
    console.log('⭐ Creating reviews...');
    const agentIds = agents.map(a => a.id);
    const clientIds = clients.map(c => c.id);
    const reviews = buildReviews(agentIds, clientIds);
    for (const r of reviews) {
        await prisma.review.create({ data: r });
    }
    console.log(`   ✓ Created ${reviews.length} reviews\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ Seed complete! Final counts:');
    console.log(`   Users:       ${await prisma.user.count()}`);
    console.log(`   Listings:    ${await prisma.listing.count()}`);
    console.log(`   Favorites:   ${await prisma.favorite.count()}`);
    console.log(`   Collections: ${await prisma.collection.count()}`);
    console.log(`   Reviews:     ${await prisma.review.count()}`);
    console.log('═══════════════════════════════════════');
}

export { main as seedDatabase };

