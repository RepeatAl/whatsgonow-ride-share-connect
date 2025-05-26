
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ban, RefreshCcw, User, Clock, AlertTriangle } from 'lucide-react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { useSuspensionEnhanced } from '@/hooks/use-suspension-enhanced';
import ReactivateUserDialog from './ReactivateUserDialog';
import SuspensionHistoryDialog from './SuspensionHistoryDialog';
import EnhancedSuspendUserDialog from './EnhancedSuspendUserDialog';
import type { EnhancedSuspendedUserInfo, SuspensionType } from '@/types/suspension-enhanced';

export const EnhancedSuspendedUsersTab: React.FC = () => {
  const [suspendedUsers, setSuspendedUsers] = useState<EnhancedSuspendedUserInfo[]>([]);
  const [statusFilter, setStatusFilter] = useState<'active' | 'expired' | 'all'>('active');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  
  const [selectedUser, setSelectedUser] = useState<EnhancedSuspendedUserInfo | null>(null);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  
  const { fetchSuspendedUsers, loading } = useSuspensionEnhanced();
  
  useEffect(() => {
    loadSuspendedUsers();
  }, [statusFilter, typeFilter]);
  
  const loadSuspendedUsers = async () => {
    const users = await fetchSuspendedUsers({
      status: statusFilter,
      type: typeFilter
    });
    setSuspendedUsers(users as EnhancedSuspendedUserInfo[]);
  };
  
  const handleReactivateClick = (user: EnhancedSuspendedUserInfo) => {
    setSelectedUser(user);
    setIsReactivateDialogOpen(true);
  };
  
  const handleHistoryClick = (user: EnhancedSuspendedUserInfo) => {
    setSelectedUser(user);
    setIsHistoryDialogOpen(true);
  };

  const handleSuspendClick = (user: EnhancedSuspendedUserInfo) => {
    setSelectedUser(user);
    setIsSuspendDialogOpen(true);
  };
  
  const handleUserUpdated = () => {
    loadSuspendedUsers();
  };
  
  const getSuspensionTypeBadge = (type: SuspensionType, isCurrentlySuspended: boolean) => {
    const baseClasses = "text-xs";
    
    if (!isCurrentlySuspended) {
      return <Badge variant="outline" className={`${baseClasses} bg-gray-50 text-gray-500`}>Abgelaufen</Badge>;
    }
    
    switch (type) {
      case 'hard':
        return <Badge variant="destructive" className={baseClasses}>Hart</Badge>;
      case 'soft':
        return <Badge variant="outline" className={`${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`}>Soft</Badge>;
      case 'temporary':
        return <Badge variant="outline" className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200`}>Temporär</Badge>;
      case 'permanent':
        return <Badge variant="destructive" className={`${baseClasses} bg-red-100 text-red-800`}>Permanent</Badge>;
      default:
        return <Badge variant="secondary" className={baseClasses}>{type}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };
  
  const getTimeRemaining = (dateString: string | null, isCurrentlySuspended: boolean) => {
    if (!dateString) return "Permanent";
    if (!isCurrentlySuspended) return "Abgelaufen";
    
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
            <CardTitle>Suspendierte Nutzer (Enhanced)</CardTitle>
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
          Erweiterte Übersicht aller suspendierten Nutzerkonten mit Audit-Funktionen und intelligentem Status-Checking
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
                  <SelectItem value="permanent">Permanent</SelectItem>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suspendedUsers.map((user) => (
                <TableRow key={user.user_id} className={!user.is_currently_suspended ? 'opacity-60' : ''}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {user.first_name} {user.last_name}
                        {!user.is_currently_suspended && (
                          <AlertTriangle className="h-3.5 w-3.5 text-orange-500" title="Suspension abgelaufen" />
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSuspensionTypeBadge(user.suspension_type, user.is_currently_suspended)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <span className="line-clamp-2 text-sm">{user.reason}</span>
                      {user.reason_code && (
                        <span className="text-xs text-muted-foreground block mt-1">
                          Code: {user.reason_code}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm">{formatDate(user.suspended_at)}</span>
                      <span className="text-xs text-muted-foreground">von {user.suspended_by_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-sm">
                        {getTimeRemaining(user.suspended_until, user.is_currently_suspended)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleHistoryClick(user)}
                    >
                      Verlauf
                    </Button>
                    {user.is_currently_suspended ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReactivateClick(user)}
                      >
                        Reaktivieren
                      </Button>
                    ) : (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleSuspendClick(user)}
                      >
                        Erneut suspendieren
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
              onReactivated={handleUserUpdated}
            />
            
            <SuspensionHistoryDialog
              userId={selectedUser.user_id}
              userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
              open={isHistoryDialogOpen}
              onOpenChange={setIsHistoryDialogOpen}
            />

            <EnhancedSuspendUserDialog
              userId={selectedUser.user_id}
              userName={`${selectedUser.first_name} ${selectedUser.last_name}`}
              isOpen={isSuspendDialogOpen}
              onClose={() => setIsSuspendDialogOpen(false)}
              onSuspended={handleUserUpdated}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedSuspendedUsersTab;
