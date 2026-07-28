import { PDFDocument, degrees } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export async function rotatePdf(
  file: File,
  angle: 90 | 180 | 270 = 90,
  pageIndicesToRotate?: number[], // Optional array of 0-based page indices
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(20, 'Loading PDF for page rotation...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  onProgress?.(50, `Applying ${angle}° rotation to pages...`);

  pages.forEach((page, index) => {
    if (!pageIndicesToRotate || pageIndicesToRotate.includes(index)) {
      const currentRotation = page.getRotation().angle;
      const newAngle = (currentRotation + angle) % 360;
      page.setRotation(degrees(newAngle));
    }
  });

  onProgress?.(85, 'Saving rotated document...');
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `${baseName}_rotated.pdf`;

  onProgress?.(100, 'PDF rotated successfully!');
  return { blob, fileName, size: blob.size };
}
