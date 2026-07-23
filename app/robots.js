import { siteConfig } from '@/lib/siteConfig';

// Next.js genera automáticamente /robots.txt a partir de este archivo.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
