
export type Language = 'en' | 'es';

export const translations = {
    en: {
        sidebar: {
            brand: '.BLUE JAX',
            core: 'MLS',
            region: 'Chihuahua Region',
            dashboard: 'Dashboard',
            search: 'Property Search',
            listings: 'My Listings',
            ingestion: 'Ingestion',
            governance: 'Governance',
            system: 'System'
        },
        sections: {
            properties: {
                title: 'Property Registry',
                subtitle: 'Search and manage canonical properties.',
                searchPlaceholder: 'Search ID, Address, or Region...',
                columns: {
                    id: 'Property ID',
                    address: 'Address',
                    type: 'Type',
                    listings: 'Linked Listings',
                    confidence: 'Confidence'
                }
            },
            listings: {
                title: 'My Commercial Listings',
                subtitle: 'Manage your active and drafted listings.',
                create: '+ Create Listing',
                tabs: { active: 'Active', drafts: 'Drafts', history: 'History' }
            },
            ingestion: {
                title: 'Data Ingestion',
                subtitle: 'Upload feeds, CSVs, and manage scraped data.',
                upload: 'Upload Feeds',
                dragDrop: 'Drag & Drop CSV or XML files here'
            },
            governance: {
                title: 'Governance Rules',
                subtitle: 'Configuration and transparency for system rules.',
                activeRules: 'Active Rules'
            },
            system: {
                title: 'System Configuration',
                subtitle: 'Admin settings and region management (Chihuahua).',
                regionSettings: 'Region Settings'
            }
        },
        topbar: {
            searchPlaceholder: 'Search Property UUID, Listing ID, or Address...',
            systemOnline: 'SYSTEM: ONLINE',
            latency: 'Latency',
            role: 'Broker Admin'
        },
        rightPanel: {
            title: 'Context & Governance',
            trustScore: 'Trust Score',
            excellent: 'Excellent',
            verifiedSource: 'Verified Source',
            ruleEvaluation: 'Rule Evaluation',
            recentActivity: 'Recent Activity',
            priceUpdated: 'Price Updated',
            verificationRun: 'Verification Run',
            ago: 'ago'
        },
        dashboard: {
            title: 'Dashboard',
            subtitle: 'Governance overview and market health.',
            activeListings: 'Active Listings',
            pendingReview: 'Pending Review',
            governanceAlerts: 'Governance Alerts',
            systemHealth: 'System Health',
            governanceFeed: 'Governance Feed',
            openClaims: 'Open Claims',
            requiresAttention: 'Requires attention',
            criticalBlocks: 'Critical blocks',
            ruleEngineOp: 'Rule Engine Operational',
            fromLastMonth: 'from last month'
        }
    },
    es: {
        sidebar: {
            brand: '.BLUE JAX',
            core: 'MLS',
            region: 'Región Chihuahua',
            dashboard: 'Tablero',
            search: 'Buscar Propiedad',
            listings: 'Mis Listados',
            ingestion: 'Ingesta de Datos',
            governance: 'Gobernanza',
            system: 'Sistema'
        },
        sections: {
            properties: {
                title: 'Registro de Propiedades',
                subtitle: 'Buscar y administrar propiedades canónicas.',
                searchPlaceholder: 'Buscar ID, Dirección o Región...',
                columns: {
                    id: 'ID Propiedad',
                    address: 'Dirección',
                    type: 'Tipo',
                    listings: 'Listados Vinculados',
                    confidence: 'Confianza'
                }
            },
            listings: {
                title: 'Mis Listados Comerciales',
                subtitle: 'Administra tus listados activos y borradores.',
                create: '+ Crear Listado',
                tabs: { active: 'Activos', drafts: 'Borradores', history: 'Historial' }
            },
            ingestion: {
                title: 'Ingesta de Datos',
                subtitle: 'Cargar feeds, CSVs y administrar datos scrapeados.',
                upload: 'Cargar Feeds',
                dragDrop: 'Arrastra y suelta archivos CSV o XML aquí'
            },
            governance: {
                title: 'Reglas de Gobernanza',
                subtitle: 'Configuración y transparencia de reglas del sistema.',
                activeRules: 'Reglas Activas'
            },
            system: {
                title: 'Configuración del Sistema',
                subtitle: 'Ajustes de administrador y gestión regional (Chihuahua).',
                regionSettings: 'Ajustes Regionales'
            }
        },
        topbar: {
            searchPlaceholder: 'Buscar UUID, ID de Listado o Dirección...',
            systemOnline: 'SISTEMA: EN LÍNEA',
            latency: 'Latencia',
            role: 'Admin. Corredor'
        },
        rightPanel: {
            title: 'Contexto y Gobernanza',
            trustScore: 'Nivel de Confianza',
            excellent: 'Excelente',
            verifiedSource: 'Fuente Verificada',
            ruleEvaluation: 'Evaluación de Reglas',
            recentActivity: 'Actividad Reciente',
            priceUpdated: 'Precio Actualizado',
            verificationRun: 'Verificación Ejecutada',
            ago: 'hace'
        },
        dashboard: {
            title: 'Tablero de Control',
            subtitle: 'Visión general de gobernanza y salud del mercado.',
            activeListings: 'Listados Activos',
            pendingReview: 'Pendiente de Revisión',
            governanceAlerts: 'Alertas de Gobernanza',
            systemHealth: 'Salud del Sistema',
            governanceFeed: 'Feed de Gobernanza',
            openClaims: 'Reclamos Abiertos',
            requiresAttention: 'Requiere atención',
            criticalBlocks: 'Bloqueos críticos',
            ruleEngineOp: 'Motor de Reglas Operativo',
            fromLastMonth: 'vs mes anterior'
        }
    }
};
