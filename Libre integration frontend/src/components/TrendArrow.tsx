import React from 'react';

const TREND_MAP: Record<number, { arrow: string; label: string; color: string }> = {
  0: { arrow: '↑↑', label: 'Rising rapidly',  color: '#e53e3e' },
  1: { arrow: '↑',  label: 'Rising',           color: '#ed8936' },
  2: { arrow: '↗',  label: 'Rising slightly',  color: '#ecc94b' },
  3: { arrow: '→',  label: 'Stable',            color: '#48bb78' },
  4: { arrow: '↘',  label: 'Falling slightly', color: '#ecc94b' },
  5: { arrow: '↓',  label: 'Falling',           color: '#ed8936' },
  6: { arrow: '↓↓', label: 'Falling rapidly',  color: '#e53e3e' },
};

interface Props {
  trend: number;
  size?: number;
}

export const TrendArrow: React.FC<Props> = ({ trend, size = 28 }) => {
  const info = TREND_MAP[trend] ?? TREND_MAP[3];
  return (
    <span
      title={info.label}
      style={{ fontSize: size, color: info.color, lineHeight: 1, display: 'inline-block' }}
    >
      {info.arrow}
    </span>
  );
};