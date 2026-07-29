import { PDFDocument } from 'pdf-lib';
import { pdfjsLib } from './pdfSetup';

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(15, 'Reading PDF document structure...');
  const arrayBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(arrayBuffer);
  const cleanPassword = password ? password.trim() : '';

  onProgress?.(30, 'Authenticating and decrypting document with pdfjs engine...');
  const loadingTask = pdfjsLib.getDocument({
    data: fileBytes,
    password: cleanPassword
  });

  let pdfDoc: any;
  try {
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err && (err.name === 'PasswordException' || err.code === 1)) {
      if (!cleanPassword) {
        throw new Error('This PDF is password-protected. Please enter the password above and try again.');
      }
      throw new Error('Invalid password. Please check your password and try again.');
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg.toLowerCase().includes('password')) {
      throw new Error('Invalid password. Please check your password and try again.');
    }
    throw new Error(`Failed to decrypt PDF: ${errMsg}`);
  }

  try {
    onProgress?.(50, 'Creating clean unencrypted PDF document...');
    const outputPdf = await PDFDocument.create();
    const numPages = pdfDoc.numPages;

    for (let i = 1; i <= numPages; i++) {
      const pct = 50 + Math.round(((i - 1) / numPages) * 40);
      onProgress?.(pct, `Processing page ${i} of ${numPages} for unlocked export...`);

      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas 2D context not available');

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport } as any).promise;

      const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
      const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

      const embeddedImage = await outputPdf.embedJpg(imageBytes);
      const newPage = outputPdf.addPage([viewport.width / 2, viewport.height / 2]);

      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: newPage.getWidth(),
        height: newPage.getHeight()
      });
    }

    onProgress?.(95, 'Saving unencrypted PDF file...');
    const unlockedPdfBytes = await outputPdf.save({ useObjectStreams: true });
    const blob = new Blob([unlockedPdfBytes], { type: 'application/pdf' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_unlocked.pdf`;

    onProgress?.(100, 'PDF successfully unlocked!');
    return { blob, fileName, size: blob.size };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to generate clean unlocked PDF: ${msg}`);
  }
}


