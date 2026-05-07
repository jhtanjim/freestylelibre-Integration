import React from 'react';
import type { GlucoseReading } from '../types/glucose';
import { TrendArrow } from './TrendArrow';

interface Props {
  reading: GlucoseReading | null;
}

function getStatus(reading: GlucoseReading | null) {
  if (!reading) return { label: 'No data', color: '#a0aec0' };
  if (reading.isHigh) return { label: 'High', color: '#e53e3e' };
  if (reading.isLow) return { label: 'Low', color: '#3182ce' };
  return { label: 'In range', color: '#38a169' };
}

export const GlucoseGauge: React.FC<Props> = ({ reading }) => {
  const status = getStatus(reading);

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow ring */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 20,
        boxShadow: `inset 0 0 60px ${status.color}18`,
        pointerEvents: 'none',
      }} />

      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
        Current glucose
      </p>

      {reading ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
            <span style={{ fontSize: 72, fontWeight: 700, color: status.color, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              {reading.value}
            </span>
            <span style={{ fontSize: 16, color: 'var(--muted)' }}>mg/dL</span>
          </div>

          <div style={{ fontSize: 22, color: 'var(--muted)', marginTop: 2 }}>
            {reading.mmol} mmol/L
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
            <TrendArrow trend={reading.trend} size={24} />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{reading.trendType}</span>
          </div>

          <div style={{
            display: 'inline-block',
            marginTop: 16,
            padding: '4px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            background: `${status.color}18`,
            color: status.color,
            border: `1px solid ${status.color}40`,
          }}>
            {status.label}
          </div>

          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
            {new Date(reading.timestamp).toLocaleTimeString()}
          </p>
        </>
      ) : (
        <div style={{ padding: '2rem 0', color: 'var(--muted)', fontSize: 14 }}>
          No sensor data available.<br />
          <span style={{ fontSize: 12 }}>Connect a LibreLink sensor to see readings.</span>
        </div>
      )}
    </div>
  );
};