import { PDFDocument, PageSizes } from 'pdf-lib';
import { fileToArrayBuffer } from './pdfSetup';

export type PageSizeOption = 'a4' | 'letter' | 'fit';
export type OrientationOption = 'auto' | 'portrait' | 'landscape';
export type MarginOption = 'none' | 'small' | 'big';

export async function imagesToPdf(
  files: File[],
  pageSizeOpt: PageSizeOption = 'a4',
  orientationOpt: OrientationOption = 'auto',
  marginOpt: MarginOption = 'small',
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number }> {
  if (files.length === 0) {
    throw new Error('Please select at least 1 image.');
  }

  onProgress?.(10, 'Initializing PDF Document...');
  const pdfDoc = await PDFDocument.create();

  const marginMap = {
    none: 0,
    small: 20,
    big: 40
  };
  const margin = marginMap[marginOpt];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = 10 + Math.round(((i + 1) / files.length) * 80);
    onProgress?.(progress, `Processing image ${i + 1} of ${files.length}: ${file.name}`);

    const buffer = await fileToArrayBuffer(file);

    let embeddedImage;
    if (file.type.includes('png')) {
      embeddedImage = await pdfDoc.embedPng(buffer);
    } else {
      // JPEG / WebP / Canvas fallback to JPG
      try {
        embeddedImage = await pdfDoc.embedJpg(buffer);
      } catch {
        // Fallback for WebP / GIF / non-standard PNGs using canvas
        const img = new Image();
        const url = URL.createObjectURL(file);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = url;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const jpgBuf = await fetch(dataUrl).then((r) => r.arrayBuffer());
        embeddedImage = await pdfDoc.embedJpg(jpgBuf);
        URL.revokeObjectURL(url);
      }
    }

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth = imgWidth + margin * 2;
    let pageHeight = imgHeight + margin * 2;

    if (pageSizeOpt === 'a4') {
      [pageWidth, pageHeight] = PageSizes.A4;
    } else if (pageSizeOpt === 'letter') {
      [pageWidth, pageHeight] = PageSizes.Letter;
    }

    if (orientationOpt === 'landscape' && pageWidth < pageHeight) {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    } else if (orientationOpt === 'portrait' && pageWidth > pageHeight) {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImage, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });
  }

  onProgress?.(95, 'Generating PDF...');
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const fileName = `images_converted_${Date.now()}.pdf`;

  onProgress?.(100, 'Conversion completed!');
  return { blob, fileName, size: blob.size };
}
