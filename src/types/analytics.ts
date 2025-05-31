
import { z } from 'zod';

// Base schema for common fields across all events
const BaseAnalyticsEventSchema = z.object({
  session_id: z.string().min(1, 'Session ID is required'),
  user_id: z.string().uuid().optional(),
  region: z.string().optional(),
  language: z.string().min(2, 'Language must be at least 2 characters'),
  timestamp: z.string().datetime('Invalid timestamp format'),
});

// Video-specific metadata schema
const VideoMetadataSchema = z.object({
  duration: z.number().min(0).optional(),
  current_time: z.number().min(0).optional(),
  error_code: z.string().optional(),
  error_message: z.string().optional(),
  video_url: z.string().url().optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
  quality: z.string().optional(),
  watch_duration: z.number().min(0).optional(),
  from_time: z.number().min(0).optional(),
});

// Video Analytics Event Schema
export const VideoAnalyticsEventSchema = BaseAnalyticsEventSchema.extend({
  event_type: z.enum([
    'video_started', 
    'video_paused', 
    'video_completed', 
    'video_error', 
    'video_thumbnail_clicked', 
    'video_seek', 
    'video_quality_changed'
  ]),
  video_id: z.string().min(1, 'Video ID is required'),
  video_title: z.string().optional(),
  metadata: VideoMetadataSchema.optional(),
});

// Language Analytics Event Schema
export const LanguageAnalyticsEventSchema = BaseAnalyticsEventSchema.extend({
  event_type: z.enum(['language_switched', 'region_changed']),
  from_language: z.string().optional(),
  to_language: z.string().min(2, 'Target language is required'),
  from_region: z.string().optional(),
  to_region: z.string().optional(),
});

// User Journey Event Schema
export const UserJourneyEventSchema = BaseAnalyticsEventSchema.extend({
  event_type: z.enum(['page_view', 'feature_used', 'conversion_step']),
  page_path: z.string().min(1, 'Page path is required'),
  metadata: z.record(z.any()).optional(),
});

// Combined Analytics Event Schema
export const AnalyticsEventSchema = z.discriminatedUnion('event_type', [
  VideoAnalyticsEventSchema,
  LanguageAnalyticsEventSchema,
  UserJourneyEventSchema,
]);

// TypeScript interfaces derived from Zod schemas
export type VideoAnalyticsEvent = z.infer<typeof VideoAnalyticsEventSchema>;
export type LanguageAnalyticsEvent = z.infer<typeof LanguageAnalyticsEventSchema>;
export type UserJourneyEvent = z.infer<typeof UserJourneyEventSchema>;
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// Validation results
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Analytics validation utilities
export class AnalyticsValidator {
  static validateEvent(event: unknown): ValidationResult<AnalyticsEvent> {
    try {
      const validatedEvent = AnalyticsEventSchema.parse(event);
      return {
        success: true,
        data: validatedEvent,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error'],
      };
    }
  }

  static validateVideoEvent(event: unknown): ValidationResult<VideoAnalyticsEvent> {
    try {
      const validatedEvent = VideoAnalyticsEventSchema.parse(event);
      return {
        success: true,
        data: validatedEvent,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error'],
      };
    }
  }

  static validateLanguageEvent(event: unknown): ValidationResult<LanguageAnalyticsEvent> {
    try {
      const validatedEvent = LanguageAnalyticsEventSchema.parse(event);
      return {
        success: true,
        data: validatedEvent,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error'],
      };
    }
  }

  static validateUserJourneyEvent(event: unknown): ValidationResult<UserJourneyEvent> {
    try {
      const validatedEvent = UserJourneyEventSchema.parse(event);
      return {
        success: true,
        data: validatedEvent,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        };
      }
      return {
        success: false,
        errors: ['Unknown validation error'],
      };
    }
  }
}
