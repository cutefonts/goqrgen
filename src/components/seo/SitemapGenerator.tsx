import React, { useEffect } from 'react';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

const SitemapGenerator: React.FC = () => {
  useEffect(() => {
    const generateSitemap = () => {
      const baseUrl = 'https://goqrgen.com';
      const currentDate = new Date().toISOString().split('T')[0];
      
      const pages: SitemapEntry[] = [
        {
          url: `${baseUrl}/`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 1.0
        },
        {
          url: `${baseUrl}/generator`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.9
        },
        {
          url: `${baseUrl}/scanner`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        {
          url: `${baseUrl}/batch`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.8
        },
        {
          url: `${baseUrl}/history`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: 0.7
        },
        {
          url: `${baseUrl}/about`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        },
        {
          url: `${baseUrl}/privacy`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          url: `${baseUrl}/terms`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.5
        },
        {
          url: `${baseUrl}/contact`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: 0.6
        }
      ];

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // In a real application, you would send this to your server
      console.log('Generated sitemap:', sitemapXml);
    };

    generateSitemap();
  }, []);

  return null;
};

export default SitemapGenerator;