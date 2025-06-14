
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

interface TranslationFeedbackFormProps {
  namespace?: string;
  translationKey?: string;
  fallbackContent?: string;
  onSubmitSuccess: () => void;
}

const TranslationFeedbackForm: React.FC<TranslationFeedbackFormProps> = ({
  namespace,
  translationKey,
  fallbackContent,
  onSubmitSuccess,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [suggestedImprovement, setSuggestedImprovement] = useState<string>('');
  const { user } = useOptimizedAuth();

  const handleSubmit = () => {
    // Simulate submission
    console.log('Submitting translation feedback:', {
      namespace,
      translationKey,
      fallbackContent,
      rating,
      comment,
      suggestedImprovement
    });
    onSubmitSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('translation_feedback')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {translationKey && (
          <div className="grid gap-2">
            <Label htmlFor="translationKey">{t('translation_key')}</Label>
            <Input id="translationKey" value={translationKey} readOnly />
          </div>
        )}
        {fallbackContent && (
          <div className="grid gap-2">
            <Label htmlFor="fallbackContent">{t('content')}</Label>
            <Textarea id="fallbackContent" value={fallbackContent} readOnly />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="rating">{t('rating')}</Label>
          <Select value={rating.toString()} onValueChange={(value) => setRating(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder={t('select_rating')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - {t('very_bad')}</SelectItem>
              <SelectItem value="2">2 - {t('bad')}</SelectItem>
              <SelectItem value="3">3 - {t('okay')}</SelectItem>
              <SelectItem value="4">4 - {t('good')}</SelectItem>
              <SelectItem value="5">5 - {t('very_good')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comment">{t('comment')}</Label>
          <Textarea
            id="comment"
            placeholder={t('enter_comment')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="suggestedImprovement">{t('suggested_improvement')}</Label>
          <Textarea
            id="suggestedImprovement"
            placeholder={t('enter_suggested_improvement')}
            value={suggestedImprovement}
            onChange={(e) => setSuggestedImprovement(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmit}>{t('submit')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationFeedbackForm;
