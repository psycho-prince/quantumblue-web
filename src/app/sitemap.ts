import { MetadataRoute } from 'next'

const base = 'https://quantum-blue.in'

const pages: MetadataRoute.Sitemap = [
  { url: base, lastModified: new Date('2026-09-22'), changeFrequency: 'weekly', priority: 1.0 },
  { url: `${base}/compliance`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${base}/docs`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${base}/scanner`, lastModified: new Date('2026-09-22'), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${base}/pricing`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${base}/legal`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/platform`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/press`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/resources`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/contact`, lastModified: new Date('2026-09-22'), changeFrequency: 'yearly', priority: 0.6 },
  { url: `${base}/privacy`, lastModified: new Date('2026-09-22'), changeFrequency: 'yearly', priority: 0.6 },
  { url: `${base}/terms`, lastModified: new Date('2026-09-22'), changeFrequency: 'yearly', priority: 0.6 },
  { url: `${base}/it-regulations`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/blog`, lastModified: new Date('2026-09-22'), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${base}/blog/fips-204-hybrid-signatures-explained`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/blog/how-to-migrate-nginx-to-ml-kem`, lastModified: new Date('2026-09-22'), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${base}/resources/ovs-critique`, lastModified: new Date('2026-09-22'), changeFrequency: 'yearly', priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
}
