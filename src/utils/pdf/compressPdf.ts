import { PDFDocument } from 'pdf-lib';
import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';

export type CompressionLevel = 'extreme' | 'recommended' | 'low';

export async function compressPdf(
  file: File,
  level: CompressionLevel = 'recommended',
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number; originalSize: number }> {
  onProgress?.(10, 'Reading original PDF...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const newPdf = await PDFDocument.create();

  // Settings based on compression level
  let scale = 1.0;
  let quality = 0.75;

  if (level === 'extreme') {
    scale = 0.8;
    quality = 0.5;
  } else if (level === 'recommended') {
    scale = 1.0;
    quality = 0.7;
  } else {
    scale = 1.2;
    quality = 0.85;
  }

  for (let i = 1; i <= numPages; i++) {
    const progress = 10 + Math.round((i / numPages) * 80);
    onProgress?.(progress, `Compressing page ${i} of ${numPages}...`);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas 2D context not available');

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegImageBytes = await fetch(jpegDataUrl).then((res) => res.arrayBuffer());

    const embeddedImage = await newPdf.embedJpg(jpegImageBytes);
    const newPage = newPdf.addPage([viewport.width, viewport.height]);

    newPage.drawImage(embeddedImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height
    });
  }

  onProgress?.(95, 'Finalizing compressed document...');
  const pdfBytes = await newPdf.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `${baseName}_compressed.pdf`;

  onProgress?.(100, 'Compression completed!');
  return {
    blob,
    fileName,
    size: blob.size,
    originalSize: file.size
  };
}
