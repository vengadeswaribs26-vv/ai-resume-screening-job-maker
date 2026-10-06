import { GoogleGenAI } from '@google/genai';
import { ResumeAnalysis } from '../types';
import { parseResumeWithNLP } from '../utils/nlpEngine';

// Try to initialize Gemini AI client if key is available in environment
let aiClient: GoogleGenAI | null = null;
const apiKey = typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined;

try {
  if (apiKey) {
    aiClient = new GoogleGenAI({ apiKey });
  } else {
    // Check if window / import.meta has it
    // @ts-ignore
    const metaKey = import.meta?.env?.VITE_GEMINI_API_KEY;
    if (metaKey) {
      aiClient = new GoogleGenAI({ apiKey: metaKey });
    }
  }
} catch (e) {
  console.warn('Gemini client initialization deferred:', e);
}

/**
 * Analyzes resume text using Gemini AI with fallback to NLP engine
 */
export async function analyzeResumeWithAI(
  rawText: string,
  fileName: string = 'Resume.pdf'
): Promise<{ analysis: ResumeAnalysis; aiUsed: boolean }> {
  // Always compute NLP baseline first so we have guaranteed instant results
  const nlpBaseline = parseResumeWithNLP(rawText, fileName);

  if (!aiClient) {
    return { analysis: nlpBaseline, aiUsed: false };
  }

  try {
    const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze this candidate's resume text and return structured JSON matching this schema:

{
  "candidateName": "Full Name",
  "email": "candidate@example.com",
  "phone": "+1 234 567 8900",
  "extractedSkills": ["Python", "SQL", "Machine Learning", ...],
  "programmingLanguages": ["Python", "JavaScript", ...],
  "technicalTools": ["Git", "Docker", "AWS", ...],
  "frameworks": ["React", "FastAPI", "Pandas", ...],
  "education": ["B.Sc Computer Science, University of ...", ...],
  "certifications": ["AWS Certified...", ...],
  "experienceSummary": "3+ years in full stack engineering",
  "experienceYearsDetected": 3,
  "detectedRoles": ["Full Stack Developer", "Backend Engineer"],
  "keyStrengths": ["Strong architectural skills", "Proficient in cloud APIs"],
  "summary": "Professional executive summary of candidate",
  "atsScore": 85
}

Resume Text:
"""
${rawText.slice(0, 8000)}
"""

Respond ONLY with valid JSON. Do not include markdown code block markers or extra explanation.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    // Clean json markers if present
    const cleanJson = responseText
      .replace(/^```json/m, '')
      .replace(/^```/m, '')
      .trim();

    const parsed = JSON.parse(cleanJson);

    const mergedAnalysis: ResumeAnalysis = {
      id: 'analysis_ai_' + Date.now(),
      resumeId: '',
      candidateId: '',
      candidateName: parsed.candidateName || nlpBaseline.candidateName,
      email: parsed.email || nlpBaseline.email,
      phone: parsed.phone || nlpBaseline.phone,
      extractedSkills: Array.from(new Set([...(parsed.extractedSkills || []), ...nlpBaseline.extractedSkills])),
      programmingLanguages: parsed.programmingLanguages || nlpBaseline.programmingLanguages,
      technicalTools: parsed.technicalTools || nlpBaseline.technicalTools,
      frameworks: parsed.frameworks || nlpBaseline.frameworks,
      education: parsed.education || nlpBaseline.education,
      certifications: parsed.certifications || nlpBaseline.certifications,
      experienceSummary: parsed.experienceSummary || nlpBaseline.experienceSummary,
      experienceYearsDetected: Number(parsed.experienceYearsDetected) || nlpBaseline.experienceYearsDetected,
      detectedRoles: parsed.detectedRoles || nlpBaseline.detectedRoles,
      keyStrengths: parsed.keyStrengths || nlpBaseline.keyStrengths,
      summary: parsed.summary || nlpBaseline.summary,
      atsScore: Number(parsed.atsScore) || nlpBaseline.atsScore,
      parsedAt: new Date().toISOString()
    };

    return { analysis: mergedAnalysis, aiUsed: true };
  } catch (error) {
    console.warn('Gemini AI API call failed or timed out, using built-in NLP engine:', error);
    return { analysis: nlpBaseline, aiUsed: false };
  }
}
