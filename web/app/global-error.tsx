'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'red' }}>
                    <h2>🔥 Critical System Failure (Global Error)</h2>
                    <p><strong>Message:</strong> {error.message}</p>
                    {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                    <div style={{ background: '#eee', padding: '1rem', marginTop: '1rem', color: '#333' }}>
                        <pre>{error.stack}</pre>
                    </div>
                    <button
                        onClick={() => reset()}
                        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
