import React, { useState, useMemo } from 'react';
import {
  User,
  FileText,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Clock,
  MapPin,
  Eye,
  SlidersHorizontal,
  BookmarkCheck,
  ChevronRight,
  Code2,
  Award,
} from 'lucide-react';
import { Candidate, Job, JobMatch, Resume, ResumeAnalysis, JobApplication } from '../types';
import { storageService } from '../services/storageService';
import { ResumeUploader } from './ResumeUploader';
import { JobCard } from './JobCard';
import { JobDetailModal } from './JobDetailModal';
import { ScreeningReportModal } from './ScreeningReportModal';

interface CandidateDashboardProps {
  candidate: Candidate;
  allJobs: Job[];
  allApplications: JobApplication[];
  analysis?: ResumeAnalysis;
  resume?: Resume;
  onOpenAcademicDocs: () => void;
}

export const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  candidate,
  allJobs,
  allApplications,
  analysis,
  resume,
  onOpenAcademicDocs,
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'analysis' | 'upload' | 'applications'>('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [minMatchScore, setMinMatchScore] = useState(0);

  // Selected job for detail modal
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedJobMatch, setSelectedJobMatch] = useState<JobMatch | undefined>(undefined);

  // Report modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Calculate job matches for this candidate
  const candidateMatches = useMemo(() => {
    return storageService.getCandidateMatches(candidate.id);
  }, [candidate.id, analysis, allJobs]);

  // Unique locations for filter
  const locations = useMemo(() => {
    const locs = new Set(allJobs.map(j => j.location.split('(')[0].trim()));
    return ['All', ...Array.from(locs)];
  }, [allJobs]);

  // Filtered job matches
  const filteredMatches = useMemo(() => {
    return candidateMatches.filter(item => {
      // Title search
      const matchesQuery =
        item.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.job.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Location filter
      const matchesLocation =
        selectedLocation === 'All' || item.job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Skill filter
      const matchesSkill =
        !selectedSkillFilter ||
        item.job.requiredSkills.some(s => s.toLowerCase().includes(selectedSkillFilter.toLowerCase()));

      // Minimum match score
      const matchesScore = item.matchScore >= minMatchScore;

      return matchesQuery && matchesLocation && matchesSkill && matchesScore;
    });
  }, [candidateMatches, searchQuery, selectedLocation, selectedSkillFilter, minMatchScore]);

  const handleApply = (job: Job) => {
    storageService.applyToJob(candidate.id, job.id);
  };

  const appliedJobIds = useMemo(() => {
    return new Set(
      allApplications.filter(a => a.candidateId === candidate.id).map(a => a.jobId)
    );
  }, [allApplications, candidate.id]);

  const topMatch = candidateMatches[0];

  return (
    <div className="space-y-6">
      {/* Candidate Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none transform skew-x-12"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold text-white border border-white/20 shrink-0">
              {candidate.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl font-extrabold">{candidate.name}</h1>
                <span className="text-xs bg-blue-500/40 text-blue-100 px-2.5 py-0.5 rounded-full font-medium border border-blue-400/30">
                  Candidate Portal
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1 flex flex-wrap items-center gap-3">
                <span>{candidate.currentTitle || 'Software Engineer'}</span>
                <span>•</span>
                <span>{candidate.email}</span>
                <span>•</span>
                <span>{candidate.location}</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {candidate.skills.slice(0, 6).map(skill => (
                  <span
                    key={skill}
                    className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-md font-medium text-white backdrop-blur-xs"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 6 && (
                  <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md text-blue-100">
                    +{candidate.skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">ATS Score</p>
              <p className="text-xl font-extrabold text-white">
                {analysis?.atsScore || 75}%
              </p>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Top Match</p>
              <p className="text-xl font-extrabold text-emerald-300">
                {topMatch ? `${topMatch.matchScore}%` : '85%'}
              </p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-wider">Applications</p>
              <p className="text-xl font-extrabold text-white">
                {appliedJobIds.size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 overflow-x-auto">
        <div className="flex space-x-2">
          {[
            { id: 'recommendations', label: 'Recommended Jobs', icon: TrendingUp, count: candidateMatches.length },
            { id: 'analysis', label: 'AI Screening Report', icon: Sparkles },
            { id: 'upload', label: 'Upload / Update Resume', icon: FileText },
            { id: 'applications', label: 'My Applications', icon: BookmarkCheck, count: appliedJobIds.size },
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

        <button
          onClick={() => analysis && setIsReportOpen(true)}
          disabled={!analysis}
          className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs disabled:opacity-50"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          <span>View Full ATS Report</span>
        </button>
      </div>

      {/* Tab 1: Recommended Jobs */}
      {activeTab === 'recommendations' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company, or required skill..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Location */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-slate-700"
                >
                  {locations.map(loc => (
                    <option key={loc} value={loc}>
                      Location: {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Match Score Slider / Threshold */}
              <div className="flex items-center space-x-2 px-2">
                <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                  Min Match: {minMatchScore}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={minMatchScore}
                  onChange={e => setMinMatchScore(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>

            {/* Quick Skill Filters */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Filter by Skill:</span>
              </span>
              {['All', 'Python', 'React', 'SQL', 'AWS', 'Docker', 'Machine Learning'].map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillFilter(skill === 'All' ? '' : skill)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                    (skill === 'All' && !selectedSkillFilter) || selectedSkillFilter === skill
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs Listing Grid */}
          {filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map(item => (
                <JobCard
                  key={item.jobId}
                  job={item.job}
                  match={item}
                  hasApplied={appliedJobIds.has(item.jobId)}
                  onViewDetails={(job, match) => {
                    setSelectedJob(job);
                    setSelectedJobMatch(match);
                  }}
                  onApply={handleApply}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 w-12 h-12 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No matching jobs found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try lowering the minimum match threshold or clearing search filters to see all available openings.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All');
                  setSelectedSkillFilter('');
                  setMinMatchScore(0);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Screening Report */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {analysis ? (
            <div className="space-y-6">
              {/* ATS Overview Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Natural Language Processing & ATS Evaluation
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    Resume Profile for {analysis.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Parsed from {resume?.fileName || 'Uploaded Resume'} • {analysis.experienceSummary}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400 font-semibold uppercase">Overall ATS Score</p>
                    <p className="text-2xl font-black text-blue-600">{analysis.atsScore}%</p>
                  </div>
                  <button
                    onClick={() => setIsReportOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                  >
                    Open Full Report
                  </button>
                </div>
              </div>

              {/* Skills Breakdown by Taxonomy */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Programming Languages */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span>Programming Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.programmingLanguages && analysis.programmingLanguages.length > 0 ? (
                      analysis.programmingLanguages.map(lang => (
                        <span
                          key={lang}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200"
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Frameworks & Libraries */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Frameworks & Libraries</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.frameworks && analysis.frameworks.length > 0 ? (
                      analysis.frameworks.map(fw => (
                        <span
                          key={fw}
                          className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200"
                        >
                          {fw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None detected</span>
                    )}
                  </div>
                </div>

                {/* Tools & Cloud */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Tools & Cloud</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.technicalTools && analysis.technicalTools.length > 0 ? (
                      analysis.technicalTools.map(tool => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200"
                        >
                          {tool}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills & Career Growth Advice */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-800">
                      Identified Missing Skills for Target High-Paying Roles
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Recommended learning roadmap to reach 95%+ match
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidateMatches.slice(0, 4).map(item => (
                    <div
                      key={item.jobId}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{item.job.title}</span>
                        <span className="text-xs font-bold text-blue-600">{item.matchScore}% Match</span>
                      </div>
                      {item.missingSkills.length > 0 ? (
                        <div className="space-y-1">
                          <p className="text-[11px] text-slate-500 font-medium">To increase match score, learn:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.missingSkills.map(s => (
                              <span
                                key={s}
                                className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium"
                              >
                                + {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>100% Skill alignment achieved for this role!</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Resume Screened Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Upload your resume or use our 1-click sample resume to run the AI screening analysis and see your match results.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Upload Resume Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Resume Uploader */}
      {activeTab === 'upload' && (
        <ResumeUploader
          candidateId={candidate.id}
          onAnalysisComplete={() => {
            setActiveTab('recommendations');
          }}
        />
      )}

      {/* Tab 4: My Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">My Job Applications</h3>
              <p className="text-xs text-slate-500">
                Track status of jobs you applied for with your screened resume
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
              {appliedJobIds.size} Active Applications
            </span>
          </div>

          {appliedJobIds.size > 0 ? (
            <div className="divide-y divide-slate-100">
              {allApplications
                .filter(a => a.candidateId === candidate.id)
                .map(app => {
                  const job = allJobs.find(j => j.id === app.jobId);
                  if (!job) return null;
                  return (
                    <div
                      key={app.id}
                      className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{job.title}</h4>
                        <p className="text-xs text-slate-500">{job.company} • {job.location}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Applied Date: {app.appliedDate}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === 'Shortlisted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Interview'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.status}
                        </span>

                        <button
                          onClick={() => {
                            const match = candidateMatches.find(m => m.jobId === job.id);
                            setSelectedJob(job);
                            setSelectedJobMatch(match);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <BookmarkCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No applications submitted yet</p>
              <p className="text-xs text-slate-500">
                Browse our recommended jobs tab and apply to roles matching your skills!
              </p>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
              >
                Explore Recommended Jobs
              </button>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        match={selectedJobMatch}
        hasApplied={selectedJob ? appliedJobIds.has(selectedJob.id) : false}
        onClose={() => {
          setSelectedJob(null);
          setSelectedJobMatch(undefined);
        }}
        onApply={handleApply}
      />

      {/* Full Screening Report Modal */}
      {analysis && (
        <ScreeningReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          analysis={analysis}
          jobMatches={candidateMatches}
        />
      )}
    </div>
  );
};
