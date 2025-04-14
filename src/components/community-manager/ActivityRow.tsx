
import { TableRow, TableCell } from "@/components/ui/table";
import ActivityIcon from "./ActivityIcon";
import StatusBadge from "./StatusBadge";
import DateFormatter from "./DateFormatter";

interface ActivityRowProps {
  activity: {
    id: string;
    type: string;
    user_name: string;
    timestamp: string;
    description: string;
    status?: string;
  };
}

const ActivityRow = ({ activity }: ActivityRowProps) => {
  return (
    <TableRow key={activity.id}>
      <TableCell>
        <ActivityIcon type={activity.type} status={activity.status} />
      </TableCell>
      <TableCell className="font-medium">
        {activity.user_name}
      </TableCell>
      <TableCell>
        <DateFormatter dateString={activity.timestamp} />
      </TableCell>
      <TableCell className="max-w-[300px] truncate">
        {activity.description}
      </TableCell>
      <TableCell>
        <StatusBadge status={activity.status} />
      </TableCell>
    </TableRow>
  );
};

export default ActivityRow;
