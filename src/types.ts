export type ToolCategory = 'pdf' | 'text' | 'utility';

export interface HowToStep {
  step: number;
  title: string;
  description: string;
}

export interface KeyFeature {
  title: string;
  description: string;
}

export interface ToolMeta {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  category: ToolCategory;
  shortDesc: string;
  fullTitle: string;
  seoDescription: string;
  badge?: string;
  seoContent: {
    heading: string;
    intro: string;
    howToSteps: string[];
    features: string[];
    useCases: string[];
    whyChoose?: {
      paragraph1: string;
      paragraph2: string;
    };
  };
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface ProcessedFileResult {
  fileName: string;
  blob: Blob;
  url: string;
  size: number;
  originalSize?: number;
  extractedText?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  content: string;
  relatedToolIds: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}
