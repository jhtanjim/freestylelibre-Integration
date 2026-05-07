import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { GlucoseReading } from '../types/glucose';

interface Props {
    history: GlucoseReading[];
    current: GlucoseReading | null;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const color = d.isHigh ? '#f59e0b' : d.isLow ? '#6366f1' : '#10b981';
    return (
        <div style={{
            background: 'var(--card, #fff)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: 10,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: "'Syne', sans-serif",
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
            <div style={{
                fontWeight: 700, color,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 16,
            }}>
                {d.value} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--muted, #64748b)' }}>mg/dL</span>
            </div>
            <div style={{ color: 'var(--muted, #64748b)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
                {d.mmol} mmol/L
            </div>
            <div style={{ color: 'var(--muted, #64748b)', fontSize: 11, marginTop: 4 }}>{d.time}</div>
        </div>
    );
};

const ReferenceLabel = ({ viewBox, value, color }: any) => {
    const { x, y, width } = viewBox;
    return (
        <text
            x={x + width - 4}
            y={y - 5}
            textAnchor="end"
            fill={color}
            fontSize={9}
            fontFamily="'JetBrains Mono', monospace"
            opacity={0.8}
        >
            {value}
        </text>
    );
};

export const GlucoseChart: React.FC<Props> = ({ history, current }) => {
    const all = [...history, ...(current ? [current] : [])]
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(r => ({
            ...r,
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

    if (all.length === 0) {
        return (
            <div style={{
                textAlign: 'center', padding: '2.5rem',
                color: 'var(--muted, #64748b)', fontSize: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
                <i className="ti ti-chart-line" aria-hidden="true" style={{ fontSize: 32, opacity: 0.3 }} />
                No history available yet.
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={all} margin={{ top: 16, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border, #e2e8f0)"
                    vertical={false}
                    opacity={0.6}
                />
                <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: 'var(--muted, #64748b)', fontFamily: "'JetBrains Mono', monospace" }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    domain={[40, 400]}
                    tick={{ fontSize: 10, fill: 'var(--muted, #64748b)', fontFamily: "'JetBrains Mono', monospace" }}
                    tickLine={false}
                    axisLine={false}
                />
                <ReferenceLine
                    y={70}
                    stroke="#6366f1"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={<ReferenceLabel value="Low" color="#6366f1" />}
                />
                <ReferenceLine
                    y={180}
                    stroke="#f59e0b"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={<ReferenceLabel value="High" color="#f59e0b" />}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#glucoseGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#0ea5e9', strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};