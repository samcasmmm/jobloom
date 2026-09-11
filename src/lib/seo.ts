import type { Metadata } from 'next';

export const siteConfig = {
  name: 'Jobloom',
  shortName: 'Jobloom',
  description:
    'A privacy-first, local-first web app to track job applications, interview rounds, and follow-ups. Zero backend, all data stored securely on-device with JSON export/import for backup.',
  url: 'https://jobloom.digitat.in',
  ogImage: 'https://jobloom.digitat.in/og-image.png',
  keywords: [
    'Job Application Tracker',
    'Local-First App',
    'Job Hunt Organizer',
    'Interview Tracker',
    'Career Management',
    'IndexedDB Job Tracker',
    'Offline Job Tracker',
    'JSON Backup Job Tracker',
    'Tech Job Search',
    'Kanban Job Board',
    'Private Job Application Tracker',
  ],
  authors: [
    {
      name: 'Digitat',
      url: 'https://digitat.in',
    },
  ],
  creator: 'Digitat',
  themeColor: '#0a0a0f',
};

export interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
  type?: 'website' | 'article';
}

/**
 * Constructs a type-safe Next.js Metadata object with comprehensive OpenGraph, Twitter cards, and SEO best practices.
 */
export function constructMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  canonicalUrl,
  noIndex = false,
  keywords = siteConfig.keywords,
  type = 'website',
}: ConstructMetadataProps = {}): Metadata {
  const metaTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} — Local-First Job Application Tracker`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: metaTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.creator,
    alternates: {
      canonical: canonicalUrl || './',
    },
    openGraph: {
      title: metaTitle,
      description,
      url: canonicalUrl || siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — Preview`,
        },
      ],
      type,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
      creator: '@jobloom',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  };
}

/**
 * Generates Schema.org JSON-LD structured data for WebApplication / SoftwareApplication
 */
export function getWebApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5 IndexedDB.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Local-first job application tracking with IndexedDB',
      'Interactive Kanban board and Table views',
      'Multi-round interview scheduling & notes',
      'Resume version blob attachment and management',
      'Follow-up reminders and activity timeline',
      'Full structured JSON export & import',
      'Zero backend & complete privacy',
    ],
  };
}
