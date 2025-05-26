import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { Shield, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Escalation {
  id: string;
  user_id: string;
  escalation_type: string;
  trigger_reason: string;
  triggered_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  // User info
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export const EscalationsTab = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const fetchEscalations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('escalation_log')
        .select(`
          id,
          user_id,
          escalation_type,
          trigger_reason,
          triggered_at,
          resolved_at,
          resolved_by,
          notes,
          metadata,
          profiles:user_id (
            first_name,
            last_name,
            email,
            role
          )
        `)
        .order('triggered_at', { ascending: false });

      if (filter === 'active') {
        query = query.is('resolved_at', null);
      } else if (filter === 'resolved') {
        query = query.not('resolved_at', 'is', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to flatten profile info - fix array access
      const transformedData = data?.map(item => ({
        ...item,
        first_name: item.profiles?.[0]?.first_name || 'Unknown',
        last_name: item.profiles?.[0]?.last_name || 'User', 
        email: item.profiles?.[0]?.email || 'No email',
        role: item.profiles?.[0]?.role || 'unknown'
      })) || [];

      setEscalations(transformedData);
    } catch (error) {
      console.error('Error fetching escalations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, [filter]);

  const resolveEscalation = async (escalationId: string) => {
    try {
      const { error } = await supabase
        .rpc('resolve_escalation', {
          escalation_id: escalationId,
          resolution_notes: 'Manuell durch Admin aufgelöst'
        });

      if (error) throw error;
      
      await fetchEscalations();
    } catch (error) {
      console.error('Error resolving escalation:', error);
    }
  };

  const getEscalationTypeLabel = (type: string) => {
    switch (type) {
      case 'trust_drop': return 'Trust Score Drop';
      case 'auto_flag_threshold': return 'Flag Threshold';
      case 'repeat_dispute': return 'Wiederholte Dispute';
      case 'manual_escalation': return 'Manuelle Eskalation';
      default: return type;
    }
  };

  const getEscalationTypeColor = (type: string) => {
    switch (type) {
      case 'trust_drop': return 'destructive';
      case 'auto_flag_threshold': return 'secondary';
      case 'repeat_dispute': return 'default';
      case 'manual_escalation': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p>Lade Eskalationen...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Eskalationen Monitor
          </CardTitle>
          <CardDescription>
            Überwache und verwalte automatische und manuelle Eskalationen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              Aktiv ({escalations.filter(e => !e.resolved_at).length})
            </Button>
            <Button
              variant={filter === 'resolved' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('resolved')}
            >
              Aufgelöst
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Alle
            </Button>
          </div>

          {escalations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Keine Eskalationen gefunden.
            </p>
          ) : (
            <div className="space-y-4">
              {escalations.map((escalation) => (
                <div key={escalation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getEscalationTypeColor(escalation.escalation_type)}>
                        {getEscalationTypeLabel(escalation.escalation_type)}
                      </Badge>
                      {escalation.resolved_at ? (
                        <Badge variant="secondary">
                          <Shield className="h-3 w-3 mr-1" />
                          Aufgelöst
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <Clock className="h-3 w-3 mr-1" />
                          Aktiv
                        </Badge>
                      )}
                    </div>
                    <div className="mb-1">
                      <span className="font-medium">
                        {escalation.first_name} {escalation.last_name}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({escalation.email})
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {escalation.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <strong>Grund:</strong> {escalation.trigger_reason}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <strong>Erstellt:</strong> {format(new Date(escalation.triggered_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </p>
                    {escalation.resolved_at && (
                      <p className="text-xs text-green-600">
                        <strong>Aufgelöst:</strong> {format(new Date(escalation.resolved_at), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!escalation.resolved_at && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveEscalation(escalation.id)}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Auflösen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationsTab;
