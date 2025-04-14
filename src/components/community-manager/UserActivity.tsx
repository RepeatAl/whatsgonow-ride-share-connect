
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import ActivityRow from "./ActivityRow";
import EmptyState from "./EmptyState";
import { useActivityData } from "@/hooks/use-activity-data";

interface UserActivityProps {
  region: string;
}

const UserActivity = ({ region }: UserActivityProps) => {
  const { activities, loading } = useActivityData(region);

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
    return <EmptyState message="Dir ist noch keine Region zugewiesen." />;
  }

  if (activities.length === 0) {
    return <EmptyState message="Keine Aktivitäten in den letzten 30 Tagen gefunden." />;
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
            <ActivityRow key={activity.id} activity={activity} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserActivity;
