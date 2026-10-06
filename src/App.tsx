import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CandidateDashboard } from './components/CandidateDashboard';
import { RecruiterDashboard } from './components/RecruiterDashboard';
import { AcademicDocsModal } from './components/AcademicDocsModal';
import { AuthModal } from './components/AuthModal';
import { storageService } from './services/storageService';
import { Candidate, Job, JobApplication, Resume, ResumeAnalysis, User } from './types';
import { Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  const [candidates, setCandidates] = useState<Candidate[]>(storageService.getCandidates());
  const [jobs, setJobs] = useState<Job[]>(storageService.getJobs());
  const [resumes, setResumes] = useState<Resume[]>(storageService.getResumes());
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>(storageService.getAnalyses());
  const [applications, setApplications] = useState<JobApplication[]>(storageService.getApplications());

  // Modals
  const [isAcademicDocsOpen, setIsAcademicDocsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setCurrentUser(storageService.getCurrentUser());
      setCandidates(storageService.getCandidates());
      setJobs(storageService.getJobs());
      setResumes(storageService.getResumes());
      setAnalyses(storageService.getAnalyses());
      setApplications(storageService.getApplications());
    });
    return unsubscribe;
  }, []);

  const handleRoleSwitch = (newRole: 'recruiter' | 'candidate') => {
    const updatedUser = storageService.switchRole(newRole);
    setCurrentUser(updatedUser);
  };

  const handleResetData = () => {
    if (confirm('Reset application to sample data (sample candidates, jobs, and resumes)?')) {
      storageService.resetData();
      alert('Sample data has been restored!');
    }
  };

  // Find active candidate for Candidate Dashboard
  const activeCandidate: Candidate = React.useMemo(() => {
    if (currentUser.role === 'candidate') {
      const found = candidates.find(c => c.userId === currentUser.id || c.email === currentUser.email);
      if (found) return found;
    }
    // Default to first candidate
    return candidates[0] || {
      id: 'cand_default',
      userId: currentUser.id,
      name: currentUser.name || 'Candidate',
      email: currentUser.email || 'candidate@example.com',
      phone: '+1 (555) 000-0000',
      education: 'B.Sc in Computer Science',
      degree: 'B.Sc',
      institution: 'University',
      experienceYears: 2,
      currentTitle: 'Software Engineer',
      skills: ['Python', 'SQL', 'JavaScript', 'React'],
      location: 'San Francisco, CA',
      createdAt: new Date().toISOString(),
    };
  }, [currentUser, candidates]);

  const activeAnalysis = analyses.find(a => a.candidateId === activeCandidate.id);
  const activeResume = resumes.find(r => r.candidateId === activeCandidate.id);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-[11px] py-1.5 px-4 text-center font-medium flex items-center justify-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
        <span>
          AI-Based Resume Screening and Job Recommendation System • Full End-to-End Functional Mini Project
        </span>
        <button
          onClick={() => setIsAcademicDocsOpen(true)}
          className="underline font-bold text-blue-200 hover:text-white ml-2"
        >
          View BSc Project Source & Documentation
        </button>
      </div>

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onOpenAcademicDocs={() => setIsAcademicDocsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentUser.role === 'recruiter' ? (
          <RecruiterDashboard
            candidates={candidates}
            jobs={jobs}
            resumes={resumes}
            analyses={analyses}
            applications={applications}
            onOpenAcademicDocs={() => setIsAcademicDocsOpen(true)}
          />
        ) : (
          <CandidateDashboard
            candidate={activeCandidate}
            allJobs={jobs}
            allApplications={applications}
            analysis={activeAnalysis}
            resume={activeResume}
            onOpenAcademicDocs={() => setIsAcademicDocsOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-700">
              AI-Based Resume Screening & Job Recommendation System
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Developed for BSc Computer Science / IT Mini Project • Automated PDF/DOCX Parsing, NLP & Multi-Factor Fitment
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAcademicDocsOpen(true)}
              className="text-blue-600 hover:underline font-semibold flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Documentation & Code</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">8 Relational DB Tables</span>
            <span>•</span>
            <span className="text-slate-400">Gemini & NLP Engine</span>
          </div>
        </div>
      </footer>

      {/* Academic Docs & Source Code Modal */}
      <AcademicDocsModal
        isOpen={isAcademicDocsOpen}
        onClose={() => setIsAcademicDocsOpen(false)}
      />

      {/* Authentication & User Switch Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={user => setCurrentUser(user)}
      />
    </div>
  );
}
