
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminTranslationFeedback } from '@/hooks/use-admin-translation-feedback';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, XCircle, ClockIcon } from 'lucide-react';
import { TranslationFeedback } from '@/services/translation-feedback';

const TranslationFeedbackDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loadFeedbackById, reviewFeedback, reviewing } = useAdminTranslationFeedback();
  const { t } = useTranslation();
  
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      const data = await loadFeedbackById(id);
      setFeedback(data);
      
      // Set admin notes if available in metadata
      if (data?.metadata?.admin_notes) {
        setAdminNotes(data.metadata.admin_notes);
      }
      
      setLoading(false);
    };
    
    fetchFeedbackDetails();
  }, [id]);
  
  const handleBack = () => {
    navigate('/admin/translation-feedback');
  };
  
  const handleApprove = async () => {
    if (!id) return;
    
    const success = await reviewFeedback({
      id,
      status: 'approved',
      notes: adminNotes
    });
    
    if (success) {
      // Refresh the data
      const updated = await loadFeedbackById(id);
      setFeedback(updated);
    }
  };
  
  const handleReject = async () => {
    if (!id) return;
    
    const success = await reviewFeedback({
      id,
      status: 'rejected',
      notes: adminNotes
    });
    
    if (success) {
      // Refresh the data
      const updated = await loadFeedbackById(id);
      setFeedback(updated);
    }
  };
  
  const handleInReview = async () => {
    if (!id) return;
    
    const success = await reviewFeedback({
      id,
      status: 'in_review',
      notes: adminNotes
    });
    
    if (success) {
      // Refresh the data
      const updated = await loadFeedbackById(id);
      setFeedback(updated);
    }
  };
  
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
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!feedback) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">{t('translation.detail.not_found')}</h1>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        
        <h1 className="text-2xl font-bold mb-4">{t('translation.detail.title')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('translation.detail.feedback_info')}</CardTitle>
                <Badge variant={getStatusBadgeVariant(feedback.status)}>
                  {feedback.status || 'pending'}
                </Badge>
              </div>
              <CardDescription>
                {t('translation.detail.submitted_at', { date: new Date(feedback.created_at!).toLocaleDateString() })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">{t('translation.detail.language')}</h3>
                <p>{feedback.language}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">{t('translation.detail.namespace')}</h3>
                <p>{feedback.namespace}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">{t('translation.detail.key')}</h3>
                <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-1 rounded">{feedback.key}</p>
              </div>
              
              {feedback.fallback_content && (
                <div>
                  <h3 className="text-sm font-medium">{t('translation.detail.current_text')}</h3>
                  <p className="italic">{feedback.fallback_content}</p>
                </div>
              )}
              
              {feedback.suggestion && (
                <div>
                  <h3 className="text-sm font-medium">{t('translation.detail.suggested_text')}</h3>
                  <p className="font-medium">{feedback.suggestion}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium">{t('translation.detail.comment')}</h3>
                <p>{feedback.comment}</p>
              </div>
              
              {feedback.page_url && (
                <div>
                  <h3 className="text-sm font-medium">{t('translation.detail.page_url')}</h3>
                  <a 
                    href={feedback.page_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {feedback.page_url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('translation.detail.review_title')}</CardTitle>
              <CardDescription>
                {feedback.reviewed_at 
                  ? t('translation.detail.reviewed_at', { date: new Date(feedback.reviewed_at).toLocaleDateString() }) 
                  : t('translation.detail.not_reviewed_yet')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">{t('translation.detail.admin_notes')}</h3>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={t('translation.detail.notes_placeholder')}
                  rows={4}
                  disabled={reviewing || feedback.status === 'approved' || feedback.status === 'rejected'}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {feedback.status !== 'approved' && (
                <Button
                  variant="outline"
                  className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
                  onClick={handleApprove}
                  disabled={reviewing}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t('translation.detail.approve')}
                </Button>
              )}
              
              {feedback.status !== 'rejected' && (
                <Button
                  variant="outline"
                  className="bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                  onClick={handleReject}
                  disabled={reviewing}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {t('translation.detail.reject')}
                </Button>
              )}
              
              {feedback.status !== 'in_review' && (
                <Button
                  variant="outline"
                  className="bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700"
                  onClick={handleInReview}
                  disabled={reviewing}
                >
                  <ClockIcon className="mr-2 h-4 w-4" />
                  {t('translation.detail.mark_in_review')}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TranslationFeedbackDetail;
