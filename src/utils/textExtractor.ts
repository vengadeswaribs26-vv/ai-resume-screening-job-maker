import mammoth from 'mammoth';

// Interface for extracted text result
export interface TextExtractionResult {
  text: string;
  wordCount: number;
  fileName: string;
  fileSize: number;
  fileType: string;
}

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

/**
 * Extracts raw text from an uploaded File (PDF, DOCX, TXT)
 */
export async function extractTextFromFile(file: File): Promise<TextExtractionResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  let extractedText = '';

  try {
    if (extension === 'pdf') {
      extractedText = await extractTextFromPdf(file);
    } else if (extension === 'docx') {
      extractedText = await extractTextFromDocx(file);
    } else if (extension === 'txt' || extension === 'md' || extension === 'json') {
      extractedText = await file.text();
    } else {
      // Try text read fallback
      try {
        extractedText = await file.text();
      } catch {
        throw new Error(`Unsupported file type: .${extension}. Please upload a PDF or DOCX file.`);
      }
    }
  } catch (err: any) {
    console.error('File extraction error:', err);
    throw new Error(err?.message || 'Failed to extract text from file');
  }

  const cleanText = cleanExtractedText(extractedText);

  if (!cleanText || cleanText.length < 20) {
    throw new Error('Extracted text is empty or too short. Please upload a valid resume file.');
  }

  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return {
    text: cleanText,
    wordCount,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || extension || 'unknown',
  };
}

/**
 * Extract text from PDF file using PDF.js
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  // Check window.pdfjsLib (from CDN in index.html)
  const pdfjs = window.pdfjsLib;

  if (pdfjs) {
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += `\n--- Page ${pageNum} ---\n` + pageText;
    }

    return fullText;
  }

  // Fallback: simple text scanner for embedded strings in PDF array buffer
  const uint8 = new Uint8Array(arrayBuffer);
  const textDecoder = new TextDecoder('latin1');
  const rawString = textDecoder.decode(uint8);

  // Extract strings between parentheses in PDF stream (BT ... ET)
  const streamMatches = rawString.match(/\(([^()]+)\)/g);
  if (streamMatches && streamMatches.length > 10) {
    return streamMatches
      .map(m => m.slice(1, -1))
      .filter(s => /[a-zA-Z0-9]/.test(s))
      .join(' ');
  }

  throw new Error('Could not parse PDF content. Please ensure the PDF is not encrypted or scanned as an image.');
}

/**
 * Extract text from DOCX file using mammoth
 */
async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Normalize and clean extracted resume text
 */
function cleanExtractedText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ') // remove unprintable control chars
    .replace(/ +/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
}
