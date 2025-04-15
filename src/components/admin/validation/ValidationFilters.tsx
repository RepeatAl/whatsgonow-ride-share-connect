
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from 'date-fns';

interface ValidationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedValidationType: string | undefined;
  onValidationTypeChange: (value: string) => void;
  selectedStatus: string | undefined;
  onStatusChange: (value: string) => void;
  startDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  endDate: Date | undefined;
  onEndDateChange: (date: Date | undefined) => void;
  onReset: () => void;
}

export const ValidationFilters = ({
  searchTerm,
  onSearchChange,
  selectedValidationType,
  onValidationTypeChange,
  selectedStatus,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset
}: ValidationFiltersProps) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Rechnungs-ID</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suche nach ID..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Validierungstyp</label>
          <Select
            value={selectedValidationType}
            onValueChange={onValidationTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Alle Typen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital_signature">Digitale Signatur</SelectItem>
              <SelectItem value="xrechnung">XRechnung</SelectItem>
              <SelectItem value="gobd">GoBD</SelectItem>
              <SelectItem value="format">Format</SelectItem>
              <SelectItem value="tax">Steuer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={selectedStatus}
            onValueChange={onStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Alle Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passed">Bestanden</SelectItem>
              <SelectItem value="failed">Nicht bestanden</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Startdatum</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'dd.MM.yyyy') : 'Startdatum wählen'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={onStartDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Enddatum</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'dd.MM.yyyy') : 'Enddatum wählen'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={onEndDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset} className="mr-2">
          Filter zurücksetzen
        </Button>
      </div>
    </div>
  );
};
