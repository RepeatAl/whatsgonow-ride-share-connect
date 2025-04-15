
import { Button } from "@/components/ui/button";
import { SearchInput } from "./filters/SearchInput";
import { FilterSelect } from "./filters/FilterSelect";
import { DatePickerField } from "./filters/DatePickerField";

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
  const validationTypeOptions = [
    { value: "digital_signature", label: "Digitale Signatur" },
    { value: "xrechnung", label: "XRechnung" },
    { value: "gobd", label: "GoBD" },
    { value: "format", label: "Format" },
    { value: "tax", label: "Steuer" }
  ];

  const statusOptions = [
    { value: "passed", label: "Bestanden" },
    { value: "failed", label: "Nicht bestanden" }
  ];

  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={onSearchChange}
        />
        
        <FilterSelect
          label="Validierungstyp"
          value={selectedValidationType}
          onValueChange={onValidationTypeChange}
          options={validationTypeOptions}
          placeholder="Alle Typen"
        />
        
        <FilterSelect
          label="Status"
          value={selectedStatus}
          onValueChange={onStatusChange}
          options={statusOptions}
          placeholder="Alle Status"
        />
        
        <DatePickerField
          label="Startdatum"
          date={startDate}
          onDateChange={onStartDateChange}
          placeholder="Startdatum wählen"
        />
        
        <DatePickerField
          label="Enddatum"
          date={endDate}
          onDateChange={onEndDateChange}
          placeholder="Enddatum wählen"
        />
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" onClick={onReset} className="mr-2">
          Filter zurücksetzen
        </Button>
      </div>
    </div>
  );
};
