import { Job, JobMatch, ResumeAnalysis } from '../types';

// Comprehensive dictionary of technical skills, categorized
export const SKILL_TAXONOMY = {
  programmingLanguages: [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'Go', 'Golang',
    'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R', 'Dart', 'SQL', 'HTML', 'CSS',
    'HTML5', 'CSS3', 'Bash', 'Shell', 'Scala', 'Perl'
  ],
  frameworksAndLibraries: [
    'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Node.js', 'Express',
    'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Spring', 'ASP.NET',
    'Laravel', 'Tailwind CSS', 'Bootstrap', 'Redux', 'GraphQL', 'REST API', 'Pandas',
    'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'NLTK',
    'React Native', 'Flutter', 'Jest', 'Mocha', 'Cypress'
  ],
  toolsAndPlatforms: [
    'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Amazon Web Services',
    'Azure', 'Google Cloud', 'GCP', 'Linux', 'Unix', 'PostgreSQL', 'MySQL',
    'MongoDB', 'Redis', 'SQLite', 'Elasticsearch', 'Jenkins', 'Terraform',
    'CI/CD', 'Jira', 'Figma', 'Postman', 'Webpack', 'Vite', 'Kafka', 'RabbitMQ'
  ],
  domainsAndConcepts: [
    'Machine Learning', 'Deep Learning', 'Natural Language Processing', 'NLP',
    'Artificial Intelligence', 'Data Science', 'Data Analysis', 'Computer Vision',
    'System Design', 'Microservices', 'Agile', 'Scrum', 'Object-Oriented Programming',
    'OOP', 'Database Management', 'Cloud Computing', 'DevOps', 'Web Development',
    'Full Stack Development', 'Frontend Development', 'Backend Development',
    'Data Structures & Algorithms', 'DSA', 'Cybersecurity', 'API Development'
  ]
};

// Common degrees for pattern matching
const DEGREE_PATTERNS = [
  /B\.?Sc(?:ience)?(?:\s+in)?\s+([A-Za-z\s]+)?/i,
  /Bachelor\s+of\s+([A-Za-z\s]+)/i,
  /B\.?Tech(?:\s+in)?\s+([A-Za-z\s]+)?/i,
  /B\.?E\.?(?:\s+in)?\s+([A-Za-z\s]+)?/i,
  /BCA/i,
  /MCA/i,
  /M\.?Sc(?:ience)?(?:\s+in)?\s+([A-Za-z\s]+)?/i,
  /Master\s+of\s+([A-Za-z\s]+)/i,
  /M\.?Tech/i,
  /Ph\.?D/i,
  /Associate\s+Degree/i,
  /Diploma\s+in\s+([A-Za-z\s]+)/i
];

/**
 * Local Rule-Based NLP Resume Parser
 * Extracts contact, skills, education, experience and generates structured data.
 */
export function parseResumeWithNLP(rawText: string, fileName: string = 'Resume'): ResumeAnalysis {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Extract Candidate Name
  const candidateName = extractCandidateName(lines, rawText, fileName);

  // 2. Extract Contact Info
  const email = extractEmail(rawText);
  const phone = extractPhone(rawText);

  // 3. Extract Skills by Category
  const lowerText = ` ${rawText.toLowerCase().replace(/[^a-z0-9+#.]/g, ' ')} `;
  
  const foundLanguages = extractFromCategory(SKILL_TAXONOMY.programmingLanguages, lowerText);
  const foundFrameworks = extractFromCategory(SKILL_TAXONOMY.frameworksAndLibraries, lowerText);
  const foundTools = extractFromCategory(SKILL_TAXONOMY.toolsAndPlatforms, lowerText);
  const foundConcepts = extractFromCategory(SKILL_TAXONOMY.domainsAndConcepts, lowerText);

  // Consolidated unique skills
  const allExtractedSkills = Array.from(new Set([
    ...foundLanguages,
    ...foundFrameworks,
    ...foundTools,
    ...foundConcepts
  ]));

  // 4. Extract Education
  const education = extractEducation(rawText, lines);

  // 5. Extract Experience Years
  const experienceYearsDetected = estimateExperienceYears(rawText);

  // 6. Certifications
  const certifications = extractCertifications(rawText, lines);

  // 7. Detected Suitable Roles
  const detectedRoles = inferTargetRoles(allExtractedSkills);

  // 8. Key Strengths
  const keyStrengths = generateKeyStrengths(allExtractedSkills, experienceYearsDetected, education);

  // 9. ATS Score
  const atsScore = calculateATSScore(allExtractedSkills, education, experienceYearsDetected, rawText);

  // 10. Summary
  const summary = generateSummary(candidateName, experienceYearsDetected, allExtractedSkills, education);

  return {
    id: 'analysis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    resumeId: '',
    candidateId: '',
    candidateName,
    email: email || undefined,
    phone: phone || undefined,
    extractedSkills: allExtractedSkills,
    programmingLanguages: foundLanguages,
    technicalTools: foundTools,
    frameworks: foundFrameworks,
    education,
    certifications,
    experienceSummary: `${experienceYearsDetected > 0 ? experienceYearsDetected + '+ years' : 'Fresher / Entry-Level'} relevant technical experience`,
    experienceYearsDetected,
    detectedRoles,
    keyStrengths,
    summary,
    atsScore,
    parsedAt: new Date().toISOString()
  };
}

/**
 * Match a candidate's resume analysis against an individual job
 */
export function calculateJobMatch(analysis: ResumeAnalysis, job: Job): JobMatch {
  const candidateSkills = (analysis.extractedSkills || []).map(s => s.toLowerCase().trim());
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());

  // 1. Skill Match Calculation
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const reqSkill of job.requiredSkills) {
    const isMatched = candidateSkills.some(candSkill => {
      // Direct match or partial token match (e.g. "React.js" matches "React")
      const c = candSkill.toLowerCase();
      const r = reqSkill.toLowerCase();
      return c === r || c.includes(r) || r.includes(c);
    });

    if (isMatched) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  }

  const skillMatchPercentage = requiredSkills.length > 0
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
    : 100;

  // 2. Experience Match Calculation
  let expPercentage = 100;
  if (job.experienceRequired > 0) {
    const ratio = analysis.experienceYearsDetected / job.experienceRequired;
    expPercentage = Math.min(100, Math.round(ratio * 100));
  }

  // 3. Qualification Match Calculation
  let qualPercentage = 80;
  const educationString = (analysis.education || []).join(' ').toLowerCase();
  const jobQual = job.qualification.toLowerCase();

  if (jobQual.includes('bachelor') || jobQual.includes('b.sc') || jobQual.includes('b.tech') || jobQual.includes('bca') || jobQual.includes('computer')) {
    if (educationString.includes('bachelor') || educationString.includes('b.sc') || educationString.includes('b.tech') || educationString.includes('bca') || educationString.includes('master') || educationString.includes('mca') || educationString.includes('computer')) {
      qualPercentage = 100;
    }
  }

  // Weighted overall Match Score: 65% Skills + 20% Experience + 15% Qualification
  const rawScore = Math.round(
    (skillMatchPercentage * 0.65) +
    (expPercentage * 0.20) +
    (qualPercentage * 0.15)
  );

  const matchScore = Math.min(100, Math.max(0, rawScore));

  let matchStatus: JobMatch['matchStatus'] = 'Low Match';
  if (matchScore >= 80) matchStatus = 'High Match';
  else if (matchScore >= 60) matchStatus = 'Good Match';
  else if (matchScore >= 40) matchStatus = 'Moderate Match';

  let recommendationReason = '';
  if (matchScore >= 75) {
    recommendationReason = `Strong alignment on core skills (${matchedSkills.slice(0, 3).join(', ')}). Highly recommended for interview.`;
  } else if (matchScore >= 50) {
    recommendationReason = `Candidate possesses key fundamentals (${matchedSkills.slice(0, 2).join(', ')}). Missing ${missingSkills.slice(0, 2).join(', ')}.`;
  } else {
    recommendationReason = `Skills gap identified. Role requires further competencies in ${missingSkills.slice(0, 2).join(', ')}.`;
  }

  return {
    jobId: job.id,
    job,
    matchScore,
    skillMatchPercentage,
    experienceMatchPercentage: expPercentage,
    qualificationMatchPercentage: qualPercentage,
    matchedSkills,
    missingSkills,
    matchStatus,
    recommendationReason
  };
}

/**
 * Rank and recommend jobs in descending order of match percentage
 */
export function getJobRecommendations(analysis: ResumeAnalysis, jobs: Job[]): JobMatch[] {
  const matches = jobs
    .filter(job => job.status === 'Active')
    .map(job => calculateJobMatch(analysis, job));

  // Sort descending by match score
  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

// ----------------- Helper Extraction Functions -----------------

function extractFromCategory(dictionary: string[], text: string): string[] {
  const matched = new Set<string>();
  for (const item of dictionary) {
    // Escaped regex with boundary check
    const escaped = item.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9+#.])${escaped}(?:$|[^a-zA-Z0-9+#.])`, 'i');
    if (regex.test(text)) {
      matched.add(item);
    }
  }
  return Array.from(matched);
}

function extractEmail(text: string): string {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const match = text.match(emailRegex);
  return match ? match[1] : '';
}

function extractPhone(text: string): string {
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

function extractCandidateName(lines: string[], rawText: string, fileName: string): string {
  // First non-empty line usually has candidate's name in resumes
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      !line.toLowerCase().includes('page') &&
      !line.includes('@') &&
      !/\d/.test(line)
    ) {
      return line;
    }
  }

  // Fallback: extract from file name (e.g., "John_Doe_Resume.pdf" -> "John Doe")
  const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]resume/i, '').replace(/[-_]/g, ' ');
  if (baseName && baseName.length > 2) {
    return baseName
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return 'Candidate Profile';
}

function extractEducation(rawText: string, lines: string[]): string[] {
  const results: string[] = [];

  // Degree matches
  for (const pattern of DEGREE_PATTERNS) {
    const match = rawText.match(pattern);
    if (match) {
      results.push(match[0].trim());
    }
  }

  // Look around "Education" section
  const eduIndex = lines.findIndex(l => /^(?:education|academics|qualifications)/i.test(l));
  if (eduIndex !== -1) {
    for (let i = eduIndex + 1; i < Math.min(lines.length, eduIndex + 5); i++) {
      const line = lines[i];
      if (/^(?:experience|skills|projects|certifications)/i.test(line)) break;
      if (line.length > 5 && !results.some(r => r.toLowerCase() === line.toLowerCase())) {
        results.push(line);
      }
    }
  }

  if (results.length === 0) {
    results.push('B.Sc in Computer Science / Equivalent');
  }

  return Array.from(new Set(results)).slice(0, 3);
}

function estimateExperienceYears(text: string): number {
  // Regex for "X years of experience"
  const expMatch = text.match(/(\d+)\+?\s*(?:to\s*\d+\s*)?years?(?:\s+of)?\s+experience/i);
  if (expMatch) {
    return parseInt(expMatch[1], 10);
  }

  // Regex for year ranges like "2019 - 2023" or "2021 - Present"
  const yearRanges = text.match(/\b(20\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)\b/gi);
  if (yearRanges && yearRanges.length > 0) {
    const currentYear = new Date().getFullYear();
    let maxDiff = 0;
    for (const range of yearRanges) {
      const parts = range.split(/(?:-|–|to)/i).map(s => s.trim());
      const start = parseInt(parts[0], 10);
      const end = /present|current/i.test(parts[1]) ? currentYear : parseInt(parts[1], 10);
      if (!isNaN(start) && !isNaN(end) && end >= start) {
        maxDiff = Math.max(maxDiff, end - start);
      }
    }
    if (maxDiff > 0) return Math.min(maxDiff, 20);
  }

  return 1; // Default entry-level 1 year / fresher
}

function extractCertifications(rawText: string, lines: string[]): string[] {
  const certifications: string[] = [];
  const certKeywords = [
    'AWS Certified Solutions Architect', 'AWS Certified Developer', 'Google Cloud Certified',
    'Azure Fundamentals', 'Certified Scrum Master', 'Oracle Certified Professional',
    'Meta Certified Front-End Developer', 'IBM Data Science', 'DeepLearning.AI',
    'HackerRank Certified', 'CompTIA Security+'
  ];

  for (const cert of certKeywords) {
    if (new RegExp(cert, 'i').test(rawText)) {
      certifications.push(cert);
    }
  }

  // General cert lines
  const certHeaderIdx = lines.findIndex(l => /^(?:certifications|licenses)/i.test(l));
  if (certHeaderIdx !== -1) {
    for (let i = certHeaderIdx + 1; i < Math.min(lines.length, certHeaderIdx + 4); i++) {
      if (/^(?:skills|education|projects)/i.test(lines[i])) break;
      if (lines[i].length > 4) {
        certifications.push(lines[i]);
      }
    }
  }

  return Array.from(new Set(certifications)).slice(0, 4);
}

function inferTargetRoles(skills: string[]): string[] {
  const s = skills.map(x => x.toLowerCase());
  const roles: string[] = [];

  const hasFrontend = s.includes('react') || s.includes('javascript') || s.includes('vue') || s.includes('angular') || s.includes('html');
  const hasBackend = s.includes('python') || s.includes('node.js') || s.includes('java') || s.includes('django') || s.includes('sql') || s.includes('express');
  const hasData = s.includes('python') && (s.includes('pandas') || s.includes('machine learning') || s.includes('tensorflow') || s.includes('sql') || s.includes('data analysis'));
  const hasDevOps = s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('ci/cd') || s.includes('linux');

  if (hasFrontend && hasBackend) roles.push('Full Stack Developer');
  if (hasFrontend) roles.push('Frontend Developer');
  if (hasBackend) roles.push('Backend Software Engineer');
  if (hasData) roles.push('Data Scientist / ML Engineer');
  if (hasDevOps) roles.push('DevOps & Cloud Engineer');

  if (roles.length === 0) {
    roles.push('Associate Software Engineer', 'Junior Web Developer');
  }

  return roles.slice(0, 3);
}

function generateKeyStrengths(skills: string[], exp: number, edu: string[]): string[] {
  const strengths: string[] = [];

  if (skills.length >= 8) {
    strengths.push('Diverse technical toolkit across multiple engineering stacks');
  }
  if (skills.some(s => ['React', 'Angular', 'Vue', 'Next.js'].includes(s))) {
    strengths.push('Modern frontend architectural capabilities');
  }
  if (skills.some(s => ['Python', 'Java', 'Node.js', 'Go'].includes(s))) {
    strengths.push('Strong backend and algorithmic programming foundation');
  }
  if (skills.some(s => ['AWS', 'Docker', 'Kubernetes'].includes(s))) {
    strengths.push('Cloud infrastructure and containerization literacy');
  }
  if (exp >= 3) {
    strengths.push(`${exp}+ years demonstrated hands-on industry experience`);
  } else {
    strengths.push('High career agility and solid computer science grounding');
  }

  return strengths.slice(0, 4);
}

function calculateATSScore(skills: string[], edu: string[], exp: number, rawText: string): number {
  let score = 50; // base score

  // Skill volume
  if (skills.length >= 10) score += 20;
  else if (skills.length >= 6) score += 15;
  else if (skills.length >= 3) score += 10;

  // Contact info check
  if (/@/.test(rawText)) score += 5;
  if (/\d{3}/.test(rawText)) score += 5;

  // Education presence
  if (edu.length > 0) score += 10;

  // Experience
  if (exp >= 2) score += 10;
  else if (exp >= 1) score += 5;

  return Math.min(96, Math.max(45, score));
}

function generateSummary(name: string, exp: number, skills: string[], edu: string[]): string {
  const topSkills = skills.slice(0, 4).join(', ');
  const degree = edu[0] || 'Computer Science degree';
  return `${name} is a results-driven technologist with ${exp > 0 ? exp + '+ years of experience' : 'a solid foundation'} in software engineering. Core proficiencies include ${topSkills || 'modern software development'}. Holds credentials in ${degree} with an aptitude for rapid adaptation and problem solving.`;
}
