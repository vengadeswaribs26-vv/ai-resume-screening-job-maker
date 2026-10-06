import React from 'react';
import {
  FileCheck,
  Award,
  GraduationCap,
  Briefcase,
  Code,
  Wrench,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  X,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { JobMatch, ResumeAnalysis } from '../types';

interface ScreeningReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ResumeAnalysis;
  jobMatches?: JobMatch[];
}

export const ScreeningReportModal: React.FC<ScreeningReportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  jobMatches = [],
}) => {
  if (!isOpen || !analysis) return null;

  const topJob = jobMatches[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-950 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <FileCheck className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">AI Resume Screening & Fitment Report</h2>
                <span className="text-[11px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-medium border border-blue-400/20">
                  ATS Verified
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-0.5">
                Evaluated for {analysis.candidateName} • Generated on {new Date(analysis.parsedAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center space-x-1"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 print:bg-white print:p-0">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ATS Score */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex items-center space-x-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#e2e8f0"
                    strokeWidth="5"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#2563eb"
                    strokeWidth="5"
                    strokeDasharray="163.3"
                    strokeDashoffset={163.3 - (163.3 * analysis.atsScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-slate-800">
                  {analysis.atsScore}%
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">ATS Match Score</p>
                <p className="text-sm font-bold text-slate-800">
                  {analysis.atsScore >= 80 ? 'Highly Qualified' : analysis.atsScore >= 60 ? 'Competitive Fit' : 'Requires Enhancement'}
                </p>
                <p className="text-[11px] text-slate-400">Based on keyword density & formatting</p>
              </div>
            </div>

            {/* Experience & Roles */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Detected Experience</span>
              </div>
              <p className="text-lg font-bold text-slate-800">
                {analysis.experienceYearsDetected > 0
                  ? `${analysis.experienceYearsDetected}+ Years Experience`
                  : 'Fresher / Entry-Level'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                Role: {analysis.detectedRoles?.join(', ') || 'Software Engineer'}
              </p>
            </div>

            {/* Highest Job Match */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-1">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Top Recommended Match</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-emerald-600">
                  {topJob ? `${topJob.matchScore}%` : 'N/A'}
                </span>
                <span className="text-xs font-medium text-slate-600 truncate">
                  {topJob?.job?.title || 'Calculating...'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {topJob?.job?.company || 'Explore available roles'}
              </p>
            </div>
          </div>

          {/* Candidate Profile Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Executive Summary</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {analysis.summary}
            </p>

            {analysis.keyStrengths && analysis.keyStrengths.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-600 mb-2">Key Candidate Strengths:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysis.keyStrengths.map((str, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Extracted Skills Categorization */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Code className="w-3.5 h-3.5 text-blue-600" />
              <span>Extracted Technical Competencies ({analysis.extractedSkills.length} Total)</span>
            </h3>

            <div className="space-y-3">
              {/* Programming Languages */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Programming Languages</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.programmingLanguages && analysis.programmingLanguages.length > 0 ? (
                    analysis.programmingLanguages.map(lang => (
                      <span
                        key={lang}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium"
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
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Frameworks & Libraries</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.frameworks && analysis.frameworks.length > 0 ? (
                    analysis.frameworks.map(fw => (
                      <span
                        key={fw}
                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-medium"
                      >
                        {fw}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">None detected</span>
                  )}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Tools, Databases & Platforms</p>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.technicalTools && analysis.technicalTools.length > 0 ? (
                    analysis.technicalTools.map(tool => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium"
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
          </div>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>Detected Education</span>
              </h3>
              <ul className="space-y-1.5">
                {analysis.education && analysis.education.length > 0 ? (
                  analysis.education.map((edu, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{edu}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No formal degree parsed</li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Certifications & Honors</span>
              </h3>
              <ul className="space-y-1.5">
                {analysis.certifications && analysis.certifications.length > 0 ? (
                  analysis.certifications.map((cert, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{cert}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No certifications listed</li>
                )}
              </ul>
            </div>
          </div>

          {/* Top Job Matches & Missing Skills Analysis */}
          {jobMatches.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Job Fitment & Skill Gap Analysis</span>
                </h3>
                <span className="text-[11px] text-slate-400">
                  Top {Math.min(3, jobMatches.length)} matching roles
                </span>
              </div>

              <div className="space-y-3">
                {jobMatches.slice(0, 3).map(match => (
                  <div
                    key={match.jobId}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{match.job.title}</p>
                        <p className="text-[11px] text-slate-500">{match.job.company} • {match.job.location}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg border ${
                            match.matchScore >= 80
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : match.matchScore >= 60
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {match.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Matched Skills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-slate-500 font-medium">Matched:</span>
                      {match.matchedSkills.map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>

                    {/* Missing Skills */}
                    {match.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-rose-600 font-medium">Missing Skills:</span>
                        {match.missingSkills.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded font-medium flex items-center space-x-1"
                          >
                            <XCircle className="w-3 h-3 text-rose-500" />
                            <span>{skill}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Report ID: {analysis.id} • AI Resume Screener & Recommendation System
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
