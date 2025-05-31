
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  Settings, 
  Eye, 
  History, 
  RotateCcw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { FeatureFlagName, FeatureFlagAudit } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';

const FeatureFlagManager = () => {
  const { 
    flags, 
    loading, 
    error, 
    health, 
    toggleFeatureFlag, 
    getAuditHistory,
    environment 
  } = useFeatureFlags();
  const { toast } = useToast();
  const [auditHistory, setAuditHistory] = useState<FeatureFlagAudit[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlagName | null>(null);
  const [reason, setReason] = useState('');
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  const handleToggleFlag = async (flagName: FeatureFlagName, enabled: boolean) => {
    if (!reason.trim()) {
      toast({
        title: 'Grund erforderlich',
        description: 'Bitte geben Sie einen Grund für die Änderung an.',
        variant: 'destructive',
      });
      return;
    }

    const success = await toggleFeatureFlag(flagName, enabled, reason);
    
    if (success) {
      toast({
        title: 'Feature Flag aktualisiert',
        description: `${flagName} wurde ${enabled ? 'aktiviert' : 'deaktiviert'}.`,
      });
      setReason('');
    } else {
      toast({
        title: 'Fehler',
        description: 'Feature Flag konnte nicht aktualisiert werden.',
        variant: 'destructive',
      });
    }
  };

  const loadAuditHistory = async (flagName?: FeatureFlagName) => {
    const history = await getAuditHistory(flagName, 100);
    setAuditHistory(history);
    setSelectedFlag(flagName || null);
    setShowAuditDialog(true);
  };

  const getStatusColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'no_flags': return 'bg-yellow-100 text-yellow-800';
      case 'all_disabled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Lade Feature Flags...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Status */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Health - {environment.toUpperCase()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Badge className={getHealthStatusColor(health.status)}>
                  {health.status}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">Status</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{health.enabled_flags}</p>
                <p className="text-sm text-gray-600">Aktive Flags</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{health.audit_entries_today}</p>
                <p className="text-sm text-gray-600">Änderungen heute</p>
              </div>
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadAuditHistory()}
                >
                  <History className="h-4 w-4 mr-2" />
                  Audit Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Fehler beim Laden: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Flags List */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(flags).map(([flagName, enabled]) => (
              <div 
                key={flagName}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{flagName}</h3>
                    <Badge className={getStatusColor(enabled)}>
                      {enabled ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadAuditHistory(flagName as FeatureFlagName)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={enabled ? "destructive" : "default"}
                        size="sm"
                      >
                        {enabled ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deaktivieren
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aktivieren
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Feature Flag {enabled ? 'deaktivieren' : 'aktivieren'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                          Sie sind dabei, <strong>{flagName}</strong> zu {enabled ? 'deaktivieren' : 'aktivieren'}.
                        </p>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Grund für die Änderung *
                          </label>
                          <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Beschreiben Sie den Grund für diese Änderung..."
                            className="min-h-20"
                          />
                        </div>
                        
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleToggleFlag(flagName as FeatureFlagName, !enabled)}
                            className="flex-1"
                            variant={enabled ? "destructive" : "default"}
                          >
                            {enabled ? 'Deaktivieren' : 'Aktivieren'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit History Dialog */}
      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent className="max-w-4xl max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Audit Geschichte {selectedFlag ? `- ${selectedFlag}` : '(Alle Flags)'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {auditHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Keine Audit-Einträge gefunden.
              </p>
            ) : (
              auditHistory.map((entry) => (
                <div key={entry.audit_id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{entry.flag_name}</Badge>
                      <Badge className={
                        entry.action === 'enabled' ? 'bg-green-100 text-green-800' :
                        entry.action === 'disabled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {entry.action}
                      </Badge>
                      {entry.field_changed && (
                        <Badge variant="secondary">{entry.field_changed}</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.changed_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {entry.reason && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <strong>Grund:</strong> {entry.reason}
                    </p>
                  )}
                  
                  {(entry.previous_value || entry.new_value) && (
                    <div className="mt-2 text-xs">
                      {entry.previous_value && (
                        <div>Vorher: <code>{JSON.stringify(entry.previous_value)}</code></div>
                      )}
                      {entry.new_value && (
                        <div>Nachher: <code>{JSON.stringify(entry.new_value)}</code></div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeatureFlagManager;
