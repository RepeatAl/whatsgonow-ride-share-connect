// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoManagementPanel from "@/components/admin/VideoManagementPanel";

const VideosPage = () => {
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
        <h1 className="text-2xl font-bold">Video-Verwaltung</h1>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Video className="h-6 w-6 text-brand-orange" />
              <CardTitle className="text-lg">Video-System Übersicht</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                ✅ <strong>Echte Löschung:</strong> Videos werden vollständig aus Datenbank und Storage entfernt
              </p>
              <p>
                🔄 <strong>Automatische Bereinigung:</strong> Storage-Dateien und Thumbnails werden automatisch mitgelöscht
              </p>
              <p>
                🛡️ <strong>Audit-Trail:</strong> Alle Löschvorgänge werden für Compliance protokolliert
              </p>
              <p>
                🔍 <strong>Konsistenz-Checks:</strong> Automatische Erkennung von Storage-Problemen
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <VideoManagementPanel />
    </div>
  );
};

export default VideosPage;
