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
    worker = await createWorker(language);
  } catch (err) {
    console.warn('Tesseract worker error, attempting fallback:', err);
  }

  let extractedText = '';

  if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
    onProgress?.(15, 'Rendering PDF pages for optical character recognition...');
    const arrayBuffer = await fileToArrayBuffer(file);
    const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      onProgress?.(
        15 + Math.round(((i - 1) / numPages) * 75),
        `Processing Page ${i} of ${numPages}...`
      );
      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

        if (worker) {
          try {
            const ret = await worker.recognize(canvas);
            const pageText = ret.data.text.trim();
            extractedText += (extractedText ? '\n\n' : '') + `--- Page ${i} ---\n` + (pageText || '[No text detected]');
          } catch (e) {
            console.warn(`OCR error on page ${i}:`, e);
            const textContent = await page.getTextContent();
            const pageStr = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
            extractedText += (extractedText ? '\n\n' : '') + `--- Page ${i} ---\n` + (pageStr || '[No text extracted]');
          }
        } else {
          const textContent = await page.getTextContent();
          const pageStr = textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ');
          extractedText += (extractedText ? '\n\n' : '') + `--- Page ${i} ---\n` + (pageStr || '[No text extracted]');
        }
      }
    }
  } else {
    onProgress?.(25, 'Processing document image for OCR...');
    if (worker) {
      try {
        const ret = await worker.recognize(file);
        extractedText = ret.data.text.trim();
      } catch (e) {
        extractedText = 'Unable to run OCR on this image format.';
      }
    } else {
      extractedText = 'Unable to initialize Tesseract.js worker.';
    }
  }

  if (worker) {
    try {
      await worker.terminate();
    } catch (e) {}
  }

  if (!extractedText.trim()) {
    extractedText = 'No text detected or extracted from the uploaded document.';
  }

  onProgress?.(95, 'Generating output text and document files...');

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

