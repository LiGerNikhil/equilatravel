import { MetadataRoute } from 'next';

const baseUrl = 'https://www.equilatravel.com';

const serviceSlugs = [
  'city-rides',
  'airport-transfers',
  'flight-booking',
  'visa-assistance',
  'outstation-trips',
  'hourly-rentals',
  'corporate-travel',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date('2026-06-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date('2026-06-08'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...servicePages,
    {
      url: `${baseUrl}/fleet`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2026-06-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
