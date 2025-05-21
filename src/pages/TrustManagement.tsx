
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, RefreshCw, Info, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { adminTrustService } from "@/services/adminTrustService";
import { Skeleton } from "@/components/ui/skeleton";

const TrustManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recalculating, setRecalculating] = useState(false);
  const [auditEntries, setAuditEntries] = useState<any[]>([]);

  useEffect(() => {
    loadAuditData();
  }, []);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const data = await adminTrustService.getAllTrustScoreAudits();
      setAuditEntries(data);
    } catch (error) {
      console.error("Error loading trust score audit data:", error);
      toast({
        title: t("admin.trust.error_loading"),
        description: t("admin.trust.error_loading_description"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateScores = async () => {
    setRecalculating(true);
    try {
      const updatedCount = await adminTrustService.recalculateAllScores();
      toast({
        title: t("admin.trust.recalculation_success"),
        description: t("admin.trust.recalculation_success_description", { count: updatedCount }),
      });
      
      // Reload audit data to show the new scores
      await loadAuditData();
    } catch (error) {
      console.error("Error recalculating trust scores:", error);
      toast({
        title: t("admin.trust.recalculation_error"),
        description: t("admin.trust.recalculation_error_description"),
        variant: "destructive",
      });
    } finally {
      setRecalculating(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "dd.MM.yyyy HH:mm");
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          {t("admin.trust.title")}
        </h1>
        
        <Button 
          onClick={handleRecalculateScores} 
          disabled={recalculating}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${recalculating ? 'animate-spin' : ''}`} />
          {t("admin.trust.recalculate_all")}
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t("admin.trust.info_description")}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="audit">
        <TabsList>
          <TabsTrigger value="audit">{t("admin.trust.audit_tab")}</TabsTrigger>
          <TabsTrigger value="settings">{t("admin.trust.settings_tab")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.trust.recent_changes")}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))
              ) : auditEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-2">{t("admin.trust.timestamp")}</th>
                        <th className="text-left p-2">{t("admin.trust.user")}</th>
                        <th className="text-left p-2">{t("admin.trust.old_score")}</th>
                        <th className="text-left p-2">{t("admin.trust.new_score")}</th>
                        <th className="text-left p-2">{t("admin.trust.delta")}</th>
                        <th className="text-left p-2">{t("admin.trust.reason")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditEntries.map((entry) => (
                        <tr key={entry.id} className="border-b hover:bg-muted">
                          <td className="p-2">{formatTimestamp(entry.created_at)}</td>
                          <td className="p-2">
                            {entry.profiles?.first_name} {entry.profiles?.last_name}
                            <div className="text-xs text-muted-foreground">{entry.profiles?.email}</div>
                          </td>
                          <td className="p-2">{entry.old_score !== null ? entry.old_score : '–'}</td>
                          <td className="p-2">{entry.new_score !== null ? entry.new_score : '–'}</td>
                          <td className={`p-2 ${
                            entry.delta > 0 
                              ? 'text-green-600' 
                              : entry.delta < 0 
                                ? 'text-red-600' 
                                : ''
                          }`}>
                            {entry.delta > 0 ? '+' : ''}{entry.delta}
                          </td>
                          <td className="p-2">{entry.reason || 'Keine Angabe'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="mx-auto h-10 w-10 mb-2" />
                  <p>{t("admin.trust.no_audit_entries")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("admin.trust.settings_title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("admin.trust.settings_description")}
              </p>
              
              {/* Settings content will be implemented in a future update */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t("admin.trust.settings_coming_soon")}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrustManagement;
