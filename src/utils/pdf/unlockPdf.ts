import { PDFDocument } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(15, 'Reading PDF document structure...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfBytes = new Uint8Array(arrayBuffer);
  const cleanPassword = password ? password.trim() : '';

  onProgress?.(35, 'Authenticating and decrypting document...');
  let pdfDoc: PDFDocument;

  try {
    // Attempt loading with user password or empty
    pdfDoc = await PDFDocument.load(pdfBytes, {
      password: cleanPassword || undefined,
      ignoreEncryption: false
    } as any);
  } catch (err: unknown) {
    if (!cleanPassword) {
      throw new Error('This PDF is password-protected. Please enter the password above and try again.');
    }
    throw new Error('Invalid password provided. Please check credentials.');
  }

  try {
    onProgress?.(65, 'Creating clean unencrypted PDF structure...');
    // Create a brand-new unencrypted PDFDocument
    const unlockedDoc = await PDFDocument.create();

    // Copy all pages from decrypted PDF into the clean document
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await unlockedDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => unlockedDoc.addPage(page));

    onProgress?.(90, 'Saving unlocked PDF file...');
    const cleanBytes = await unlockedDoc.save({ useObjectStreams: true });
    const blob = new Blob([cleanBytes], { type: 'application/pdf' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_unlocked.pdf`;

    onProgress?.(100, 'PDF successfully unlocked!');
    return { blob, fileName, size: blob.size };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to generate clean unlocked PDF: ${msg}`);
  }
}

