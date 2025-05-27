import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

interface TranslationFeedbackFormProps {
  translationKey: string;
  originalText: string;
  translatedText: string;
  onSubmit: (feedback: { rating: number; comment: string; suggestedImprovement: string }) => void;
  onCancel: () => void;
}

const TranslationFeedbackForm: React.FC<TranslationFeedbackFormProps> = ({
  translationKey,
  originalText,
  translatedText,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [suggestedImprovement, setSuggestedImprovement] = useState<string>('');
  const { user } = useSimpleAuth();

  const handleSubmit = () => {
    onSubmit({ rating, comment, suggestedImprovement });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('translation_feedback')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="translationKey">{t('translation_key')}</Label>
          <Input id="translationKey" value={translationKey} readOnly />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="originalText">{t('original_text')}</Label>
          <Textarea id="originalText" value={originalText} readOnly />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="translatedText">{t('translated_text')}</Label>
          <Textarea id="translatedText" value={translatedText} readOnly />
        </div>
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
          <Button variant="ghost" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('submit')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationFeedbackForm;

