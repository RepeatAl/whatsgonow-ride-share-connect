
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEscalation, Escalation, EscalationFilter } from '@/hooks/use-escalation';
import { ResolveEscalationDialog } from './ResolveEscalationDialog';

export const EscalationPanel: React.FC = () => {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [filter, setFilter] = useState<EscalationFilter>({ status: 'active' });
  const [activeTab, setActiveTab] = useState<string>('active');
  const { fetchEscalations, loading, canResolve } = useEscalation();

  useEffect(() => {
    loadEscalations();
  }, [filter]);

  const loadEscalations = async () => {
    const data = await fetchEscalations(filter);
    setEscalations(data);
  };

  const handleRefresh = () => {
    loadEscalations();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilter({
      ...filter,
      status: value === 'all' ? 'all' : (value === 'active' ? 'active' : 'resolved')
    });
  };

  const handleTypeFilterChange = (value: string) => {
    setFilter({
      ...filter,
      type: value === 'all' ? undefined : value
    });
  };

  const handleEscalationResolved = () => {
    loadEscalations();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy HH:mm');
    } catch (e) {
      return 'Ungültiges Datum';
    }
  };

  const getEscalationTypeLabel = (type: string) => {
    switch (type) {
      case 'trust_drop': return 'Trust Score';
      case 'auto_flag_threshold': return 'Markierungen';
      case 'repeat_dispute': return 'Konflikte';
      case 'manual_escalation': return 'Manuell';
      default: return type;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Eskalationsübersicht
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="ml-1 sr-only">Aktualisieren</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="active">Aktiv</TabsTrigger>
              <TabsTrigger value="resolved">Gelöst</TabsTrigger>
              <TabsTrigger value="all">Alle</TabsTrigger>
            </TabsList>

            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <Select 
                defaultValue="all" 
                onValueChange={handleTypeFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter nach Typ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Typen</SelectItem>
                  <SelectItem value="trust_drop">Trust Score</SelectItem>
                  <SelectItem value="auto_flag_threshold">Markierungen</SelectItem>
                  <SelectItem value="repeat_dispute">Konflikte</SelectItem>
                  <SelectItem value="manual_escalation">Manuelle Eskalation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : escalations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Keine Eskalationen gefunden
              </div>
            ) : (
              <div className="space-y-2">
                {escalations.map((escalation) => (
                  <Card key={escalation.id} className="overflow-hidden">
                    <div className={`p-4 grid grid-cols-12 gap-2 ${
                      escalation.resolved_at ? 'bg-gray-50' : 'bg-amber-50 border-l-4 border-l-amber-500'
                    }`}>
                      <div className="col-span-7">
                        <div className="font-medium">{escalation.user_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {escalation.trigger_reason}
                        </div>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200">
                            {getEscalationTypeLabel(escalation.escalation_type)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(escalation.triggered_at)}
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end items-center">
                        {escalation.resolved_at ? (
                          <span className="inline-flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Gelöst</span>
                          </span>
                        ) : canResolve ? (
                          <ResolveEscalationDialog 
                            escalationId={escalation.id}
                            onResolved={handleEscalationResolved}
                          />
                        ) : (
                          <span className="inline-flex items-center text-amber-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Aktiv</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EscalationPanel;
