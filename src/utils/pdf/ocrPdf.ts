import { createWorker } from 'tesseract.js';
import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function ocrDocument(
  file: File,
  language: string = 'eng',
  onProgress?: (progress: number, message: string) => void
): Promise<{ text: string; docxBlob: Blob; txtBlob: Blob; fileName: string }> {
  onProgress?.(5, 'Initializing Tesseract.js local browser OCR engine...');

  let worker: Awaited<ReturnType<typeof createWorker>> | null = null;
  try {
    worker = await createWorker(language, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          const pct = Math.round((m.progress || 0) * 100);
          onProgress?.(20 + Math.round(pct * 0.7), `OCR Recognizer: ${pct}% completed`);
        } else if (m.status) {
          onProgress?.(15, `Tesseract Engine: ${m.status}...`);
        }
      }
    });
  } catch (err) {
    console.warn('Tesseract worker error, attempting fallback:', err);
  }

  let extractedText = '';

  if (file.type.includes('pdf')) {
    onProgress?.(15, 'Rendering PDF pages to canvas for optical recognition...');
    const arrayBuffer = await fileToArrayBuffer(file);
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      onProgress?.(20 + Math.round(((i - 1) / numPages) * 70), `Analyzing page ${i} of ${numPages}...`);
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
        if (worker) {
          const ret = await worker.recognize(canvas);
          extractedText += `\n\n--- PAGE ${i} ---\n\n` + ret.data.text;
        } else {
          // Fallback if worker fails
          const textContent = await page.getTextContent();
          const pageStr = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
          extractedText += `\n\n--- PAGE ${i} ---\n\n` + pageStr;
        }
      }
    }
  } else {
    // Image file
    onProgress?.(25, 'Processing document image...');
    if (worker) {
      const ret = await worker.recognize(file);
      extractedText = ret.data.text;
    } else {
      extractedText = 'Unable to run OCR worker on image.';
    }
  }

  if (worker) {
    await worker.terminate();
  }

  if (!extractedText.trim()) {
    extractedText = 'No text detected or extracted from the uploaded document.';
  }

  onProgress?.(95, 'Generating formatted output files (.docx & .txt)...');

  // Generate .docx
  const docxParagraphs = extractedText.split('\n').map((line) => {
    return new Paragraph({
      children: [new TextRun({ text: line, size: 24 })],
      spacing: { after: 100 }
    });
  });

  const doc = new Document({
    sections: [{ properties: {}, children: docxParagraphs }]
  });

  const docxBlob = await Packer.toBlob(doc);
  const txtBlob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  onProgress?.(100, 'OCR Processing finished!');
  return {
    text: extractedText,
    docxBlob,
    txtBlob,
    fileName: `${baseName}_ocr_extracted`
  };
}
