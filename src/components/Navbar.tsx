import React from 'react';
import {
  FileCheck2,
  Users,
  Briefcase,
  BookOpen,
  RotateCcw,
  LogIn,
  ChevronDown,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onRoleSwitch: (role: 'recruiter' | 'candidate') => void;
  onOpenAcademicDocs: () => void;
  onOpenAuth: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleSwitch,
  onOpenAcademicDocs,
  onOpenAuth,
  onResetData,
}) => {
  const isRecruiter = currentUser.role === 'recruiter';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-blue-700 to-indigo-600 rounded-xl text-white shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  ResuMatch <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  NLP Powered
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI Resume Screening & Job Recommendation System
              </p>
            </div>
          </div>

          {/* Central Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onRoleSwitch('candidate')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                !isRecruiter
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Portal</span>
            </button>
            <button
              onClick={() => onRoleSwitch('recruiter')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                isRecruiter
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Recruiter / Admin</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Academic Project Docs Button */}
            <button
              onClick={onOpenAcademicDocs}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 hover:bg-blue-100/60 rounded-xl text-xs font-bold transition shadow-2xs"
              title="View Complete Academic Source Code, Schema & Project Synopsis"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Project Docs & Source</span>
              <span className="sm:hidden">Docs</span>
            </button>

            {/* Quick Demo Reset */}
            <button
              onClick={onResetData}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Reset Sample Data to Defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Account / Role Switch */}
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-none">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize mt-0.5 leading-none">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Pill */}
        <div className="flex md:hidden py-2 border-t border-slate-100">
          <div className="flex w-full items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onRoleSwitch('candidate')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition ${
                !isRecruiter ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Candidate View
            </button>
            <button
              onClick={() => onRoleSwitch('recruiter')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition ${
                isRecruiter ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Recruiter View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
