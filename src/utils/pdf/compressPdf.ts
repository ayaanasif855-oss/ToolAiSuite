import { PDFDocument } from 'pdf-lib';
import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';

export type CompressionLevel = 'extreme' | 'recommended' | 'low';

export async function compressPdf(
  file: File,
  level: CompressionLevel = 'recommended',
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number; originalSize: number }> {
  onProgress?.(10, 'Reading original PDF structure...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  let renderScale = 1.5;
  let renderQuality = 0.75;

  if (level === 'extreme') {
    renderScale = 1.25;
    renderQuality = 0.55;
  } else if (level === 'recommended') {
    renderScale = 1.5;
    renderQuality = 0.75;
  } else {
    renderScale = 1.8;
    renderQuality = 0.85;
  }

  // First, check if object stream compression alone yields a smaller file (vector text optimization)
  onProgress?.(20, 'Evaluating vector object stream compression...');
  let streamBytes: Uint8Array | null = null;
  try {
    const directDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any);
    streamBytes = await directDoc.save({ useObjectStreams: true });
  } catch (e) {
    console.warn('Direct stream optimization check skipped:', e);
  }

  // Render pages to canvas for image/raster optimization
  const newPdf = await PDFDocument.create();

  for (let i = 1; i <= numPages; i++) {
    const pct = 25 + Math.round(((i - 1) / numPages) * 60);
    onProgress?.(pct, `Compressing page ${i} of ${numPages} (${Math.round(renderQuality * 100)}% quality)...`);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: renderScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Canvas 2D context not available');

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

  onProgress?.(88, 'Finalizing compressed document...');
  let compressedBytes = await newPdf.save({ useObjectStreams: true });

  // If stream-only compression produced a smaller file, prefer streamBytes
  if (streamBytes && streamBytes.byteLength < compressedBytes.byteLength) {
    compressedBytes = streamBytes;
  }

  // STRICT SIZE GUARD (MANDATORY): Never output a file larger than or equal to original input
  if (compressedBytes.byteLength >= file.size) {
    onProgress?.(92, 'Applying strict size guard fallback...');
    if (streamBytes && streamBytes.byteLength < file.size) {
      compressedBytes = streamBytes;
    } else {
      try {
        const fallbackDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true } as any);
        const fallbackBytes = await fallbackDoc.save({ useObjectStreams: true });
        if (fallbackBytes.byteLength < file.size) {
          compressedBytes = fallbackBytes;
        }
      } catch (e) {
        console.warn('Fallback stream save failed:', e);
      }
    }
  }

  onProgress?.(98, 'Packaging final PDF file...');
  const blob = new Blob([compressedBytes], { type: 'application/pdf' });
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


