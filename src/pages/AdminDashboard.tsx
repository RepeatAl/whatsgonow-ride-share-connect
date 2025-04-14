
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLogEntry, TransactionEntry, UserSummary, useAdminLogs } from '@/hooks/use-admin-logs';
import { useAdminUsers } from '@/hooks/use-admin-users';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  TrendingUp, 
  CalendarClock, 
  Users, 
  MapPin, 
  Truck, 
  BadgeDollarSign, 
  Star,
  Activity,
  Database,
  UserCheck
} from "lucide-react";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState<number>(30);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const { users, loading: loadingUsers } = useAdminUsers();
  const { 
    logs, 
    transactions, 
    userSummaries, 
    stats, 
    loading 
  } = useAdminLogs(timeRange, selectedRegion);

  // Check if user is admin (should be handled by App.tsx route guard, but just in case)
  const currentUser = users.find(u => u.role === 'admin');
  
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

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'n/a';
    return format(new Date(timestamp), 'dd. MMM yyyy, HH:mm', { locale: de });
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'delivery_confirmed':
        return <Badge className="bg-green-500">Lieferung bestätigt</Badge>;
      case 'payment_initiated':
        return <Badge className="bg-blue-500">Zahlung initiiert</Badge>;
      case 'payment_completed':
        return <Badge className="bg-emerald-500">Zahlung abgeschlossen</Badge>;
      case 'pickup_started':
        return <Badge className="bg-amber-500">Abholung gestartet</Badge>;
      case 'delivery_started':
        return <Badge className="bg-purple-500">Lieferung gestartet</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };

  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lieferungen</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
          <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Transaktionsvolumen</CardTitle>
          <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{stats.totalTransactions.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Ø Bewertung</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating}</div>
          <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderFilterOptions = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="w-full sm:w-48">
        <Select
          value={timeRange.toString()}
          onValueChange={(value) => setTimeRange(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Zeitraum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Letzte 7 Tage</SelectItem>
            <SelectItem value="30">Letzte 30 Tage</SelectItem>
            <SelectItem value="90">Letzte 90 Tage</SelectItem>
            <SelectItem value="365">Letztes Jahr</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-48">
        <Select
          value={selectedRegion || ''}
          onValueChange={(value) => setSelectedRegion(value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Alle Regionen</SelectItem>
            {userSummaries.map((summary) => (
              <SelectItem key={summary.region} value={summary.region}>
                {summary.region || 'Unbekannt'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderLogTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Lieferprotokolle der letzten {timeRange} Tage</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Log ID</TableHead>
            <TableHead>Auftrag</TableHead>
            <TableHead>Nutzer</TableHead>
            <TableHead>Aktion</TableHead>
            <TableHead>IP-Adresse</TableHead>
            <TableHead>Zeitpunkt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Keine Protokolldaten für den ausgewählten Zeitraum verfügbar
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log: AdminLogEntry) => (
              <TableRow key={log.log_id}>
                <TableCell className="font-mono text-xs">{log.log_id.slice(0, 8)}...</TableCell>
                <TableCell>
                  {log.order_id ? (
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(`/deal/${log.order_id}`, '_blank')}>
                      {log.order_id.slice(0, 8)}...
                    </Button>
                  ) : (
                    'n/a'
                  )}
                </TableCell>
                <TableCell>{log.user_name || 'Unknown'}</TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell className="font-mono text-xs">{log.ip_address || 'n/a'}</TableCell>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderTransactionsTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Transaktionen der letzten {timeRange} Tage</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Transaktions-ID</TableHead>
            <TableHead>Auftrag</TableHead>
            <TableHead>Von</TableHead>
            <TableHead>An</TableHead>
            <TableHead>Betrag</TableHead>
            <TableHead>Zeitpunkt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Keine Transaktionen für den ausgewählten Zeitraum verfügbar
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx: TransactionEntry) => (
              <TableRow key={tx.tx_id}>
                <TableCell className="font-mono text-xs">{tx.tx_id.slice(0, 8)}...</TableCell>
                <TableCell>
                  {tx.order_id ? (
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(`/deal/${tx.order_id}`, '_blank')}>
                      {tx.order_id.slice(0, 8)}...
                    </Button>
                  ) : (
                    'n/a'
                  )}
                </TableCell>
                <TableCell>{tx.payer_name || 'Unknown'}</TableCell>
                <TableCell>{tx.receiver_name || 'Unknown'}</TableCell>
                <TableCell className="font-medium">€{tx.amount.toFixed(2)}</TableCell>
                <TableCell>{formatTimestamp(tx.timestamp)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderUserActivityTable = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableCaption>Nutzeraktivität nach Region</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead>Nutzer total</TableHead>
            <TableHead>Aktive Nutzer</TableHead>
            <TableHead>Fahrer</TableHead>
            <TableHead>Auftraggeber</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userSummaries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Keine Nutzerdaten verfügbar
              </TableCell>
            </TableRow>
          ) : (
            userSummaries.map((summary: UserSummary) => (
              <TableRow key={summary.region}>
                <TableCell>{summary.region || 'Unbekannt'}</TableCell>
                <TableCell>{summary.total_users}</TableCell>
                <TableCell>{summary.active_users}</TableCell>
                <TableCell>{summary.drivers}</TableCell>
                <TableCell>{summary.senders}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold mb-2 md:mb-0 flex items-center gap-2">
            <Database className="h-8 w-8" />
            Admin Dashboard
          </h1>
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
            {renderKPICards()}
            {renderFilterOptions()}
            
            <Tabs defaultValue="logs" className="mt-6">
              <TabsList className="mb-4">
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Lieferprotokolle</span>
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex items-center gap-2">
                  <BadgeDollarSign className="h-4 w-4" />
                  <span>Transaktionen</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Nutzeraktivität</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="mt-0">
                {renderLogTable()}
              </TabsContent>
              
              <TabsContent value="transactions" className="mt-0">
                {renderTransactionsTable()}
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                {renderUserActivityTable()}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
