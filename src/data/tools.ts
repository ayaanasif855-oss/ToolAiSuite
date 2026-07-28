import { ToolMeta } from '../types';

export const TOOLS_DATA: ToolMeta[] = [
  // --- CATEGORY: PDF TOOLS ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    slug: 'merge-pdf',
    iconName: 'FileStack',
    category: 'pdf',
    badge: 'Popular',
    shortDesc: 'Combine multiple PDF documents into a single organized file in seconds.',
    fullTitle: 'Merge PDF Online 100% Privately - Combine PDFs in Browser',
    seoDescription: 'Merge PDF files online for free. Combine multiple PDFs into one document without uploading files to any server. 100% secure client-side browser processing.',
    seoContent: {
      heading: 'How to Combine Multiple PDF Files 100% Privately in Your Browser',
      intro: 'ToolAISuite Merge PDF allows you to effortlessly join multiple PDF documents into one single file without risking sensitive document leaks. Traditional online PDF tools upload your confidential records to cloud servers. With our browser-native WebAssembly architecture, all PDF page merging happens entirely inside your local computer or phone browser.',
      howToSteps: [
        'Select or drag and drop multiple PDF files into the secure upload dropzone.',
        'Reorder your documents into your preferred page sequence using simple drag or arrow controls.',
        'Click the "Merge PDFs Now" button to execute instant browser-side compilation.',
        'Download your newly combined PDF document instantly with zero file size limits.'
      ],
      features: [
        '100% Browser Execution: Files never touch an external server or database.',
        'Unlimited File Size: No artificial caps on document sizes or page counts.',
        'Drag-and-Drop Reordering: Seamlessly arrange files before merging.',
        'Cross-Platform Ready: Works smoothly on Windows, Mac, Linux, iOS, and Android.'
      ],
      useCases: [
        'Merging monthly bank statements into an annual tax folder.',
        'Combining cover letters, resumes, and portfolio certificates into one job application.',
        'Joining multiple scanned invoice receipts into a unified accounting report.'
      ]
    },
    faqs: [
      {
        question: 'Is it safe to merge confidential financial or legal PDFs here?',
        answer: 'Yes, absolutely! ToolAISuite processes files using client-side JavaScript. Your PDF data is never uploaded to any remote server or cloud network.'
      },
      {
        question: 'Are there file size or upload limits for merging PDFs?',
        answer: 'No! Because processing uses your own device resources, you can merge large PDFs limited only by your web browser memory.'
      },
      {
        question: 'Can I reorder the pages before merging?',
        answer: 'Yes, you can easily arrange the file order in our interactive workspace before clicking the merge button.'
      }
    ]
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    slug: 'split-pdf',
    iconName: 'Scissors',
    category: 'pdf',
    badge: 'Essential',
    shortDesc: 'Extract specific page ranges or split a PDF into separate single-page documents.',
    fullTitle: 'Split PDF Pages Online - Extract Pages Privately in Browser',
    seoDescription: 'Split PDF pages online for free. Extract custom page ranges or break a large PDF into individual page files. 100% private client-side execution.',
    seoContent: {
      heading: 'Extract Specific PDF Pages or Split Whole Documents Local-Only',
      intro: 'Need to extract a specific chapter from an ebook or separate a single invoice from a 50-page statement? ToolAISuite Split PDF provides precision page extraction entirely inside your web browser. You can specify custom page ranges (e.g. 1-3, 5, 8-12) or extract every single page into individual standalone PDF files.',
      howToSteps: [
        'Upload your target PDF document into the workspace dropzone.',
        'Choose your preferred split mode: Custom Page Ranges or Separate All Pages.',
        'Input your required page numbers (for example: "1-4, 7, 10-15").',
        'Click "Split PDF Document" and download your extracted files instantly.'
      ],
      features: [
        'Custom Page Range Syntax: Extract complex page sets effortlessly.',
        'Instant Individual Page Extractor: Generate single-page PDFs in seconds.',
        'Zero Data Logging: Your extracted documents remain strictly private.',
        'High Fidelity Preservation: Retains original fonts, vectors, and image clarity.'
      ],
      useCases: [
        'Extracting a signature page from a long legal contract.',
        'Separating chapters from an academic textbook or manual.',
        'Splitting multi-page tax filings into standalone schedules.'
      ]
    },
    faqs: [
      {
        question: 'How do I specify custom page ranges to split?',
        answer: 'Simply type commas for individual pages and hyphens for ranges, such as "1-3, 5, 8-10".'
      },
      {
        question: 'Will splitting lower the visual quality of my document?',
        answer: 'No! The underlying vector graphics, original images, and fonts are preserved bit-for-bit without re-encoding quality loss.'
      }
    ]
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    iconName: 'Minimize2',
    category: 'pdf',
    badge: 'High Performance',
    shortDesc: 'Reduce PDF file size significantly while preserving document visual clarity.',
    fullTitle: 'Compress PDF Online Privately - Reduce PDF File Size in Browser',
    seoDescription: 'Compress PDF files online for free. Reduce PDF document size up to 80% while retaining sharp text and image quality. Client-side browser compression.',
    seoContent: {
      heading: 'Shrink Large PDF File Sizes Local-Only Without Server Uploads',
      intro: 'Large PDF attachments often bounce back due to email inbox size restrictions. ToolAISuite Compress PDF optimizes and recompresses internal PDF image assets and structure streams directly in browser memory. Choose from Recommended, Extreme, or Less Compression presets to balance maximum byte savings and high DPI rendering.',
      howToSteps: [
        'Select or drop your large PDF file into the browser compress workspace.',
        'Select your desired compression tier (Recommended, Extreme, or Light).',
        'Click "Compress PDF" to start local byte optimization.',
        'Compare original vs compressed size and download your compact file.'
      ],
      features: [
        'Smart Image Downsampling: Reduces image weight while keeping text ultra-crisp.',
        'Multiple Compression Presets: Fine-tune visual quality against file size.',
        'Instant Byte Comparison: See exact percentage savings in real time.',
        'Email & Portal Ready: Ensures files fit strict web form upload caps.'
      ],
      useCases: [
        'Shrinking multi-megabyte PDF portfolios to send via email attachments.',
        'Optimizing scanned documents before submitting to portal upload fields.',
        'Reducing mobile data usage when viewing heavy PDF presentations.'
      ]
    },
    faqs: [
      {
        question: 'How much smaller will my compressed PDF become?',
        answer: 'Compression rates depend on embedded images. Documents with large uncompressed photos can shrink up to 70-80%!'
      },
      {
        question: 'Is my text blurred after compressing?',
        answer: 'No! Text vectors and fonts remain 100% crisp. Only raster images are optimized.'
      }
    ]
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    iconName: 'Image',
    category: 'pdf',
    badge: 'Popular',
    shortDesc: 'Convert JPG, PNG, WEBP, and GIF images into professional PDF documents.',
    fullTitle: 'Convert JPG/PNG to PDF Online - Image to PDF Browser Converter',
    seoDescription: 'Convert JPG, PNG, and WebP images to PDF online for free. Set page sizes, margins, and orientation. 100% private in-browser image conversion.',
    seoContent: {
      heading: 'Convert Photos and Scanned Images into Formatted PDF Files',
      intro: 'Need to convert photos, receipts, or graphics into a clean PDF document? ToolAISuite Image to PDF lets you upload multiple JPG, PNG, WEBP, and GIF files, adjust margins, select paper dimensions (A4, Letter, Auto-fit), and generate a standardized PDF file instantly.',
      howToSteps: [
        'Drag and drop one or multiple image files into the converter area.',
        'Choose paper size (A4, US Letter, Fit to Image) and margin padding.',
        'Arrange image order if converting multiple photos.',
        'Click "Convert to PDF" and download your newly created PDF.'
      ],
      features: [
        'Multi-Format Support: JPG, PNG, WEBP, GIF, and BMP supported.',
        'Custom Page Sizing: Standard A4, Letter, or exact image dimensions.',
        'Batch Combining: Merge dozens of photos into a single album PDF.',
        'Privacy Guaranteed: Images are never transferred outside your device.'
      ],
      useCases: [
        'Converting phone snapshots of receipts into expense report PDFs.',
        'Bundling scanned textbook pages into an organized study PDF.',
        'Creating digital design portfolios from exported PNG assets.'
      ]
    },
    faqs: [
      {
        question: 'Can I convert multiple images into a single PDF document?',
        answer: 'Yes! You can add multiple images, reorder them, and combine them into one seamless PDF file.'
      },
      {
        question: 'Does Image to PDF preserve high resolution photos?',
        answer: 'Yes! Image quality is preserved with zero loss of clarity.'
      }
    ]
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    slug: 'pdf-to-jpg',
    iconName: 'FileImage',
    category: 'pdf',
    badge: 'Fast',
    shortDesc: 'Extract pages from PDF files and save them as high-quality JPG image files.',
    fullTitle: 'Convert PDF to JPG Images Online - PDF Page Image Extractor',
    seoDescription: 'Convert PDF pages to high-resolution JPG images for free. Extract images or full pages in high quality without uploading files. 100% private browser tool.',
    seoContent: {
      heading: 'Convert PDF Pages to High-Resolution JPG Images Local-Only',
      intro: 'ToolAISuite PDF to JPG renders PDF pages into crisp, high-DPI JPG images directly using browser rendering engines. Download individual page photos or save all converted pages in a convenient ZIP archive.',
      howToSteps: [
        'Upload your PDF file into the PDF to JPG conversion workspace.',
        'The tool renders each page into high-resolution JPG previews.',
        'Click individual page cards to download or click "Download All as ZIP".'
      ],
      features: [
        'High DPI Rendering: Renders sharp text and vivid graphics.',
        'ZIP Archive Export: Download all page images in a single ZIP file.',
        '100% Client-Side Speed: Instant conversion without remote server queues.',
        'Universal Compatibility: Compatible with web browsers across all platforms.'
      ],
      useCases: [
        'Extracting infographic diagrams from PDF research papers.',
        'Converting PDF slides into images for social media posts.',
        'Previewing PDF catalog pages as image thumbnails.'
      ]
    },
    faqs: [
      {
        question: 'How high is the image resolution when converting PDF to JPG?',
        answer: 'Pages are rendered at high resolution suitable for printing and clear digital display.'
      },
      {
        question: 'Can I download all converted JPGs at once?',
        answer: 'Yes! Click "Download All as ZIP" to get all page images bundled in a single download.'
      }
    ]
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word',
    slug: 'pdf-to-word',
    iconName: 'FileText',
    category: 'pdf',
    badge: 'Editable',
    shortDesc: 'Convert PDF text and structure into editable Microsoft Word (.docx) documents.',
    fullTitle: 'Convert PDF to Word DOCX Online - Free Editable Word Converter',
    seoDescription: 'Convert PDF to Word (.docx) online for free. Turn PDF files into editable DOCX and TXT files directly in your web browser. 100% private execution.',
    seoContent: {
      heading: 'Convert PDF Files into Editable Microsoft Word Documents Privately',
      intro: 'Editing text locked inside a PDF file used to require expensive software subscriptions. ToolAISuite PDF to Word parses document text structures and outputs clean editable Word (.docx) and plain text (.txt) files local-only in your browser.',
      howToSteps: [
        'Upload your PDF file into the PDF to Word converter.',
        'Click "Convert to Word DOCX" to parse text and layout blocks.',
        'Download your editable .docx file or copy extracted text.'
      ],
      features: [
        'DOCX & TXT Export: Get editable Word files and plain text files.',
        'Layout Parsing: Extracts paragraphs, headings, and lists.',
        'Zero Data Logging: Your document contents never leave your device.',
        'Instant Editing: Open directly in Word, Google Docs, or LibreOffice.'
      ],
      useCases: [
        'Editing outdated PDF agreements without original source files.',
        'Extracting contract clauses for reuse in new draft agreements.',
        'Converting PDF reports into editable Word research drafts.'
      ]
    },
    faqs: [
      {
        question: 'Can I edit the converted document in Microsoft Word and Google Docs?',
        answer: 'Yes! The generated .docx file opens seamlessly in Microsoft Word, Google Docs, and LibreOffice.'
      },
      {
        question: 'Does PDF to Word work on scanned PDFs?',
        answer: 'For scanned image PDFs, please use our dedicated OCR PDF tool for best character recognition!'
      }
    ]
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    slug: 'unlock-pdf',
    iconName: 'Unlock',
    category: 'pdf',
    badge: 'Security',
    shortDesc: 'Remove owner passwords and print/copy restrictions from PDF documents.',
    fullTitle: 'Unlock Password Protected PDF Online - Remove PDF Passwords Privately',
    seoDescription: 'Unlock PDF files online for free. Remove passwords and restrictions from secured PDFs in your browser. 100% secure client-side password removal.',
    seoContent: {
      heading: 'Remove Password Protection and Printing Restrictions from PDFs',
      intro: 'Tired of typing a password every time you open your monthly utility bill or tax statement? ToolAISuite Unlock PDF removes owner passwords and permission restrictions from protected PDFs directly in your browser.',
      howToSteps: [
        'Upload your password-protected PDF document.',
        'If prompt required, enter the correct user password.',
        'Click "Unlock PDF" to strip encryption keys.',
        'Download your unlocked, restriction-free PDF file.'
      ],
      features: [
        'Strips Opening Passwords: Never type repeating passwords again.',
        'Removes Printing & Copying Locks: Enables text copying and printing.',
        '100% Local Encryption Decryption: Passwords are processed strictly in RAM.',
        'Instant Result: Instant unlocking without cloud processing delays.'
      ],
      useCases: [
        'Removing repeating passwords from monthly bank and credit card statements.',
        'Unlocking administrative printing bans on official forms.',
        'Archiving personal records without password lock friction.'
      ]
    },
    faqs: [
      {
        question: 'Is my password safe when unlocking PDFs here?',
        answer: 'Yes! Password decryption happens entirely in your browser memory. Passwords are never sent across the network.'
      },
      {
        question: 'Can I unlock a PDF if I do not know the password?',
        answer: 'If a PDF has an opening password, you must enter it once to authorize removal of encryption.'
      }
    ]
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    slug: 'rotate-pdf',
    iconName: 'RotateCw',
    category: 'pdf',
    badge: 'Utility',
    shortDesc: 'Rotate PDF pages 90, 180, or 270 degrees clockwise or counter-clockwise.',
    fullTitle: 'Rotate PDF Pages Online - Permanently Fix Upside-Down PDFs',
    seoDescription: 'Rotate PDF pages online for free. Fix sideways or upside-down PDF files directly in your web browser. 100% private client-side orientation tool.',
    seoContent: {
      heading: 'Permanently Rotate Upside-Down or Sideways PDF Pages',
      intro: 'Scanned documents often end up sideways or completely upside down. ToolAISuite Rotate PDF lets you rotate all or selected pages by 90°, 180°, or 270° degrees and save the fixed orientation permanently.',
      howToSteps: [
        'Upload the misaligned PDF into the rotate workspace.',
        'Choose rotation angle (90° Clockwise, 180°, 270° Counter-Clockwise).',
        'Click "Rotate PDF" to permanently save orientation changes.',
        'Download your correctly oriented PDF document.'
      ],
      features: [
        'Precise Angles: Rotate 90°, 180°, or 270° degrees.',
        'Permanent Orientation Lock: Saved changes persist across all PDF viewers.',
        'Zero Quality Loss: Rotates orientation headers without re-compressing graphics.',
        'Browser Native Execution: Fast processing with zero server uploads.'
      ],
      useCases: [
        'Fixing upside-down mobile phone document scans.',
        'Adjusting landscape tables in portrait PDF reports.',
        'Standardizing architectural blueprint scan orientations.'
      ]
    },
    faqs: [
      {
        question: 'Will rotating my PDF make it blurry?',
        answer: 'No! Orientation headers are modified directly without altering image compression or text vectors.'
      }
    ]
  },
  {
    id: 'add-watermark',
    name: 'Add Watermark to PDF',
    slug: 'add-watermark',
    iconName: 'Stamp',
    category: 'pdf',
    badge: 'Protection',
    shortDesc: 'Stamp custom text watermarks across PDF pages to protect intellectual property.',
    fullTitle: 'Add Text Watermark to PDF Online - Free PDF Stamp Protection',
    seoDescription: 'Add custom text watermarks to PDF files online for free. Adjust opacity, color, and angle. 100% private in-browser document stamping.',
    seoContent: {
      heading: 'Protect Your Confidential Documents with Custom PDF Watermarks',
      intro: 'Prevent unauthorized document distribution by stamping custom text watermarks such as "CONFIDENTIAL", "SAMPLE", "DRAFT", or your company name across every page of your PDF file.',
      howToSteps: [
        'Upload your PDF document into the watermark tool workspace.',
        'Enter your desired watermark text string (e.g. "CONFIDENTIAL").',
        'Adjust text opacity slider and choose custom stamp color.',
        'Click "Apply Watermark" and download your protected document.'
      ],
      features: [
        'Custom Text & Styling: Customize text, opacity, and color accents.',
        'Multi-Page Stamping: Automatically stamps every page of your file.',
        'Vector Text Stamp: Clean rendering across all screen zoom levels.',
        '100% Local Processing: Protects confidential intellectual property.'
      ],
      useCases: [
        'Stamping "CONFIDENTIAL" on financial audit drafts.',
        'Marking legal agreements as "DRAFT" prior to final signature.',
        'Adding copyright notices to preview PDF ebooks and whitepapers.'
      ]
    },
    faqs: [
      {
        question: 'Can I customize the watermark text and transparency?',
        answer: 'Yes! You can customize the exact text, opacity transparency, and color.'
      }
    ]
  },
  {
    id: 'ocr-pdf',
    name: 'OCR PDF',
    slug: 'ocr-pdf',
    iconName: 'ScanText',
    category: 'pdf',
    badge: 'AI Powered',
    shortDesc: 'Recognize and extract editable text from scanned PDF files and images using OCR.',
    fullTitle: 'OCR PDF Online - Convert Scanned PDFs into Searchable Text',
    seoDescription: 'Optical Character Recognition (OCR) for PDF files for free. Extract editable text from scanned documents directly in browser. 100% private OCR tool.',
    seoContent: {
      heading: 'Extract Searchable Text from Scanned PDF Documents via Client-Side OCR',
      intro: 'Scanned PDF documents are basically picture files containing locked text. ToolAISuite OCR PDF uses Tesseract WebAssembly to perform optical character recognition directly inside your web browser, extracting editable text without sending your files to remote servers.',
      howToSteps: [
        'Upload your scanned PDF file or document photo.',
        'Select target language (English, Spanish, French, German, etc.).',
        'Click "Run OCR Text Extraction" to scan characters.',
        'Copy extracted text or download as a .TXT file.'
      ],
      features: [
        'In-Browser Tesseract Engine: Real OCR execution inside browser WebAssembly.',
        'Multi-Language OCR: Supports English, Spanish, French, German, and more.',
        'Copy & Export TXT: Copy extracted text directly to clipboard.',
        '100% Private Scanning: Confidential paper records remain private.'
      ],
      useCases: [
        'Digitizing old scanned book pages and paper articles.',
        'Extracting invoice line items from scanned PDF bill receipts.',
        'Converting scanned legal filings into searchable text archives.'
      ]
    },
    faqs: [
      {
        question: 'Is the OCR scanning accuracy high?',
        answer: 'Yes! The Tesseract engine provides state-of-the-art character recognition for clear scans.'
      },
      {
        question: 'Does my scanned document get sent to an OCR server?',
        answer: 'No! The OCR model runs locally inside your browser via WebAssembly.'
      }
    ]
  },

  // --- CATEGORY: TEXT TOOLS ---
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    slug: 'word-counter',
    iconName: 'AlignLeft',
    category: 'text',
    badge: 'Real-Time',
    shortDesc: 'Count words, characters, sentences, paragraphs, and estimate reading time instantly.',
    fullTitle: 'Free Word Counter & Character Count Tool Online - Real-Time Analysis',
    seoDescription: 'Count words, characters with spaces, characters without spaces, sentences, paragraphs, and reading time in real time. 100% private browser text analysis.',
    seoContent: {
      heading: 'Real-Time Word Count, Character Count, and Text Analysis Tool',
      intro: 'Whether writing an essay, blog post, social media update, or academic paper, tracking strict word and character limits is critical. ToolAISuite Word Counter gives you live metrics for words, characters, sentences, paragraphs, and estimated reading time as you type.',
      howToSteps: [
        'Type or paste your text directly into the interactive text editor.',
        'View live updated metrics for words, characters, sentences, and paragraphs.',
        'Check estimated reading and speaking time metrics.',
        'Use quick action buttons to copy cleaned text or clear input.'
      ],
      features: [
        'Instant Real-Time Metrics: Updates calculations with zero keystroke delay.',
        'Reading & Speaking Time Estimator: Calculates average reading duration.',
        'Space Invariant Counter: Shows character count with and without spaces.',
        '100% Offline & Private: No text is ever stored or logged.'
      ],
      useCases: [
        'Ensuring Twitter/X tweets stay under character limits.',
        'Checking essay word counts for university assignment criteria.',
        'Optimizing blog post lengths for SEO readability standards.'
      ]
    },
    faqs: [
      {
        question: 'Does this tool store or log the text I paste here?',
        answer: 'No! All text calculations happen locally in your browser state. Nothing is recorded or uploaded.'
      },
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is calculated based on standard human reading speeds of 200 words per minute.'
      }
    ]
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    slug: 'case-converter',
    iconName: 'Type',
    category: 'text',
    badge: 'Popular',
    shortDesc: 'Instantly transform text into UPPERCASE, lowercase, Title Case, Sentence case, or slug-case.',
    fullTitle: 'Online Case Converter - Convert Text to UPPERCASE, lowercase, Title Case',
    seoDescription: 'Convert text case online for free. Instantly transform text to UPPERCASE, lowercase, Title Case, Sentence case, Capitalized Case, camelCase, and slug-case.',
    seoContent: {
      heading: 'Transform Any Text into Your Desired Letter Case Format Instantly',
      intro: 'Accidentally typed a paragraph with Caps Lock on? Need to convert article titles into proper Title Case or create clean URL slugs for web design? ToolAISuite Case Converter transforms text into 10 distinct case styles in one click with live character and word tracking.',
      howToSteps: [
        'Paste your raw text into the input text editor area.',
        'Click your desired target case button (e.g. UPPERCASE, Title Case, camelCase).',
        'Review the transformed text with instant live character and word counts.',
        'Click "Copy Converted Text" or download as a .TXT file.'
      ],
      features: [
        '10 Conversion Styles: UPPERCASE, lowercase, Sentence case, Title Case, Capitalized, Alternating, slug-case, camelCase, PascalCase, CONSTANT_CASE.',
        'One-Click Clipboard Copy: Copy formatted output instantly.',
        'Text Metrics Display: Tracks character, word, sentence, and line counts.',
        '100% Private Processing: Everything happens locally in browser memory.'
      ],
      useCases: [
        'Fixing text accidentally typed with CAPS LOCK enabled.',
        'Formatting headline titles for blog posts and news articles.',
        'Converting string titles into valid code variables (camelCase, CONSTANT_CASE).'
      ]
    },
    faqs: [
      {
        question: 'What is Title Case vs Sentence case?',
        answer: 'Sentence case capitalizes only the first letter of sentences. Title Case capitalizes every major word in headlines.'
      },
      {
        question: 'Is there a character limit for converting text?',
        answer: 'No! You can convert long documents containing tens of thousands of words instantly.'
      }
    ]
  },
  {
    id: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    slug: 'duplicate-line-remover',
    iconName: 'ListFilter',
    category: 'text',
    badge: 'List Cleaner',
    shortDesc: 'Clean up text lists by removing repeated duplicate lines and sorting entries.',
    fullTitle: 'Remove Duplicate Lines Online - Free Text List Deduplication Tool',
    seoDescription: 'Remove duplicate lines from text lists online for free. Deduplicate emails, keywords, and data entries with case sensitivity and sorting options. 100% private.',
    seoContent: {
      heading: 'Clean Up Messy Lists by Eliminating Repeated Duplicate Lines',
      intro: 'Cleaning email lists, keyword lists, or CSV rows manually is tedious and prone to human error. ToolAISuite Duplicate Line Remover scans text lists instantly, identifies identical duplicate entries, and outputs a clean list of unique entries with full metric reporting.',
      howToSteps: [
        'Paste your list containing duplicate lines into the left input area.',
        'Configure options: Case sensitivity, whitespace trimming, or alphabetical sorting.',
        'View the deduplicated output list on the right along with statistics.',
        'Click "Copy Clean List" or download as a text file.'
      ],
      features: [
        'Custom Sensitivity Toggles: Support case-sensitive or case-insensitive matching.',
        'Whitespace & Blank Line Filter: Automatically trims spaces and removes empty lines.',
        'Alphabetical Sorting Options: Sort unique results A-Z or Z-A.',
        'Metric Reduction Ratio: Shows original lines vs unique lines and % saved.'
      ],
      useCases: [
        'Cleaning subscriber email lists prior to email newsletter campaigns.',
        'Removing duplicate SEO keywords from keyword research sheets.',
        'Deduplicating server log lines and database export lists.'
      ]
    },
    faqs: [
      {
        question: 'Can I perform case-insensitive duplicate removal?',
        answer: 'Yes! Toggle the "Case Sensitive Comparison" checkbox on or off depending on your needs.'
      },
      {
        question: 'Can I sort my deduplicated list alphabetically?',
        answer: 'Yes! You can sort unique entries in ascending (A-Z) or descending (Z-A) order.'
      }
    ]
  },
  {
    id: 'extra-space-remover',
    name: 'Extra Space Remover',
    slug: 'extra-space-remover',
    iconName: 'Space',
    category: 'text',
    badge: 'Formatter',
    shortDesc: 'Clean up messy formatting by removing extra spaces, tabs, and blank lines.',
    fullTitle: 'Remove Extra Spaces Online - Text Whitespace Formatting Cleaner',
    seoDescription: 'Remove extra spaces, tabs, and unnecessary blank lines online for free. Clean messy text formatting instantly in your browser. 100% private text utility.',
    seoContent: {
      heading: 'Eliminate Unnecessary Double Spaces, Tabs, and Blank Lines',
      intro: 'Copying text from PDFs or web pages often introduces weird double spaces, rogue tabs, and excessive blank lines. ToolAISuite Extra Space Remover cleans up text formatting in seconds, converting multi-space gaps into clean single spaces.',
      howToSteps: [
        'Paste your messy text into the input box.',
        'Select cleaning options: Collapse spaces, trim lines, or remove tabs.',
        'Review the cleaned text output in real time.',
        'Copy the formatted text or download as a clean .TXT document.'
      ],
      features: [
        'Space Collapsing: Turns multiple consecutive spaces into a single space.',
        'Line Trimming: Removes leading and trailing whitespace from every line.',
        'Tab & Break Remover: Converts tabs into single spaces or flattens paragraphs.',
        'Byte Efficiency Savings: Shows exact character reduction metrics.'
      ],
      useCases: [
        'Cleaning text copied from PDFs before publishing to CMS platforms.',
        'Formatting messy raw code comments and document drafts.',
        'Standardizing text spacing before sending professional emails.'
      ]
    },
    faqs: [
      {
        question: 'Will this tool remove all spaces or just extra spaces?',
        answer: 'It collapses extra multiple spaces into single normal spaces, keeping your words readable.'
      },
      {
        question: 'Can I turn my multi-line text into a single paragraph?',
        answer: 'Yes! Enable the "Remove All Line Breaks" toggle option to flatten your text into one continuous paragraph.'
      }
    ]
  },

  // --- CATEGORY: UTILITIES & CALCULATORS ---
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    iconName: 'QrCode',
    category: 'utility',
    badge: 'Customizable',
    shortDesc: 'Generate custom vector QR codes for websites, WiFi passwords, and text.',
    fullTitle: 'Free Custom QR Code Generator Online - High-Res PNG QR Codes',
    seoDescription: 'Create custom QR codes online for free. Generate QR codes for URLs, WiFi networks, phone numbers, and text with custom colors. 100% private browser tool.',
    seoContent: {
      heading: 'Create Custom High-Resolution QR Codes Local-Only',
      intro: 'Generate instant QR codes for website URLs, WiFi network details, email addresses, and contact info without subscriptions or expiration dates. ToolAISuite QR Code Generator creates high-resolution vector QR codes directly in your browser canvas.',
      howToSteps: [
        'Enter your website link, text message, or WiFi network details.',
        'Customize foreground color, background color, and margin size.',
        'Preview the live QR code updating in real time.',
        'Download your custom QR code image as a crisp PNG file.'
      ],
      features: [
        'Instant Vector Rendering: Renders sharp QR codes for print and web.',
        'Custom Colors: Personalize foreground and background colors.',
        'Never Expires: Created QR codes work permanently with zero tracking redirects.',
        '100% Free & Private: Built in local browser canvas.'
      ],
      useCases: [
        'Generating QR codes for restaurant menus and flyer promotions.',
        'Sharing WiFi network passwords with guests easily.',
        'Adding QR links to business cards and event posters.'
      ]
    },
    faqs: [
      {
        question: 'Do the generated QR codes ever expire?',
        answer: 'No! The QR codes contain direct data payloads without middleman tracking URLs, so they work forever.'
      },
      {
        question: 'Can I change the QR code colors to match my brand?',
        answer: 'Yes! You can select custom foreground and background colors.'
      }
    ]
  },
  {
    id: 'password-generator',
    name: 'Strong Password Generator',
    slug: 'password-generator',
    iconName: 'KeyRound',
    category: 'utility',
    badge: 'Secure',
    shortDesc: 'Generate unbreakable, secure passwords with custom lengths and strength metrics.',
    fullTitle: 'Strong Password Generator Online - Cryptographically Secure Passwords',
    seoDescription: 'Generate secure, random passwords online for free. Customize length, uppercase, numbers, and symbols with strength entropy metrics. 100% private browser tool.',
    seoContent: {
      heading: 'Generate Cryptographically Secure Passwords 100% Privately',
      intro: 'Weak passwords are the #1 vulnerability in digital security. ToolAISuite Strong Password Generator uses your browser native Web Crypto API (`window.crypto.getRandomValues`) to generate cryptographically uncrackable passwords with real-time entropy security scoring.',
      howToSteps: [
        'Adjust the password length slider (from 4 up to 64 characters).',
        'Toggle uppercase, lowercase, numbers, symbols, or exclude ambiguous characters.',
        'Check the live entropy strength meter rating.',
        'Click "Copy" or generate 10 passwords at once in Batch Mode.'
      ],
      features: [
        'Web Crypto API Engine: Uses cryptographically secure random number generators.',
        'Entropy Security Meter: Real-time bit-entropy security rating.',
        'Ambiguous Character Filter: Avoid confusing characters like i, l, 1, L, o, 0, O.',
        'Batch Mode Generator: Generate 10 passwords at once with TXT export.'
      ],
      useCases: [
        'Creating secure passwords for online banking and email accounts.',
        'Generating strong API keys and database credentials for web apps.',
        'Creating random temporary passwords for user accounts.'
      ]
    },
    faqs: [
      {
        question: 'Are generated passwords sent over the network or saved anywhere?',
        answer: 'Never! Passwords are generated strictly inside your device RAM using Web Crypto API and wiped on refresh.'
      },
      {
        question: 'What password length is considered secure?',
        answer: 'Security experts recommend at least 16 characters mixing uppercase, lowercase, numbers, and symbols.'
      }
    ]
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    iconName: 'Calendar',
    category: 'utility',
    badge: 'Detailed',
    shortDesc: 'Calculate exact age down to years, months, days, hours, and next birthday countdown.',
    fullTitle: 'Exact Age Calculator Online - Calculate Age in Years, Months, Days',
    seoDescription: 'Calculate your exact age online for free. Find age in years, months, days, total weeks, hours, next birthday countdown, and zodiac sign. 100% private browser tool.',
    seoContent: {
      heading: 'Calculate Your Exact Age in Years, Months, Days, and Total Hours',
      intro: 'Ever wondered exactly how many days, weeks, or hours you have lived? ToolAISuite Age Calculator takes your Date of Birth and calculates your exact age down to the day, along with a countdown to your next birthday and zodiac details.',
      howToSteps: [
        'Select your Date of Birth (DOB) using the date picker calendar.',
        'Select the target date (defaults to today).',
        'View your exact age in years, months, and days.',
        'Explore the full lifetime breakdown table and next birthday countdown.'
      ],
      features: [
        'Exact Age Breakdown: Years, months, and days calculated accurately across leap years.',
        'Complete Lifetime Totals: Displays total months, weeks, days, hours, and seconds lived.',
        'Next Birthday Countdown: Exact day count and day of week for your next birthday.',
        'Astrological Zodiac Sign: Includes zodiac sign and personality traits.'
      ],
      useCases: [
        'Calculating exact age for job applications, official forms, and passports.',
        'Finding total days lived for personal anniversary milestones.',
        'Determining exact age differences between family members.'
      ]
    },
    faqs: [
      {
        question: 'Does the age calculator account for leap years?',
        answer: 'Yes! The calculation accurately accounts for leap years and varying month lengths.'
      },
      {
        question: 'Can I calculate age for a past or future date?',
        answer: 'Yes! You can change the "Calculate Age As Of Date" field to any date.'
      }
    ]
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage & Discount Calculator',
    slug: 'percentage-calculator',
    iconName: 'Percent',
    category: 'utility',
    badge: 'Multi-Mode',
    shortDesc: 'Calculate shopping discounts, percentage of value, % change, and test grades.',
    fullTitle: 'Percentage & Discount Calculator Online - Shopping Discount & Test Marks',
    seoDescription: 'Calculate percentages and shopping discounts online for free. Includes discount price calculator, percentage of value, % increase/decrease, and exam marks grade.',
    seoContent: {
      heading: 'All-in-One Percentage, Shopping Discount, and Test Marks Calculator',
      intro: 'Whether calculating sale discounts in a shopping store, determining percentage growth for business metrics, or figuring out exam grades, ToolAISuite Percentage Calculator offers 4 dedicated calculation modes in one clean interface.',
      howToSteps: [
        'Select your calculation tab: Shopping Discount, % Of Value, % Change, or Test Marks.',
        'Enter your input values into the simple input fields.',
        'View instant calculated results with automatic breakdown metrics.'
      ],
      features: [
        '4 Calculation Modes: Shopping Discount, % Of Value, % Increase/Decrease, Test Marks Grade.',
        'Sales Tax & Savings Calculator: Shows final price and exact dollar savings.',
        'Exam Marks & Grade Letter: Converts scores to percentage % and letter grade (A+, A, B, C, F).',
        'Real-Time Instant Math: Calculates as you type with zero delay.'
      ],
      useCases: [
        'Calculating final prices and savings during store discount sales.',
        'Calculating quarterly percentage revenue growth for business reports.',
        'Finding test score percentages and letter grades for student report cards.'
      ]
    },
    faqs: [
      {
        question: 'How does the shopping discount calculator handle sales tax?',
        answer: 'You can enter an optional sales tax or VAT percentage to calculate the exact final total price.'
      },
      {
        question: 'Is this percentage calculator free to use?',
        answer: 'Yes! 100% free with unlimited calculations and zero registration required.'
      }
    ]
  }
];
