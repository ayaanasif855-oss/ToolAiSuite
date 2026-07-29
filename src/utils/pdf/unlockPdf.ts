import { PDFDocument } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(20, 'Reading PDF document security structure...');
  const arrayBuffer = await fileToArrayBuffer(file);

  try {
    onProgress?.(50, 'Removing password protections and encryption restrictions...');
    // Load with password if provided, or ignore encryption
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      password: password || undefined,
      ignoreEncryption: true
    } as any);

    onProgress?.(80, 'Re-saving clean unlocked PDF...');
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_unlocked.pdf`;

    onProgress?.(100, 'PDF successfully unlocked!');
    return { blob, fileName, size: blob.size };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to unlock PDF';
    if (errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('encrypted')) {
      throw new Error('This PDF requires a valid password. Please enter the password above and try again.');
    }
    throw new Error(`Failed to unlock PDF: ${errorMsg}`);
  }
}
