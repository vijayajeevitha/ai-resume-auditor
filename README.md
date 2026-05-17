# ⚡ AI Resume Auditor

> Professional ATS Resume Analyzer — Built for job seekers who want an edge.

![Dark Blue Theme](https://img.shields.io/badge/Theme-Dark%20Blue-0a1628)
![React](https://img.shields.io/badge/React-18-61dafb)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🔥 Features

- **5-Dimension ATS Scoring** — ATS Compatibility, Formatting, Skills Match, Readability, Keywords
- **Role-specific Keyword Analysis** — 10+ job roles with targeted keyword banks
- **Formatting Audit** — Detects tables, long paragraphs, weak verbs, clichés
- **Section-by-Section Audit** — Identifies missing or weak resume sections
- **PDF + DOCX + TXT Support** — Real file parsing with pdf.js and mammoth.js
- **What to Remove / Add / Update** — Actionable, specific suggestions
- **Dark Blue Professional UI** — Built with Syne + DM Sans typography

---

## 🚀 Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy to Netlify

### Option 1: Drag & Drop
1. Run `npm run build`
2. Drag the `build/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)

### Option 2: GitHub + Netlify CI/CD
1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site from Git
3. Connect your GitHub repo
4. Build command: `npm run build`
5. Publish directory: `build`
6. Click Deploy 🚀

### Option 3: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## 🐙 Deploy to GitHub

```bash
git init
git add .
git commit -m "🚀 Initial commit — AI Resume Auditor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-auditor.git
git push -u origin main
```

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| UI Framework | React 18 |
| Styling | Custom CSS + CSS Variables |
| PDF Parsing | pdf.js (pdfjs-dist) |
| DOCX Parsing | mammoth.js |
| Fonts | Syne (display) + DM Sans (body) |
| Deployment | Netlify |

---

## 📊 Scoring Engine

The ATS engine analyzes resumes across 5 dimensions:

| Dimension | Weight | What It Checks |
|-----------|--------|----------------|
| ATS Compatibility | 25% | Parsability, contact info, structure |
| Formatting | 20% | Tables, long paragraphs, weak verbs |
| Skills Match | 25% | Role-specific keyword coverage |
| Readability | 15% | Word count, line length, structure |
| Keyword Optimization | 15% | Keyword density and placement |

---

## 📁 Project Structure

```
src/
├── App.js              # Main application
├── App.css             # All styles
├── atsEngine.js        # Core ATS analysis logic
├── index.js            # Entry point
├── index.css           # Global styles / CSS vars
└── components/
    ├── ScoreRing.jsx   # Circular + bar score displays
    ├── UploadZone.jsx  # File upload with drag & drop
    ├── FeedbackCard.jsx # Remove/Add/Update feedback
    ├── KeywordPanel.jsx # Keyword match display
    └── SectionStrength.jsx # Resume section audit
```

---

## 📄 License

MIT — free to use, modify, and deploy.

---

Made with ⚡ by AI Resume Auditor
