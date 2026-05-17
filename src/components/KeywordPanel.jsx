import React from 'react';

export function KeywordPanel({ found, missing, role }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
          🔍 Keyword Analysis
        </span>
        <span style={{
          fontSize: 11,
          color: 'var(--accent-blue)',
          fontFamily: 'var(--font-mono)',
          background: 'rgba(56,139,253,0.1)',
          padding: '2px 10px',
          borderRadius: 20,
        }}>
          {found.length}/{role.length} matched
        </span>
      </div>

      <div style={{ padding: 18 }}>
        {found.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: 'var(--accent-green)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              ✓ Found in Resume
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {found.map(kw => (
                <span key={kw} style={{
                  padding: '4px 12px',
                  background: 'rgba(61,220,151,0.1)',
                  border: '1px solid rgba(61,220,151,0.25)',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#3ddc97',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {missing.length > 0 && (
          <div>
            <p style={{ fontSize: 11, color: '#ff5757', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              ✗ Missing — Add These
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {missing.map(kw => (
                <span key={kw} style={{
                  padding: '4px 12px',
                  background: 'rgba(255,87,87,0.08)',
                  border: '1px solid rgba(255,87,87,0.2)',
                  borderRadius: 20,
                  fontSize: 12,
                  color: '#ff8888',
                  fontWeight: 500,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
