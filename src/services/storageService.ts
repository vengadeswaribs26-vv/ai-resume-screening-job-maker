import {
  Candidate,
  Job,
  JobApplication,
  JobMatch,
  Resume,
  ResumeAnalysis,
  User,
} from '../types';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { parseResumeWithNLP, calculateJobMatch } from '../utils/nlpEngine';

const STORAGE_KEYS = {
  USERS: 'ai_resume_users_v2',
  CANDIDATES: 'ai_resume_candidates_v2',
  RESUMES: 'ai_resume_resumes_v2',
  JOBS: 'ai_resume_jobs_v2',
  ANALYSES: 'ai_resume_analyses_v2',
  APPLICATIONS: 'ai_resume_applications_v2',
  CURRENT_USER: 'ai_resume_current_user_v2',
};

// Default seed jobs representing top IT roles
const DEFAULT_JOBS: Job[] = [
  {
    id: 'job_1',
    title: 'Full Stack Software Engineer',
    company: 'TechCorp Innovations',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST API', 'Git'],
    preferredSkills: ['Docker', 'AWS', 'Tailwind CSS'],
    qualification: 'B.Sc / B.Tech in Computer Science or equivalent',
    experienceRequired: 2,
    jobDescription:
      'We are looking for a proactive Full Stack Engineer to build high-performance web applications using React, TypeScript, and Node.js microservices. You will collaborate with product designers and backend architects to deliver responsive user experiences.',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Hybrid',
    salaryRange: '$110,000 - $145,000',
    department: 'Software Engineering',
    postedDate: '2026-09-28',
    status: 'Active',
  },
  {
    id: 'job_2',
    title: 'AI & Machine Learning Engineer',
    company: 'DataPulse AI',
    requiredSkills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Scikit-Learn'],
    preferredSkills: ['PyTorch', 'NLP', 'Docker'],
    qualification: 'B.Sc / M.Sc in Data Science, Computer Science or Statistics',
    experienceRequired: 3,
    jobDescription:
      'Join our core AI research and development team. You will design, train, and deploy predictive ML models and NLP pipelines to automate business intelligence and resume evaluation workflows.',
    location: 'New York, NY (Remote)',
    type: 'Remote',
    salaryRange: '$130,000 - $165,000',
    department: 'Artificial Intelligence',
    postedDate: '2026-10-01',
    status: 'Active',
  },
  {
    id: 'job_3',
    title: 'Frontend React Developer',
    company: 'CloudPeak Systems',
    requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    preferredSkills: ['Next.js', 'Redux', 'Jest'],
    qualification: 'Bachelor in Computer Science or relevant technical discipline',
    experienceRequired: 1,
    jobDescription:
      'Seeking a creative Frontend Developer proficient with React component lifecycles, state management, and modern CSS frameworks. You will build user-friendly dashboards and responsive client interfaces.',
    location: 'Austin, TX',
    type: 'Full-time',
    salaryRange: '$85,000 - $115,000',
    department: 'Frontend Engineering',
    postedDate: '2026-10-02',
    status: 'Active',
  },
  {
    id: 'job_4',
    title: 'Cloud & DevOps Engineer',
    company: 'SkyLine Networks',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Terraform'],
    preferredSkills: ['Python', 'Jenkins', 'Prometheus'],
    qualification: 'B.E / B.Tech in IT / Computer Engineering',
    experienceRequired: 3,
    jobDescription:
      'Manage multi-region AWS cloud infrastructure, configure Kubernetes container clusters, build resilient CI/CD pipelines, and guarantee high availability and automated failovers.',
    location: 'Seattle, WA (Remote)',
    type: 'Remote',
    salaryRange: '$125,000 - $155,000',
    department: 'Cloud Infrastructure',
    postedDate: '2026-09-25',
    status: 'Active',
  },
  {
    id: 'job_5',
    title: 'Backend Java Developer',
    company: 'FinTech Nexus',
    requiredSkills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Microservices', 'REST API'],
    preferredSkills: ['Docker', 'Kafka', 'Redis'],
    qualification: 'B.Sc in Computer Science or Software Engineering',
    experienceRequired: 2,
    jobDescription:
      'Design high-throughput banking transaction engines and secure microservices using Java Spring Boot. Implement relational database optimizations and maintain transaction consistency.',
    location: 'Chicago, IL (Hybrid)',
    type: 'Hybrid',
    salaryRange: '$115,000 - $140,000',
    department: 'Core Banking',
    postedDate: '2026-09-30',
    status: 'Active',
  },
  {
    id: 'job_6',
    title: 'Associate Software Developer (Entry Level)',
    company: 'NextWave Labs',
    requiredSkills: ['Python', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Git'],
    preferredSkills: ['React', 'Flask', 'Data Structures & Algorithms'],
    qualification: 'B.Sc / BCA / B.Tech in Computer Science (Fresher Welcome)',
    experienceRequired: 0,
    jobDescription:
      'Exciting opportunity for fresh computer science graduates. You will learn modern full stack web development under senior mentorship, write clean maintainable code, and contribute to internal enterprise tools.',
    location: 'Boston, MA',
    type: 'Full-time',
    salaryRange: '$70,000 - $88,000',
    department: 'Software Engineering',
    postedDate: '2026-10-04',
    status: 'Active',
  },
];

// Pre-seeded users
const DEFAULT_USERS: User[] = [
  {
    id: 'user_recruiter_1',
    email: 'recruiter@techcorp.com',
    name: 'Sarah Jenkins',
    role: 'recruiter',
    phone: '+1 (555) 234-5678',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'user_candidate_1',
    email: 'jane.doe@example.com',
    name: 'Jane Doe',
    role: 'candidate',
    phone: '+1 (555) 345-6789',
    createdAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'user_candidate_2',
    email: 'alex.chen@example.com',
    name: 'Alex Chen',
    role: 'candidate',
    phone: '+1 (555) 876-5432',
    createdAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'user_candidate_3',
    email: 'priya.patel@example.com',
    name: 'Priya Patel',
    role: 'candidate',
    phone: '+1 (555) 432-1098',
    createdAt: '2026-09-15T09:30:00Z',
  },
];

// Pre-seeded candidates
const DEFAULT_CANDIDATES: Candidate[] = [
  {
    id: 'cand_1',
    userId: 'user_candidate_1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 345-6789',
    education: 'B.Sc in Computer Science, University of Technology (2022)',
    degree: 'B.Sc in Computer Science',
    institution: 'University of Technology',
    experienceYears: 3,
    currentTitle: 'Full Stack Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Git', 'REST API'],
    bio: 'Experienced full stack developer passionate about React and scalable cloud services.',
    location: 'San Francisco, CA',
    status: 'Shortlisted',
    createdAt: '2026-09-10T10:00:00Z',
  },
  {
    id: 'cand_2',
    userId: 'user_candidate_2',
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 876-5432',
    education: 'B.Sc in Data Science & Machine Learning, Columbia University (2021)',
    degree: 'B.Sc in Data Science & Machine Learning',
    institution: 'Columbia University',
    experienceYears: 4,
    currentTitle: 'Data Scientist & ML Engineer',
    skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'Pandas', 'Scikit-Learn', 'PyTorch', 'Docker'],
    bio: 'Specialized in predictive modeling, deep learning, and NLP architectures.',
    location: 'New York, NY',
    status: 'Interview Scheduled',
    createdAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'cand_3',
    userId: 'user_candidate_3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 432-1098',
    education: 'B.Tech in Information Technology, NIT (2020)',
    degree: 'B.Tech in Information Technology',
    institution: 'National Institute of Technology',
    experienceYears: 5,
    currentTitle: 'Lead DevOps & Cloud Engineer',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python', 'Jenkins'],
    bio: 'Cloud architect focused on Kubernetes orchestration and Terraform IaC.',
    location: 'Austin, TX',
    status: 'Under Review',
    createdAt: '2026-09-15T09:30:00Z',
  },
];

// Initial seeded resumes
const DEFAULT_RESUMES: Resume[] = [
  {
    id: 'res_1',
    candidateId: 'cand_1',
    fileName: 'Jane_Doe_FullStack_Resume.pdf',
    fileType: 'application/pdf',
    fileSize: 142000,
    uploadDate: '2026-09-10T10:05:00Z',
    rawText: SAMPLE_RESUMES[0].rawText,
  },
  {
    id: 'res_2',
    candidateId: 'cand_2',
    fileName: 'Alex_Chen_DataScientist_CV.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 118000,
    uploadDate: '2026-09-12T11:05:00Z',
    rawText: SAMPLE_RESUMES[1].rawText,
  },
  {
    id: 'res_3',
    candidateId: 'cand_3',
    fileName: 'Priya_Patel_DevOps_Resume.pdf',
    fileType: 'application/pdf',
    fileSize: 156000,
    uploadDate: '2026-09-15T09:35:00Z',
    rawText: SAMPLE_RESUMES[2].rawText,
  },
];

// Initial pre-analyzed reports
const DEFAULT_ANALYSES: ResumeAnalysis[] = [
  {
    ...parseResumeWithNLP(SAMPLE_RESUMES[0].rawText, SAMPLE_RESUMES[0].fileName),
    id: 'ana_1',
    resumeId: 'res_1',
    candidateId: 'cand_1',
    candidateName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 345-6789',
  },
  {
    ...parseResumeWithNLP(SAMPLE_RESUMES[1].rawText, SAMPLE_RESUMES[1].fileName),
    id: 'ana_2',
    resumeId: 'res_2',
    candidateId: 'cand_2',
    candidateName: 'Alex Chen',
    email: 'alex.chen@example.com',
    phone: '+1 (555) 876-5432',
  },
  {
    ...parseResumeWithNLP(SAMPLE_RESUMES[2].rawText, SAMPLE_RESUMES[2].fileName),
    id: 'ana_3',
    resumeId: 'res_3',
    candidateId: 'cand_3',
    candidateName: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 432-1098',
  },
];

const DEFAULT_APPLICATIONS: JobApplication[] = [
  {
    id: 'app_1',
    candidateId: 'cand_1',
    jobId: 'job_1',
    appliedDate: '2026-09-29',
    status: 'Shortlisted',
    notes: 'Exceptional match for full-stack react position.',
  },
  {
    id: 'app_2',
    candidateId: 'cand_2',
    jobId: 'job_2',
    appliedDate: '2026-10-02',
    status: 'Interview',
    notes: 'Strong machine learning and python portfolio.',
  },
  {
    id: 'app_3',
    candidateId: 'cand_3',
    jobId: 'job_4',
    appliedDate: '2026-09-27',
    status: 'Reviewing',
    notes: 'Impressive Kubernetes and AWS certifications.',
  },
];

// In-Memory fallback store
class DataStore {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
      localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(DEFAULT_CANDIDATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESUMES)) {
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(DEFAULT_RESUMES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(DEFAULT_JOBS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYSES)) {
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(DEFAULT_ANALYSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    }
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Current User & Auth ---
  public getCurrentUser(): User {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch {}
    return DEFAULT_USERS[0];
  }

  public setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  public switchRole(role: 'recruiter' | 'candidate'): User {
    const users = this.getUsers();
    let target = users.find(u => u.role === role);
    if (!target) {
      target = role === 'recruiter' ? DEFAULT_USERS[0] : DEFAULT_USERS[1];
    }
    this.setCurrentUser(target);
    return target;
  }

  public getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: 'user_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If candidate, also create candidate profile
    if (newUser.role === 'candidate') {
      this.createCandidate({
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        education: 'B.Sc in Computer Science',
        degree: 'B.Sc',
        institution: 'University',
        experienceYears: 1,
        currentTitle: 'Software Engineer',
        skills: ['Python', 'SQL', 'JavaScript'],
        location: 'Remote',
      });
    }

    this.setCurrentUser(newUser);
    return newUser;
  }

  // --- Jobs (CRUD) ---
  public getJobs(): Job[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.JOBS);
      return data ? JSON.parse(data) : DEFAULT_JOBS;
    } catch {
      return DEFAULT_JOBS;
    }
  }

  public getJobById(id: string): Job | undefined {
    return this.getJobs().find(j => j.id === id);
  }

  public createJob(jobData: Omit<Job, 'id' | 'postedDate'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: 'job_' + Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      status: jobData.status || 'Active',
    };
    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    this.notify();
    return newJob;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    this.notify();
    return jobs[index];
  }

  public deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    if (filtered.length !== jobs.length) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(filtered));
      this.notify();
      return true;
    }
    return false;
  }

  // --- Candidates ---
  public getCandidates(): Candidate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
      return data ? JSON.parse(data) : DEFAULT_CANDIDATES;
    } catch {
      return DEFAULT_CANDIDATES;
    }
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.getCandidates().find(c => c.id === id);
  }

  public getCandidateByUserId(userId: string): Candidate | undefined {
    return this.getCandidates().find(c => c.userId === userId);
  }

  public createCandidate(candData: Omit<Candidate, 'id' | 'createdAt'>): Candidate {
    const candidates = this.getCandidates();
    const newCand: Candidate = {
      ...candData,
      id: 'cand_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Active',
    };
    candidates.push(newCand);
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    this.notify();
    return newCand;
  }

  public updateCandidate(id: string, updates: Partial<Candidate>): Candidate | null {
    const candidates = this.getCandidates();
    const idx = candidates.findIndex(c => c.id === id);
    if (idx === -1) return null;
    candidates[idx] = { ...candidates[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
    this.notify();
    return candidates[idx];
  }

  // --- Resumes & Analyses ---
  public getResumes(): Resume[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      return data ? JSON.parse(data) : DEFAULT_RESUMES;
    } catch {
      return DEFAULT_RESUMES;
    }
  }

  public getResumeByCandidateId(candidateId: string): Resume | undefined {
    return this.getResumes().find(r => r.candidateId === candidateId);
  }

  public saveResume(resume: Resume): void {
    const resumes = this.getResumes();
    const existingIdx = resumes.findIndex(r => r.candidateId === resume.candidateId);
    if (existingIdx !== -1) {
      resumes[existingIdx] = resume;
    } else {
      resumes.push(resume);
    }
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    this.notify();
  }

  public getAnalyses(): ResumeAnalysis[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES);
      return data ? JSON.parse(data) : DEFAULT_ANALYSES;
    } catch {
      return DEFAULT_ANALYSES;
    }
  }

  public getAnalysisByCandidateId(candidateId: string): ResumeAnalysis | undefined {
    return this.getAnalyses().find(a => a.candidateId === candidateId);
  }

  public saveAnalysis(analysis: ResumeAnalysis): void {
    const analyses = this.getAnalyses();
    const existingIdx = analyses.findIndex(a => a.candidateId === analysis.candidateId);
    if (existingIdx !== -1) {
      analyses[existingIdx] = analysis;
    } else {
      analyses.push(analysis);
    }
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));

    // Also sync candidate's skills, title, experience from analysis
    if (analysis.candidateId) {
      this.updateCandidate(analysis.candidateId, {
        skills: analysis.extractedSkills,
        experienceYears: analysis.experienceYearsDetected,
        name: analysis.candidateName || undefined,
        currentTitle: analysis.detectedRoles[0] || undefined,
        education: analysis.education[0] || undefined,
      });
    }

    this.notify();
  }

  // --- Applications ---
  public getApplications(): JobApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : DEFAULT_APPLICATIONS;
    } catch {
      return DEFAULT_APPLICATIONS;
    }
  }

  public applyToJob(candidateId: string, jobId: string): JobApplication {
    const apps = this.getApplications();
    const existing = apps.find(a => a.candidateId === candidateId && a.jobId === jobId);
    if (existing) return existing;

    const newApp: JobApplication = {
      id: 'app_' + Date.now(),
      candidateId,
      jobId,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
    };
    apps.push(newApp);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    this.notify();
    return newApp;
  }

  public updateApplicationStatus(appId: string, status: JobApplication['status']): void {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = status;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
      this.notify();
    }
  }

  // Helper: Get candidate matches for all active jobs
  public getCandidateMatches(candidateId: string): JobMatch[] {
    const analysis = this.getAnalysisByCandidateId(candidateId);
    const jobs = this.getJobs();
    if (!analysis) {
      // Create minimal analysis from candidate skills
      const cand = this.getCandidateById(candidateId);
      if (!cand) return [];
      const dummyAnalysis: ResumeAnalysis = {
        id: 'dummy',
        resumeId: '',
        candidateId,
        candidateName: cand.name,
        extractedSkills: cand.skills,
        programmingLanguages: [],
        technicalTools: [],
        frameworks: [],
        education: [cand.education],
        certifications: [],
        experienceSummary: `${cand.experienceYears} years`,
        experienceYearsDetected: cand.experienceYears,
        detectedRoles: [cand.currentTitle],
        keyStrengths: [],
        summary: cand.bio || '',
        atsScore: 70,
        parsedAt: new Date().toISOString(),
      };
      return jobs.map(j => calculateJobMatch(dummyAnalysis, j)).sort((a, b) => b.matchScore - a.matchScore);
    }
    return jobs.map(j => calculateJobMatch(analysis, j)).sort((a, b) => b.matchScore - a.matchScore);
  }

  // Reset to factory sample data
  public resetData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(DEFAULT_CANDIDATES));
    localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(DEFAULT_RESUMES));
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(DEFAULT_JOBS));
    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(DEFAULT_ANALYSES));
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    this.notify();
  }
}

export const storageService = new DataStore();
