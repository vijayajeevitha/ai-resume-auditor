import React, { useState, useRef } from 'react';
import { ScoreRing, ScoreBar } from './components/ScoreRing';
import { UploadZone } from './components/UploadZone';
import { FeedbackCard } from './components/FeedbackCard';
import { KeywordPanel } from './components/KeywordPanel';
import { SectionStrength } from './components/SectionStrength';
import { analyzeResume, extractText } from './atsEngine';
import './App.css';

const JOB_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile Developer",
  "UI UX Designer",
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
];

function App() {
  const [jobRole, setJobRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [inputMode, setInputMode] = useState('upload'); // 'upload' | 'paste'
  const resultsRef = useRef();

  const handleAnalyze = async () => {
    const role = jobRole || customRole;
    if (!role.trim()) { setError('Please select or enter a job role.'); return; }
    if (inputMode === 'upload' && !file) { setError('Please upload your resume.'); return; }
    if (inputMode === 'paste' && !pasteText.trim()) { setError('Please paste your resume text.'); return; }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      let text;
      if (inputMode === 'upload') {
        text = await extractText(file);
      } else {
        text = pasteText;
      }

      if (!text || text.trim().length < 50) {
        setError('Could not extract text from resume. Try pasting the text instead.');
        setLoading(false);
        return;
      }

      // Simulate processing time for effect
      await new Promise(r => setTimeout(r, 1200));

      const analysis = analyzeResume(text, role);
      setResult(analysis);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError('Error analyzing resume: ' + err.message);
    }
    setLoading(false);
  };

  const overallLabel = result?.scores.overall >= 80 ? '🔥 Strong Resume' :
                       result?.scores.overall >= 60 ? '✅ Good Shape' :
                       result?.scores.overall >= 40 ? '⚠ Needs Work' : '❌ Needs Major Fixes';

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div>
              <h1 className="logo-title">AI Resume Auditor</h1>
              <p className="logo-sub">Professional ATS Analyzer</p>
            </div>
          </div>
          <nav className="nav-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#analyzer" className="nav-cta">Analyze Now →</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot" />
          ATS Engine v2.0 — Enterprise Grade
        </div>
        <h2 className="hero-title">
          Get Your Resume<br />
          <span className="gradient-text">Recruiter-Ready</span>
        </h2>
        <p className="hero-desc">
          Deep ATS compatibility checks, keyword gap analysis, formatting audits,
          and AI-powered suggestions — everything real recruiting systems use.
        </p>
        <div className="hero-stats">
          {[['5+', 'Score Dimensions'], ['50+', 'Keywords Checked'], ['100%', 'Free to Use']].map(([num, label]) => (
            <div key={label} className="stat">
              <span className="stat-num">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <h3 className="section-title">How ATS Systems Work</h3>
          <div className="steps-row">
            {[
              ['📄', 'Upload Resume', 'PDF, DOCX or paste text'],
              ['🔍', 'Text Extraction', 'Parse content from file'],
              ['📊', 'Section Analysis', 'Detect resume structure'],
              ['🏷', 'Keyword Matching', 'Role-specific keywords'],
              ['✨', 'Score & Suggest', 'Actionable improvements'],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="step">
                <div className="step-icon">{icon}</div>
                <div className="step-arrow">{i < 4 ? '→' : ''}</div>
                <div className="step-body">
                  <div className="step-title">{title}</div>
                  <div className="step-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analyzer */}
      <section id="analyzer" className="analyzer-section">
        <div className="section-container">
          <h3 className="section-title">Analyze Your Resume</h3>

          <div className="analyzer-grid">
            {/* Left: Input */}
            <div className="input-panel">
              {/* Job role */}
              <div className="field-group">
                <label className="field-label">Target Job Role <span style={{ color: '#ff5757' }}>*</span></label>
                <div className="role-grid">
                  {JOB_ROLES.map(r => (
                    <button
                      key={r}
                      className={`role-btn ${jobRole === r ? 'active' : ''}`}
                      onClick={() => { setJobRole(r === jobRole ? '' : r); setCustomRole(''); }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  className="text-input"
                  placeholder="Or type a custom role..."
                  value={customRole}
                  onChange={e => { setCustomRole(e.target.value); setJobRole(''); }}
                  style={{ marginTop: 8 }}
                />
              </div>

              {/* Input mode toggle */}
              <div className="field-group">
                <label className="field-label">Resume Input</label>
                <div className="mode-toggle">
                  <button
                    className={`mode-btn ${inputMode === 'upload' ? 'active' : ''}`}
                    onClick={() => setInputMode('upload')}
                  >
                    📎 Upload File
                  </button>
                  <button
                    className={`mode-btn ${inputMode === 'paste' ? 'active' : ''}`}
                    onClick={() => setInputMode('paste')}
                  >
                    📋 Paste Text
                  </button>
                </div>
              </div>

              {inputMode === 'upload' ? (
                <UploadZone onFile={setFile} loading={loading} />
              ) : (
                <textarea
                  className="text-input paste-area"
                  placeholder="Paste your resume text here..."
                  value={pasteText}
                  onChange={e => setPasteText(e.target.value)}
                  rows={12}
                />
              )}

              {error && (
                <div className="error-msg">
                  ⚠ {error}
                </div>
              )}

              <button
                className="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" /> Analyzing...</>
                ) : (
                  <><span>⚡</span> Analyze My Resume</>
                )}
              </button>
            </div>

            {/* Right: Results */}
            <div className="results-panel" ref={resultsRef}>
              {!result && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h4>Your analysis will appear here</h4>
                  <p>Upload your resume and select a job role to get started</p>
                  <div className="feature-list">
                    {['ATS Compatibility Score', 'Keyword Gap Analysis', 'Formatting Checks', 'Section-by-Section Audit', 'Actionable Improvements'].map(f => (
                      <div key={f} className="feature-item">
                        <span style={{ color: 'var(--accent-blue)' }}>→</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="scan-animation">
                    <div className="scan-doc">📄</div>
                    <div className="scan-beam" />
                  </div>
                  <p style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Running ATS Analysis...</p>
                  {['Extracting text content', 'Detecting resume sections', 'Matching keywords', 'Scoring compatibility'].map((step, i) => (
                    <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.3}s` }}>
                      <span className="loading-dot" style={{ animationDelay: `${i * 0.3}s` }} />
                      {step}
                    </div>
                  ))}
                </div>
              )}

              {result && (
                <div className="results-content animate-fadeIn">
                  {/* Overall score banner */}
                  <div className="score-banner">
                    <div className="score-banner-left">
                      <div className="overall-label">{overallLabel}</div>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        Based on {result.meta.wordCount} words analyzed
                      </p>
                    </div>
                    <ScoreRing score={result.scores.overall} size={100} label="Overall ATS Score" />
                  </div>

                  {/* Score breakdown */}
                  <div className="card">
                    <div className="card-header">📈 Score Breakdown</div>
                    <div className="card-body">
                      <ScoreBar label="ATS Compatibility"   score={result.scores.ats}         delay={100} />
                      <ScoreBar label="Formatting Quality"  score={result.scores.formatting}   delay={200} />
                      <ScoreBar label="Skills Match"        score={result.scores.skillsMatch}  delay={300} />
                      <ScoreBar label="Readability"         score={result.scores.readability}  delay={400} />
                      <ScoreBar label="Keyword Optimization" score={result.scores.keywords}    delay={500} />
                    </div>
                  </div>

                  {/* Mini scores */}
                  <div className="mini-scores">
                    {[
                      { score: result.scores.ats,          label: 'ATS',       delay: 0   },
                      { score: result.scores.formatting,    label: 'Format',    delay: 100 },
                      { score: result.scores.skillsMatch,   label: 'Skills',    delay: 200 },
                      { score: result.scores.readability,   label: 'Read',      delay: 300 },
                      { score: result.scores.keywords,      label: 'Keywords',  delay: 400 },
                    ].map(item => (
                      <ScoreRing key={item.label} score={item.score} size={72} label={item.label} strokeWidth={5} delay={item.delay} />
                    ))}
                  </div>

                  {/* Feedback cards */}
                  <FeedbackCard type="remove" items={result.feedback.remove} />
                  <FeedbackCard type="add"    items={result.feedback.add}    />
                  <FeedbackCard type="update" items={result.feedback.update} />

                  {/* Keywords */}
                  <KeywordPanel
                    found={result.keywords.found}
                    missing={result.keywords.missing}
                    role={result.keywords.role}
                  />

                  {/* Section audit */}
                  <SectionStrength sections={result.sectionStrength} />

                  {/* Quick stats */}
                  <div className="quick-stats">
                    {[
                      { icon: '📧', label: 'Email',    val: result.meta.hasEmail    ? '✓ Found' : '✗ Missing', ok: result.meta.hasEmail    },
                      { icon: '📞', label: 'Phone',    val: result.meta.hasPhone    ? '✓ Found' : '✗ Missing', ok: result.meta.hasPhone    },
                      { icon: '💼', label: 'LinkedIn', val: result.meta.hasLinkedIn ? '✓ Found' : '✗ Missing', ok: result.meta.hasLinkedIn },
                      { icon: '🔗', label: 'GitHub',   val: result.meta.hasGitHub   ? '✓ Found' : '✗ Missing', ok: result.meta.hasGitHub   },
                      { icon: '📊', label: 'Metrics',  val: `${result.meta.metricsCount} found`, ok: result.meta.metricsCount >= 2 },
                      { icon: '📝', label: 'Words',    val: result.meta.wordCount,   ok: result.meta.wordCount >= 300 && result.meta.wordCount <= 900 },
                    ].map(item => (
                      <div key={item.label} className="stat-badge" style={{ borderColor: item.ok ? 'rgba(61,220,151,0.25)' : 'rgba(255,87,87,0.2)' }}>
                        <span>{item.icon}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{item.label}</span>
                        <span style={{ color: item.ok ? '#3ddc97' : '#ff7777', fontSize: 11, fontWeight: 600 }}>{item.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Re-analyze button */}
                  <button
                    className="re-analyze-btn"
                    onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    ↩ Analyze Another Resume
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>AI Resume Auditor — Built with ⚡ for job seekers worldwide</p>
        <p style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
          Your resume data is processed locally and never stored.
        </p>
      </footer>
    </div>
  );
}

export default App;
