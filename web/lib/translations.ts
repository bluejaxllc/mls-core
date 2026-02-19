
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
            intelligence: 'Intelligence',
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
                dragDrop: 'Drag & Drop CSV or XML files here',
                syncNow: 'Sync Now',
                syncAlert: 'Sync initiated! Feed updates will be processed in the background.',
                uploadSuccess: 'Uploading',
                files: 'file(s)',
                activeFeeds: 'Active Feeds',
                lastSync: 'Last sync',
                records: 'Records',
                healthy: 'Healthy',
                degraded: 'Degraded',
                validationLog: 'Validation Log',
                batchProcessed: 'Batch Processed',
                success: 'Success',
                skipped: 'Skipped',
                botDetected: 'Scraper Bot Detected',
                blocked: 'Blocked',
                valuesUpdated: 'Values Updated',
                updatedFromSource: 'updated from Source'
            },
            governance: {
                title: 'Governance Rules',
                subtitle: 'Configuration and transparency for system rules.',
                activeRules: 'Active Rules',
                version: 'System Version',
                disabled: 'DISABLED',
                block: 'BLOCK',
                downgrade: 'DOWNGRADE',
                update: 'UPDATE',
                warn: 'WARN',
                documentation: 'View full rule documentation in the',
                legalRepository: 'Legal Repository',
                rules: {
                    immutable: {
                        name: 'Listing Version Immutability',
                        desc: 'Prevents modification of locking fields on Verified listings.'
                    },
                    ownership: {
                        name: 'Broker Ownership Enforcement',
                        desc: 'Only the designated broker owner can modify a commercial listing.'
                    },
                    scraped: {
                        name: 'Scraped Data Downgrade',
                        desc: 'Automatically reduces trust score of scraped ingestion feeds.'
                    },
                    exposure: {
                        name: 'Public Exposure Requirements',
                        desc: 'Ensures minimum photo and description quality for public visibility.'
                    },
                    priceDrift: {
                        name: 'Price Variation Check'
                    }
                }
            },
            system: {
                title: 'System Configuration',
                subtitle: 'Admin settings and region management (Chihuahua).',
                regionSettings: 'Region Settings',
                activeRegion: 'Active Region',
                currency: 'Currency',
                timezone: 'Timezone',
                pesos: 'Pesos',
                editDefaults: 'Edit Regional Defaults',
                userDirectory: 'User Directory',
                manageRoles: 'Manage Roles & Permissions'
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
            fromLastMonth: 'from last month',
            logs: {
                downgraded: 'Listing #88392 Downgraded to DRAFT',
                rulePrefix: 'Rule: ',
                timeMins: '2 mins ago',
                timeHour: '1h ago',
                logLabel: 'LOG'
            },
            claims: {
                open: 'Open Claims',
                dispute: 'OWNERSHIP DISPUTE',
                review: 'Review Evidence'
            }
        },
        common: {
            pass: 'PASS',
            warn: 'WARN',
            by: 'by',
            system: 'System',
            brokerAdmin: 'Broker Admin',
            mins: 'mins',
            hour: 'hour',
            hrs: 'hrs',
            day: 'day',
            verified: 'VERIFIED',
            pendingReview: 'PENDING REVIEW',
            trustScore: 'Trust Score',
            editListing: 'Edit Listing',
            continueEditing: 'Continue Editing',
            addressLocked: 'Address Locked',
            updated: 'Updated',
            created: 'Created',
            version: 'Version',
            draft: 'Draft',
            online: 'Online',
            offline: 'Offline',
            systemAdmin: 'System Admin',
            filters: 'Filters',
            actions: 'Actions',
            active: 'Active',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
            viewDetails: 'View Details'
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
            intelligence: 'Inteligencia',
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
                tabs: { active: 'Activos', drafts: 'Borradores', history: 'Historial' },
                status: {
                    verified: 'VERIFICADO',
                    pendingReview: 'PENDIENTE DE REVISIÓN'
                },
                actions: {
                    edit: 'Editar Listado',
                    continue: 'Continuar Editando',
                    locked: 'Dirección Bloqueada'
                }
            },
            ingestion: {
                title: 'Ingesta de Datos',
                subtitle: 'Cargar feeds, CSVs y administrar datos scrapeados.',
                upload: 'Cargar Feeds',
                dragDrop: 'Arrastra y suelta archivos CSV o XML aquí',
                syncNow: 'Sincronizar Ahora',
                syncAlert: '¡Sincronización iniciada! Las actualizaciones se procesarán en segundo plano.',
                uploadSuccess: 'Cargando',
                files: 'archivo(s)',
                activeFeeds: 'Feeds Activos',
                lastSync: 'Última sinc.',
                records: 'Registros',
                healthy: 'Saludable',
                degraded: 'Degradado',
                validationLog: 'Log de Validación',
                batchProcessed: 'Lote Procesado',
                success: 'Éxito',
                skipped: 'Omitidos',
                botDetected: 'Bot de Scrapeo Detectado',
                blocked: 'Bloqueados',
                valuesUpdated: 'Valores Actualizados',
                updatedFromSource: 'actualizado desde Fuente'
            },
            governance: {
                title: 'Reglas de Gobernanza',
                subtitle: 'Configuración y transparencia de reglas del sistema.',
                activeRules: 'Reglas Activas',
                version: 'Versión del Sistema',
                disabled: 'DESACTIVADO',
                block: 'BLOQUEAR',
                downgrade: 'REDUCIR',
                update: 'ACTUALIZAR',
                warn: 'ADVERTIR',
                documentation: 'Ver documentación completa en el',
                legalRepository: 'Repositorio Legal',
                rules: {
                    immutable: {
                        name: 'Inmutabilidad de Versión de Listado',
                        desc: 'Previene la modificación de campos bloqueados en listados verificados.'
                    },
                    ownership: {
                        name: 'Cumplimiento de Propiedad del Corredor',
                        desc: 'Solo el corredor designado puede modificar un listado comercial.'
                    },
                    scraped: {
                        name: 'Reducción de Datos Scrapeados',
                        desc: 'Reduce automáticamente el nivel de confianza de los feeds de ingesta scrapeados.'
                    },
                    exposure: {
                        name: 'Requisitos de Exposición Pública',
                        desc: 'Garantiza una calidad mínima de fotos y descripción para visibilidad pública.'
                    },
                    priceDrift: {
                        name: 'Control de Variación de Precio'
                    }
                }
            },
            system: {
                title: 'Configuración del Sistema',
                subtitle: 'Ajustes de administrador y gestión regional (Chihuahua).',
                regionSettings: 'Ajustes Regionales',
                activeRegion: 'Región Activa',
                currency: 'Moneda',
                timezone: 'Zona Horaria',
                pesos: 'Pesos',
                editDefaults: 'Editar Valores Regionales',
                userDirectory: 'Directorio de Usuarios',
                manageRoles: 'Administrar Roles y Permisos'
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
            fromLastMonth: 'vs mes anterior',
            logs: {
                downgraded: 'Listado #88392 Reducido a BORRADOR',
                rulePrefix: 'Regla: ',
                timeMins: 'hace 2 min',
                timeHour: 'hace 1h',
                logLabel: 'LOG'
            },
            claims: {
                open: 'Reclamos Abiertos',
                dispute: 'DISPUTA DE PROPIEDAD',
                review: 'Revisar Evidencia'
            }
        },
        common: {
            pass: 'PASA',
            warn: 'ADVERTENCIA',
            by: 'por',
            system: 'Sistema',
            brokerAdmin: 'Admin. Corredor',
            mins: 'min',
            hour: 'hora',
            hrs: 'hrs',
            day: 'día',
            verified: 'VERIFICADO',
            pendingReview: 'PENDIENTE DE REVISIÓN',
            trustScore: 'Nivel de Confianza',
            editListing: 'Editar Listado',
            continueEditing: 'Continuar Editando',
            addressLocked: 'Dirección Bloqueada',
            updated: 'Actualizado',
            created: 'Creado',
            version: 'Versión',
            draft: 'Borrador',
            online: 'En Línea',
            offline: 'Desconectado',
            systemAdmin: 'Admin. Sistema',
            filters: 'Filtros',
            actions: 'Acciones',
            active: 'Activo',
            high: 'Alto',
            medium: 'Medio',
            low: 'Bajo',
            viewDetails: 'Ver Detalles'
        }
    }
};
