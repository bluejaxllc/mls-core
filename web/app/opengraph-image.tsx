import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BLUE JAX CORE – Mexico MLS Market Infrastructure';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%)',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        opacity: 0.08,
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />

                {/* Glow accent */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-120px',
                        right: '-80px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Small accent glow bottom-left */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-60px',
                        left: '-40px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)',
                        display: 'flex',
                    }}
                />

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    {/* Title */}
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 800,
                            color: 'white',
                            letterSpacing: '-2px',
                            lineHeight: 1,
                            display: 'flex',
                        }}
                    >
                        BLUE JAX
                    </div>

                    {/* CORE badge */}
                    <div
                        style={{
                            fontSize: 36,
                            fontWeight: 700,
                            color: '#60A5FA',
                            letterSpacing: '12px',
                            marginTop: '8px',
                            display: 'flex',
                        }}
                    >
                        CORE
                    </div>

                    {/* Accent line */}
                    <div
                        style={{
                            width: '120px',
                            height: '4px',
                            borderRadius: '2px',
                            background: 'linear-gradient(90deg, #3B82F6, #60A5FA)',
                            marginTop: '24px',
                            display: 'flex',
                        }}
                    />

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: 22,
                            fontWeight: 400,
                            color: 'rgba(203,213,225,0.9)',
                            marginTop: '24px',
                            letterSpacing: '1px',
                            display: 'flex',
                        }}
                    >
                        Mexico MLS Market Infrastructure
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
