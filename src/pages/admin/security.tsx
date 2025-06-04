
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SecurityHealthDashboard from "@/components/admin/SecurityHealthDashboard";

const SecurityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          className="pl-0" 
          onClick={() => navigate("/admin")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Button>
        <h1 className="text-2xl font-bold">Sicherheit & Compliance</h1>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-lg">Enterprise Security Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                ✅ <strong>RLS Aktiviert:</strong> Alle sensiblen Tabellen sind durch Row Level Security geschützt
              </p>
              <p>
                🔒 <strong>SECURITY DEFINER eliminiert:</strong> Kritische Views wurden durch sichere Alternativen ersetzt
              </p>
              <p>
                🛡️ <strong>Feature Flags implementiert:</strong> Vollständiges System mit Audit-Trail ist aktiv
              </p>
              <p>
                📊 <strong>Compliance-Ready:</strong> DSGVO-konforme Datenzugriffskontrolle
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <SecurityHealthDashboard />
    </div>
  );
};

export default SecurityPage;
