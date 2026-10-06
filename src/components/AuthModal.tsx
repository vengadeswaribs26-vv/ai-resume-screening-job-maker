import React, { useState } from 'react';
import { User as UserIcon, Lock, Mail, Phone, Briefcase, GraduationCap, X, Check, ShieldCheck } from 'lucide-react';
import { User, UserRole } from '../types';
import { storageService } from '../services/storageService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('candidate');

  // Login form
  const [loginEmail, setLoginEmail] = useState('jane.doe@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEducation, setRegEducation] = useState('B.Sc in Computer Science');
  const [regCurrentTitle, setRegCurrentTitle] = useState('Junior Software Engineer');
  const [regSkills, setRegSkills] = useState('Python, SQL, HTML, CSS, JavaScript');

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (email: string) => {
    const users = storageService.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      storageService.setCurrentUser(user);
      onLoginSuccess(user);
      onClose();
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const users = storageService.getUsers();
    let user = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());

    if (!user) {
      // Auto-create user for demo convenience
      user = storageService.createUser({
        email: loginEmail,
        name: loginEmail.split('@')[0],
        role,
      });
    }

    storageService.setCurrentUser(user);
    onLoginSuccess(user);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!regName.trim() || !regEmail.trim()) {
      setError('Please provide your name and email');
      return;
    }

    const newUser = storageService.createUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      role,
    });

    if (role === 'candidate') {
      const skillsArray = regSkills.split(',').map(s => s.trim()).filter(Boolean);
      const cand = storageService.getCandidateByUserId(newUser.id);
      if (cand) {
        storageService.updateCandidate(cand.id, {
          education: regEducation,
          currentTitle: regCurrentTitle,
          skills: skillsArray,
        });
      }
    }

    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Authentication Portal</h3>
              <p className="text-xs text-slate-400">Sign in as Recruiter or Candidate</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Profile Switcher */}
        <div className="p-4 bg-blue-50/70 border-b border-blue-100">
          <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2">
            1-Click Instant Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('recruiter@techcorp.com')}
              className="p-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-lg text-left text-xs transition"
            >
              <span className="font-bold text-slate-800 block">Sarah Jenkins</span>
              <span className="text-[10px] text-blue-600 font-medium">Recruiter / Admin</span>
            </button>
            <button
              onClick={() => handleQuickLogin('jane.doe@example.com')}
              className="p-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-lg text-left text-xs transition"
            >
              <span className="font-bold text-slate-800 block">Jane Doe</span>
              <span className="text-[10px] text-blue-600 font-medium">Full Stack Candidate</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              tab === 'login'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              tab === 'register'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800 bg-slate-50'
            }`}
          >
            Register New Account
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('candidate')}
                className={`py-2 text-xs font-bold rounded-lg border text-center transition ${
                  role === 'candidate'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Job Candidate
              </button>
              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2 text-xs font-bold rounded-lg border text-center transition ${
                  role === 'recruiter'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Recruiter / Admin
              </button>
            </div>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition mt-2"
              >
                Log In to Dashboard
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {role === 'candidate' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Education / Degree</label>
                    <input
                      type="text"
                      value={regEducation}
                      onChange={e => setRegEducation(e.target.value)}
                      placeholder="e.g. B.Sc in Computer Science"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={regSkills}
                      onChange={e => setRegSkills(e.target.value)}
                      placeholder="e.g. Python, SQL, React, Docker"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition mt-2"
              >
                Create Account & Enter
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
