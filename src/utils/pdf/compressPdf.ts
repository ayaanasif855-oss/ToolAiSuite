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

  // Initial preset settings based on user selection
  let initialScale = 1.0;
  let initialQuality = 0.65;

  if (level === 'extreme') {
    initialScale = 0.85;
    initialQuality = 0.45;
  } else if (level === 'recommended') {
    initialScale = 1.0;
    initialQuality = 0.65;
  } else {
    initialScale = 1.1;
    initialQuality = 0.80;
  }

  // Helper renderer function
  const renderPdfWithSettings = async (renderScale: number, renderQuality: number, startPct: number, endPct: number) => {
    const newPdf = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const pct = startPct + Math.round(((i - 1) / numPages) * (endPct - startPct));
      onProgress?.(pct, `Compressing page ${i} of ${numPages} (${Math.round(renderQuality * 100)}% JPEG quality)...`);

      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: renderScale });

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Canvas 2D context not available');

      // Fill white background for clean rendering
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', renderQuality);
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

    const pdfBytes = await newPdf.save();
    return pdfBytes;
  };

  // Pass 1: Render with initial settings
  let finalBytes = await renderPdfWithSettings(initialScale, initialQuality, 10, 80);

  // Size Guard Check: If output size >= original file size, execute pass 2 or stream optimization
  if (finalBytes.length >= file.size) {
    onProgress?.(82, 'Size guard activated: Optimizing compression parameters to reduce file size...');
    // Pass 2: Lower scale and quality to guarantee size reduction
    const pass2Scale = Math.min(initialScale, 0.85);
    const pass2Quality = Math.min(initialQuality, 0.45);
    const pass2Bytes = await renderPdfWithSettings(pass2Scale, pass2Quality, 82, 95);

    if (pass2Bytes.length < finalBytes.length) {
      finalBytes = pass2Bytes;
    }

    // Try direct object stream compression with pdf-lib if rasterization is still larger
    if (finalBytes.length >= file.size) {
      try {
        const directDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const directBytes = await directDoc.save({ useObjectStreams: true });
        if (directBytes.length < finalBytes.length) {
          finalBytes = directBytes;
        }
      } catch (e) {
        console.warn('Direct stream optimization skipped:', e);
      }
    }
  }

  onProgress?.(98, 'Finalizing compressed document...');
  const blob = new Blob([finalBytes], { type: 'application/pdf' });
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

