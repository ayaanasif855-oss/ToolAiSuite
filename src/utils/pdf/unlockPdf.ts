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
    // 1. Load the encrypted file bytes with the user-provided password using pdf-lib
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      password: password || undefined,
      ignoreEncryption: false
    } as any);

    onProgress?.(70, 'Creating clean unencrypted document structure...');
    // 2. Create a brand new, unencrypted PDFDocument
    const unlockedDoc = await PDFDocument.create();

    // 3. Copy all pages from the loaded document into the new document
    const pageIndices = pdfDoc.getPageIndices();
    const copiedPages = await unlockedDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => unlockedDoc.addPage(page));

    onProgress?.(90, 'Saving clean unlocked PDF file...');
    // 4. Save the clean, new unlockedDoc bytes
    const pdfBytes = await unlockedDoc.save();
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
