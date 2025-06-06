import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

const DraftEdit = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { profile } = useOptimizedAuth();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraft = async () => {
      if (!draftId) return;

      try {
        setLoading(true);
        // Replace with your actual API call to fetch the draft
        const response = await fetch(`/api/drafts/${draftId}`);
        if (!response.ok) throw new Error('Failed to fetch draft');

        const data = await response.json();
        setDraft(data);
      } catch (err) {
        console.error('Error fetching draft:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, [draftId]);

  const handleSave = async () => {
    try {
      // Replace with your actual API call to save the draft
      await fetch(`/api/drafts/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });

      navigate('/my-orders');
    } catch (err) {
      console.error('Error saving draft:', err);
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      // Replace with your actual API call to delete the draft
      await fetch(`/api/drafts/${draftId}`, {
        method: 'DELETE',
      });

      navigate('/my-orders');
    } catch (err) {
      console.error('Error deleting draft:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Layout pageType="authenticated">
        <Card>
          <CardContent>Loading draft...</CardContent>
        </Card>
      </Layout>
    );
  }

  if (error || !draft) {
    return (
      <Layout pageType="authenticated">
        <Card>
          <CardContent>Error: {error || 'Draft not found'}</CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout pageType="authenticated">
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Edit Draft #{draftId}</CardTitle>
            <div className="space-x-2">
              <Button variant="ghost" onClick={() => navigate('/my-orders')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Your form to edit the draft data goes here */}
            <p>Implement your form here to edit the draft data.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DraftEdit;
