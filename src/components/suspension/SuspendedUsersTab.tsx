
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, RefreshCcw, User, Clock } from 'lucide-react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { useSuspension } from '@/hooks/use-suspension';
import ReactivateUserDialog from './ReactivateUserDialog';
import SuspensionHistoryDialog from './SuspensionHistoryDialog';
import type { SuspendedUserInfo, SuspensionType } from '@/types/suspension';

export const SuspendedUsersTab: React.FC = () => {
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUserInfo[]>([]);
  const [statusFilter, setStatusFilter] = useState<'active' | 'expired' | 'all'>('active');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  
  const [selectedUser, setSelectedUser] = useState<SuspendedUserInfo | null>(null);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  
  const { fetchSuspendedUsers, loading } = useSuspension();
  
  useEffect(() => {
    loadSuspendedUsers();
  }, [statusFilter, typeFilter]);
  
  const loadSuspendedUsers = async () => {
    const users = await fetchSuspendedUsers({
      status: statusFilter,
      type: typeFilter
    });
    setSuspendedUsers(users);
  };
  
  const handleReactivateClick = (user: SuspendedUserInfo) => {
    setSelectedUser(user);
    setIsReactivateDialogOpen(true);
  };
  
  const handleHistoryClick = (user: SuspendedUserInfo) => {
    setSelectedUser(user);
    setIsHistoryDialogOpen(true);
  };
  
  const handleUserReactivated = () => {
    loadSuspendedUsers();
  };
  
  const getSuspensionTypeBadge = (type: SuspensionType) => {
    switch (type) {
      case 'hard':
        return <Badge variant="destructive">Hart</Badge>;
      case 'soft':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Soft</Badge>;
      case 'temporary':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Temporär</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };
  
  const getTimeRemaining = (dateString: string | null) => {
    if (!dateString) return null;
    
    const expiryDate = new Date(dateString);
    if (!isAfter(expiryDate, new Date())) {
      return "Abgelaufen";
    }
    
    return formatDistanceToNow(expiryDate, { addSuffix: true, locale: de });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-500" />
            <CardTitle>Suspendierte Nutzer</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadSuspendedUsers}
            disabled={loading}
          >
            <RefreshCcw className="h-3.5 w-3.5 mr-1" />
            Aktualisieren
          </Button>
        </div>
        <CardDescription>
          Übersicht aller suspendierten Nutzerkonten mit Filteroptionen und Management-Funktionen
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="expired">Abgelaufen</SelectItem>
                  <SelectItem value="all">Alle</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Typ:</span>
            <Select 
              value={typeFilter || "all"} 
              onValueChange={(value) => setTypeFilter(value === "all" ? undefined : value)}
            >
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="hard">Hart</SelectItem>
                  <SelectItem value="temporary">Temporär</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Lade suspendierte Nutzer...</p>
          </div>
        ) : suspendedUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Keine suspendierten Nutzer gefunden.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutzer</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Grund</TableHead>
                <TableHead>Suspendiert am</TableHead>
                <TableHead>Bis</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suspendedUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSuspensionTypeBadge(user.suspension_type)}
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 text-sm">{user.reason}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm">{formatDate(user.suspended_at)}</span>
                      <span className="text-xs text-muted-foreground">von {user.suspended_by_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.suspended_until ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-sm">{getTimeRemaining(user.suspended_until)}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">Permanent</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleHistoryClick(user)}
                    >
                      Verlauf
                    </Button>
                    {user.is_active && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReactivateClick(user)}
                      >
                        Reaktivieren
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        
        {selectedUser && (
          <>
            <ReactivateUserDialog
              userId={selectedUser.user_id}
              userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
              isOpen={isReactivateDialogOpen}
              onClose={() => setIsReactivateDialogOpen(false)}
              onReactivated={handleUserReactivated}
            />
            
            <SuspensionHistoryDialog
              userId={selectedUser.user_id}
              userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
              open={isHistoryDialogOpen}
              onOpenChange={setIsHistoryDialogOpen}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspendedUsersTab;
