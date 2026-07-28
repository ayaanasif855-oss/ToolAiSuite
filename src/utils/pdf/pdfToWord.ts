import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { pdfjsLib, fileToArrayBuffer } from './pdfSetup';

export async function pdfToWord(
  file: File,
  onProgress?: (progress: number, message: string) => void
): Promise<{ blob: Blob; fileName: string; size: number; extractedText: string }> {
  onProgress?.(10, 'Reading PDF content for text extraction...');
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdfDoc.numPages;

  const paragraphs: Paragraph[] = [];
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const progress = 10 + Math.round((i / numPages) * 75);
    onProgress?.(progress, `Extracting text from page ${i} of ${numPages}...`);

    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    // Add page header marker
    paragraphs.push(
      new Paragraph({
        text: `--- Page ${i} ---`,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );
    fullText += `--- Page ${i} ---\n\n`;

    let lastY: number | null = null;
    let pageLine = '';

    for (const item of textContent.items) {
      if ('str' in item) {
        const textItem = item as { str: string; transform?: number[] };
        const currentY = textItem.transform ? textItem.transform[5] : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 8) {
          if (pageLine.trim().length > 0) {
            paragraphs.push(
              new Paragraph({
                children: [new TextRun({ text: pageLine.trim(), size: 24 })],
                spacing: { after: 120 }
              })
            );
            fullText += pageLine.trim() + '\n';
          }
          pageLine = '';
        }

        pageLine += textItem.str + ' ';
        if (currentY !== null) lastY = currentY;
      }
    }

    if (pageLine.trim().length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: pageLine.trim(), size: 24 })],
          spacing: { after: 120 }
        })
      );
      fullText += pageLine.trim() + '\n\n';
    }
  }

  onProgress?.(90, 'Generating Microsoft Word (.docx) document...');

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [
          new Paragraph({ text: 'No text extracted from PDF. Document might be scanned images.' })
        ]
      }
    ]
  });

  const docxBlob = await Packer.toBlob(doc);
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const fileName = `${baseName}_converted.docx`;

  onProgress?.(100, 'Word document generated!');
  return {
    blob: docxBlob,
    fileName,
    size: docxBlob.size,
    extractedText: fullText
  };
}

export async function extractPdfText(file: File): Promise<string> {
  const result = await pdfToWord(file);
  return result.extractedText;
}
