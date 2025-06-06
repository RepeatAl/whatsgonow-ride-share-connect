
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useAdminTranslationFeedback } from '@/hooks/use-admin-translation-feedback';
import { DataTable } from '@/components/ui/data-table';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ReviewFeedbackParams {
  id: string;
  status: 'approved' | 'rejected';
  feedback?: string;
}

const TranslationFeedbackAdmin = () => {
  const { profile } = useOptimizedAuth();
  const { feedbacks, loading, reviewFeedback } = useAdminTranslationFeedback();

  if (!profile || !['admin', 'super_admin', 'cm'].includes(profile.role)) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Administratoren und Community Manager zugänglich.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleApprove = async (id: string) => {
    try {
      await reviewFeedback({
        id,
        status: 'approved'
      });
    } catch (error) {
      console.error('Error approving feedback:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await reviewFeedback({
        id,
        status: 'rejected'
      });
    } catch (error) {
      console.error('Error rejecting feedback:', error);
    }
  };

  const columns = [
    {
      id: 'original_text',
      header: 'Original Text',
      accessorKey: 'original_text' as const,
    },
    {
      id: 'suggested_translation',
      header: 'Vorgeschlagene Übersetzung',
      accessorKey: 'suggested_translation' as const,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <Badge variant={row.status === 'pending' ? 'default' : row.status === 'approved' ? 'default' : 'destructive'}>
          {row.status}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: 'Aktionen',
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleApprove(row.id)}>
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(row.id)}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Layout pageType="admin">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Übersetzungs-Feedback verwalten</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={feedbacks}
              columns={columns}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TranslationFeedbackAdmin;
