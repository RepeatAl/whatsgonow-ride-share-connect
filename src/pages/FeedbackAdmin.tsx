
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type FeedbackItem = {
  id: string;
  title: string;
  content: string;
  feedback_type: string;
  created_at: string;
  status: string;
  email?: string;
};

const FeedbackAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return;
      }

      setFeedbackItems(data || []);
      setLoading(false);
    };

    fetchFeedback();
  }, []);

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
        <h1 className="text-3xl font-bold mb-6">Feedback-Verwaltung</h1>
        <div className="grid gap-4">
          {feedbackItems.map((item) => (
            <Card key={item.id} className="w-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{item.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString('de-DE')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2">{item.content}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span className="bg-primary/10 px-2 py-1 rounded">
                    {item.feedback_type}
                  </span>
                  <span className="bg-secondary/10 px-2 py-1 rounded">
                    {item.status}
                  </span>
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
