import React from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAdminTranslationFeedback } from '@/hooks/use-admin-translation-feedback';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

const TranslationFeedbackAdmin = () => {
  const { profile } = useOptimizedAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadAllFeedback, reviewFeedback } = useAdminTranslationFeedback();

  // Redirect non-admin users
  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return (
      <Layout pageType="admin">
        <div className="container mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Zugriff verweigert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Administratoren zugänglich.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/dashboard')}
              >
                Zurück zum Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const filter = activeTab !== 'all' ? { status: activeTab } : {};
        const data = await loadAllFeedback(filter);
        setFeedbackItems(data);
      } catch (error) {
        console.error('Error loading feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [activeTab, loadAllFeedback]);

  const handleApprove = async (id) => {
    await reviewFeedback({
      feedbackId: id,
      status: 'approved',
      adminNotes: 'Approved by admin'
    });
    
    // Refresh the list
    const updatedData = await loadAllFeedback(
      activeTab !== 'all' ? { status: activeTab } : {}
    );
    setFeedbackItems(updatedData);
  };

  const handleReject = async (id) => {
    await reviewFeedback({
      feedbackId: id,
      status: 'rejected',
      adminNotes: 'Rejected by admin'
    });
    
    // Refresh the list
    const updatedData = await loadAllFeedback(
      activeTab !== 'all' ? { status: activeTab } : {}
    );
    setFeedbackItems(updatedData);
  };

  const columns = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.id.substring(0, 8)}...</span>
    },
    {
      accessorKey: 'language',
      header: 'Sprache',
      cell: ({ row }) => <Badge variant="outline">{row.original.language}</Badge>
    },
    {
      accessorKey: 'translation_key',
      header: 'Übersetzungsschlüssel',
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-mono text-xs">
          {row.original.translation_key}
        </div>
      )
    },
    {
      accessorKey: 'comment',
      header: 'Kommentar',
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.original.comment}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === 'pending') {
          return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Ausstehend</Badge>;
        } else if (status === 'approved') {
          return <Badge variant="outline" className="bg-green-50 text-green-700">Genehmigt</Badge>;
        } else if (status === 'rejected') {
          return <Badge variant="outline" className="bg-red-50 text-red-700">Abgelehnt</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
      }
    },
    {
      accessorKey: 'created_at',
      header: 'Erstellt am',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
    {
      id: 'actions',
      header: 'Aktionen',
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === 'pending') {
          return (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 bg-green-50 hover:bg-green-100 text-green-700"
                onClick={() => handleApprove(row.original.id)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Genehmigen
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 bg-red-50 hover:bg-red-100 text-red-700"
                onClick={() => handleReject(row.original.id)}
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Ablehnen
              </Button>
            </div>
          );
        }
        return null;
      }
    }
  ];

  return (
    <Layout pageType="admin">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 pl-0" 
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Admin-Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Übersetzungs-Feedback</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback-Verwaltung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Alle</TabsTrigger>
                <TabsTrigger value="pending">Ausstehend</TabsTrigger>
                <TabsTrigger value="approved">Genehmigt</TabsTrigger>
                <TabsTrigger value="rejected">Abgelehnt</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  columns={columns}
                  data={feedbackItems}
                  loading={loading}
                  emptyMessage="Keine Feedback-Einträge gefunden"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TranslationFeedbackAdmin;
