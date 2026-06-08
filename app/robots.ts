import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/services', '/fleet', '/contact', '/privacy-policy', '/terms'],
        disallow: ['/api/', '/admin/', '/vendor/'],
      },
    ],
    sitemap: 'https://www.equilatravel.com/sitemap.xml',
  };
}
