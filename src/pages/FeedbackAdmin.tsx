
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';

type FeedbackItem = {
  id: string;
  title: string;
  content: string;
  feedback_type: string;
  created_at: string;
  status: string;
  email?: string;
  satisfaction_rating?: number;
};

const FeedbackAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Feedback konnte nicht geladen werden.",
          variant: "destructive"
        });
        return;
      }

      setFeedbackItems(data || []);
      setLoading(false);
    };

    fetchFeedback();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('feedback_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'feedback' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchFeedback();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateFeedbackStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('feedback')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Erfolgreich",
      description: "Feedback-Status wurde aktualisiert.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const filteredFeedback = feedbackItems.filter(item => 
    filter === 'all' ? true : item.status === filter
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Feedback-Verwaltung</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="open">Offen</SelectItem>
              <SelectItem value="in_progress">In Bearbeitung</SelectItem>
              <SelectItem value="resolved">Erledigt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredFeedback.map((item) => (
            <Card key={item.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {item.title}
                      {item.satisfaction_rating && (
                        <Badge variant="outline">
                          {item.satisfaction_rating}/5
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">
                        {item.feedback_type}
                      </Badge>
                      <Badge 
                        variant={item.status === 'resolved' ? 'default' : 'outline'}
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(item.status)}
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('de-DE')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{item.content}</p>
                {item.email && (
                  <p className="text-sm text-muted-foreground">
                    Kontakt: {item.email}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateFeedbackStatus(item.id, 'in_progress')}
                    disabled={item.status === 'in_progress'}
                  >
                    In Bearbeitung
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateFeedbackStatus(item.id, 'resolved')}
                    disabled={item.status === 'resolved'}
                  >
                    Als erledigt markieren
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackAdmin;
