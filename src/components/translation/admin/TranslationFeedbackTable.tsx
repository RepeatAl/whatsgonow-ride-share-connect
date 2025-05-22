
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TranslationFeedback } from '@/services/translation-feedback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdminTranslationFeedback } from '@/hooks/use-admin-translation-feedback';

interface TranslationFeedbackTableProps {
  feedbackItems: TranslationFeedback[];
  onStatusChange?: () => void;
}

const TranslationFeedbackTable: React.FC<TranslationFeedbackTableProps> = ({ 
  feedbackItems,
  onStatusChange
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { reviewFeedback, reviewing } = useAdminTranslationFeedback();
  
  const getStatusBadgeVariant = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'in_review':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleQuickApprove = async (id: string) => {
    const success = await reviewFeedback({ 
      id, 
      status: 'approved',
      notes: 'Approved without review'
    });
    
    if (success && onStatusChange) {
      onStatusChange();
    }
  };

  const handleQuickReject = async (id: string) => {
    const success = await reviewFeedback({ 
      id, 
      status: 'rejected',
      notes: 'Rejected without detailed review'
    });
    
    if (success && onStatusChange) {
      onStatusChange();
    }
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/translation-feedback/${id}`);
  };

  if (feedbackItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t('translation.feedback.no_items')}
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>{t('translation.feedback.table_caption')}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('translation.feedback.language_column')}</TableHead>
          <TableHead>{t('translation.feedback.namespace_column')}</TableHead>
          <TableHead>{t('translation.feedback.key_column')}</TableHead>
          <TableHead>{t('translation.feedback.status_column')}</TableHead>
          <TableHead className="text-right">{t('translation.feedback.actions_column')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbackItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.language}</TableCell>
            <TableCell>{item.namespace}</TableCell>
            <TableCell>{item.key}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(item.status)}>
                {item.status || 'pending'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="outline"
                size="icon"
                title={t('translation.feedback.view_details')}
                onClick={() => handleViewDetails(item.id!)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              
              {item.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-green-600 hover:text-green-700"
                    title={t('translation.feedback.approve')}
                    onClick={() => handleQuickApprove(item.id!)}
                    disabled={reviewing}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    title={t('translation.feedback.reject')}
                    onClick={() => handleQuickReject(item.id!)}
                    disabled={reviewing}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TranslationFeedbackTable;
