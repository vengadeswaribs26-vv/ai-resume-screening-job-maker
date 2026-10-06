import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Users,
  FileCheck,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Download,
  Clock,
  Layers,
} from 'lucide-react';
import { Candidate, Job, Resume, ResumeAnalysis, JobApplication } from '../types';
import { storageService } from '../services/storageService';
import { JobManagementModal } from './JobManagementModal';
import { ScreeningReportModal } from './ScreeningReportModal';
import { calculateJobMatch } from '../utils/nlpEngine';

interface RecruiterDashboardProps {
  candidates: Candidate[];
  jobs: Job[];
  resumes: Resume[];
  analyses: ResumeAnalysis[];
  applications: JobApplication[];
  onOpenAcademicDocs: () => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({
  candidates,
  jobs,
  resumes,
  analyses,
  applications,
  onOpenAcademicDocs,
}) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'matrix' | 'analytics'>('jobs');

  // Job CRUD state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null);

  // Search & Filter state
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [candidateSearchQuery, setCandidateSearchQuery] = useState('');
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState('All');

  // Matrix view selected job
  const [matrixJobId, setMatrixJobId] = useState<string>(jobs[0]?.id || '');

  // Active candidate report modal
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(null);

  // Resume text inspection modal
  const [inspectResume, setInspectResume] = useState<Resume | null>(null);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch =
        j.title.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        j.company.toLowerCase().includes(jobSearchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(jobSearchQuery.toLowerCase());
      const matchesDept =
        selectedDepartmentFilter === 'All' || j.department.toLowerCase() === selectedDepartmentFilter.toLowerCase();
      return matchesSearch && matchesDept;
    });
  }, [jobs, jobSearchQuery, selectedDepartmentFilter]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const q = candidateSearchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.currentTitle.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q))
      );
    });
  }, [candidates, candidateSearchQuery]);

  // Handlers for Jobs
  const handleCreateJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    storageService.createJob(jobData);
  };

  const handleUpdateJob = (jobData: Omit<Job, 'id' | 'postedDate'>) => {
    if (jobToEdit) {
      storageService.updateJob(jobToEdit.id, jobData);
      setJobToEdit(null);
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting? Candidates will no longer be matched with it.')) {
      storageService.deleteJob(jobId);
    }
  };

  const handleCandidateStatusChange = (candidateId: string, status: Candidate['status']) => {
    storageService.updateCandidate(candidateId, { status });
  };

  // Matrix calculations for selected job
  const selectedMatrixJob = jobs.find(j => j.id === matrixJobId) || jobs[0];

  const matrixRankings = useMemo(() => {
    if (!selectedMatrixJob) return [];

    return candidates.map(cand => {
      const analysis = analyses.find(a => a.candidateId === cand.id);
      const resume = resumes.find(r => r.candidateId === cand.id);

      const targetAnalysis: ResumeAnalysis = analysis || {
        id: 'temp',
        resumeId: '',
        candidateId: cand.id,
        candidateName: cand.name,
        extractedSkills: cand.skills,
        programmingLanguages: [],
        technicalTools: [],
        frameworks: [],
        education: [cand.education],
        certifications: [],
        experienceSummary: `${cand.experienceYears}y`,
        experienceYearsDetected: cand.experienceYears,
        detectedRoles: [cand.currentTitle],
        keyStrengths: [],
        summary: cand.bio || '',
        atsScore: 70,
        parsedAt: new Date().toISOString(),
      };

      const match = calculateJobMatch(targetAnalysis, selectedMatrixJob);
      return {
        candidate: cand,
        analysis: targetAnalysis,
        resume,
        match,
      };
    }).sort((a, b) => b.match.matchScore - a.match.matchScore);
  }, [selectedMatrixJob, candidates, analyses, resumes]);

  return (
    <div className="space-y-6">
      {/* Recruiter Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-blue-500/30 text-blue-300 px-2.5 py-0.5 rounded-full font-medium border border-blue-400/30">
              Recruiter & Admin Portal
            </span>
          </div>
          <h1 className="text-2xl font-black mt-1">Talent Acquisition & AI Screening Control</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Automated resume parsing, skill extraction, candidate ranking, and multi-factor job fitment analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              setJobToEdit(null);
              setIsJobModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Job Openings</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{jobs.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {new Set(jobs.map(j => j.department)).size} departments</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Candidates in Talent Pool</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{candidates.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">With parsed resumes & profiles</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Resumes Screened (ATS)</span>
            <FileCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">{resumes.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">100% Text & NLP extracted</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Candidate Match</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-2">78.4%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Based on skill & experience fit</p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto">
        <div className="flex space-x-2">
          {[
            { id: 'jobs', label: 'Job Postings (CRUD)', icon: Briefcase, count: jobs.length },
            { id: 'candidates', label: 'Candidate Profiles & Resumes', icon: Users, count: candidates.length },
            { id: 'matrix', label: 'Candidate-Job Match Matrix', icon: Layers },
            { id: 'analytics', label: 'Screening Analytics', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Job Postings Management (CRUD) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Search & Actions Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={jobSearchQuery}
                onChange={e => setJobSearchQuery(e.target.value)}
                placeholder="Search jobs by title or company..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <select
                value={selectedDepartmentFilter}
                onChange={e => setSelectedDepartmentFilter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="All">All Departments</option>
                {Array.from(new Set(jobs.map(j => j.department))).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <button
                onClick={() => {
                  setJobToEdit(null);
                  setIsJobModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 whitespace-nowrap shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Job</span>
              </button>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Job Title & Company</th>
                    <th className="py-3 px-4">Required Skills</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{job.title}</div>
                        <div className="text-[11px] text-slate-500">{job.company} • {job.department}</div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {job.requiredSkills.slice(0, 3).map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-medium border border-blue-200">
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <span className="text-[10px] text-slate-500">+{job.requiredSkills.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired}+ Yrs`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{job.location}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              setJobToEdit(job);
                              setIsJobModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Candidate Profiles & Resumes */}
      {activeTab === 'candidates' && (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={candidateSearchQuery}
                onChange={e => setCandidateSearchQuery(e.target.value)}
                placeholder="Search candidate name, title, or skills..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing {filteredCandidates.length} Candidates
            </span>
          </div>

          {/* Candidates Grid / Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Candidate Profile</th>
                    <th className="py-3 px-4">Education & Degree</th>
                    <th className="py-3 px-4">Extracted Technical Skills</th>
                    <th className="py-3 px-4">ATS Fitment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Screening Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map(cand => {
                    const analysis = analyses.find(a => a.candidateId === cand.id);
                    const resume = resumes.find(r => r.candidateId === cand.id);

                    return (
                      <tr key={cand.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{cand.name}</div>
                          <div className="text-[11px] text-blue-600 font-medium">{cand.currentTitle}</div>
                          <div className="text-[11px] text-slate-400">{cand.email} • {cand.location}</div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-xs text-slate-700 font-medium truncate" title={cand.education}>
                            {cand.education}
                          </p>
                          <p className="text-[11px] text-slate-500">{cand.experienceYears} Years Exp</p>
                        </td>
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="flex flex-wrap gap-1">
                            {cand.skills.slice(0, 4).map(skill => (
                              <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                                {skill}
                              </span>
                            ))}
                            {cand.skills.length > 4 && (
                              <span className="text-[10px] text-blue-600 font-semibold">
                                +{cand.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                            {analysis?.atsScore || 75}% ATS
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={cand.status || 'Active'}
                            onChange={e => handleCandidateStatusChange(cand.id, e.target.value as any)}
                            className="px-2 py-1 text-xs border border-slate-300 rounded-lg bg-white font-medium text-slate-700"
                          >
                            <option value="Active">Active</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview Scheduled">Interview</option>
                            <option value="Hired">Hired</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {resume && (
                              <button
                                onClick={() => setInspectResume(resume)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                                title="View Raw Resume Text"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Resume</span>
                              </button>
                            )}

                            {analysis && (
                              <button
                                onClick={() => setActiveAnalysis(analysis)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-xs"
                                title="View Full AI Screening Report"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Report</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Candidate-Job Match Matrix */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Job Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Candidate Fitment Ranking Matrix</h3>
              <p className="text-xs text-slate-500">
                Compare and rank all candidates against a specific job opening in real time.
              </p>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">Select Target Job:</span>
              <select
                value={matrixJobId}
                onChange={e => setMatrixJobId(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Job Info Card */}
          {selectedMatrixJob && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Target Job Requirements
                </span>
                <h4 className="text-base font-bold text-slate-800">{selectedMatrixJob.title}</h4>
                <p className="text-xs text-slate-600">
                  {selectedMatrixJob.company} • Required Exp: {selectedMatrixJob.experienceRequired} years • {selectedMatrixJob.qualification}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 max-w-md">
                {selectedMatrixJob.requiredSkills.map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Matrix Rankings List */}
          <div className="space-y-3">
            {matrixRankings.map((item, index) => (
              <div
                key={item.candidate.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-base shrink-0">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-800">{item.candidate.name}</h4>
                      <span className="text-[11px] text-blue-600 font-semibold">{item.candidate.currentTitle}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {item.candidate.education} • {item.candidate.experienceYears}y exp
                    </p>

                    {/* Matched & Missing Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {item.match.matchedSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-medium flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{s}</span>
                        </span>
                      ))}
                      {item.match.missingSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-medium flex items-center space-x-1">
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Match Score</p>
                    <span
                      className={`text-xl font-black ${
                        item.match.matchScore >= 80
                          ? 'text-emerald-600'
                          : item.match.matchScore >= 60
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {item.match.matchScore}%
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveAnalysis(item.analysis)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => handleCandidateStatusChange(item.candidate.id, 'Shortlisted')}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      Shortlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Screening Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Most In-Demand Skills Across Job Postings</h3>
            <div className="space-y-3">
              {[
                { name: 'Python', count: 4, pct: 85 },
                { name: 'React', count: 3, pct: 70 },
                { name: 'SQL', count: 4, pct: 85 },
                { name: 'TypeScript', count: 2, pct: 55 },
                { name: 'Docker & AWS', count: 3, pct: 70 },
              ].map(skill => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{skill.name}</span>
                    <span className="text-slate-500">{skill.count} Jobs ({skill.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${skill.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Applicant Pool Match Distribution</h3>
            <div className="space-y-3">
              {[
                { range: 'High Match (80% - 100%)', count: 5, pct: 45, color: 'bg-emerald-500' },
                { range: 'Good Match (60% - 79%)', count: 4, pct: 35, color: 'bg-blue-500' },
                { range: 'Moderate Fit (40% - 59%)', count: 2, pct: 15, color: 'bg-amber-500' },
                { range: 'Low Alignment (<40%)', count: 1, pct: 5, color: 'bg-rose-500' },
              ].map(row => (
                <div key={row.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">{row.range}</span>
                    <span className="text-slate-500">{row.count} Candidates</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${row.color} h-2 rounded-full`} style={{ width: `${row.pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Management Modal (Add/Edit) */}
      <JobManagementModal
        isOpen={isJobModalOpen}
        jobToEdit={jobToEdit}
        onClose={() => {
          setIsJobModalOpen(false);
          setJobToEdit(null);
        }}
        onSave={jobToEdit ? handleUpdateJob : handleCreateJob}
      />

      {/* Screening Report Modal */}
      {activeAnalysis && (
        <ScreeningReportModal
          isOpen={true}
          onClose={() => setActiveAnalysis(null)}
          analysis={activeAnalysis}
          jobMatches={storageService.getCandidateMatches(activeAnalysis.candidateId)}
        />
      )}

      {/* Inspect Raw Resume Text Modal */}
      {inspectResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{inspectResume.fileName}</h3>
                <p className="text-[11px] text-slate-400">Uploaded {new Date(inspectResume.uploadDate).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setInspectResume(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto font-mono text-xs text-slate-700 bg-slate-50 whitespace-pre-wrap leading-relaxed">
              {inspectResume.rawText}
            </div>
            <div className="p-3 bg-slate-100 border-t border-slate-200 text-right">
              <button
                onClick={() => setInspectResume(null)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
