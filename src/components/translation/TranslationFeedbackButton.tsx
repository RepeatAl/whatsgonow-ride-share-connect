
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TranslationFeedbackForm from './TranslationFeedbackForm';
import { useLanguage } from '@/contexts/language';

interface TranslationFeedbackButtonProps {
  translationKey?: string;
  namespace?: string;
  fallbackContent?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

const TranslationFeedbackButton: React.FC<TranslationFeedbackButtonProps> = ({
  translationKey,
  namespace,
  fallbackContent,
  size = 'sm',
  variant = 'outline'
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  
  const handleSubmitSuccess = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <MessageSquare className="h-4 w-4 mr-2" />
          {t('translation.feedback.report_button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('translation.feedback.dialog_title')}</DialogTitle>
          <DialogDescription>
            {t('translation.feedback.dialog_description', { language: currentLanguage })}
          </DialogDescription>
        </DialogHeader>
        
        <TranslationFeedbackForm 
          namespace={namespace}
          translationKey={translationKey}
          fallbackContent={fallbackContent}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TranslationFeedbackButton;
