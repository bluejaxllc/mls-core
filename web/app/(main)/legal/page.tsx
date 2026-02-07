'use client';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, FileText, BookOpen, Calendar, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LegalDocsPage() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentDoc, setCurrentDoc] = useState('README');

    const docs = [
        { id: 'README', name: 'Índice', file: 'README_ES.md', icon: BookOpen },
        { id: 'RULES', name: 'Reglas de Gobernanza', file: 'GOVERNANCE_RULES_ES.md', icon: Shield },
        { id: 'CHANGELOG', name: 'Historial de Cambios', file: 'CHANGELOG_ES.md', icon: Calendar },
        { id: 'COMPLIANCE', name: 'Certificado de Cumplimiento', file: 'COMPLIANCE_CERTIFICATE_ES.md', icon: FileText },
    ];

    useEffect(() => {
        const loadDoc = async () => {
            setLoading(true);
            try {
                const doc = docs.find(d => d.id === currentDoc);
                const response = await fetch(`/docs/legal/${doc?.file}`);
                const text = await response.text();
                setContent(text);
            } catch (error) {
                console.error('Error al cargar documento:', error);
                setContent('# Error\n\nNo se pudo cargar el documento.');
            } finally {
                setLoading(false);
            }
        };
        loadDoc();
    }, [currentDoc]);

    const currentDocInfo = docs.find(d => d.id === currentDoc);
    const Icon = currentDocInfo?.icon || FileText;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Gobernanza
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Repositorio Legal</h1>
                            <p className="text-sm text-blue-100">Documentación de reglas de gobernanza • Blue Jax MLS</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Wiki Navigation */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="border rounded-lg bg-card p-4">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Documentos
                                </h3>
                                <div className="space-y-1">
                                    {docs.map(doc => {
                                        const DocIcon = doc.icon;
                                        return (
                                            <button
                                                key={doc.id}
                                                onClick={() => setCurrentDoc(doc.id)}
                                                className={`w-full text-left px-3 py-2.5 rounded text-sm transition-all flex items-center gap-2 ${currentDoc === doc.id
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                <DocIcon className="h-4 w-4 flex-shrink-0" />
                                                <span className="text-xs">{doc.name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="border rounded-lg bg-card p-4">
                                <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase">Información</h3>
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Versión:</span>
                                        <span className="ml-2 font-mono">v1.4.2</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Actualizado:</span>
                                        <span className="ml-2">Feb 6, 2026</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Jurisdicción:</span>
                                        <span className="ml-2">Chihuahua, MX</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content - Wiki Article */}
                    <div className="lg:col-span-3">
                        <div className="border rounded-lg bg-card overflow-hidden">
                            {/* Document Header */}
                            <div className="border-b bg-muted/30 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-blue-600" />
                                    <h2 className="text-lg font-semibold">{currentDocInfo?.name}</h2>
                                </div>
                            </div>

                            {/* Document Body */}
                            <div className="p-8">
                                {loading ? (
                                    <div className="text-center text-muted-foreground py-12">
                                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        Cargando documento...
                                    </div>
                                ) : (
                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-blue-600 prose-code:text-blue-600 prose-pre:bg-slate-900 prose-pre:text-slate-100">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-blue-600" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-900 dark:text-blue-400" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-800 dark:text-blue-300" {...props} />,
                                                h4: ({ node, ...props }) => <h4 className="text-lg font-semibold mt-4 mb-2" {...props} />,
                                                p: ({ node, ...props }) => <p className="mb-4 leading-7 text-foreground" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                                                li: ({ node, ...props }) => <li className="leading-7" {...props} />,
                                                code: ({ node, inline, ...props }: any) => inline
                                                    ? <code className="bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono border border-blue-200 dark:border-blue-800" {...props} />
                                                    : <code className="block bg-slate-900 text-slate-100 p-4 rounded-md overflow-x-auto text-sm font-mono my-4" {...props} />,
                                                pre: ({ node, ...props }) => <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto my-4 border border-slate-700" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-600 transition-colors" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950/30 pl-4 py-2 italic my-4 rounded-r" {...props} />,
                                                hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
                                                table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse border border-border rounded-lg overflow-hidden" {...props} /></div>,
                                                thead: ({ node, ...props }) => <thead className="bg-blue-600 text-white" {...props} />,
                                                th: ({ node, ...props }) => <th className="border border-border px-4 py-3 text-left font-semibold" {...props} />,
                                                td: ({ node, ...props }) => <td className="border border-border px-4 py-2" {...props} />,
                                            }}
                                        >
                                            {content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
