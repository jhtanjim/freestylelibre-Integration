import React, { useState } from 'react';

interface Props {
    onLogin: (email: string, password: string) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export const LoginPage: React.FC<Props> = ({ onLogin, loading, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailInvalid = touched.email && !email.includes('@');
    const passwordInvalid = touched.password && password.length < 4;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (emailInvalid || passwordInvalid) return;
        await onLogin(email, password);
    };

    const inputBase: React.CSSProperties = {
        width: '100%', padding: '12px 16px', borderRadius: 10,
        background: 'var(--faint)', color: 'var(--text)', fontSize: 14,
        boxSizing: 'border-box', outline: 'none',
        fontFamily: "'Syne', sans-serif",
        transition: 'border-color 0.2s',
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'var(--bg, #f8fafc)',
            fontFamily: "'Syne', 'Segoe UI', sans-serif",
            color: 'var(--text, #0f172a)',
        }}>
            {/* Fonts & Icons */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

            <style>{`
                :root {
                    --bg: #f8fafc; --card: #ffffff; --border: #e2e8f0;
                    --text: #0f172a; --muted: #64748b; --faint: #f1f5f9;
                }
                @media (prefers-color-scheme: dark) {
                    :root {
                        --bg: #0b0f1a; --card: #111827; --border: #1e293b;
                        --text: #f1f5f9; --muted: #64748b; --faint: #1e293b;
                    }
                }
                * { box-sizing: border-box; }
                ::placeholder { color: #94a3b8 !important; }
                input:focus { border-color: #0ea5e9 !important; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 700px) {
                    .login-left { display: none !important; }
                }
            `}</style>

            {/* Left branding panel */}
            <div className="login-left" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '4rem',
                borderRight: '1px solid var(--border)',
                background: 'var(--card)',
            }}>
                <div style={{ maxWidth: 400 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#0ea5e9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 22, marginBottom: '2rem',
                    }}>
                        <i className="ti ti-activity-heartbeat" aria-hidden="true" />
                    </div>

                    <h1 style={{
                        fontSize: 40, fontWeight: 800, lineHeight: 1.1,
                        margin: '0 0 1rem', letterSpacing: '-0.02em',
                        color: 'var(--text)',
                    }}>
                        Your glucose,<br />
                        <span style={{ color: '#0ea5e9' }}>always in view.</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                        Connect your FreeStyle Libre and see your CGM data in a clean, real-time dashboard.
                    </p>

                    <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { icon: 'ti-chart-bar', text: 'Live readings every 5 minutes' },
                            { icon: 'ti-chart-line', text: 'Glucose trend charts and history' },
                            { icon: 'ti-target', text: 'Time-in-range analytics' },
                        ].map(({ icon, text }) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'var(--faint)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#0ea5e9', fontSize: 18,
                                }}>
                                    <i className={`ti ${icon}`} aria-hidden="true" />
                                </div>
                                <span style={{ color: 'var(--muted)', fontSize: 14 }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{
                width: '100%', maxWidth: 460,
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '3rem 2.5rem',
                background: 'var(--bg)',
            }}>
                {/* Mobile logo */}
                <div style={{ marginBottom: '2rem', display: 'none' }} className="login-logo-mobile">
                    <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: '#0ea5e9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 20,
                    }}>
                        <i className="ti ti-activity-heartbeat" aria-hidden="true" />
                    </div>
                </div>

                <h2 style={{
                    fontSize: 26, fontWeight: 700, margin: '0 0 6px',
                    letterSpacing: '-0.01em', color: 'var(--text)',
                }}>
                    Welcome back
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 2rem' }}>
                    Sign in with your LibreLink Up account
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Email */}
                    <div>
                        <label style={{
                            display: 'block', fontSize: 11, fontWeight: 600,
                            color: 'var(--muted)', marginBottom: 8,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                            Email address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="ti ti-mail" aria-hidden="true" style={{
                                position: 'absolute', left: 14, top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: 16, color: 'var(--muted)',
                            }} />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                                placeholder="you@example.com"
                                style={{
                                    ...inputBase,
                                    paddingLeft: 42,
                                    border: `1.5px solid ${emailInvalid ? '#ef4444' : 'var(--border)'}`,
                                }}
                            />
                        </div>
                        {emailInvalid && (
                            <p style={{ color: '#ef4444', fontSize: 12, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 13 }} />
                                Please enter a valid email address
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: 'block', fontSize: 11, fontWeight: 600,
                            color: 'var(--muted)', marginBottom: 8,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <i className="ti ti-lock" aria-hidden="true" style={{
                                position: 'absolute', left: 14, top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: 16, color: 'var(--muted)',
                            }} />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={() => setTouched(t => ({ ...t, password: true }))}
                                placeholder="••••••••••"
                                style={{
                                    ...inputBase,
                                    paddingLeft: 42, paddingRight: 44,
                                    border: `1.5px solid ${passwordInvalid ? '#ef4444' : 'var(--border)'}`,
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                                style={{
                                    position: 'absolute', right: 14, top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--muted)', fontSize: 18, padding: 0, lineHeight: 1,
                                }}
                            >
                                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true" />
                            </button>
                        </div>
                        {passwordInvalid && (
                            <p style={{ color: '#ef4444', fontSize: 12, margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 13 }} />
                                Password looks too short
                            </p>
                        )}
                    </div>

                    {/* Backend error */}
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '12px 14px', borderRadius: 10,
                            background: '#ef444410', border: '1px solid #ef444430',
                        }}>
                            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 16, color: '#ef4444', marginTop: 1 }} />
                            <div>
                                <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>
                                    Could not sign you in
                                </p>
                                <p style={{ color: '#ef444499', fontSize: 12, margin: 0 }}>
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '13px',
                            borderRadius: 10, border: 'none',
                            background: loading ? 'var(--faint)' : '#0ea5e9',
                            color: loading ? 'var(--muted)' : '#fff',
                            fontSize: 14, fontWeight: 700,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: "'Syne', sans-serif",
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            marginTop: 4,
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading ? (
                            <>
                                <i className="ti ti-refresh" aria-hidden="true" style={{ fontSize: 16, animation: 'spin 0.7s linear infinite' }} />
                                Connecting to LibreLink...
                            </>
                        ) : (
                            <>
                                Sign in
                                <i className="ti ti-arrow-right" aria-hidden="true" style={{ fontSize: 16 }} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: '2rem', lineHeight: 1.6 }}>
                    Use the same credentials as the <strong style={{ color: 'var(--text)' }}>LibreLink Up</strong> mobile app. Your data stays on your own server.
                </p>
            </div>
        </div>
    );
};