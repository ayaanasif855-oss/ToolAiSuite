import { PDFDocument } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export interface SplitResultItem {
  fileName: string;
  blob: Blob;
  size: number;
  pageRange: string;
}

export async function splitPdf(
  file: File,
  mode: 'ranges' | 'all',
  customRanges: string = '1',
  onProgress?: (progress: number, message: string) => void
): Promise<SplitResultItem[]> {
  onProgress?.(10, 'Loading PDF document...');
  const fileBuffer = await fileToArrayBuffer(file);
  const srcDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
  const totalPages = srcDoc.getPageCount();

  const results: SplitResultItem[] = [];

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const progress = 10 + Math.round(((i + 1) / totalPages) * 80);
      onProgress?.(progress, `Extracting page ${i + 1} of ${totalPages}...`);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(srcDoc, [i]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const fileName = `${baseName}_page_${i + 1}.pdf`;

      results.push({
        fileName,
        blob,
        size: blob.size,
        pageRange: `Page ${i + 1}`
      });
    }
  } else {
    // Parse ranges e.g. "1-3, 5, 8-10"
    onProgress?.(20, 'Parsing page ranges...');
    const ranges = customRanges.split(',').map((r) => r.trim()).filter(Boolean);

    for (let index = 0; index < ranges.length; index++) {
      const rangeStr = ranges[index];
      const pageIndices: number[] = [];

      if (rangeStr.includes('-')) {
        const [startStr, endStr] = rangeStr.split('-');
        const start = Math.max(1, parseInt(startStr, 10) || 1);
        const end = Math.min(totalPages, parseInt(endStr, 10) || totalPages);
        for (let p = start; p <= end; p++) {
          pageIndices.push(p - 1);
        }
      } else {
        const pageNum = parseInt(rangeStr, 10);
        if (pageNum >= 1 && pageNum <= totalPages) {
          pageIndices.push(pageNum - 1);
        }
      }

      if (pageIndices.length === 0) continue;

      const progress = 20 + Math.round(((index + 1) / ranges.length) * 70);
      onProgress?.(progress, `Extracting range ${rangeStr}...`);

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const fileName = `${baseName}_range_${rangeStr}.pdf`;

      results.push({
        fileName,
        blob,
        size: blob.size,
        pageRange: `Range ${rangeStr}`
      });
    }
  }

  if (results.length === 0) {
    throw new Error('No valid pages were extracted. Please check your range values.');
  }

  onProgress?.(100, 'Split completed!');
  return results;
}
