import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, User, Calendar, MessageSquare, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/hooks/use-toast';

interface TranslationFeedback {
  id: string;
  user_id: string;
  page_url: string;
  language_code: string;
  feedback_type: string;
  content: string;
  suggested_translation: string | null;
  status: string;
  created_at: string;
  admin_response: string | null;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const TranslationFeedbackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<TranslationFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminResponse, setAdminResponse] = useState('');
  const [status, setStatus] = useState('pending');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchFeedbackDetail();
    }
  }, [id]);

  const fetchFeedbackDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_feedback')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setFeedback(data);
      setAdminResponse(data.admin_response || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching feedback detail:', error);
      toast({
        title: "Fehler",
        description: "Feedback konnte nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!feedback) return;

    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('translation_feedback')
        .update({
          status,
          admin_response: adminResponse,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedback.id);

      if (error) throw error;

      toast({
        title: "Erfolgreich aktualisiert",
        description: "Das Feedback wurde erfolgreich aktualisiert.",
      });

      // Refresh data
      await fetchFeedbackDetail();
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast({
        title: "Fehler",
        description: "Feedback konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'default'; // Changed from 'success' to 'default'
      case 'in_progress':
        return 'secondary'; // Changed from 'warning' to 'secondary' 
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'error':
        return 'destructive';
      case 'improvement':
        return 'outline';
      case 'missing':
        return 'secondary'; // Changed from 'warning' to 'secondary'
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Feedback nicht gefunden</h1>
          <Button onClick={() => navigate('/admin/translation-feedback')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/translation-feedback')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <h1 className="text-3xl font-bold">Translation Feedback Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(feedback.status)}>
            {feedback.status}
          </Badge>
          <Badge variant={getTypeBadgeVariant(feedback.feedback_type)}>
            {feedback.feedback_type}
          </Badge>
        </div>
      </div>

      {/* Feedback Details */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">User:</span>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{feedback.profiles?.first_name} {feedback.profiles?.last_name} ({feedback.profiles?.email})</span>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Created At:</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(feedback.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">Page URL:</span>
            <a href={feedback.page_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {feedback.page_url}
            </a>
          </div>
          <div>
            <span className="text-sm font-medium">Language Code:</span>
            <span>{feedback.language_code}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Feedback Type:</span>
            <span>{feedback.feedback_type}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Content:</span>
            <p className="whitespace-pre-line">{feedback.content}</p>
          </div>
          {feedback.suggested_translation && (
            <div>
              <span className="text-sm font-medium">Suggested Translation:</span>
              <p className="whitespace-pre-line">{feedback.suggested_translation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Response */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea 
              placeholder="Admin Response"
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
            />
          </div>
          <div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleUpdate} 
            disabled={updating}
          >
            {updating ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Updating...
              </>
            ) : (
              "Update Feedback"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslationFeedbackDetail;
