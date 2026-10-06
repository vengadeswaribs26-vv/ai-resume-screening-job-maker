import React, { useState, useEffect } from 'react';
import { Briefcase, Building, MapPin, DollarSign, Plus, X, AlertCircle } from 'lucide-react';
import { Job } from '../types';

interface JobManagementModalProps {
  isOpen: boolean;
  jobToEdit?: Job | null;
  onClose: () => void;
  onSave: (jobData: Omit<Job, 'id' | 'postedDate'>) => void;
}

export const JobManagementModal: React.FC<JobManagementModalProps> = ({
  isOpen,
  jobToEdit,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(2);
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Job['type']>('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [department, setDepartment] = useState('Software Engineering');
  const [status, setStatus] = useState<'Active' | 'Closed'>('Active');

  const [requiredSkillsInput, setRequiredSkillsInput] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  const [preferredSkillsInput, setPreferredSkillsInput] = useState('');
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (jobToEdit) {
      setTitle(jobToEdit.title);
      setCompany(jobToEdit.company);
      setQualification(jobToEdit.qualification);
      setExperienceRequired(jobToEdit.experienceRequired);
      setJobDescription(jobToEdit.jobDescription);
      setLocation(jobToEdit.location);
      setType(jobToEdit.type);
      setSalaryRange(jobToEdit.salaryRange);
      setDepartment(jobToEdit.department);
      setStatus(jobToEdit.status);
      setRequiredSkills(jobToEdit.requiredSkills || []);
      setPreferredSkills(jobToEdit.preferredSkills || []);
    } else {
      // Defaults for new job
      setTitle('');
      setCompany('TechCorp Global');
      setQualification('B.Sc / B.Tech in Computer Science or related degree');
      setExperienceRequired(2);
      setJobDescription('');
      setLocation('San Francisco, CA (Hybrid)');
      setType('Full-time');
      setSalaryRange('$95,000 - $130,000');
      setDepartment('Engineering');
      setStatus('Active');
      setRequiredSkills(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
      setPreferredSkills(['Docker', 'AWS']);
    }
    setErrors({});
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddRequiredSkill = () => {
    const trimmed = requiredSkillsInput.trim();
    if (trimmed && !requiredSkills.includes(trimmed)) {
      setRequiredSkills([...requiredSkills, trimmed]);
      setRequiredSkillsInput('');
    }
  };

  const handleRemoveRequiredSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleAddPreferredSkill = () => {
    const trimmed = preferredSkillsInput.trim();
    if (trimmed && !preferredSkills.includes(trimmed)) {
      setPreferredSkills([...preferredSkills, trimmed]);
      setPreferredSkillsInput('');
    }
  };

  const handleRemovePreferredSkill = (skill: string) => {
    setPreferredSkills(preferredSkills.filter(s => s !== skill));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Job title is required';
    if (!company.trim()) newErrors.company = 'Company name is required';
    if (!qualification.trim()) newErrors.qualification = 'Qualification is required';
    if (!jobDescription.trim() || jobDescription.length < 20) {
      newErrors.jobDescription = 'Job description must be at least 20 characters';
    }
    if (!location.trim()) newErrors.location = 'Location is required';
    if (requiredSkills.length === 0) {
      newErrors.requiredSkills = 'Please provide at least one required skill';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      title: title.trim(),
      company: company.trim(),
      qualification: qualification.trim(),
      experienceRequired: Number(experienceRequired) || 0,
      jobDescription: jobDescription.trim(),
      location: location.trim(),
      type,
      salaryRange: salaryRange.trim(),
      department: department.trim(),
      status,
      requiredSkills,
      preferredSkills,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {jobToEdit ? 'Edit Job Posting' : 'Create New Job Listing'}
              </h2>
              <p className="text-xs text-slate-400">
                Configure job requirements for automated candidate resume matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.title && <p className="text-[11px] text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. TechCorp Solutions"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.company && <p className="text-[11px] text-red-500 mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Engineering, AI Labs"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Required (Years)
              </label>
              <input
                type="number"
                min="0"
                max="15"
                value={experienceRequired}
                onChange={e => setExperienceRequired(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA (or Remote)"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {errors.location && <p className="text-[11px] text-red-500 mt-1">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={e => setSalaryRange(e.target.value)}
                placeholder="e.g. $100,000 - $130,000"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Educational Qualification *
            </label>
            <input
              type="text"
              value={qualification}
              onChange={e => setQualification(e.target.value)}
              placeholder="e.g. B.Sc / B.Tech / BCA in Computer Science"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.qualification && (
              <p className="text-[11px] text-red-500 mt-1">{errors.qualification}</p>
            )}
          </div>

          {/* Required Skills Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (Used for AI Matching %) *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requiredSkillsInput}
                onChange={e => setRequiredSkillsInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddRequiredSkill())}
                placeholder="Type a skill and press Enter (e.g. Python, React, SQL)"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddRequiredSkill}
                className="px-3 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700"
              >
                Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {requiredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequiredSkill(skill)}
                    className="hover:text-blue-950"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {requiredSkills.length === 0 && (
                <span className="text-xs text-slate-400 italic">No skills added yet</span>
              )}
            </div>
            {errors.requiredSkills && (
              <p className="text-[11px] text-red-500 mt-1">{errors.requiredSkills}</p>
            )}
          </div>

          {/* Preferred Skills Tag Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Skills (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredSkillsInput}
                onChange={e => setPreferredSkillsInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPreferredSkill())}
                placeholder="Type optional skill and press Enter (e.g. Docker, AWS)"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPreferredSkill}
                className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {preferredSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePreferredSkill(skill)}
                    className="hover:text-slate-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {preferredSkills.length === 0 && (
                <span className="text-xs text-slate-400 italic">No preferred skills</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description *
            </label>
            <textarea
              rows={4}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Outline role responsibilities, deliverables, and team dynamics..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {errors.jobDescription && (
              <p className="text-[11px] text-red-500 mt-1">{errors.jobDescription}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-700">Listing Status:</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="Active">Active (Accepting Resumes)</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              {jobToEdit ? 'Save Changes' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
