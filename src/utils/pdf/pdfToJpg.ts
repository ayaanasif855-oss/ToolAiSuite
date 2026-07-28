import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';

export interface PdfToJpgResult {
  fileName: string;
  blob: Blob;
  dataUrl: string;
  pageNumber: number;
}

export async function pdfToJpg(
  file: File,
  qualityScale: number = 2.0, // High DPI render
  onProgress?: (progress: number, message: string) => void
): Promise<PdfToJpgResult[]> {
  onProgress?.(10, 'Loading PDF document...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const results: PdfToJpgResult[] = [];
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  for (let i = 1; i <= numPages; i++) {
    const progress = 10 + Math.round((i / numPages) * 85);
    onProgress?.(progress, `Rendering page ${i} of ${numPages} as high quality image...`);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: qualityScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas 2D context not available');

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = `${baseName}_page_${i}.jpg`;

    results.push({
      fileName,
      blob,
      dataUrl,
      pageNumber: i
    });
  }

  onProgress?.(100, 'All pages converted to JPG images!');
  return results;
}
