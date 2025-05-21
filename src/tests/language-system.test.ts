
import { determineBestLanguage, validateLanguagePath } from '@/utils/languageUtils';
import { extractLanguageFromUrl, addLanguageToUrl } from '@/contexts/language/utils';

describe('Language System Tests', () => {
  // Language preference logic tests
  describe('determineBestLanguage', () => {
    it('should use user profile language if available', () => {
      const result = determineBestLanguage('en', 'de', 'ar');
      expect(result).toBe('ar');
    });
    
    it('should fallback to localStorage if no profile', () => {
      const result = determineBestLanguage('en', 'de', undefined);
      expect(result).toBe('de');
    });
    
    it('should fallback to browser language if no other preference', () => {
      const result = determineBestLanguage('en', undefined, undefined);
      expect(result).toBe('en');
    });
    
    it('should fallback to default (de) if no valid language found', () => {
      const result = determineBestLanguage('xx', 'yy', 'zz');
      expect(result).toBe('de');
    });
  });
  
  // URL handling tests
  describe('extractLanguageFromUrl', () => {
    it('should extract language code from URL', () => {
      expect(extractLanguageFromUrl('/en/dashboard')).toBe('en');
    });
    
    it('should return default language for paths without language code', () => {
      expect(extractLanguageFromUrl('/dashboard')).toBe('de');
    });
    
    it('should return default language for empty path', () => {
      expect(extractLanguageFromUrl('/')).toBe('de');
    });
  });
  
  describe('addLanguageToUrl', () => {
    it('should add language code to URL without code', () => {
      expect(addLanguageToUrl('/dashboard', 'en')).toBe('/en/dashboard');
    });
    
    it('should replace existing language code', () => {
      expect(addLanguageToUrl('/de/dashboard', 'en')).toBe('/en/dashboard');
    });
    
    it('should handle root path', () => {
      expect(addLanguageToUrl('/', 'en')).toBe('/en');
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
  });
});
