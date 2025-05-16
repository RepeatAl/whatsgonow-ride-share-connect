
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { EscalationPanel } from "./EscalationPanel";

export const EscalationsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            <CardTitle>Eskalationsmanagement</CardTitle>
          </div>
          <CardDescription>
            Überwachung und Verwaltung von Nutzerkontoeskalationen und Vorwarnungen.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <EscalationPanel />
        </CardContent>
      </Card>
    </div>
  );
};

export default EscalationsTab;
