
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserSummary } from "@/hooks/use-admin-logs";

interface UserActivityTableProps {
  userSummaries: UserSummary[];
}

const UserActivityTable = ({ userSummaries }: UserActivityTableProps) => (
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

export default UserActivityTable;
