
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PreRegistration } from "@/types/pre-registration";

interface PreRegistrationsTableProps {
  registrations: PreRegistration[];
  isLoading: boolean;
}

export const PreRegistrationsTable = ({ registrations, isLoading }: PreRegistrationsTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        {isLoading ? (
          <TableCaption>Lade Vorregistrierungen...</TableCaption>
        ) : registrations.length === 0 ? (
          <TableCaption>Keine Vorregistrierungen gefunden</TableCaption>
        ) : null}
        
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>PLZ</TableHead>
            <TableHead>Rollen</TableHead>
            <TableHead>Fahrzeugtypen</TableHead>
            <TableHead>Datum</TableHead>
            <TableHead>Benachrichtigt</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : registrations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                Keine Vorregistrierungen gefunden
              </TableCell>
            </TableRow>
          ) : (
            registrations.map((reg) => (
              <TableRow key={reg.id}>
                <TableCell>
                  <div className="font-medium">{reg.first_name} {reg.last_name}</div>
                </TableCell>
                <TableCell>{reg.email}</TableCell>
                <TableCell>{reg.postal_code}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {reg.wants_driver && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        Fahrer
                      </span>
                    )}
                    {reg.wants_cm && (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700">
                        CM
                      </span>
                    )}
                    {reg.wants_sender && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                        Versender
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {reg.vehicle_types && reg.vehicle_types.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {reg.vehicle_types.map(type => (
                        <span 
                          key={type} 
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">-</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(reg.created_at)}</TableCell>
                <TableCell>
                  {reg.notification_sent ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Ja
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      Nein
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
