import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Send,
  X,
  BookmarkCheck,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Job, JobMatch } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  match?: JobMatch;
  hasApplied?: boolean;
  onClose: () => void;
  onApply: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  match,
  hasApplied = false,
  onClose,
  onApply,
}) => {
  const [justApplied, setJustApplied] = useState(false);

  if (!job) return null;

  const handleApplyClick = () => {
    onApply(job);
    setJustApplied(true);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const isApplied = hasApplied || justApplied;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {job.department} • {job.type}
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{job.title}</h2>
            <div className="flex items-center space-x-2 text-xs text-slate-300 mt-1">
              <span className="font-semibold text-white">{job.company}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{job.location}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
          {/* Match Score Banner */}
          {match && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Candidate AI Fitment Analysis
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${
                    match.matchScore >= 80
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : match.matchScore >= 60
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {match.matchScore}% Overall Match
                </span>
              </div>

              {/* Multi-factor Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">Skills Compatibility</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {match.skillMatchPercentage}%
                  </p>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${match.skillMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">Experience Fit</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {match.experienceMatchPercentage}%
                  </p>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-1 rounded-full"
                      style={{ width: `${match.experienceMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">Academic Qualification</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">
                    {match.qualificationMatchPercentage}%
                  </p>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1 rounded-full"
                      style={{ width: `${match.qualificationMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                "{match.recommendationReason}"
              </p>
            </div>
          )}

          {/* Key Job Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Experience</span>
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired}+ Years`}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>Compensation</span>
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">{job.salaryRange || 'Competitive'}</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>Job Type</span>
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1">{job.type}</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                <span>Degree</span>
              </span>
              <p className="text-xs font-bold text-slate-800 mt-1 truncate" title={job.qualification}>
                {job.qualification}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Job Description & Responsibilities
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {job.jobDescription}
            </p>
          </div>

          {/* Required Skills & Gap Analysis */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Technical Competencies
            </h3>

            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">Mandatory Skills:</p>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map(skill => {
                  const isMatched = match?.matchedSkills.includes(skill);
                  return (
                    <span
                      key={skill}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 border ${
                        match
                          ? isMatched
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {match && (
                        isMatched ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-500" />
                        )
                      )}
                      <span>{skill}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {job.preferredSkills && job.preferredSkills.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-700 mb-2">Preferred / Good to Have:</p>
                <div className="flex flex-wrap gap-2">
                  {job.preferredSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>

          {isApplied ? (
            <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300">
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>Application Submitted Successfully</span>
            </div>
          ) : (
            <button
              onClick={handleApplyClick}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Application with Screened Resume</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
