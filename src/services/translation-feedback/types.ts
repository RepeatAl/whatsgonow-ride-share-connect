
export interface TranslationFeedback {
  id?: string;
  created_at?: string;
  user_id?: string;
  email?: string;
  language: string;
  namespace: string;
  key: string;
  fallback_content?: string;
  suggestion?: string;
  comment: string;
  status?: string;
  page_url?: string;
  screenshot_url?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  metadata?: Record<string, any>;
}

export interface TranslationFeedbackFilter {
  language?: string;
  namespace?: string;
  status?: string;
  user_id?: string;
}

export interface ReviewFeedbackParams {
  id: string;
  status: 'approved' | 'rejected' | 'in_review';
  notes?: string;
}
