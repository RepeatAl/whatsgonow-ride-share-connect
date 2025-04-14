
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  MessageSquare, 
  Star, 
  TruckIcon,
  ShoppingBag,
  User
} from "lucide-react";

interface UserActivityProps {
  region: string;
}

interface ActivityItem {
  id: string;
  type: "order" | "offer" | "rating" | "transaction";
  user_name: string;
  user_id: string;
  timestamp: string;
  description: string;
  status?: string;
}

const UserActivity = ({ region }: UserActivityProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!region) {
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        // Get a timestamp for 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Load orders from this region
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select(`
            order_id,
            sender_id,
            status,
            description,
            deadline,
            users!inner(name)
          `)
          .eq("users.region", region)
          .gte("deadline", thirtyDaysAgo.toISOString())
          .order("deadline", { ascending: false })
          .limit(10);
          
        if (ordersError) throw ordersError;
        
        // Load ratings from this region
        const { data: ratings, error: ratingsError } = await supabase
          .from("ratings")
          .select(`
            rating_id,
            from_user,
            to_user,
            score,
            comment,
            users!inner(name, region)
          `)
          .eq("users.region", region)
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (ratingsError) throw ratingsError;
        
        // Combine and format all activities
        const orderActivities = (orders || []).map(order => {
          // Access the user's name safely
          const userName = order.users ? order.users.name : 'Unknown User';
          
          return {
            id: order.order_id,
            type: "order" as const,
            user_name: userName,
            user_id: order.sender_id,
            timestamp: order.deadline,
            description: order.description,
            status: order.status
          };
        });
        
        const ratingActivities = (ratings || []).map(rating => {
          // Access the user's name safely
          const userName = rating.users ? rating.users.name : 'Unknown User';
          
          return {
            id: rating.rating_id,
            type: "rating" as const,
            user_name: userName,
            user_id: rating.from_user,
            timestamp: new Date().toISOString(), // Using current date as a fallback
            description: `Bewertung: ${rating.score}/5 ${rating.comment ? `- "${rating.comment}"` : ""}`,
          };
        });
        
        // Combine all activities and sort by date
        const allActivities = [...orderActivities, ...ratingActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 15); // Limit to most recent 15 activities
          
        setActivities(allActivities);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivity();
  }, [region]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  const getActivityIcon = (type: string, status?: string) => {
    switch (type) {
      case "order":
        if (status === "completed") {
          return <TruckIcon className="h-4 w-4 text-green-500" />;
        } else if (status === "cancelled") {
          return <Package className="h-4 w-4 text-red-500" />;
        }
        return <Package className="h-4 w-4 text-blue-500" />;
      case "offer":
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      case "rating":
        return <Star className="h-4 w-4 text-amber-500" />;
      case "transaction":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status) {
      case "offen":
        return <Badge variant="outline" className="ml-2">Offen</Badge>;
      case "matched":
        return <Badge variant="secondary" className="ml-2">Matched</Badge>;
      case "unterwegs":
        return <Badge className="bg-blue-500 text-white ml-2">Unterwegs</Badge>;
      case "abgeschlossen":
        return <Badge className="bg-green-500 text-white ml-2">Abgeschlossen</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Dir ist noch keine Region zugewiesen.
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Keine Aktivitäten in den letzten 30 Tagen gefunden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Typ</TableHead>
            <TableHead>Nutzer</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {getActivityIcon(activity.type, activity.status)}
              </TableCell>
              <TableCell className="font-medium">
                {activity.user_name}
              </TableCell>
              <TableCell>{formatDate(activity.timestamp)}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {activity.description}
              </TableCell>
              <TableCell>
                {getStatusBadge(activity.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserActivity;
