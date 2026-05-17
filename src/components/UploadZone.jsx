import React, { useRef, useState } from 'react';

export function UploadZone({ onFile, loading }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      onClick={() => !loading && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${drag ? 'var(--accent-cyan)' : 'var(--border-bright)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '48px 32px',
        textAlign: 'center',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'var(--transition)',
        background: drag ? 'rgba(0,212,255,0.04)' : 'rgba(56,139,253,0.03)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Scan line animation */}
      {loading && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
          animation: 'scanLine 1.5s linear infinite',
          zIndex: 2,
        }} />
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {loading ? (
        <div>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent-cyan)',
            animation: 'rotate 0.8s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: 15 }}>Analyzing resume...</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Running ATS compatibility checks</p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          {fileName ? (
            <div>
              <p style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>✓ {fileName}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Click to change file</p>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
                Drop your resume here
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16 }}>
                Supports PDF, DOCX, and TXT files
              </p>
              <div style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: 'linear-gradient(135deg, rgba(56,139,253,0.2), rgba(0,212,255,0.1))',
                border: '1px solid var(--border-bright)',
                borderRadius: 8,
                color: 'var(--accent-blue)',
                fontSize: 13,
                fontWeight: 600,
              }}>
                Browse Files
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
