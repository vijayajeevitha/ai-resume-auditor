// ============================================================
// ATS ANALYSIS ENGINE
// ============================================================

// ---- Keyword banks by role ----
const ROLE_KEYWORDS = {
  "frontend developer": ["React", "JavaScript", "TypeScript", "HTML", "CSS", "REST API", "Git", "Webpack", "Tailwind", "Redux", "Next.js", "Vue", "Angular", "Responsive Design", "Jest", "GraphQL", "Figma"],
  "backend developer": ["Node.js", "Python", "Java", "SQL", "REST API", "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB", "Redis", "Git", "Linux", "Microservices", "CI/CD", "GraphQL"],
  "full stack developer": ["React", "Node.js", "JavaScript", "TypeScript", "SQL", "MongoDB", "REST API", "Docker", "Git", "AWS", "Next.js", "PostgreSQL", "Redis", "CI/CD", "Tailwind"],
  "data scientist": ["Python", "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "NumPy", "SQL", "Jupyter", "Statistics", "Data Visualization", "Scikit-learn", "R", "Tableau", "Deep Learning", "NLP"],
  "devops engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform", "Linux", "Jenkins", "Git", "Ansible", "Monitoring", "Bash", "Python", "Azure", "GCP", "Prometheus"],
  "mobile developer": ["React Native", "Flutter", "Swift", "Kotlin", "iOS", "Android", "REST API", "Git", "Firebase", "TypeScript", "Xcode", "Android Studio"],
  "ui ux designer": ["Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Design Systems", "HTML", "CSS", "Responsive Design", "Accessibility"],
  "software engineer": ["Python", "Java", "C++", "JavaScript", "Data Structures", "Algorithms", "Git", "REST API", "SQL", "Docker", "Agile", "Problem Solving", "OOP"],
  "product manager": ["Agile", "Scrum", "Roadmap", "Stakeholder Management", "User Stories", "KPIs", "Jira", "Analytics", "Market Research", "A/B Testing", "Go-to-Market", "Leadership"],
  "data analyst": ["SQL", "Python", "Excel", "Tableau", "Power BI", "Data Visualization", "Statistics", "R", "Google Analytics", "ETL", "Reporting", "Dashboard"],
};

const GENERIC_KEYWORDS = ["JavaScript", "Python", "SQL", "Git", "REST API", "Docker", "AWS", "Agile", "Linux", "TypeScript"];

// ---- Section detectors ----
const SECTION_PATTERNS = {
  experience:    /\b(experience|work history|employment|professional background|career)\b/i,
  education:     /\b(education|academic|degree|university|college|qualification)\b/i,
  skills:        /\b(skills|technical skills|competencies|technologies|tools|expertise)\b/i,
  projects:      /\b(projects|portfolio|side projects|personal projects|open source)\b/i,
  certifications:/\b(certifications?|certificates?|credentials?|licenses?|accreditations?)\b/i,
  summary:       /\b(summary|objective|profile|about|introduction|overview)\b/i,
  contact:       /\b(contact|email|phone|address|linkedin|github)\b/i,
  awards:        /\b(awards?|honors?|achievements?|recognition)\b/i,
};

// ---- Formatting red flags ----
const FORMAT_FLAGS = {
  tables:       /(\|.+\|.+\||\+-+\+)/g,
  multiColumn:  /(.{5,})\s{5,}(.{5,})/g,
  longParagraph:/\b(\w+\s){60,}\b/g,
  weakObjective:/^(i am|i'm|looking for|seeking a|objective:|career objective)/im,
  weakVerbs:    /\b(worked on|helped with|assisted in|did|made|was responsible for)\b/gi,
  genericSummary: /\b(hardworking|team player|fast learner|passionate about|results.driven|motivated professional)\b/gi,
};

const ACTION_VERBS = ["Developed", "Built", "Led", "Designed", "Implemented", "Optimized", "Architected", "Launched", "Managed", "Delivered", "Improved", "Reduced", "Increased", "Automated", "Engineered"];

const METRIC_PATTERNS = /(\d+%|\d+x|\$[\d,]+|\d+\s*(users|clients|projects|team|members|hours|days|months|years|ms|seconds))/gi;

// ============================================================
// MAIN ANALYZE FUNCTION
// ============================================================
export function analyzeResume(text, jobRole) {
  const lower = text.toLowerCase();
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const wordCount = text.split(/\s+/).length;

  // 1. Detect sections
  const sectionsFound = {};
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    sectionsFound[key] = pattern.test(text);
  }

  // 2. Keyword matching
  const role = jobRole.toLowerCase().trim();
  let roleKeywords = ROLE_KEYWORDS[role] || [];
  if (roleKeywords.length === 0) {
    // fuzzy match
    const matched = Object.keys(ROLE_KEYWORDS).find(k => k.includes(role) || role.includes(k));
    roleKeywords = matched ? ROLE_KEYWORDS[matched] : GENERIC_KEYWORDS;
  }

  const foundKeywords = roleKeywords.filter(kw => new RegExp(`\\b${kw.replace(/[+.]/g, '\\$&')}\\b`, 'i').test(text));
  const missingKeywords = roleKeywords.filter(kw => !foundKeywords.includes(kw));
  const keywordScore = roleKeywords.length > 0 ? Math.round((foundKeywords.length / roleKeywords.length) * 100) : 60;

  // 3. Formatting checks
  const hasTables    = FORMAT_FLAGS.tables.test(text);
  const hasLongParas = (text.match(FORMAT_FLAGS.longParagraph) || []).length > 2;
  const weakVerbList = [...new Set((text.match(FORMAT_FLAGS.weakVerbs) || []).map(v => v.toLowerCase()))];
  const genericPhrases = [...new Set((text.match(FORMAT_FLAGS.genericSummary) || []))];
  const hasWeakObjective = FORMAT_FLAGS.weakObjective.test(text);

  let formattingScore = 100;
  if (hasTables)          formattingScore -= 15;
  if (hasLongParas)       formattingScore -= 15;
  if (hasWeakObjective)   formattingScore -= 10;
  if (weakVerbList.length > 2) formattingScore -= 10;
  if (genericPhrases.length > 2) formattingScore -= 10;
  if (!sectionsFound.contact) formattingScore -= 10;
  formattingScore = Math.max(30, formattingScore);

  // 4. ATS compatibility
  let atsScore = 85;
  if (hasTables) atsScore -= 20;
  const hasLinkedIn = /linkedin\.com/i.test(text);
  const hasGitHub   = /github\.com/i.test(text);
  const hasEmail    = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone    = /(\+?[\d\s\-().]{10,})/.test(text);
  if (!hasEmail)    atsScore -= 15;
  if (!sectionsFound.experience) atsScore -= 10;
  if (!sectionsFound.skills)     atsScore -= 10;
  atsScore = Math.max(20, atsScore);

  // 5. Skills match
  const skillsScore = keywordScore;

  // 6. Readability
  const avgLineLen = lines.reduce((a, l) => a + l.length, 0) / (lines.length || 1);
  let readabilityScore = 80;
  if (avgLineLen > 120) readabilityScore -= 15;
  if (wordCount < 200)  readabilityScore -= 20;
  if (wordCount > 1200) readabilityScore -= 10;
  if (hasLongParas)     readabilityScore -= 15;
  readabilityScore = Math.max(25, readabilityScore);

  // 7. Overall
  const overallScore = Math.round(
    (atsScore * 0.25) + (formattingScore * 0.20) + (skillsScore * 0.25) +
    (readabilityScore * 0.15) + (Math.min(keywordScore, 100) * 0.15)
  );

  // 8. Metrics check
  const metricsFound = (text.match(METRIC_PATTERNS) || []).length;
  const hasMetrics = metricsFound >= 2;

  // 9. Action verbs check
  const usedActionVerbs = ACTION_VERBS.filter(v => new RegExp(`\\b${v}\\b`, 'i').test(text));
  const missingActionVerbs = ACTION_VERBS.filter(v => !usedActionVerbs.includes(v)).slice(0, 5);

  // 10. Build feedback
  const remove = [];
  const add = [];
  const update = [];

  // REMOVE suggestions
  if (hasTables)               remove.push({ icon: "❌", text: "Tables — ATS cannot parse table layouts" });
  if (hasLongParas)            remove.push({ icon: "❌", text: "Long paragraphs — use bullet points instead" });
  if (hasWeakObjective)        remove.push({ icon: "❌", text: "Weak objective statement — replace with strong summary" });
  if (genericPhrases.length)   remove.push({ icon: "❌", text: `Clichés: "${genericPhrases.slice(0,2).join('", "')}" — remove filler phrases` });
  if (weakVerbList.length)     remove.push({ icon: "❌", text: `Weak verbs: "${weakVerbList.slice(0,3).join('", "')}" — replace with action verbs` });
  if (!remove.length)          remove.push({ icon: "✅", text: "No major formatting issues detected — great!" });

  // ADD suggestions
  if (!hasMetrics)             add.push({ icon: "📊", text: 'Quantified metrics — e.g., "Improved load time by 40%", "Served 10K+ users"' });
  if (!hasGitHub)              add.push({ icon: "🔗", text: "GitHub profile link — essential for tech roles" });
  if (!hasLinkedIn)            add.push({ icon: "💼", text: "LinkedIn URL — recruiters expect this" });
  if (!sectionsFound.certifications) add.push({ icon: "🏆", text: "Certifications section — boosts credibility significantly" });
  if (!sectionsFound.projects) add.push({ icon: "🚀", text: "Projects section with tech stack and impact" });
  if (missingActionVerbs.length) add.push({ icon: "⚡", text: `Action verbs: ${missingActionVerbs.slice(0,3).join(", ")} — start each bullet with power verbs` });
  if (!add.length)             add.push({ icon: "✅", text: "Your resume has all the essential elements!" });

  // UPDATE suggestions
  if (!hasEmail)               update.push({ icon: "⚠️", text: "Add a professional email address" });
  if (!hasPhone)               update.push({ icon: "⚠️", text: "Add a phone number with country code" });
  if (sectionsFound.summary && hasWeakObjective) update.push({ icon: "⚠️", text: "Rewrite summary — make it role-specific and achievement-focused" });
  if (missingKeywords.length > 5) update.push({ icon: "⚠️", text: `Role keywords missing — add: ${missingKeywords.slice(0,4).join(", ")}` });
  if (!hasMetrics && sectionsFound.experience) update.push({ icon: "⚠️", text: "Strengthen experience bullets with numbers and impact" });
  if (!update.length)          update.push({ icon: "✅", text: "Contact and profile info looks complete!" });

  // 11. Section strength
  const sectionStrength = [
    { name: "Contact Info",     status: (hasEmail && hasPhone) ? "strong" : "missing", icon: "📋" },
    { name: "Summary / Profile",status: sectionsFound.summary ? (hasWeakObjective ? "weak" : "strong") : "missing", icon: "👤" },
    { name: "Experience",       status: sectionsFound.experience ? (hasMetrics ? "strong" : "weak") : "missing", icon: "💼" },
    { name: "Skills",           status: sectionsFound.skills ? "strong" : "missing", icon: "🛠" },
    { name: "Projects",         status: sectionsFound.projects ? "strong" : "missing", icon: "🚀" },
    { name: "Education",        status: sectionsFound.education ? "strong" : "missing", icon: "🎓" },
    { name: "Certifications",   status: sectionsFound.certifications ? "strong" : "missing", icon: "🏆" },
    { name: "LinkedIn / GitHub",status: (hasLinkedIn || hasGitHub) ? "strong" : "missing", icon: "🔗" },
  ];

  return {
    scores: {
      overall:     overallScore,
      ats:         atsScore,
      formatting:  formattingScore,
      skillsMatch: skillsScore,
      readability: readabilityScore,
      keywords:    Math.min(keywordScore, 100),
    },
    keywords: {
      found:   foundKeywords,
      missing: missingKeywords.slice(0, 12),
      role:    roleKeywords,
    },
    feedback: { remove, add, update },
    sectionStrength,
    meta: {
      wordCount,
      hasEmail, hasPhone, hasLinkedIn, hasGitHub,
      metricsCount: metricsFound,
      sectionsFound,
    },
  };
}

// ---- CDN script loader helper ----
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ---- Text extraction helpers ----
export async function extractTextFromPDF(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }
  return fullText;
}

export async function extractTextFromDOCX(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
  const mammoth = window.mammoth;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf'))  return extractTextFromPDF(file);
  if (name.endsWith('.docx')) return extractTextFromDOCX(file);
  if (name.endsWith('.txt'))  return file.text();
  throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT.');
}
