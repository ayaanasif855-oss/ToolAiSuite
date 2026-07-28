import { FAQItem } from '../types';

export const GLOBAL_FAQS: FAQItem[] = [
  {
    question: 'How can ToolAISuite process PDFs without uploading them to a server?',
    answer: 'ToolAISuite uses modern web technologies including HTML5 Canvas, WebAssembly (Wasm), and client-side JavaScript PDF engine libraries (pdf-lib, pdfjs-dist, tesseract.js). All file processing runs 100% inside your web browser using your device CPU memory.'
  },
  {
    question: 'Are my confidential documents safe and private?',
    answer: 'Yes, 100%! Because your files never leave your computer or phone, zero third parties, cloud providers, or bad actors can intercept, read, or store your documents.'
  },
  {
    question: 'Can I use ToolAISuite offline or in Airplane Mode?',
    answer: 'Yes! Once the ToolAISuite web application is loaded in your browser tab, all 10 tools function completely offline without requiring active internet connectivity.'
  },
  {
    question: 'Are there file size limits or usage fees?',
    answer: 'ToolAISuite is 100% free with no hidden subscriptions, daily document quotas, or artificial file size restrictions.'
  },
  {
    question: 'Is ToolAISuite compliant with GDPR, HIPAA, and privacy standards?',
    answer: 'Because ToolAISuite collects zero document data, transmits zero files over networks, and stores zero user files on remote servers, it inherently satisfies strict privacy compliance standards.'
  },
  {
    question: 'What web browsers are supported?',
    answer: 'ToolAISuite works smoothly across all modern desktop and mobile browsers, including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Brave, and Opera.'
  }
];
