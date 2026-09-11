import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

import { constructMetadata, getWebApplicationJsonLd } from '@/lib/seo';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({ children }: LayoutProps<'/'>) {
  const jsonLd = getWebApplicationJsonLd();

  return (
    <html lang='en' className={`${geistSans.className} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  );
}
