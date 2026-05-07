import React, { useEffect, useRef } from 'react';
import { GlucoseChart } from '../components/GlucoseChart';
import { useGlucose } from '../hooks/useGlucose';
import { type GlucoseData, type UserProfile } from '../types/glucose';

interface Props {
    user: UserProfile;
    initialGlucose: GlucoseData;
    onLogout: () => void;
}

const REFRESH_MS = 5 * 60 * 1000;

const TREND_LABELS: Record<string, { label: string; icon: string }> = {
    Flat:          { label: 'Stable',           icon: 'ti-arrow-right' },
    SingleUp:      { label: 'Rising',           icon: 'ti-arrow-up' },
    SingleDown:    { label: 'Falling',          icon: 'ti-arrow-down' },
    FortyFiveUp:   { label: 'Rising slightly',  icon: 'ti-arrow-up-right' },
    FortyFiveDown: { label: 'Falling slightly', icon: 'ti-arrow-down-right' },
    DoubleUp:      { label: 'Rising fast',      icon: 'ti-arrows-up' },
    DoubleDown:    { label: 'Falling fast',     icon: 'ti-arrows-down' },
};

export const DashboardPage: React.FC<Props> = ({ user, initialGlucose, onLogout }) => {
    const { data, loading, error, lastRefresh, refresh } = useGlucose();
    const glucose = data ?? initialGlucose;
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(refresh, REFRESH_MS);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [refresh]);

    const history = glucose.history;
    const avgMgdl = history.length
        ? Math.round(history.reduce((s, r) => s + r.value, 0) / history.length)
        : null;
    const highs = history.filter(r => r.isHigh).length;
    const lows = history.filter(r => r.isLow).length;
    const inRange = history.length - highs - lows;
    const inRangePct = history.length ? Math.round((inRange / history.length) * 100) : null;

    const initials = [user.firstName?.[0], user.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
    const current = glucose.current;

    const statusColor = !current ? '#94a3b8'
        : current.isHigh ? '#f59e0b'
        : current.isLow ? '#6366f1'
        : '#10b981';

    const statusLabel = !current ? 'No data'
        : current.isHigh ? 'Above range'
        : current.isLow ? 'Below range'
        : 'In range';

    const trendInfo = current ? (TREND_LABELS[current.trendType] ?? { label: current.trendType, icon: 'ti-arrow-right' }) : null;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg, #f8fafc)',
            color: 'var(--text, #0f172a)',
            fontFamily: "'Syne', 'Segoe UI', sans-serif",
        }}>
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
            {/* Tabler Icons */}
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
                .mono { font-family: 'JetBrains Mono', monospace; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
                .live-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #10b981; display: inline-block;
                    animation: pulse 2s infinite;
                }
            `}</style>

            {/* Nav */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 28px',
                background: 'var(--card)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#0ea5e9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 16,
                    }}>
                        <i className="ti ti-activity-heartbeat" aria-hidden="true" />
                    </div>
                    GlucoTrack
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {lastRefresh && (
                        <span style={{
                            fontSize: 11, padding: '4px 10px', borderRadius: 20,
                            background: 'var(--faint)', color: 'var(--muted)',
                            border: '1px solid var(--border)',
                            fontFamily: "'JetBrains Mono', monospace",
                        }}>
                            <i className="ti ti-clock" aria-hidden="true" style={{ fontSize: 11, verticalAlign: '-1px', marginRight: 4 }} />
                            Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={refresh}
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '7px 13px', borderRadius: 8,
                            border: '1px solid var(--border)', background: 'var(--card)',
                            color: loading ? 'var(--muted)' : 'var(--text)',
                            fontSize: 12, fontFamily: "'Syne', sans-serif",
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        <i className="ti ti-refresh" aria-hidden="true" style={{ fontSize: 14, ...(loading ? { animation: 'spin 0.7s linear infinite' } : {}) }} />
                        {loading ? 'Refreshing' : 'Refresh'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color: '#fff',
                        }}>{initials}</div>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{user.firstName}</span>
                        <button
                            onClick={onLogout}
                            style={{
                                padding: '5px 12px', borderRadius: 7,
                                border: '1px solid var(--border)', background: 'transparent',
                                color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
                                fontFamily: "'Syne', sans-serif",
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px' }}>

                {/* Error */}
                {error && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 16px', borderRadius: 12, marginBottom: '16px',
                        background: '#ef444410', border: '1px solid #ef444425',
                        color: '#ef4444', fontSize: 13,
                    }}>
                        <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 16 }} />
                        {error}
                    </div>
                )}

                {/* Hero */}
                <div style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 16, padding: '28px',
                    marginBottom: 16,
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 24, flexWrap: 'wrap',
                    position: 'relative', overflow: 'hidden',
                }}>
                    {/* Top accent bar */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: 'linear-gradient(90deg, #0ea5e9, #10b981)',
                    }} />

                    <div>
                        <p style={{
                            fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--muted)', margin: '0 0 14px',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <span className="live-dot" />
                            Current glucose
                        </p>

                        {current ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                                    <span className="mono" style={{
                                        fontSize: 72, fontWeight: 800, lineHeight: 1,
                                        letterSpacing: '-0.04em', color: statusColor,
                                    }}>
                                        {current.value}
                                    </span>
                                    <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500 }}>mg/dL</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                                    <span className="mono" style={{ fontSize: 20, color: 'var(--muted)' }}>{current.mmol} mmol/L</span>
                                    <span style={{
                                        fontSize: 11, padding: '3px 12px', borderRadius: 20,
                                        fontWeight: 600, letterSpacing: '0.03em',
                                        background: `${statusColor}18`,
                                        color: statusColor,
                                        border: `1px solid ${statusColor}30`,
                                    }}>
                                        {statusLabel}
                                    </span>
                                </div>
                                {trendInfo && (
                                    <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <i className={`ti ${trendInfo.icon}`} aria-hidden="true" style={{ fontSize: 14, color: statusColor }} />
                                        {trendInfo.label} · {new Date(current.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                            </>
                        ) : (
                            <div style={{ marginTop: 8 }}>
                                <p style={{ fontSize: 22, color: 'var(--muted)', fontWeight: 700, margin: '0 0 6px' }}>No sensor data</p>
                                <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                                    Make sure your FreeStyle Libre sensor is active<br />
                                    and connected to <strong>LibreLink Up</strong>.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stat pills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 190 }}>
                        {[
                            { label: 'Average', value: avgMgdl ? `${avgMgdl} mg/dL` : '—', color: '#6366f1', icon: 'ti-chart-bar' },
                            { label: 'Time in range', value: inRangePct != null ? `${inRangePct}%` : '—', color: '#10b981', icon: 'ti-target' },
                            { label: 'High readings', value: String(highs), color: '#f59e0b', icon: 'ti-arrow-up-circle' },
                            { label: 'Low readings', value: String(lows), color: '#6366f1', icon: 'ti-arrow-down-circle' },
                        ].map(s => (
                            <div key={s.label} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px', borderRadius: 10,
                                background: 'var(--faint)', border: '1px solid var(--border)',
                                gap: 16,
                            }}>
                                <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <i className={`ti ${s.icon}`} aria-hidden="true" style={{ fontSize: 13, color: s.color }} />
                                    {s.label}
                                </span>
                                <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 16, padding: '24px', marginBottom: 16,
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
                            <i className="ti ti-chart-line" aria-hidden="true" style={{ color: '#0ea5e9' }} />
                            Glucose history
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--muted)' }}>mg/dL · dashed = range limits (70–180)</span>
                    </div>
                    <GlucoseChart history={glucose.history} current={glucose.current} />
                </div>

                {/* Table */}
                {history.length > 0 && (
                    <div style={{
                        background: 'var(--card)', border: '1px solid var(--border)',
                        borderRadius: 16, padding: '24px', overflowX: 'auto',
                    }}>
                        <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
                            <i className="ti ti-list" aria-hidden="true" style={{ color: '#0ea5e9' }} />
                            Recent readings
                        </p>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr>
                                    {['Time', 'mg/dL', 'mmol/L', 'Trend', 'Status'].map(h => (
                                        <th key={h} style={{
                                            textAlign: 'left', padding: '8px 12px',
                                            color: 'var(--muted)', fontWeight: 600, fontSize: 11,
                                            textTransform: 'uppercase', letterSpacing: '0.07em',
                                            borderBottom: '1px solid var(--border)',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[...history].reverse().slice(0, 12).map((r, i) => {
                                    const c = r.isHigh ? '#f59e0b' : r.isLow ? '#6366f1' : '#10b981';
                                    const label = r.isHigh ? 'High' : r.isLow ? 'Low' : 'In range';
                                    const ti = TREND_LABELS[r.trendType] ?? { label: r.trendType, icon: 'ti-arrow-right' };
                                    return (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--faint)' }}>
                                            <td className="mono" style={{ padding: '11px 12px', color: 'var(--muted)', fontSize: 12 }}>
                                                {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="mono" style={{ padding: '11px 12px', fontWeight: 700, color: c, fontSize: 15 }}>
                                                {r.value}
                                            </td>
                                            <td className="mono" style={{ padding: '11px 12px', color: 'var(--muted)', fontSize: 12 }}>
                                                {r.mmol}
                                            </td>
                                            <td style={{ padding: '11px 12px', color: 'var(--muted)', fontSize: 12 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                    <i className={`ti ${ti.icon}`} aria-hidden="true" style={{ fontSize: 13, color: c }} />
                                                    {ti.label}
                                                </span>
                                            </td>
                                            <td style={{ padding: '11px 12px' }}>
                                                <span style={{
                                                    fontSize: 10, padding: '2px 9px', borderRadius: 20,
                                                    fontWeight: 600, letterSpacing: '0.03em',
                                                    background: `${c}18`, color: c,
                                                    border: `1px solid ${c}30`,
                                                }}>
                                                    {label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};