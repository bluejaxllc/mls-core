// Mock/demo data for the MLS app when real API data is unavailable
// Used as fallback in pages to show the app is functional

export const MOCK_LISTINGS = [
    { id: 'mock-1', type: 'CANONICAL' as const, title: 'Casa Residencial en Lomas del Santuario', price: 4500000, address: 'Av. Lomas del Santuario 145, Chihuahua', status: 'ACTIVE', image: null, trustScore: 92, source: 'MLS', updatedAt: new Date().toISOString() },
    { id: 'mock-2', type: 'CANONICAL' as const, title: 'Departamento en Zona Centro', price: 1800000, address: 'Calle Victoria 302, Centro, Chihuahua', status: 'ACTIVE', image: null, trustScore: 88, source: 'MLS', updatedAt: new Date().toISOString() },
    { id: 'mock-3', type: 'CANONICAL' as const, title: 'Terreno Comercial Periférico de la Juventud', price: 12000000, address: 'Periférico de la Juventud Km 4.5, Chihuahua', status: 'ACTIVE', image: null, trustScore: 95, source: 'MLS', updatedAt: new Date().toISOString() },
    { id: 'mock-4', type: 'OBSERVED' as const, title: 'Nave Industrial Complejo Sur', price: 8500000, address: 'Parque Industrial Chihuahua Sur', status: 'DETECTED_SALE', image: null, trustScore: 65, source: 'ML', updatedAt: new Date().toISOString(), confidence: 0.78 },
    { id: 'mock-5', type: 'CANONICAL' as const, title: 'Oficina Premium Torre Legislativa', price: 3200000, address: 'Ave. Independencia 1200, Chihuahua', status: 'ACTIVE', image: null, trustScore: 91, source: 'MLS', updatedAt: new Date().toISOString() },
    { id: 'mock-6', type: 'CANONICAL' as const, title: 'Rancho en Venta Carretera a Aldama', price: 15000000, address: 'Carretera Chihuahua-Aldama Km 22', status: 'ACTIVE', image: null, trustScore: 78, source: 'MLS', updatedAt: new Date().toISOString() },
];

export const MOCK_MESSAGES = [
    { id: 'msg-1', participant1: 'user-1', participant2: 'user-2', lastMessage: '¿Sigue disponible la propiedad en Lomas?', lastMessageAt: new Date(Date.now() - 3600000).toISOString(), otherUser: { id: 'user-2', firstName: 'Carlos', lastName: 'Mendoza', email: 'carlos@inmobiliaria.mx' }, unreadCount: 2 },
    { id: 'msg-2', participant1: 'user-1', participant2: 'user-3', lastMessage: 'Le envío los documentos del terreno mañana', lastMessageAt: new Date(Date.now() - 86400000).toISOString(), otherUser: { id: 'user-3', firstName: 'Ana', lastName: 'García', email: 'ana@bienes.mx' }, unreadCount: 0 },
    { id: 'msg-3', participant1: 'user-1', participant2: 'user-4', lastMessage: 'Aceptamos la oferta, ¿cuándo podemos firmar?', lastMessageAt: new Date(Date.now() - 172800000).toISOString(), otherUser: { id: 'user-4', firstName: 'Roberto', lastName: 'Luna', email: 'roberto@realty.mx' }, unreadCount: 1 },
];

export const MOCK_FAVORITES = [
    { id: 'fav-1', listingId: 'mock-1', notes: 'Excelente ubicación', createdAt: new Date().toISOString(), listing: { id: 'mock-1', title: 'Casa Residencial en Lomas del Santuario', price: 4500000, address: 'Av. Lomas del Santuario 145', city: 'Chihuahua', images: '[]', propertyType: 'residential', status: 'ACTIVE' } },
    { id: 'fav-2', listingId: 'mock-3', notes: 'Para inversionistas', createdAt: new Date().toISOString(), listing: { id: 'mock-3', title: 'Terreno Comercial Periférico', price: 12000000, address: 'Periférico de la Juventud Km 4.5', city: 'Chihuahua', images: '[]', propertyType: 'land', status: 'ACTIVE' } },
];

export const MOCK_REVIEWS = [
    { id: 'rev-1', author: 'Carlos Mendoza', rating: 5, comment: 'Excelente servicio, muy profesional en todo el proceso de venta.', property: 'Casa en Lomas', createdAt: new Date(Date.now() - 604800000).toISOString() },
    { id: 'rev-2', author: 'Ana García', rating: 4, comment: 'Buena atención, el proceso fue rápido y transparente.', property: 'Terreno Periférico', createdAt: new Date(Date.now() - 1209600000).toISOString() },
    { id: 'rev-3', author: 'Roberto Luna', rating: 5, comment: 'La mejor inmobiliaria de Chihuahua, sin duda.', property: 'Oficina Torre Legislativa', createdAt: new Date(Date.now() - 2419200000).toISOString() },
];

export const MOCK_APPOINTMENTS = [
    { id: 'apt-1', title: 'Visita Casa Lomas del Santuario', date: new Date(Date.now() + 86400000).toISOString(), client: 'Carlos Mendoza', property: 'Casa Residencial en Lomas', status: 'confirmed', time: '10:00 AM' },
    { id: 'apt-2', title: 'Valuación Terreno Periférico', date: new Date(Date.now() + 172800000).toISOString(), client: 'Ana García', property: 'Terreno Comercial', status: 'pending', time: '3:00 PM' },
    { id: 'apt-3', title: 'Firma de Contrato', date: new Date(Date.now() + 259200000).toISOString(), client: 'Roberto Luna', property: 'Oficina Torre Legislativa', status: 'confirmed', time: '11:00 AM' },
];

export const MOCK_NOTIFICATIONS = [
    { id: 'not-1', title: 'Nueva oferta recibida', message: 'Carlos Mendoza envió una oferta por Casa en Lomas del Santuario', type: 'offer', read: false, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: 'not-2', title: 'Listado expirado', message: 'Tu listado "Departamento Centro" expirará en 3 días', type: 'warning', read: false, createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'not-3', title: 'Documento firmado', message: 'El contrato de Terreno Periférico fue firmado digitalmente', type: 'success', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'not-4', title: 'Nuevo mensaje', message: 'Roberto Luna te envió un mensaje sobre Oficina Torre Legislativa', type: 'message', read: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const MOCK_GOVERNANCE_RULES = [
    { id: 'rule-1', name: 'Validación de Precio de Mercado', description: 'Verifica que el precio esté dentro del rango de mercado para la zona', triggerEvents: ['LISTING_CREATED', 'LISTING_UPDATED'], priority: 1, version: '1.0', status: 'ACTIVE', isEnabled: true },
    { id: 'rule-2', name: 'Detección de Duplicados', description: 'Identifica listados duplicados basándose en dirección y características', triggerEvents: ['LISTING_CREATED', 'DATA_INGESTED'], priority: 2, version: '1.2', status: 'ACTIVE', isEnabled: true },
    { id: 'rule-3', name: 'Verificación de Documentos', description: 'Asegura que los documentos legales estén completos antes de publicar', triggerEvents: ['LISTING_CREATED'], priority: 1, version: '1.0', status: 'ACTIVE', isEnabled: false },
    { id: 'rule-4', name: 'Alerta de Zona de Riesgo', description: 'Notifica si la propiedad se encuentra en zona de riesgo geológico', triggerEvents: ['LISTING_CREATED', 'LISTING_UPDATED'], priority: 3, version: '2.0', status: 'ACTIVE', isEnabled: true },
];

export const MOCK_GOVERNANCE_EVENTS = [
    { id: 'evt-1', ruleName: 'Validación de Precio', result: 'PASS', listingTitle: 'Casa en Lomas del Santuario', message: 'Precio dentro del rango de mercado', createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 'evt-2', ruleName: 'Detección de Duplicados', result: 'WARNING', listingTitle: 'Terreno Periférico', message: 'Posible duplicado detectado con MLM-2290354933', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'evt-3', ruleName: 'Alerta de Zona', result: 'PASS', listingTitle: 'Oficina Torre Legislativa', message: 'Sin riesgos detectados en la zona', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'evt-4', ruleName: 'Validación de Precio', result: 'BLOCK', listingTitle: 'Departamento Centro', message: 'Precio 45% por debajo del promedio de zona', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const MOCK_AGENTS = [
    { id: 'agent-1', name: 'María Fernández', email: 'maria@bluejax.ai', role: 'Senior Agent', activeListings: 8, closedDeals: 23, avatar: null, phone: '+52 614 123 4567', status: 'active' },
    { id: 'agent-2', name: 'José Hernández', email: 'jose@bluejax.ai', role: 'Agent', activeListings: 5, closedDeals: 12, avatar: null, phone: '+52 614 234 5678', status: 'active' },
    { id: 'agent-3', name: 'Laura Rodríguez', email: 'laura@bluejax.ai', role: 'Junior Agent', activeListings: 3, closedDeals: 4, avatar: null, phone: '+52 614 345 6789', status: 'active' },
];

export const MOCK_ANALYTICS = {
    totalListings: 48,
    activeListings: 32,
    totalViews: 1247,
    totalLeads: 89,
    avgDaysOnMarket: 42,
    conversionRate: 7.1,
    monthlyViews: [120, 145, 132, 168, 189, 201, 178, 156, 210, 234, 198, 247],
    topCities: [
        { city: 'Chihuahua', count: 28 },
        { city: 'Juárez', count: 12 },
        { city: 'Delicias', count: 5 },
        { city: 'Cuauhtémoc', count: 3 },
    ],
};

export const MOCK_AUDIT_LOG = [
    { id: 'audit-1', action: 'LISTING_CREATED', user: 'admin@asilo.com', details: 'Creó listado: Casa en Lomas del Santuario', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'audit-2', action: 'LISTING_UPDATED', user: 'admin@asilo.com', details: 'Actualizó precio: Terreno Periférico ($12,000,000 → $11,500,000)', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'audit-3', action: 'USER_LOGIN', user: 'admin@asilo.com', details: 'Inicio de sesión desde 187.188.x.x', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'audit-4', action: 'RULE_TOGGLED', user: 'admin@asilo.com', details: 'Desactivó regla: Verificación de Documentos', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 'audit-5', action: 'DATA_IMPORT', user: 'system', details: 'Importó 24 propiedades desde Mercado Libre', timestamp: new Date(Date.now() - 259200000).toISOString() },
];
