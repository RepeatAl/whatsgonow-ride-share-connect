
import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerField } from "@/components/admin/validation/filters/DatePickerField";

interface PreRegistrationsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterDrivers: boolean;
  onFilterDriversChange: (checked: boolean) => void;
  filterCM: boolean;
  onFilterCMChange: (checked: boolean) => void;
  filterSender: boolean;
  onFilterSenderChange: (checked: boolean) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
}

export const PreRegistrationsFilters = ({
  searchTerm,
  onSearchChange,
  filterDrivers,
  onFilterDriversChange,
  filterCM,
  onFilterCMChange,
  filterSender,
  onFilterSenderChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: PreRegistrationsFiltersProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <DatePickerField
            label="Von"
            date={startDate}
            onDateChange={onStartDateChange}
            placeholder="Startdatum wählen"
          />
        </div>
        <div className="w-full md:w-1/4">
          <DatePickerField
            label="Bis"
            date={endDate}
            onDateChange={onEndDateChange}
            placeholder="Enddatum wählen"
          />
        </div>
        <div className="w-full md:w-1/2">
          <Input
            type="text"
            placeholder="Suche nach Name, Email, PLZ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-drivers"
            checked={filterDrivers}
            onCheckedChange={(checked) => onFilterDriversChange(!!checked)}
          />
          <label htmlFor="filter-drivers" className="text-sm">Fahrer</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-cm"
            checked={filterCM}
            onCheckedChange={(checked) => onFilterCMChange(!!checked)}
          />
          <label htmlFor="filter-cm" className="text-sm">Community Manager</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="filter-sender"
            checked={filterSender}
            onCheckedChange={(checked) => onFilterSenderChange(!!checked)}
          />
          <label htmlFor="filter-sender" className="text-sm">Versender</label>
        </div>
      </div>
    </div>
  );
};
