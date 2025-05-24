
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple sitemap generator for build time
class SimpleSitemapGenerator {
  constructor(baseUrl = 'https://whatsgonow.com') {
    this.baseUrl = baseUrl;
    this.implementedLanguages = ['de', 'en', 'ar'];
  }

  generateSitemap() {
    const routes = [
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/login', priority: 0.8, changefreq: 'monthly' },
      { path: '/register', priority: 0.8, changefreq: 'monthly' },
      { path: '/pre-register', priority: 0.9, changefreq: 'weekly' },
      { path: '/faq', priority: 0.7, changefreq: 'weekly' },
      { path: '/support', priority: 0.7, changefreq: 'weekly' },
      { path: '/legal', priority: 0.5, changefreq: 'monthly' },
      { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
      { path: '/register/success', priority: 0.3, changefreq: 'yearly' },
      { path: '/pre-register/success', priority: 0.3, changefreq: 'yearly' },
      { path: '/forgot-password', priority: 0.4, changefreq: 'yearly' }
    ];

    const now = new Date().toISOString().split('T')[0];
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    routes.forEach(route => {
      this.implementedLanguages.forEach(lang => {
        const url = `${this.baseUrl}/${lang}${route.path === '/' ? '' : route.path}`;
        
        xml += '  <url>\n';
        xml += `    <loc>${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;

        // Add alternates
        this.implementedLanguages.forEach(altLang => {
          const hreflang = altLang === 'de' ? 'de-DE' : altLang === 'en' ? 'en-US' : 'ar-SA';
          const altUrl = `${this.baseUrl}/${altLang}${route.path === '/' ? '' : route.path}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${altUrl}" />\n`;
        });

        // x-default
        const defaultUrl = `${this.baseUrl}/de${route.path === '/' ? '' : route.path}`;
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}" />\n`;

        xml += '  </url>\n';
      });
    });

    xml += '</urlset>';
    return xml;
  }
}

// Generate and save sitemap
const generator = new SimpleSitemapGenerator();
const sitemap = generator.generateSitemap();

const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ Sitemap generated successfully at:', sitemapPath);
console.log('📊 Generated', sitemap.split('<url>').length - 1, 'URLs');
