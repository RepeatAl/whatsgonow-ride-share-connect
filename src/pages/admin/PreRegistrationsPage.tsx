import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreRegistrationsPage = () => {
  const { profile } = useOptimizedAuth();
  const [preRegistrations, setPreRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
      navigate('/dashboard');
      return;
    }

    fetchPreRegistrations();
  }, [profile, navigate]);

  const fetchPreRegistrations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pre_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPreRegistrations(data || []);
    } catch (error) {
      console.error('Error fetching pre-registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvePreRegistration = async (id) => {
    try {
      const { error } = await supabase
        .from('pre_registrations')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchPreRegistrations();
    } catch (error) {
      console.error('Error approving pre-registration:', error);
    }
  };

  const rejectPreRegistration = async (id) => {
    try {
      const { error } = await supabase
        .from('pre_registrations')
        .update({ status: 'rejected', rejected_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchPreRegistrations();
    } catch (error) {
      console.error('Error rejecting pre-registration:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Ausstehend</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Genehmigt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Abgelehnt</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  return (
    <Layout pageType="admin">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Voranmeldungen</h1>
          <Button onClick={fetchPreRegistrations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Alle Voranmeldungen</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : preRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Voranmeldungen gefunden
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Datum</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preRegistrations.map((registration) => (
                      <TableRow key={registration.id}>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>
                          {registration.first_name} {registration.last_name}
                        </TableCell>
                        <TableCell>{registration.role || 'Nicht angegeben'}</TableCell>
                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                        <TableCell>
                          {format(new Date(registration.created_at), 'dd.MM.yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          {registration.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 text-green-700"
                                onClick={() => approvePreRegistration(registration.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Genehmigen
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 hover:bg-red-100 text-red-700"
                                onClick={() => rejectPreRegistration(registration.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Ablehnen
                              </Button>
                            </div>
                          )}
                          {registration.status !== 'pending' && (
                            <span className="text-muted-foreground text-sm">
                              {registration.status === 'approved' ? 'Genehmigt am ' : 'Abgelehnt am '}
                              {format(
                                new Date(registration.approved_at || registration.rejected_at),
                                'dd.MM.yyyy'
                              )}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Hinweis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Voranmeldungen müssen manuell genehmigt werden, bevor Benutzer sich registrieren können.
              Nach der Genehmigung erhalten Benutzer eine E-Mail mit einem Link zur Registrierung.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PreRegistrationsPage;
