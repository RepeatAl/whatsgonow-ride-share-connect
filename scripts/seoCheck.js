
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// SEO Quality Checker
class SEOChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
  }

  checkSEOContent() {
    const seoContentPath = path.join(__dirname, '..', 'src', 'data', 'seoContent.ts');
    
    if (!fs.existsSync(seoContentPath)) {
      this.issues.push('❌ SEO content file not found');
      return;
    }

    const content = fs.readFileSync(seoContentPath, 'utf8');
    
    // Check for required languages
    const requiredLanguages = ['de', 'en', 'ar'];
    requiredLanguages.forEach(lang => {
      if (content.includes(`${lang}:`)) {
        this.successes.push(`✅ ${lang.toUpperCase()} language content found`);
      } else {
        this.issues.push(`❌ Missing ${lang.toUpperCase()} language content`);
      }
    });

    // Check for required pages
    const requiredPages = ['landing', 'login', 'register', 'pre-register', 'support', 'faq'];
    requiredPages.forEach(page => {
      if (content.includes(`${page}:`)) {
        this.successes.push(`✅ ${page} page SEO content found`);
      } else {
        this.warnings.push(`⚠️  ${page} page SEO content missing`);
      }
    });

    // Check for SEO fields
    const requiredFields = ['title', 'description', 'keywords'];
    requiredFields.forEach(field => {
      if (content.includes(`${field}:`)) {
        this.successes.push(`✅ ${field} fields found`);
      } else {
        this.issues.push(`❌ Missing ${field} fields`);
      }
    });
  }

  checkRobotsTxt() {
    const robotsPath = path.join(__dirname, '..', 'public', 'robots.txt');
    
    if (!fs.existsSync(robotsPath)) {
      this.issues.push('❌ robots.txt file not found');
      return;
    }

    const content = fs.readFileSync(robotsPath, 'utf8');
    
    if (content.includes('Sitemap:')) {
      this.successes.push('✅ robots.txt has sitemap reference');
    } else {
      this.warnings.push('⚠️  robots.txt missing sitemap reference');
    }

    if (content.includes('Disallow: /admin/')) {
      this.successes.push('✅ robots.txt blocks admin areas');
    } else {
      this.warnings.push('⚠️  robots.txt should block admin areas');
    }
  }

  checkSitemapGenerator() {
    const sitemapGenPath = path.join(__dirname, '..', 'src', 'utils', 'sitemapGenerator.ts');
    
    if (!fs.existsSync(sitemapGenPath)) {
      this.issues.push('❌ Sitemap generator not found');
      return;
    }

    this.successes.push('✅ Sitemap generator found');

    // Check build script
    const buildScriptPath = path.join(__dirname, 'generateSitemap.js');
    if (fs.existsSync(buildScriptPath)) {
      this.successes.push('✅ Build-time sitemap script found');
    } else {
      this.warnings.push('⚠️  Build-time sitemap script missing');
    }
  }

  checkSEOComponents() {
    const seoComponentPath = path.join(__dirname, '..', 'src', 'components', 'seo', 'EnhancedLanguageSEO.tsx');
    
    if (!fs.existsSync(seoComponentPath)) {
      this.issues.push('❌ Enhanced SEO component not found');
      return;
    }

    const content = fs.readFileSync(seoComponentPath, 'utf8');
    
    // Check for essential SEO features
    const features = [
      { name: 'Hreflang tags', pattern: 'hrefLang=' },
      { name: 'Canonical URLs', pattern: 'rel="canonical"' },
      { name: 'Open Graph tags', pattern: 'property="og:' },
      { name: 'Twitter Cards', pattern: 'name="twitter:' },
      { name: 'JSON-LD', pattern: 'application/ld+json' }
    ];

    features.forEach(feature => {
      if (content.includes(feature.pattern)) {
        this.successes.push(`✅ ${feature.name} implemented`);
      } else {
        this.issues.push(`❌ ${feature.name} missing`);
      }
    });
  }

  generateReport() {
    console.log('\n🔍 SEO Quality Check Report\n');
    console.log('=' .repeat(50));

    if (this.successes.length > 0) {
      console.log('\n✅ PASSED CHECKS:');
      this.successes.forEach(success => console.log(`  ${success}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }

    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES TO FIX:');
      this.issues.forEach(issue => console.log(`  ${issue}`));
    }

    console.log('\n' + '=' .repeat(50));
    console.log(`📊 Summary: ${this.successes.length} passed, ${this.warnings.length} warnings, ${this.issues.length} issues`);

    if (this.issues.length === 0) {
      console.log('🎉 SEO implementation looks good!');
    } else {
      console.log('🔧 Please fix the issues above for optimal SEO');
    }

    console.log('\n📋 Next Steps:');
    console.log('  1. Run: node scripts/generateSitemap.js');
    console.log('  2. Integrate EnhancedLanguageSEO in your pages');
    console.log('  3. Test hreflang tags with Google Search Console');
    console.log('  4. Monitor SEO performance with analytics');
  }

  run() {
    console.log('🚀 Starting SEO quality check...\n');
    
    this.checkSEOContent();
    this.checkRobotsTxt();
    this.checkSitemapGenerator();
    this.checkSEOComponents();
    
    this.generateReport();
  }
}

// Run the checker
const checker = new SEOChecker();
checker.run();
