
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdminUsers } from "@/hooks/use-admin-users";

const UsersPage = () => {
  const navigate = useNavigate();
  const { users, loading } = useAdminUsers();

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
        <h1 className="text-2xl font-bold">Benutzerverwaltung</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter und Aktionen</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Add filters component */}
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex gap-2 p-4 border-b bg-slate-50">
          <Button variant="ghost" size="sm" disabled={loading}>
            <Table className="mr-2 h-4 w-4" />
            Aktualisieren
          </Button>
          <div className="flex-1"></div>
          <div className="text-sm text-muted-foreground">
            {users.length} Benutzer
          </div>
        </div>
        
        {/* TODO: Add users table component */}
      </div>
    </div>
  );
};

export default UsersPage;
