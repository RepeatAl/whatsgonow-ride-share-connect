
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { determineBestLanguage, validateLanguagePath } from '@/utils/languageUtils';
import { extractLanguageFromUrl, addLanguageToUrl } from '@/contexts/language/utils';

describe('Language System Tests - MCP Compatible', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      writable: true,
      value: 'en-US'
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Language preference logic tests - updated for MCP
  describe('determineBestLanguage', () => {
    it('should use user profile language if available and valid', () => {
      const result = determineBestLanguage('en', 'de', 'ar');
      expect(result).toBe('ar');
    });
    
    it('should fallback to localStorage if no profile but valid stored language', () => {
      const result = determineBestLanguage('en', 'de', undefined);
      expect(result).toBe('de');
    });
    
    it('should fallback to browser language if no other preference and valid', () => {
      const result = determineBestLanguage('en', undefined, undefined);
      expect(result).toBe('en');
    });
    
    it('should fallback to default (de) if no valid language found', () => {
      const result = determineBestLanguage('xx', 'yy', 'zz');
      expect(result).toBe('de');
    });

    it('should handle null/undefined stored language', () => {
      const result = determineBestLanguage('en', null, undefined);
      expect(result).toBe('en');
    });

    it('should prioritize valid user profile over invalid stored language', () => {
      const result = determineBestLanguage('invalid', 'invalid-stored', 'ar');
      expect(result).toBe('ar');
    });
  });
  
  // URL handling tests - MCP compatible
  describe('extractLanguageFromUrl', () => {
    it('should extract language code from URL with valid language', () => {
      expect(extractLanguageFromUrl('/en/dashboard')).toBe('en');
      expect(extractLanguageFromUrl('/de/profile')).toBe('de');
      expect(extractLanguageFromUrl('/ar/orders')).toBe('ar');
    });
    
    it('should return default language for paths without language code', () => {
      expect(extractLanguageFromUrl('/dashboard')).toBe('de');
      expect(extractLanguageFromUrl('/profile/settings')).toBe('de');
    });
    
    it('should return default language for empty or root path', () => {
      expect(extractLanguageFromUrl('/')).toBe('de');
      expect(extractLanguageFromUrl('')).toBe('de');
    });

    it('should return default language for invalid language codes', () => {
      expect(extractLanguageFromUrl('/xx/dashboard')).toBe('de');
      expect(extractLanguageFromUrl('/invalid/profile')).toBe('de');
    });
  });
  
  describe('addLanguageToUrl', () => {
    it('should add language code to URL without existing code', () => {
      expect(addLanguageToUrl('/dashboard', 'en')).toBe('/en/dashboard');
      expect(addLanguageToUrl('/profile/settings', 'ar')).toBe('/ar/profile/settings');
    });
    
    it('should replace existing language code with new one', () => {
      expect(addLanguageToUrl('/de/dashboard', 'en')).toBe('/en/dashboard');
      expect(addLanguageToUrl('/en/profile', 'ar')).toBe('/ar/profile');
    });
    
    it('should handle root path correctly', () => {
      expect(addLanguageToUrl('/', 'en')).toBe('/en');
      expect(addLanguageToUrl('/', 'ar')).toBe('/ar');
    });

    it('should handle paths with query parameters', () => {
      expect(addLanguageToUrl('/dashboard?tab=orders', 'en')).toBe('/en/dashboard?tab=orders');
    });
  });
  
  describe('validateLanguagePath', () => {
    it('should validate path with valid language prefix', () => {
      const result = validateLanguagePath('/en/dashboard');
      expect(result.isValid).toBe(true);
      expect(result.languageCode).toBe('en');
      expect(result.hasLanguagePrefix).toBe(true);
      expect(result.redirectPath).toBeUndefined();
    });
    
    it('should validate path with Arabic language prefix', () => {
      const result = validateLanguagePath('/ar/profile');
      expect(result.isValid).toBe(true);
      expect(result.languageCode).toBe('ar');
      expect(result.hasLanguagePrefix).toBe(true);
      expect(result.redirectPath).toBeUndefined();
    });
    
    it('should invalidate path without language prefix', () => {
      const result = validateLanguagePath('/dashboard');
      expect(result.isValid).toBe(false);
      expect(result.languageCode).toBe(null);
      expect(result.hasLanguagePrefix).toBe(false);
      expect(result.redirectPath).toBe('/de/dashboard');
    });
    
    it('should invalidate path with invalid language prefix', () => {
      const result = validateLanguagePath('/xx/dashboard');
      expect(result.isValid).toBe(false);
      expect(result.languageCode).toBe(null);
      expect(result.hasLanguagePrefix).toBe(false);
      expect(result.redirectPath).toBe('/de/xx/dashboard');
    });

    it('should handle root path validation', () => {
      const result = validateLanguagePath('/');
      expect(result.isValid).toBe(false);
      expect(result.languageCode).toBe(null);
      expect(result.hasLanguagePrefix).toBe(false);
      expect(result.redirectPath).toBe('/de/');
    });
  });
});

describe('MCP Language System Integration Tests', () => {
  describe('Language Detection Logic', () => {
    it('should prioritize user profile over browser preference', () => {
      const result = determineBestLanguage('en', undefined, 'ar');
      expect(result).toBe('ar');
    });
    
    it('should use browser language when no other preferences available', () => {
      const result = determineBestLanguage('en', undefined, undefined);
      expect(result).toBe('en');
    });

    it('should fallback to default when all preferences are invalid', () => {
      const result = determineBestLanguage('xyz', 'abc', 'invalid');
      expect(result).toBe('de');
    });
  });
  
  describe('URL Language Handling', () => {
    it('should correctly handle language switching in URLs', () => {
      const originalUrl = '/de/dashboard/orders';
      const newUrl = addLanguageToUrl(originalUrl, 'en');
      expect(newUrl).toBe('/en/dashboard/orders');
      
      const extractedLang = extractLanguageFromUrl(newUrl);
      expect(extractedLang).toBe('en');
    });
    
    it('should maintain URL structure during language changes', () => {
      const complexUrl = '/ar/profile/settings/notifications';
      const switchedUrl = addLanguageToUrl(complexUrl, 'de');
      expect(switchedUrl).toBe('/de/profile/settings/notifications');
    });
  });
  
  describe('MCP Error Handling', () => {
    it('should handle malformed URLs gracefully', () => {
      expect(() => extractLanguageFromUrl('///malformed///')).not.toThrow();
      expect(() => addLanguageToUrl('///malformed///', 'en')).not.toThrow();
    });
    
    it('should validate language codes properly', () => {
      const validationResult = validateLanguagePath('/valid-but-unknown-lang/dashboard');
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.redirectPath).toBeDefined();
    });
  });

  describe('RTL Language Support', () => {
    it('should handle Arabic language paths correctly', () => {
      const arabicPath = '/ar/dashboard';
      const validation = validateLanguagePath(arabicPath);
      expect(validation.isValid).toBe(true);
      expect(validation.languageCode).toBe('ar');
    });
    
    it('should maintain RTL language in URL operations', () => {
      const rtlUrl = '/ar/profile';
      const newUrl = addLanguageToUrl(rtlUrl, 'ar');
      expect(newUrl).toBe('/ar/profile');
    });
  });
});
