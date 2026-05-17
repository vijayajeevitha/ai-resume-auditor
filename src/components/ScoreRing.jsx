import React, { useEffect, useState } from 'react';

const getColor = (score) => {
  if (score >= 80) return '#3ddc97';
  if (score >= 60) return '#388bfd';
  if (score >= 40) return '#f5c542';
  return '#ff5757';
};

const getLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
};

export function ScoreRing({ score, size = 120, label, strokeWidth = 8, delay = 0 }) {
  const [animScore, setAnimScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getColor(score);
  const progress = animScore / 100;
  const dashOffset = circumference * (1 - progress);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const step = score / 40;
      const interval = setInterval(() => {
        start += step;
        if (start >= score) { setAnimScore(score); clearInterval(interval); }
        else setAnimScore(Math.round(start));
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(56,139,253,0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: size / 4, fontWeight: 700, color, lineHeight: 1 }}>
            {animScore}
          </span>
          <span style={{ fontSize: size / 9, color: 'var(--text-muted)', fontWeight: 500 }}>%</span>
        </div>
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color, fontWeight: 500 }}>{getLabel(score)}</div>
        </div>
      )}
    </div>
  );
}

export function ScoreBar({ label, score, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const color = getColor(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 100);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: 'rgba(56,139,253,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 3,
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}66`
        }} />
      </div>
    </div>
  );
}
