
import { describe, it, expect } from 'vitest';
import { AnalyticsValidator } from '@/types/analytics';

describe('Analytics Validation', () => {
  describe('Video Analytics Events', () => {
    it('should validate a correct video event', () => {
      const validEvent = {
        event_type: 'video_started',
        video_id: 'test-video-123',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
        metadata: {
          duration: 120,
          current_time: 0,
          video_url: 'https://example.com/video.mp4'
        }
      };

      const result = AnalyticsValidator.validateVideoEvent(validEvent);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it('should reject video event with missing video_id', () => {
      const invalidEvent = {
        event_type: 'video_started',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateVideoEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toContain('video_id: String must contain at least 1 character(s)');
    });

    it('should reject video event with invalid metadata', () => {
      const invalidEvent = {
        event_type: 'video_started',
        video_id: 'test-video-123',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
        metadata: {
          duration: -5, // Negative duration should be invalid
          completion_percentage: 150 // Over 100% should be invalid
        }
      };

      const result = AnalyticsValidator.validateVideoEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should reject video event with invalid event_type', () => {
      const invalidEvent = {
        event_type: 'invalid_event_type',
        video_id: 'test-video-123',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateVideoEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('Language Analytics Events', () => {
    it('should validate a correct language switch event', () => {
      const validEvent = {
        event_type: 'language_switched',
        from_language: 'de',
        to_language: 'en',
        session_id: 'session-456',
        language: 'en',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateLanguageEvent(validEvent);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject language event with invalid to_language', () => {
      const invalidEvent = {
        event_type: 'language_switched',
        from_language: 'de',
        to_language: 'x', // Too short
        session_id: 'session-456',
        language: 'en',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateLanguageEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('User Journey Events', () => {
    it('should validate a correct page view event', () => {
      const validEvent = {
        event_type: 'page_view',
        page_path: '/dashboard',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'navigation',
          previous_page: '/home'
        }
      };

      const result = AnalyticsValidator.validateUserJourneyEvent(validEvent);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject page view event with empty page_path', () => {
      const invalidEvent = {
        event_type: 'page_view',
        page_path: '', // Empty path should be invalid
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateUserJourneyEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('General Event Validation', () => {
    it('should validate events with discriminated union', () => {
      const videoEvent = {
        event_type: 'video_started',
        video_id: 'test-video-123',
        session_id: 'session-456',
        language: 'de',
        timestamp: new Date().toISOString(),
      };

      const result = AnalyticsValidator.validateEvent(videoEvent);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should reject completely invalid event structure', () => {
      const invalidEvent = {
        random_field: 'random_value',
        another_field: 123
      };

      const result = AnalyticsValidator.validateEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should handle null and undefined gracefully', () => {
      const nullResult = AnalyticsValidator.validateEvent(null);
      const undefinedResult = AnalyticsValidator.validateEvent(undefined);
      
      expect(nullResult.success).toBe(false);
      expect(undefinedResult.success).toBe(false);
    });
  });

  describe('Error Format and Logging', () => {
    it('should provide detailed error messages for validation failures', () => {
      const invalidEvent = {
        event_type: 'video_started',
        video_id: '', // Empty string
        session_id: '', // Empty string
        language: 'x', // Too short
        timestamp: 'invalid-date', // Invalid timestamp
        metadata: {
          duration: 'not-a-number', // Wrong type
          completion_percentage: 150 // Out of range
        }
      };

      const result = AnalyticsValidator.validateVideoEvent(invalidEvent);
      
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(2); // Multiple errors
      
      // Check that errors contain field paths
      const errorString = result.errors!.join(' ');
      expect(errorString).toContain('video_id');
      expect(errorString).toContain('session_id');
      expect(errorString).toContain('language');
    });
  });
});
