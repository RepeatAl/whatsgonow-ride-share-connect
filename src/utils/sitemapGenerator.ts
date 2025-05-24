
import { supportedLanguages } from '@/config/supportedLanguages';

interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  alternates?: { hreflang: string; href: string }[];
}

interface SitemapOptions {
  baseUrl?: string;
  includeAlternates?: boolean;
}

export class SitemapGenerator {
  private baseUrl: string;
  private includeAlternates: boolean;
  private implementedLanguages = ['de', 'en', 'ar'];

  constructor(options: SitemapOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://whatsgonow.com';
    this.includeAlternates = options.includeAlternates ?? true;
  }

  private getRoutes(): Array<{
    path: string;
    priority: number;
    changefreq: SitemapEntry['changefreq'];
    languages?: string[];
  }> {
    return [
      // Main pages - highest priority
      { path: '/', priority: 1.0, changefreq: 'daily' },
      
      // Authentication pages - high priority
      { path: '/login', priority: 0.8, changefreq: 'monthly' },
      { path: '/register', priority: 0.8, changefreq: 'monthly' },
      { path: '/pre-register', priority: 0.9, changefreq: 'weekly' },
      
      // Information pages - medium priority
      { path: '/faq', priority: 0.7, changefreq: 'weekly' },
      { path: '/support', priority: 0.7, changefreq: 'weekly' },
      { path: '/legal', priority: 0.5, changefreq: 'monthly' },
      { path: '/privacy-policy', priority: 0.5, changefreq: 'monthly' },
      
      // Success pages - lower priority
      { path: '/register/success', priority: 0.3, changefreq: 'yearly' },
      { path: '/pre-register/success', priority: 0.3, changefreq: 'yearly' },
      { path: '/forgot-password', priority: 0.4, changefreq: 'yearly' },
    ];
  }

  private generateAlternates(path: string): Array<{ hreflang: string; href: string }> {
    if (!this.includeAlternates) return [];

    const alternates: Array<{ hreflang: string; href: string }> = [];
    
    // Language-country mapping
    const languageCountryMap: Record<string, string> = {
      'de': 'de-DE',
      'en': 'en-US',
      'ar': 'ar-SA'
    };

    // Add alternates for each implemented language
    this.implementedLanguages.forEach(lang => {
      const hreflang = languageCountryMap[lang] || lang;
      const href = `${this.baseUrl}/${lang}${path === '/' ? '' : path}`;
      alternates.push({ hreflang, href });
    });

    // Add x-default (German as default)
    alternates.push({
      hreflang: 'x-default',
      href: `${this.baseUrl}/de${path === '/' ? '' : path}`
    });

    return alternates;
  }

  public generateSitemap(): string {
    const routes = this.getRoutes();
    const entries: SitemapEntry[] = [];
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    routes.forEach(route => {
      this.implementedLanguages.forEach(lang => {
        const url = `${this.baseUrl}/${lang}${route.path === '/' ? '' : route.path}`;
        const alternates = this.generateAlternates(route.path);

        entries.push({
          url,
          lastmod: now,
          changefreq: route.changefreq,
          priority: route.priority,
          alternates: this.includeAlternates ? alternates : undefined
        });
      });
    });

    return this.generateXML(entries);
  }

  private generateXML(entries: SitemapEntry[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
    
    if (this.includeAlternates) {
      xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"';
    }
    
    xml += '>\n';

    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.url)}</loc>\n`;
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
      xml += `    <priority>${entry.priority}</priority>\n`;

      // Add alternate language links
      if (entry.alternates && entry.alternates.length > 0) {
        entry.alternates.forEach(alternate => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${this.escapeXml(alternate.href)}" />\n`;
        });
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  public generateSitemapIndex(): string {
    const now = new Date().toISOString().split('T')[0];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Main sitemap
    xml += '  <sitemap>\n';
    xml += `    <loc>${this.baseUrl}/sitemap.xml</loc>\n`;
    xml += `    <lastmod>${now}</lastmod>\n`;
    xml += '  </sitemap>\n';

    // Language-specific sitemaps (future expansion)
    this.implementedLanguages.forEach(lang => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.baseUrl}/sitemap-${lang}.xml</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }
}

// Utility function to generate and log sitemap
export const generateAndLogSitemap = (baseUrl?: string): void => {
  const generator = new SitemapGenerator({ baseUrl });
  const sitemap = generator.generateSitemap();
  
  console.log('Generated Sitemap:');
  console.log(sitemap);
  
  // In a real app, you would save this to public/sitemap.xml
  // For now, we log it for review
};
