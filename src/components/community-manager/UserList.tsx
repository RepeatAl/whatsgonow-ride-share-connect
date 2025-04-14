
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { Eye, Clock, Plus, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserListProps {
  region: string;
}

interface User {
  user_id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  orders_count: number;
  rating_avg: number;
}

const UserList = ({ region }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!region) {
        setLoading(false);
        return;
      }

      try {
        // Fetch users data from the region
        const { data, error } = await supabase
          .from("users")
          .select("user_id, name, email, role, created_at")
          .eq("region", region);

        if (error) throw error;

        // For each user, fetch their orders count and average rating
        const enrichedUsers = await Promise.all((data || []).map(async (user) => {
          // Fetch orders count for this user
          const { count: ordersCount, error: ordersError } = await supabase
            .from("orders")
            .select("order_id", { count: "exact" })
            .eq("sender_id", user.user_id);

          if (ordersError) console.error("Error fetching orders:", ordersError);

          // Fetch average rating for this user
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("ratings")
            .select("score")
            .eq("to_user", user.user_id);

          if (ratingsError) console.error("Error fetching ratings:", ratingsError);

          const ratingAvg = ratingsData && ratingsData.length > 0 
            ? ratingsData.reduce((acc, curr) => acc + (curr.score || 0), 0) / ratingsData.length 
            : 0;

          return {
            ...user,
            orders_count: ordersCount || 0,
            rating_avg: Number(ratingAvg.toFixed(1))
          };
        }));

        setUsers(enrichedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Fehler beim Laden",
          description: "Nutzerdaten konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [region]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const toggleExpand = (userId: string) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "driver":
        return <Badge variant="secondary">Fahrer</Badge>;
      case "sender":
        return <Badge>Auftraggeber</Badge>;
      case "cm":
        return <Badge variant="outline">Community Manager</Badge>;
      case "admin":
        return <Badge className="bg-blue-500">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full mb-4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Dir ist noch keine Region zugewiesen. Bitte kontaktiere einen Administrator.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Nutzer in der Region {region}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Rolle</TableHead>
            <TableHead>Registriert</TableHead>
            <TableHead>Aufträge</TableHead>
            <TableHead>Bewertung</TableHead>
            <TableHead>Kontakt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                Keine Nutzer gefunden
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleExpand(user.user_id)}
                  >
                    {expandedUser === user.user_id ? 
                      <Eye className="h-4 w-4 text-blue-500" /> : 
                      <Plus className="h-4 w-4" />
                    }
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell>{user.orders_count}</TableCell>
                <TableCell>
                  {user.rating_avg > 0 ? (
                    <div className="flex items-center">
                      <span className={`font-medium ${
                        user.rating_avg >= 4 ? "text-green-500" : 
                        user.rating_avg >= 3 ? "text-blue-500" : 
                        "text-amber-500"
                      }`}>
                        {user.rating_avg}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        ★
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Neu
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="icon" variant="ghost" title={user.email}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Anrufen">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserList;
