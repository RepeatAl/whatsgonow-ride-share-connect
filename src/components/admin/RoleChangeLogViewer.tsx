
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

// This component follows the conventions from /docs/conventions/roles_and_ids.md
interface RoleChange {
  id: string;
  changed_by: string;
  target_user: string;
  old_role: string;
  new_role: string;
  timestamp: string;
  changed_by_user?: {
    name: string;
    email: string;
  };
  target_user_profile?: {
    name: string;
    email: string;
  };
}

export function RoleChangeLogViewer() {
  const [logs, setLogs] = useState<RoleChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoleLogs() {
      try {
        const { data, error } = await supabase
          .from("role_change_logs")
          .select(`
            id,
            changed_by,
            target_user,
            old_role,
            new_role,
            timestamp,
            changed_by_user:changed_by(name, email),
            target_user_profile:target_user(name, email)
          `)
          .order("timestamp", { ascending: false });

        if (error) throw error;
        
        // Transform the data to match our RoleChange type
        const typedData: RoleChange[] = data?.map(item => ({
          id: item.id,
          changed_by: item.changed_by,
          target_user: item.target_user,
          old_role: item.old_role,
          new_role: item.new_role,
          timestamp: item.timestamp,
          changed_by_user: item.changed_by_user as unknown as RoleChange['changed_by_user'],
          target_user_profile: item.target_user_profile as unknown as RoleChange['target_user_profile']
        })) || [];
        
        setLogs(typedData);
      } catch (err) {
        console.error("Error fetching role logs:", err);
        setError("Fehler beim Laden der Rollenänderungen");
      } finally {
        setLoading(false);
      }
    }

    fetchRoleLogs();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rollenänderungen werden geladen...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fehler</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keine Rollenänderungen</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Es wurden bisher keine Rollenänderungen vorgenommen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rollenänderungen</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zeitpunkt</TableHead>
                <TableHead>Geändert von</TableHead>
                <TableHead>Benutzer</TableHead>
                <TableHead>Alte Rolle</TableHead>
                <TableHead>Neue Rolle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <span title={new Date(log.timestamp).toLocaleString()}>
                      {formatDistanceToNow(new Date(log.timestamp), { 
                        addSuffix: true,
                        locale: de
                      })}
                    </span>
                  </TableCell>
                  <TableCell>{log.changed_by_user?.name || log.changed_by}</TableCell>
                  <TableCell>{log.target_user_profile?.name || log.target_user}</TableCell>
                  <TableCell>{log.old_role}</TableCell>
                  <TableCell className="font-medium">{log.new_role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
