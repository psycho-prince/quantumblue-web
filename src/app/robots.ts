import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/sign-in', '/sign-up', '/dashboard', '/profile', '/forgot-password', '/checkout', '/cancel', '/shipping'],
    },
    sitemap: 'https://quantum-blue.in/sitemap.xml',
  }
}
