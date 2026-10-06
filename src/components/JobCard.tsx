import React from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
} from 'lucide-react';
import { Job, JobMatch } from '../types';

interface JobCardProps {
  job: Job;
  match?: JobMatch;
  hasApplied?: boolean;
  onViewDetails: (job: Job, match?: JobMatch) => void;
  onApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  match,
  hasApplied = false,
  onViewDetails,
  onApply,
}) => {
  const matchScore = match?.matchScore ?? 0;

  // Determine badge color based on match score
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let badgeLabel = 'Match: N/A';

  if (match) {
    if (matchScore >= 80) {
      badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300';
      badgeLabel = `${matchScore}% High Match`;
    } else if (matchScore >= 60) {
      badgeClasses = 'bg-blue-50 text-blue-700 border-blue-300';
      badgeLabel = `${matchScore}% Good Match`;
    } else if (matchScore >= 40) {
      badgeClasses = 'bg-amber-50 text-amber-700 border-amber-300';
      badgeLabel = `${matchScore}% Moderate Match`;
    } else {
      badgeClasses = 'bg-rose-50 text-rose-700 border-rose-300';
      badgeLabel = `${matchScore}% Low Match`;
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between group">
      <div>
        {/* Header: Title, Company & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              {job.department || 'Technology'}
            </span>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs font-medium text-slate-600">{job.company}</p>
          </div>

          {match && (
            <div
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border shrink-0 flex items-center space-x-1 ${badgeClasses}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{badgeLabel}</span>
            </div>
          )}
        </div>

        {/* Job Meta Badges */}
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 my-3">
          <span className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{job.location}</span>
          </span>
          <span className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{job.type}</span>
          </span>
          <span className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{job.experienceRequired === 0 ? 'Fresher (0y)' : `${job.experienceRequired}+ yrs exp`}</span>
          </span>
          {job.salaryRange && (
            <span className="flex items-center space-x-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <span>{job.salaryRange}</span>
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
          {job.jobDescription}
        </p>

        {/* Skills Alignment */}
        {match ? (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-1 items-center text-[11px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Matched:</span>
              {match.matchedSkills.length > 0 ? (
                match.matchedSkills.slice(0, 4).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))
              ) : (
                <span className="text-[11px] text-slate-400 italic">No direct skill overlap</span>
              )}
              {match.matchedSkills.length > 4 && (
                <span className="text-[10px] text-emerald-700 font-semibold">
                  +{match.matchedSkills.length - 4} more
                </span>
              )}
            </div>

            {match.missingSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center text-[11px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Missing:</span>
                {match.missingSkills.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-medium flex items-center space-x-1"
                  >
                    <XCircle className="w-2.5 h-2.5 text-rose-500" />
                    <span>{skill}</span>
                  </span>
                ))}
                {match.missingSkills.length > 3 && (
                  <span className="text-[10px] text-rose-600 font-semibold">
                    +{match.missingSkills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
            {job.requiredSkills.slice(0, 4).map(skill => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(job, match)}
          className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center space-x-1 transition"
        >
          <span>View Details & Match</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {onApply && (
          hasApplied ? (
            <span className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </span>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Apply Now
            </button>
          )
        )}
      </div>
    </div>
  );
};
