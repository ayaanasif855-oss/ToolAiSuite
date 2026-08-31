import { TOOLS_DATA } from '../data/tools';
import { BLOG_POSTS } from '../data/blog';
import { ToolMeta, BlogPost } from '../types';

export interface RouteMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * Dynamic metadata generator for SEO title and meta description injection across all routes and tools
 */
export function generateMetadata(route: string): RouteMetadata {
  if (route.startsWith('tool/')) {
    const slug = route.replace('tool/', '');
    const tool = TOOLS_DATA.find((t) => t.slug === slug || t.id === slug);
    if (tool) {
      return {
        title: `${tool.name} - 100% Free & Private Online Tool | ToolAISuite`,
        description: `${tool.seoDescription || tool.shortDesc} Fast, secure, client-side in-browser processing with zero server uploads and no limits.`,
        ogTitle: `${tool.name} - Free Online Document Utility`,
        ogDescription: `Use ${tool.name} directly in your web browser. 100% confidential and safe with WebAssembly zero-upload technology.`
      };
    }
  }

  if (route.startsWith('blog/')) {
    const slug = route.replace('blog/', '');
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    if (post) {
      return {
        title: `${post.title} | ToolAISuite Knowledge Center`,
        description: post.excerpt,
        ogTitle: post.title,
        ogDescription: post.excerpt
      };
    }
  }

  switch (route) {
    case 'tools':
    case 'all-tools':
      return {
        title: 'All Free PDF & Document Tools - 100% Client-Side | ToolAISuite',
        description: 'Explore our complete suite of free, private, and client-side PDF utilities. Merge, split, compress, unlock, and convert documents instantly in your browser.',
        ogTitle: 'All Free PDF & Document Tools - ToolAISuite',
        ogDescription: '100% client-side PDF converter suite with zero server uploads and no file limits.'
      };
    case 'blog':
      return {
        title: 'Document Security & Productivity Knowledge Center | ToolAISuite Blog',
        description: 'Explore in-depth technical guides and tutorials on client-side document processing, PDF security, WebAssembly OCR, and compression algorithms.',
        ogTitle: 'ToolAISuite Knowledge Center & Technical Blog',
        ogDescription: 'Authoritative guides on in-browser document security, compression, and OCR technology.'
      };
    case 'about':
      return {
        title: 'About ToolAISuite - 100% Client-Side Document Sovereignty',
        description: 'Learn about ToolAISuite’s mission to provide secure, in-browser PDF utilities powered by WebAssembly and zero server uploads.',
        ogTitle: 'About ToolAISuite & In-Browser Processing',
        ogDescription: 'How ToolAISuite protects document privacy using modern browser technologies.'
      };
    case 'privacy':
      return {
        title: 'Privacy Policy - Zero File Storage Guarantee | ToolAISuite',
        description: 'Read ToolAISuite’s GDPR and CCPA compliant Privacy Policy. We never upload, store, or inspect your documents on remote servers.',
        ogTitle: 'ToolAISuite Privacy Policy',
        ogDescription: 'Zero server uploads and total user document sovereignty guaranteed.'
      };
    case 'terms':
      return {
        title: 'Terms of Service | ToolAISuite',
        description: 'Review the terms and conditions for using ToolAISuite’s client-side document utilities and web services.',
        ogTitle: 'Terms of Service - ToolAISuite',
        ogDescription: 'Terms and conditions for using ToolAISuite free browser utilities.'
      };
    case 'contact':
      return {
        title: 'Contact ToolAISuite Support & Developer Team',
        description: 'Get in touch with the ToolAISuite team for tool suggestions, technical support, feature requests, or business inquiries.',
        ogTitle: 'Contact ToolAISuite Support',
        ogDescription: 'Direct support and feedback for ToolAISuite users and developers.'
      };
    case 'disclaimer':
      return {
        title: 'Legal Disclaimer | ToolAISuite',
        description: 'Review our legal disclaimers regarding client-side processing, file security, and service availability.',
        ogTitle: 'Legal Disclaimer - ToolAISuite',
        ogDescription: 'Legal notice and terms of use for ToolAISuite web services.'
      };
    case 'home':
    default:
      return {
        title: 'ToolAISuite - 100% Free & Private Online PDF Tools (No Server Uploads)',
        description: 'Free, fast, and 100% client-side PDF tools. Merge, split, compress, unlock, convert to Word, and OCR PDFs in your browser without uploading files.',
        ogTitle: 'ToolAISuite - 100% Free & Private Online PDF Tools',
        ogDescription: 'Process PDF documents entirely in your web browser. Fast, free, and zero server storage.'
      };
  }
}

/**
 * Generates structured Schema.org JSON-LD graph objects for search engines
 */
export function generateJsonLd(route: string): Record<string, unknown> {
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://toolaisuite.com';
  const currentUrl = typeof window !== 'undefined'
    ? window.location.href
    : `${origin}/#/${route}`;

  // Organization & WebSite base schemas
  const organizationSchema = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    'name': 'ToolAISuite',
    'url': origin,
    'logo': `${origin}/favicon.ico`,
    'email': 'ayaanasif855@gmail.com',
    'description': 'Provider of 100% client-side browser-native PDF and document utilities with zero server file uploads.',
    'sameAs': []
  };

  // If tool page
  if (route.startsWith('tool/')) {
    const slug = route.replace('tool/', '');
    const tool = TOOLS_DATA.find((t) => t.slug === slug || t.id === slug);

    if (tool) {
      const graph: Record<string, unknown>[] = [organizationSchema];

      // 1. WebApplication Schema
      const webAppSchema: Record<string, unknown> = {
        '@type': 'WebApplication',
        '@id': `${currentUrl}#webapp`,
        'name': tool.name,
        'alternateName': tool.fullTitle,
        'url': currentUrl,
        'description': tool.seoDescription || tool.shortDesc,
        'applicationCategory': tool.category === 'pdf' ? 'BusinessApplication' : 'UtilitiesApplication',
        'operatingSystem': 'All (Web Browser, Windows, macOS, Linux, iOS, Android)',
        'browserRequirements': 'Requires HTML5 and WebAssembly JavaScript execution environment',
        'isAccessibleForFree': true,
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'availability': 'https://schema.org/InStock'
        },
        'featureList': [
          ...(tool.seoContent?.features || []),
          '100% Local In-Browser Processing (Zero Server Transmission)',
          'No File Size or Daily Usage Limits',
          'No Account Registration Required'
        ],
        'provider': {
          '@type': 'Organization',
          'name': 'ToolAISuite',
          'url': origin
        }
      };
      graph.push(webAppSchema);

      // 2. HowTo Schema for Step-by-Step Instructions
      if (tool.seoContent?.howToSteps && tool.seoContent.howToSteps.length > 0) {
        const howToSchema: Record<string, unknown> = {
          '@type': 'HowTo',
          '@id': `${currentUrl}#howto`,
          'name': `How to Use ${tool.name} Online For Free`,
          'description': tool.seoContent.intro || `Step-by-step guide to using ${tool.name} securely in your browser.`,
          'totalTime': 'PT1M',
          'step': tool.seoContent.howToSteps.map((stepText, idx) => ({
            '@type': 'HowToStep',
            'position': idx + 1,
            'name': `Step ${idx + 1}`,
            'text': stepText,
            'url': `${currentUrl}#step-${idx + 1}`
          }))
        };
        graph.push(howToSchema);
      }

      // 3. FAQPage Schema for Rich Snippets
      if (tool.faqs && tool.faqs.length > 0) {
        const faqSchema: Record<string, unknown> = {
          '@type': 'FAQPage',
          '@id': `${currentUrl}#faq`,
          'mainEntity': tool.faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer
            }
          }))
        };
        graph.push(faqSchema);
      }

      // 4. BreadcrumbList Schema
      const breadcrumbSchema: Record<string, unknown> = {
        '@type': 'BreadcrumbList',
        '@id': `${currentUrl}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${origin}/#/home`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Tools Directory',
            'item': `${origin}/#/all-tools`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': tool.name,
            'item': currentUrl
          }
        ]
      };
      graph.push(breadcrumbSchema);

      return {
        '@context': 'https://schema.org',
        '@graph': graph
      };
    }
  }

  // If blog post route
  if (route.startsWith('blog/')) {
    const slug = route.replace('blog/', '');
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (post) {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          organizationSchema,
          {
            '@type': 'BlogPosting',
            '@id': `${currentUrl}#article`,
            'headline': post.title,
            'description': post.excerpt,
            'datePublished': post.date,
            'dateModified': post.date,
            'mainEntityOfPage': currentUrl,
            'author': {
              '@type': 'Person',
              'name': post.author.name,
              'jobTitle': post.author.role
            },
            'publisher': organizationSchema,
            'articleSection': post.category
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${currentUrl}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': `${origin}/#/home`
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Knowledge Center',
                'item': `${origin}/#/blog`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': post.title,
                'item': currentUrl
              }
            ]
          }
        ]
      };
    }
  }

  // Default WebSite & Organization graph
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        'url': origin,
        'name': 'ToolAISuite',
        'description': 'Free, fast, and 100% client-side PDF tools. Merge, split, compress, unlock, and convert documents in your browser without uploading files.',
        'publisher': organizationSchema,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${origin}/#/all-tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };
}

/**
 * Injects or updates the JSON-LD <script> element in document.head
 */
export function injectJsonLd(route: string): void {
  if (typeof document === 'undefined') return;

  const jsonLdData = generateJsonLd(route);
  const scriptId = 'json-ld-structured-data';

  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(jsonLdData, null, 2);
}
