
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import type { FeedbackData } from './types';

export interface FeedbackFormProps {
  onSubmit: (data: FeedbackData) => void;
  onCancel: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const { user } = useSimpleAuth();

  const handleSubmit = () => {
    if (rating === null) {
      alert(t('feedback.rating_required'));
      return;
    }
    
    const feedbackData: FeedbackData = {
      feedbackType: 'general',
      satisfaction: rating,
      features: [],
      comment
    };
    
    onSubmit(feedbackData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('feedback.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Label>{t('feedback.rating')}</Label>
          <RadioGroup defaultValue={rating?.toString() || ''} onValueChange={(value) => setRating(parseInt(value, 10))}>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex items-center space-x-1">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} className="peer sr-only" />
                  <Label
                    htmlFor={`rating-${value}`}
                    className="cursor-pointer peer-checked:bg-accent peer-checked:text-accent-foreground p-1 rounded-md"
                  >
                    <Star className="h-5 w-5" />
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="comment">{t('feedback.comment')}</Label>
          <Textarea
            id="comment"
            placeholder={t('feedback.comment_placeholder')}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit}>{t('submit')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
