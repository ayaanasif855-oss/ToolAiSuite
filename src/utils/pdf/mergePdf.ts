import { PDFDocument } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export async function mergePdfs(
  files: File[],
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  if (files.length < 1) {
    throw new Error('Please select at least 1 PDF file to merge.');
  }

  onProgress?.(10, 'Initializing PDF merger...');
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const currentProgress = 10 + Math.round(((i + 1) / files.length) * 80);
    onProgress?.(currentProgress, `Merging file ${i + 1} of ${files.length}: ${file.name}`);

    const fileBuffer = await fileToArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(95, 'Generating merged document...');
  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const fileName = `merged_document_${Date.now()}.pdf`;

  onProgress?.(100, 'Merge complete!');
  return { blob, fileName, size: blob.size };
}
