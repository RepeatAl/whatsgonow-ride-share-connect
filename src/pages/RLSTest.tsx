
import { useState } from "react";
import Layout from "@/components/Layout";
import { runRLSTests } from "@/utils/rls-testing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Shield, Database, UserCog, UsersRound, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/utils/rls-testing/types";

// This file follows the conventions from /docs/conventions/roles_and_ids.md
const RLSTest = () => {
  const [results, setResults] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("admin");
  
  const handleRunTests = async () => {
    setLoading(true);
    try {
      const testResults = await runRLSTests();
      setResults(testResults);
      console.log("RLS Test Results:", testResults);
    } catch (error) {
      console.error("Error running RLS tests:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderResultStatus = (success: boolean | undefined, count?: number) => {
    if (success === undefined) return null;
    
    if (success) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="w-3 h-3 mr-1" /> 
          {count !== undefined ? `Allowed (${count} rows)` : 'Allowed'}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <X className="w-3 h-3 mr-1" /> Denied
        </Badge>
      );
    }
  };
  
  const renderErrorMessage = (error: string | null) => {
    if (!error) return null;
    
    return (
      <div className="mt-1 text-xs text-red-600">
        <AlertTriangle className="w-3 h-3 inline mr-1" /> {error}
      </div>
    );
  };
  
  const renderRoleResults = (role: string) => {
    if (!results || !results[role]) {
      return (
        <div className="p-4 text-center text-gray-500">
          No results available for this role
        </div>
      );
    }
    
    if (results[role].error) {
      return (
        <div className="p-4 text-center text-red-600">
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          {results[role].error}
        </div>
      );
    }
    
    // Special handling for CM role with region filtering
    const regionFilteringKeys = Object.keys(results[role]).filter(key => key.startsWith('regionFiltering'));
    const hasRegionFiltering = role === 'cm' && regionFilteringKeys.length > 0;

    return (
      <div className="space-y-4">
        {/* Display region filtering results for CM role first */}
        {hasRegionFiltering && (
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4" /> 
                Region-Based Access Control
              </CardTitle>
              <CardDescription>
                Community Managers can only access data from their assigned region
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {regionFilteringKeys.map((key) => {
                const result = results[role][key];
                return (
                  <div key={key} className="border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {result.details || key.replace('regionFiltering_', '')}
                      </span>
                      {renderResultStatus(result.success, result.count)}
                    </div>
                    {renderErrorMessage(result.error)}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Display standard table results */}
        {Object.entries(results[role]).map(([table, ops]: [string, any]) => {
          if (table === 'error' || table.startsWith('regionFiltering')) return null;
          
          return (
            <Card key={table}>
              <CardHeader className="py-3">
                <CardTitle className="text-md">Table: {table}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ops.SELECT && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">SELECT</span>
                        {renderResultStatus(ops.SELECT.success, ops.SELECT.count)}
                      </div>
                      {renderErrorMessage(ops.SELECT.error)}
                    </div>
                  )}
                  
                  {ops.INSERT && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">INSERT</span>
                        {renderResultStatus(ops.INSERT.success)}
                      </div>
                      {renderErrorMessage(ops.INSERT.error)}
                    </div>
                  )}
                  
                  {ops.UPDATE && (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">UPDATE</span>
                        {renderResultStatus(ops.UPDATE.success)}
                      </div>
                      {renderErrorMessage(ops.UPDATE.error)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">RLS Policy Tests</h1>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Überprüft die Row Level Security (RLS) Policies für verschiedene Benutzerrollen
        </p>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Supabase RLS Test Suite</CardTitle>
            </div>
            <CardDescription>
              Testet den Zugriff auf Tabellen und Operationen für Fahrer, Auftraggeber, Community Manager und Administratoren
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Dieser Test erstellt Testbenutzer für jede Rolle und prüft dann:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>SELECT-Berechtigungen für alle Tabellen</li>
              <li>INSERT/UPDATE-Berechtigungen für relevante Tabellen</li>
              <li>Regionsfilterung für Community Manager</li>
              <li>Korrekte Blockierung unberechtigter Zugriffe</li>
              <li>Super-Admin Rollenzuweisungsfunktion</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRunTests} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <UserCog className="mr-2 h-4 w-4" />
              {loading ? "Teste RLS-Policies..." : "RLS-Tests ausführen"}
            </Button>
          </CardFooter>
        </Card>
        
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        
        {results && (
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="super_admin">Super Admin</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="cm">
                <div className="flex items-center gap-1">
                  <UsersRound className="h-3.5 w-3.5" />
                  Community Manager
                </div>
              </TabsTrigger>
              <TabsTrigger value="sender_private">Privat</TabsTrigger>
              <TabsTrigger value="sender_business">Business</TabsTrigger>
              <TabsTrigger value="driver">Fahrer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="super_admin">
              {renderRoleResults('super_admin')}
            </TabsContent>
            
            <TabsContent value="admin">
              {renderRoleResults('admin')}
            </TabsContent>
            
            <TabsContent value="cm">
              {renderRoleResults('cm')}
            </TabsContent>
            
            <TabsContent value="sender_private">
              {renderRoleResults('sender_private')}
            </TabsContent>
            
            <TabsContent value="sender_business">
              {renderRoleResults('sender_business')}
            </TabsContent>
            
            <TabsContent value="driver">
              {renderRoleResults('driver')}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default RLSTest;
