import React, { useState } from 'react';

const configs = {
  remove: {
    title: 'Remove These',
    subtitle: 'ATS killers & weak content',
    borderColor: 'rgba(255,87,87,0.3)',
    bgColor: 'rgba(255,87,87,0.05)',
    headerColor: '#ff5757',
    badge: 'bg-red',
  },
  add: {
    title: 'Add These',
    subtitle: 'Missing elements that boost score',
    borderColor: 'rgba(61,220,151,0.3)',
    bgColor: 'rgba(61,220,151,0.05)',
    headerColor: '#3ddc97',
    badge: 'bg-green',
  },
  update: {
    title: 'Update These',
    subtitle: 'Items that need improvement',
    borderColor: 'rgba(245,197,66,0.3)',
    bgColor: 'rgba(245,197,66,0.05)',
    headerColor: '#f5c542',
    badge: 'bg-yellow',
  },
};

export function FeedbackCard({ type, items }) {
  const cfg = configs[type];
  const [expanded, setExpanded] = useState(true);

  return (
    <div style={{
      background: cfg.bgColor,
      border: `1px solid ${cfg.borderColor}`,
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      transition: 'var(--transition)',
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: expanded ? `1px solid ${cfg.borderColor}` : 'none',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: cfg.headerColor }}>
            {cfg.title}
          </span>
          <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{cfg.subtitle}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: cfg.borderColor,
            color: cfg.headerColor,
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}>
            {items.length}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 16, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▾
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '12px 18px' }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 12,
              padding: '10px 0',
              borderBottom: i < items.length - 1 ? `1px solid ${cfg.borderColor}` : 'none',
              animation: 'fadeInUp 0.3s ease forwards',
              animationDelay: `${i * 0.05}s`,
              opacity: 0,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
