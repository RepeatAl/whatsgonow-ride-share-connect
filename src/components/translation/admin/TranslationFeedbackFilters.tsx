
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TranslationFeedbackFilter } from '@/services/translation-feedback';
import { useTranslation } from 'react-i18next';
import { RefreshCw } from 'lucide-react';

interface TranslationFeedbackFiltersProps {
  filters: TranslationFeedbackFilter;
  onFiltersChange: (filters: TranslationFeedbackFilter) => void;
  onRefresh: () => void;
  languages: string[];
  namespaces: string[];
}

const TranslationFeedbackFilters: React.FC<TranslationFeedbackFiltersProps> = ({
  filters,
  onFiltersChange,
  onRefresh,
  languages,
  namespaces
}) => {
  const { t } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    onFiltersChange({ ...filters, language: value || undefined });
  };

  const handleNamespaceChange = (value: string) => {
    onFiltersChange({ ...filters, namespace: value || undefined });
  };

  const handleStatusChange = (value: string) => {
    onFiltersChange({ ...filters, status: value || undefined });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language-filter">{t('translation.filters.language')}</Label>
            <Select
              value={filters.language || ''}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="language-filter">
                <SelectValue placeholder={t('translation.filters.all_languages')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('translation.filters.all_languages')}</SelectItem>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="namespace-filter">{t('translation.filters.namespace')}</Label>
            <Select
              value={filters.namespace || ''}
              onValueChange={handleNamespaceChange}
            >
              <SelectTrigger id="namespace-filter">
                <SelectValue placeholder={t('translation.filters.all_namespaces')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('translation.filters.all_namespaces')}</SelectItem>
                {namespaces.map(ns => (
                  <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-filter">{t('translation.filters.status')}</Label>
            <Select
              value={filters.status || ''}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder={t('translation.filters.all_statuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('translation.filters.all_statuses')}</SelectItem>
                <SelectItem value="pending">{t('translation.status.pending')}</SelectItem>
                <SelectItem value="in_review">{t('translation.status.in_review')}</SelectItem>
                <SelectItem value="approved">{t('translation.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('translation.status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end space-x-2">
            <Button variant="outline" onClick={handleReset}>
              {t('translation.filters.reset')}
            </Button>
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('translation.filters.refresh')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationFeedbackFilters;
