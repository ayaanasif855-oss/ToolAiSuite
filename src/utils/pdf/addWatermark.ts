import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageFile?: File;
  fontSize?: number;
  opacity?: number; // 0.1 to 1.0
  rotation?: number; // e.g. 45 degrees
  color?: string; // hex color e.g. "#ff0000"
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return { r, g, b };
}

export async function addWatermark(
  file: File,
  options: WatermarkOptions,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  onProgress?.(15, 'Loading PDF for watermarking...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  const opacity = options.opacity ?? 0.3;
  const rotation = options.rotation ?? 45;

  if (options.type === 'text') {
    onProgress?.(40, 'Applying text watermark across pages...');
    const watermarkText = options.text || 'CONFIDENTIAL';
    const fontSize = options.fontSize || 48;
    const { r, g, b } = hexToRgb(options.color || '#64748b');
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x = (width - textWidth) / 2;
      let y = (height - textHeight) / 2;

      if (options.position === 'top-left') {
        x = 50;
        y = height - 100;
      } else if (options.position === 'top-right') {
        x = width - textWidth - 50;
        y = height - 100;
      } else if (options.position === 'bottom-left') {
        x = 50;
        y = 100;
      } else if (options.position === 'bottom-right') {
        x = width - textWidth - 50;
        y = 100;
      }

      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotation)
      });
    });
  } else if (options.type === 'image' && options.imageFile) {
    onProgress?.(40, 'Embedding image watermark...');
    const imgBuffer = await fileToArrayBuffer(options.imageFile);

    let embeddedImg;
    if (options.imageFile.type.includes('png')) {
      embeddedImg = await pdfDoc.embedPng(imgBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(imgBuffer);
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const scale = Math.min((width * 0.4) / imgWidth, (height * 0.4) / imgHeight);
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      page.drawImage(embeddedImg, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
        opacity,
        rotate: degrees(rotation)
      });
    });
  }

  onProgress?.(85, 'Finalizing watermarked PDF...');
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `${baseName}_watermarked.pdf`;

  onProgress?.(100, 'Watermark applied successfully!');
  return { blob, fileName, size: blob.size };
}
