interface AnalyticsError {
  timestamp: string;
  errorType: 'validation' | 'database' | 'system';
  originalEvent?: unknown;
  validationErrors?: string[];
  databaseError?: string;
  systemError?: string;
  sessionId: string;
  userAgent?: string;
}

class AnalyticsErrorLogger {
  private static errors: AnalyticsError[] = [];
  private static maxErrors = 100; // Keep last 100 errors in memory

  static logValidationError(
    originalEvent: unknown, 
    validationErrors: string[], 
    sessionId: string
  ): void {
    const error: AnalyticsError = {
      timestamp: new Date().toISOString(),
      errorType: 'validation',
      originalEvent,
      validationErrors,
      sessionId,
      userAgent: navigator.userAgent,
    };

    this.addError(error);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🔍 Analytics Validation Error');
      console.error('Event:', originalEvent);
      console.error('Errors:', validationErrors);
      console.error('Session:', sessionId);
      console.groupEnd();
    }
  }

  static logDatabaseError(
    event: unknown, 
    databaseError: string, 
    sessionId: string
  ): void {
    const error: AnalyticsError = {
      timestamp: new Date().toISOString(),
      errorType: 'database',
      originalEvent: event,
      databaseError,
      sessionId,
      userAgent: navigator.userAgent,
    };

    this.addError(error);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('💾 Analytics Database Error');
      console.error('Event:', event);
      console.error('Error:', databaseError);
      console.error('Session:', sessionId);
      console.groupEnd();
    }
  }

  static logSystemError(
    originalEvent: unknown, 
    systemError: string, 
    sessionId: string
  ): void {
    const error: AnalyticsError = {
      timestamp: new Date().toISOString(),
      errorType: 'system',
      originalEvent,
      systemError,
      sessionId,
      userAgent: navigator.userAgent,
    };

    this.addError(error);
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('⚠️ Analytics System Error');
      console.error('Event:', originalEvent);
      console.error('Error:', systemError);
      console.error('Session:', sessionId);
      console.groupEnd();
    }
  }

  private static addError(error: AnalyticsError): void {
    this.errors.push(error);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }
  }

  static getRecentErrors(limit: number = 10): AnalyticsError[] {
    return this.errors.slice(-limit).reverse(); // Most recent first
  }

  static getErrorsByType(errorType: AnalyticsError['errorType']): AnalyticsError[] {
    return this.errors.filter(error => error.errorType === errorType);
  }

  static getErrorCount(): { validation: number; database: number; system: number; total: number } {
    const validation = this.errors.filter(e => e.errorType === 'validation').length;
    const database = this.errors.filter(e => e.errorType === 'database').length;
    const system = this.errors.filter(e => e.errorType === 'system').length;
    
    return {
      validation,
      database,
      system,
      total: this.errors.length,
    };
  }

  static clearErrors(): void {
    this.errors = [];
  }
}

export default AnalyticsErrorLogger;
