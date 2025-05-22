
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslationFeedback } from '@/hooks/use-translation-feedback';
import { TranslationFeedback } from '@/services/translation-feedback';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

interface TranslationFeedbackFormProps {
  namespace?: string;
  translationKey?: string;
  fallbackContent?: string;
  onSubmitSuccess?: () => void;
}

const TranslationFeedbackForm: React.FC<TranslationFeedbackFormProps> = ({
  namespace = '',
  translationKey = '',
  fallbackContent = '',
  onSubmitSuccess
}) => {
  const { user } = useAuth();
  const { submitFeedback, submitting } = useTranslationFeedback();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Partial<TranslationFeedback>>({
    namespace,
    key: translationKey,
    fallback_content: fallbackContent,
    comment: '',
    suggestion: '',
    email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.namespace || !formData.key || !formData.comment) {
      return;
    }
    
    // Submit feedback
    const success = await submitFeedback(formData as TranslationFeedback);
    if (success) {
      setFormData(prev => ({
        ...prev,
        comment: '',
        suggestion: ''
      }));
      onSubmitSuccess?.();
    }
  };

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{t('translation.feedback.title')}</CardTitle>
          <CardDescription>
            {t('translation.feedback.description')}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="email">{t('translation.feedback.email_label')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('translation.feedback.email_placeholder')}
                value={formData.email || ''}
                onChange={handleChange}
                required={!user}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="namespace">{t('translation.feedback.namespace_label')}</Label>
            <Input
              id="namespace"
              name="namespace"
              value={formData.namespace || ''}
              onChange={handleChange}
              placeholder="common, auth, dashboard"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key">{t('translation.feedback.key_label')}</Label>
            <Input
              id="key"
              name="key"
              value={formData.key || ''}
              onChange={handleChange}
              placeholder="welcome.title, error.not_found"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fallback_content">{t('translation.feedback.current_text_label')}</Label>
            <Input
              id="fallback_content"
              name="fallback_content"
              value={formData.fallback_content || ''}
              onChange={handleChange}
              placeholder={t('translation.feedback.current_text_placeholder')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="suggestion">{t('translation.feedback.suggestion_label')}</Label>
            <Textarea
              id="suggestion"
              name="suggestion"
              value={formData.suggestion || ''}
              onChange={handleChange}
              placeholder={t('translation.feedback.suggestion_placeholder')}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">{t('translation.feedback.comment_label')}</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment || ''}
              onChange={handleChange}
              placeholder={t('translation.feedback.comment_placeholder')}
              rows={3}
              required
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                {t('translation.feedback.submitting')}
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              t('translation.feedback.submit')
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TranslationFeedbackForm;
