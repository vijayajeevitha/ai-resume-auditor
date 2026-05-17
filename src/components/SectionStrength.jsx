import React from 'react';

const statusConfig = {
  strong:  { color: '#3ddc97', bg: 'rgba(61,220,151,0.1)',  border: 'rgba(61,220,151,0.25)',  label: '✅ Strong'  },
  weak:    { color: '#f5c542', bg: 'rgba(245,197,66,0.08)', border: 'rgba(245,197,66,0.2)',   label: '⚠ Weak'    },
  missing: { color: '#ff5757', bg: 'rgba(255,87,87,0.07)',  border: 'rgba(255,87,87,0.18)',   label: '❌ Missing' },
};

export function SectionStrength({ sections }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
          📊 Resume Section Audit
        </span>
      </div>
      <div style={{ padding: '12px 18px' }}>
        {sections.map((section, i) => {
          const cfg = statusConfig[section.status];
          return (
            <div key={i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 8,
              marginBottom: i < sections.length - 1 ? 6 : 0,
              animation: 'fadeInUp 0.3s ease forwards',
              animationDelay: `${i * 0.07}s`,
              opacity: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{section.icon}</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {section.name}
                </span>
              </div>
              <span style={{
                fontSize: 11,
                color: cfg.color,
                fontWeight: 700,
                background: cfg.bg,
                padding: '3px 10px',
                borderRadius: 12,
                border: `1px solid ${cfg.border}`,
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
              }}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
