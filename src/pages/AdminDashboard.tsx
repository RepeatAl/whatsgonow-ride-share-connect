import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLogs } from '@/hooks/use-admin-logs';
import { useAdminUsers } from '@/hooks/use-admin-users';
import { useAdminMonitoring } from '@/hooks/use-admin-monitoring';
import { Activity, Database, Bell, BellOff } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import KPICards from '@/components/admin/dashboard/KPICards';
import FilterOptions from '@/components/admin/dashboard/FilterOptions';
import LogsTable from '@/components/admin/dashboard/LogsTable';
import TransactionsTable from '@/components/admin/dashboard/TransactionsTable';
import UserActivityTable from '@/components/admin/dashboard/UserActivityTable';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<number>(30);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const { user } = useAuth();
  const { users, loading: loadingUsers } = useAdminUsers();
  const navigate = useNavigate();
  const { 
    logs, 
    transactions, 
    userSummaries, 
    stats, 
    loading 
  } = useAdminLogs(timeRange, selectedRegion);
  
  const currentUser = users.find(u => u.role === 'admin');
  const monitoringUser = currentUser ? { id: currentUser.user_id, role: currentUser.role } : null;
  const { isActive: monitoringActive } = useAdminMonitoring(monitoringUser);

  if (loadingUsers) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0 flex items-center gap-2">
            <Database className="h-8 w-8" />
            Admin Dashboard
          </h1>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/analytics")}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              View Analytics
            </Button>
            <Badge 
              variant={monitoringActive ? "default" : "outline"}
              className="flex items-center gap-1 mr-4"
            >
              {monitoringActive ? (
                <>
                  <Bell className="h-3 w-3" />
                  <span>Live-Monitoring aktiv</span>
                </>
              ) : (
                <>
                  <BellOff className="h-3 w-3" />
                  <span>Monitoring inaktiv</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <>
            <KPICards stats={stats} timeRange={timeRange} />
            <FilterOptions
              timeRange={timeRange.toString()}
              setTimeRange={(value) => setTimeRange(parseInt(value))}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              userSummaries={userSummaries}
            />
            
            <Tabs defaultValue="logs" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Lieferprotokolle</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Transaktionen</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Nutzeraktivität</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="mt-0">
                <LogsTable logs={logs} timeRange={timeRange} />
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                <TransactionsTable transactions={transactions} timeRange={timeRange} />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <UserActivityTable userSummaries={userSummaries} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
