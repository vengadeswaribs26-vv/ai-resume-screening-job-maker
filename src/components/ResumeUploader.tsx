import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileCode,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { extractTextFromFile } from '../utils/textExtractor';
import { analyzeResumeWithAI } from '../services/aiService';
import { storageService } from '../services/storageService';
import { SAMPLE_RESUMES, PreloadedSampleResume } from '../data/sampleResumes';
import { Resume, ResumeAnalysis } from '../types';

interface ResumeUploaderProps {
  candidateId: string;
  onAnalysisComplete?: (analysis: ResumeAnalysis) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  candidateId,
  onAnalysisComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    fileName: string;
    wordCount: number;
    atsScore: number;
    skillsCount: number;
  } | null>(null);
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [extractedRawText, setExtractedRawText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessText = async (text: string, fileName: string, fileType: string, fileSize: number) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessInfo(null);
    setExtractedRawText(text);

    try {
      setProgressStep('Extracting document text & metadata...');
      await new Promise(r => setTimeout(r, 400));

      setProgressStep('Applying NLP tokenization & skill taxonomy matching...');
      await new Promise(r => setTimeout(r, 450));

      setProgressStep('Evaluating ATS scoring & candidate qualification fit...');
      const { analysis, aiUsed } = await analyzeResumeWithAI(text, fileName);

      analysis.candidateId = candidateId;

      // Save resume record
      const resumeRecord: Resume = {
        id: 'res_' + Date.now(),
        candidateId,
        fileName,
        fileType,
        fileSize,
        uploadDate: new Date().toISOString(),
        rawText: text,
      };
      analysis.resumeId = resumeRecord.id;

      storageService.saveResume(resumeRecord);
      storageService.saveAnalysis(analysis);

      setSuccessInfo({
        fileName,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        atsScore: analysis.atsScore,
        skillsCount: analysis.extractedSkills.length,
      });

      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgressStep('');
    }
  };

  const handleFileUpload = async (file: File) => {
    setErrorMessage(null);
    const validExtensions = ['pdf', 'docx', 'txt', 'md'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setErrorMessage(`Unsupported file format (eslintrc.${ext}). Please upload a PDF, DOCX, or TXT file.`);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setIsProcessing(true);
    setProgressStep(`Reading ${file.name}...`);

    try {
      const extraction = await extractTextFromFile(file);
      await handleProcessText(extraction.text, file.name, extraction.fileType, extraction.fileSize);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'Error extracting text from file.');
    }
  };

  const handleSelectSample = async (sample: PreloadedSampleResume) => {
    await handleProcessText(sample.rawText, sample.fileName, 'application/pdf', 150000);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      {/* Title & Description */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-blue-600" />
          <span>Upload Candidate Resume</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload your resume in <span className="font-semibold text-slate-700">PDF, DOCX, or TXT</span> format. Our AI & NLP engine will extract skills, education, experience, and match available jobs automatically.
        </p>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
        } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-blue-100/70 text-blue-600 rounded-2xl">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Click to browse or drag and drop your resume here
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF (.pdf), Microsoft Word (.docx), Plain Text (.txt) up to 10MB
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
          >
            Select Resume File
          </button>
        </div>
      </div>

      {/* Loading & Processing Status */}
      {isProcessing && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-pulse">
          <div className="flex items-center space-x-2 text-blue-700 font-semibold text-sm">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>AI Resume Processing in Progress...</span>
          </div>
          <p className="text-xs text-blue-600">{progressStep}</p>
          <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full animate-progress" style={{ width: '85%' }}></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold text-red-800">Processing Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successInfo && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-emerald-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-bold text-emerald-900">
                  Resume Successfully Screened!
                </p>
                <p className="text-xs text-emerald-700">
                  {successInfo.fileName} • {successInfo.wordCount} words extracted
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-300">
                ATS Score: {successInfo.atsScore}%
              </span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-lg border border-blue-300">
                {successInfo.skillsCount} Skills Detected
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-1 text-xs">
            <button
              onClick={() => setShowTextPreview(!showTextPreview)}
              className="text-emerald-700 hover:text-emerald-900 underline font-medium flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showTextPreview ? 'Hide Parsed Text' : 'View Extracted Raw Text'}</span>
            </button>
          </div>

          {showTextPreview && (
            <div className="bg-white border border-emerald-200 rounded-lg p-3 text-xs font-mono text-slate-700 max-h-48 overflow-y-auto whitespace-pre-wrap">
              {extractedRawText}
            </div>
          )}
        </div>
      )}

      {/* 1-Click Sample Resumes for instant testing */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Instant Testing: 1-Click Sample Resumes
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any profile to simulate resume upload
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_RESUMES.map(sample => (
            <div
              key={sample.id}
              onClick={() => !isProcessing && handleSelectSample(sample)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition text-left group bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {sample.candidateName}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    {sample.experienceYears}y exp
                  </span>
                </div>
                <p className="text-[11px] font-medium text-blue-600 mb-1">
                  {sample.role}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {sample.preview}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                <span>Load & Screen</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
