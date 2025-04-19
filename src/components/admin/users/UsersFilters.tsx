
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="Suche nach Name oder E-Mail..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Select value={roleFilter} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Rolle auswählen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Rollen</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="admin_limited">Limited Admin</SelectItem>
          <SelectItem value="driver">Fahrer</SelectItem>
          <SelectItem value="sender_private">Privater Sender</SelectItem>
          <SelectItem value="sender_business">Business Sender</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
