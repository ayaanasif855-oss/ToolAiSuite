import { createWorker } from 'tesseract.js';
import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function ocrDocument(
  file: File,
  language: string = 'eng',
  onProgress?: (progress: number, message: string) => void
): Promise<{ text: string; pdfBlob: Blob; docxBlob: Blob; txtBlob: Blob; fileName: string }> {
  onProgress?.(5, 'Initializing Tesseract.js local browser OCR engine...');

  const worker = await createWorker(language);
  let extractedText = '';

  const outputPdf = await PDFDocument.create();
  const font = await outputPdf.embedFont(StandardFonts.Helvetica);

  if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
    onProgress?.(15, 'Reading PDF structure for OCR scanning...');
    const arrayBuffer = await fileToArrayBuffer(file);
    const srcPdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = srcPdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      onProgress?.(
        15 + Math.round(((i - 1) / numPages) * 75),
        `Scanning page ${i} of ${numPages} with OCR...`
      );

      const page = await srcPdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context not available');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport } as any).promise;

      const { data } = await worker.recognize(canvas);
      const pageText = (data?.text || '').trim();
      extractedText += (extractedText ? '\n\n' : '') + `--- Page ${i} ---\n\n` + (pageText || '[No text detected on this page]');

      // Build Searchable PDF Page
      const pdfPage = outputPdf.addPage([viewport.width / 2, viewport.height / 2]);
      const pageHeight = pdfPage.getHeight();
      const pageWidth = pdfPage.getWidth();

      // Embed high-quality image layer
      const imgDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
      const embeddedImg = await outputPdf.embedJpg(imgBytes);
      pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: pageWidth, height: pageHeight });

      // Draw invisible text layer over image for searchability
      const scaleX = pageWidth / viewport.width;
      const scaleY = pageHeight / viewport.height;

      const words = (data as any)?.words as Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> | undefined;

      if (words && words.length > 0) {
        for (const word of words) {
          if (!word.text || !word.bbox) continue;
          const wordX = word.bbox.x0 * scaleX;
          const wordY = pageHeight - word.bbox.y1 * scaleY;
          const fontSize = Math.max(6, Math.min(36, (word.bbox.y1 - word.bbox.y0) * scaleY));

          const safeText = word.text.replace(/[^\x20-\x7E]/g, ' ').trim();
          if (safeText) {
            try {
              pdfPage.drawText(safeText, {
                x: wordX,
                y: wordY,
                size: fontSize,
                font: font,
                opacity: 0 // Invisible text layer over original document
              });
            } catch (e) {
              // Ignore invalid glyph rendering errors gracefully
            }
          }
        }
      }
    }
  } else {
    onProgress?.(25, 'Scanning document image with OCR...');

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(imageBitmap, 0, 0);
    }

    const { data } = await worker.recognize(canvas);
    extractedText = (data?.text || '').trim();

    const pdfPage = outputPdf.addPage([imageBitmap.width, imageBitmap.height]);
    const pageHeight = pdfPage.getHeight();
    const pageWidth = pdfPage.getWidth();

    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
    const embeddedImg = await outputPdf.embedJpg(imgBytes);
    pdfPage.drawImage(embeddedImg, { x: 0, y: 0, width: pageWidth, height: pageHeight });

    const imgWords = (data as any)?.words as Array<{ text: string; bbox: { x0: number; y0: number; x1: number; y1: number } }> | undefined;

    if (imgWords && imgWords.length > 0) {
      for (const word of imgWords) {
        if (!word.text || !word.bbox) continue;
        const wordX = word.bbox.x0;
        const wordY = pageHeight - word.bbox.y1;
        const fontSize = Math.max(6, Math.min(36, word.bbox.y1 - word.bbox.y0));

        const safeText = word.text.replace(/[^\x20-\x7E]/g, ' ').trim();
        if (safeText) {
          try {
            pdfPage.drawText(safeText, {
              x: wordX,
              y: wordY,
              size: fontSize,
              font: font,
              opacity: 0
            });
          } catch (e) {
            // Ignore glyph errors
          }
        }
      }
    }
  }

  try {
    await worker.terminate();
  } catch (e) {
    console.warn('Error terminating Tesseract worker:', e);
  }

  if (!extractedText.trim()) {
    extractedText = 'No text detected or extracted from the uploaded document.';
  }

  onProgress?.(92, 'Packaging searchable PDF document...');
  const ocrPdfBytes = await outputPdf.save({ useObjectStreams: true });
  const pdfBlob = new Blob([ocrPdfBytes], { type: 'application/pdf' });

  onProgress?.(96, 'Generating document files (.docx & .txt)...');

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

  onProgress?.(100, 'Searchable PDF created successfully!');
  return {
    text: extractedText,
    pdfBlob,
    docxBlob,
    txtBlob,
    fileName: `${baseName}_searchable`
  };
}




