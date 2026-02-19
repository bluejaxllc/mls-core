'use client';

import { FileText, Shield, Zap, Database, Lock, TrendingUp, Users } from 'lucide-react';

export default function WhitepaperPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Blue Jax MLS Core</h1>
                            <p className="text-xs text-zinc-400">Whitepaper Técnico v1.0</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">

                {/* Abstract */}
                <section className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400 uppercase tracking-wider">
                        Resumen Ejecutivo
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Infraestructura Inmutable para el<br />Mercado Inmobiliario de México
                    </h2>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                        Blue Jax MLS Core es una plataforma de inteligencia descentralizada diseñada para revolucionar
                        la gestión de listados inmobiliarios en México mediante gobernanza automatizada, verificación
                        criptográfica de identidad y sincronización de datos en tiempo real.
                    </p>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 1. Visión */}
                <section className="space-y-6">
                    <SectionHeader icon={TrendingUp} title="1. Visión del Proyecto" />
                    <div className="space-y-4 text-zinc-300 leading-relaxed">
                        <p>
                            El mercado inmobiliario mexicano enfrenta desafíos críticos de fragmentación de datos,
                            duplicación de listados y falta de estándares de gobernanza. Blue Jax Core aborda estos
                            problemas implementando una arquitectura de confianza cero donde:
                        </p>
                        <ul className="space-y-2 ml-6 list-disc">
                            <li>Los listados se verifican automáticamente contra reglas de cumplimiento</li>
                            <li>La identidad y propiedad se validan criptográficamente</li>
                            <li>Los datos se propagan en tiempo real a través de toda la red</li>
                            <li>La gobernanza se ejecuta mediante lógica inmutable</li>
                        </ul>
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 2. Arquitectura */}
                <section className="space-y-6">
                    <SectionHeader icon={Database} title="2. Arquitectura del Sistema" />

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-3">2.1 Capas del Sistema</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <ArchCard
                                    title="Capa de Presentación"
                                    items={["Next.js 14", "React Server Components", "Tailwind CSS"]}
                                />
                                <ArchCard
                                    title="Capa de Lógica"
                                    items={["Node.js", "Rule Engine", "API Gateway"]}
                                />
                                <ArchCard
                                    title="Capa de Datos"
                                    items={["PostgreSQL", "Prisma ORM", "Redis Cache"]}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-3">2.2 Motor de Reglas (Rule Engine)</h3>
                            <p className="text-zinc-300 leading-relaxed">
                                El núcleo del sistema es un motor de reglas programable que ejecuta verificaciones
                                automáticas sobre cada listado. Las reglas incluyen:
                            </p>
                            <ul className="mt-3 space-y-2 ml-6 list-disc text-zinc-300">
                                <li><strong>Jerarquía de Confianza:</strong> Validación de fuentes de datos según nivel de confiabilidad</li>
                                <li><strong>Verificación de Propiedad:</strong> Confirmación de derechos de propiedad mediante registros públicos</li>
                                <li><strong>Cumplimiento de Formato:</strong> Estandarización de campos y metadatos</li>
                                <li><strong>Detección de Fraude:</strong> Identificación de patrones sospechosos</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 3. Gobernanza */}
                <section className="space-y-6">
                    <SectionHeader icon={Shield} title="3. Gobernanza Automatizada" />
                    <div className="space-y-4 text-zinc-300 leading-relaxed">
                        <p>
                            La gobernanza en Blue Jax Core no depende de intervención manual. Las reglas están
                            codificadas en lógica ejecutable que se aplica de manera consistente:
                        </p>

                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-3">
                            <h4 className="font-semibold text-white">Ejemplo: Flujo de Verificación</h4>
                            <ol className="space-y-2 ml-6 list-decimal text-sm">
                                <li>Listado ingresado por agente autorizado</li>
                                <li>Motor de reglas ejecuta 47 verificaciones automáticas</li>
                                <li>Se genera puntaje de confianza (0-100)</li>
                                <li>Listados con score &lt; 70 requieren revisión manual</li>
                                <li>Eventos registrados en log de auditoría inmutable</li>
                            </ol>
                        </div>

                        <p className="mt-4">
                            Este enfoque elimina sesgos humanos, reduce tiempos de procesamiento de semanas a
                            segundos y garantiza cumplimiento normativo del 100%.
                        </p>
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 4. Seguridad */}
                <section className="space-y-6">
                    <SectionHeader icon={Lock} title="4. Modelo de Seguridad" />
                    <div className="space-y-4 text-zinc-300 leading-relaxed">
                        <p>
                            Blue Jax Core implementa un modelo de seguridad de confianza cero (Zero Trust):
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <SecurityCard
                                title="Autenticación"
                                features={[
                                    "NextAuth.js con JWT",
                                    "Refresh tokens automáticos",
                                    "2FA opcional para admins"
                                ]}
                            />
                            <SecurityCard
                                title="Autorización"
                                features={[
                                    "RBAC (Role-Based Access Control)",
                                    "Permisos granulares por recurso",
                                    "Audit logs de todas las acciones"
                                ]}
                            />
                        </div>

                        <p className="mt-4">
                            Todos los datos sensibles se encriptan en tránsito (TLS 1.3) y en reposo (AES-256).
                            Las credenciales nunca se almacenan en texto plano.
                        </p>
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 5. Casos de Uso */}
                <section className="space-y-6">
                    <SectionHeader icon={Users} title="5. Casos de Uso" />

                    <div className="space-y-4">
                        <UseCaseCard
                            number="5.1"
                            title="Agencias Inmobiliarias"
                            description="Gestión centralizada de inventario con sincronización automática a portales. Eliminación de duplicados y validación de datos en tiempo real."
                        />
                        <UseCaseCard
                            number="5.2"
                            title="Desarrolladores Inmobiliarios"
                            description="Publicación masiva de unidades con verificación de cumplimiento normativo automática. Integración directa con sistemas ERP."
                        />
                        <UseCaseCard
                            number="5.3"
                            title="Plataformas de Listados"
                            description="Consumo de datos verificados mediante API. Reducción de carga operativa al eliminar verificaciones manuales."
                        />
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* 6. Roadmap */}
                <section className="space-y-6">
                    <SectionHeader icon={Zap} title="6. Roadmap Técnico" />

                    <div className="space-y-4">
                        <RoadmapPhase
                            phase="Q1 2026"
                            title="MVP y Lanzamiento"
                            items={[
                                "Despliegue de plataforma en Vercel",
                                "100 agencias piloto en Chihuahua",
                                "Motor de reglas con 47 verificaciones"
                            ]}
                            status="current"
                        />
                        <RoadmapPhase
                            phase="Q2 2026"
                            title="Expansión y API Pública"
                            items={[
                                "API REST documentada con OpenAPI 3.0",
                                "SDK para JavaScript y Python",
                                "Integración con 3 portales principales"
                            ]}
                            status="upcoming"
                        />
                        <RoadmapPhase
                            phase="Q3-Q4 2026"
                            title="Características Avanzadas"
                            items={[
                                "IA para valuación automática de propiedades",
                                "IA para comunicación y gestión de documentación",
                                "Sistema de reputación para agentes",
                                "MLS descentralizado con blockchain"
                            ]}
                            status="upcoming"
                        />
                    </div>
                </section>

                <div className="border-t border-zinc-800"></div>

                {/* Conclusión */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold">Conclusión</h2>
                    <p className="text-zinc-300 leading-relaxed">
                        Blue Jax MLS Core representa un cambio de paradigma en cómo se gestiona la información
                        inmobiliaria en México. Al combinar arquitectura moderna, gobernanza automatizada y
                        seguridad de nivel empresarial, la plataforma establece un nuevo estándar para la
                        industria.
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                        El futuro del MLS es descentralizado, verificable y automático. Blue Jax Core es ese futuro.
                    </p>
                </section>

                {/* Footer */}
                <footer className="pt-12 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                    <p>© 2026 Blue Jax LLC. Todos los derechos reservados.</p>
                    <p className="mt-2">Documento técnico versión 1.0 - Febrero 2026</p>
                </footer>

            </main>
        </div>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
    );
}

function ArchCard({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-sm text-zinc-300">{title}</h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SecurityCard({ title, features }: { title: string, features: string[] }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-5">
            <h4 className="font-semibold mb-3 text-white">{title}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function UseCaseCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-start gap-3">
                <div className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{number}</div>
                <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">{title}</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}

function RoadmapPhase({ phase, title, items, status }: { phase: string, title: string, items: string[], status: 'current' | 'upcoming' }) {
    return (
        <div className={`border-l-4 pl-6 py-4 ${status === 'current' ? 'border-blue-500' : 'border-zinc-700'}`}>
            <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded">{phase}</span>
                {status === 'current' && (
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">En Progreso</span>
                )}
            </div>
            <h4 className="font-semibold text-lg mb-3">{title}</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 bg-zinc-600 rounded-full mt-1.5"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
