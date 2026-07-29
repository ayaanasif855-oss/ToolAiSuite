import { PDFDocument } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export async function unlockPdf(
  file: File,
  password?: string,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(15, 'Reading PDF document structure...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const trimmedPassword = password ? password.trim() : '';

  onProgress?.(35, 'Authenticating and decrypting document...');
  let pdfDoc: PDFDocument;

  try {
    // Attempt loading with user password or empty
    pdfDoc = await PDFDocument.load(arrayBuffer, {
      password: trimmedPassword || undefined,
      ignoreEncryption: false
    } as any);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (!trimmedPassword) {
      throw new Error('This PDF is password-protected. Please enter the password above and try again.');
    }
    throw new Error('Invalid password provided. Unable to decrypt this PDF. Please check your password and try again.');
  }

  try {
    onProgress?.(65, 'Creating clean unencrypted PDF structure...');
    // Create a brand-new unencrypted PDFDocument
    const cleanDoc = await PDFDocument.create();

    // Copy all pages from decrypted PDF into the clean document
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await cleanDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => cleanDoc.addPage(page));

    onProgress?.(90, 'Saving unlocked PDF file...');
    const pdfBytes = await cleanDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_unlocked.pdf`;

    onProgress?.(100, 'PDF successfully unlocked!');
    return { blob, fileName, size: blob.size };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Failed to generate clean unlocked PDF: ${msg}`);
  }
}

