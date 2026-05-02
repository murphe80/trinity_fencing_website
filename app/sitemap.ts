import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://trinityfencing.ie'

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/events`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/achievements`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/members`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/membership`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/friends`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]
}
