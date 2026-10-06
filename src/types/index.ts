export type UserRole = 'recruiter' | 'candidate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  degree: string;
  institution: string;
  graduationYear?: string;
  experienceYears: number;
  currentTitle: string;
  skills: string[];
  bio?: string;
  location: string;
  status?: 'Active' | 'Shortlisted' | 'Under Review' | 'Interview Scheduled' | 'Hired';
  createdAt: string;
}

export interface Resume {
  id: string;
  candidateId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  rawText: string;
}

export interface ResumeAnalysis {
  id: string;
  resumeId: string;
  candidateId: string;
  candidateName: string;
  email?: string;
  phone?: string;
  extractedSkills: string[];
  programmingLanguages: string[];
  technicalTools: string[];
  frameworks: string[];
  education: string[];
  certifications: string[];
  experienceSummary: string;
  experienceYearsDetected: number;
  detectedRoles: string[];
  keyStrengths: string[];
  summary: string;
  atsScore: number; // 0 - 100
  parsedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  qualification: string;
  experienceRequired: number; // in years
  jobDescription: string;
  location: string;
  type: 'Full-time' | 'Remote' | 'Hybrid' | 'Part-time';
  salaryRange: string;
  department: string;
  postedDate: string;
  status: 'Active' | 'Closed';
}

export interface JobMatch {
  jobId: string;
  job: Job;
  matchScore: number; // 0 - 100
  skillMatchPercentage: number;
  experienceMatchPercentage: number;
  qualificationMatchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchStatus: 'High Match' | 'Good Match' | 'Moderate Match' | 'Low Match';
  recommendationReason: string;
}

export interface JobApplication {
  id: string;
  candidateId: string;
  jobId: string;
  appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Reviewing' | 'Interview' | 'Rejected' | 'Offered';
  notes?: string;
}

export interface RecruiterScreeningView {
  candidate: Candidate;
  resume?: Resume;
  analysis?: ResumeAnalysis;
  bestMatchedJob?: {
    job: Job;
    score: number;
  };
  jobMatches: JobMatch[];
}
