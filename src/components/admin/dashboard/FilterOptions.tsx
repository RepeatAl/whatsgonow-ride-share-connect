
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSummary } from "@/hooks/use-admin-logs";

interface FilterOptionsProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  selectedRegion: string | undefined;
  setSelectedRegion: (value: string | undefined) => void;
  userSummaries: UserSummary[];
}

const FilterOptions = ({
  timeRange,
  setTimeRange,
  selectedRegion,
  setSelectedRegion,
  userSummaries
}: FilterOptionsProps) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="w-full sm:w-48">
      <Select
        value={timeRange.toString()}
        onValueChange={(value) => setTimeRange(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Zeitraum" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Letzte 7 Tage</SelectItem>
          <SelectItem value="30">Letzte 30 Tage</SelectItem>
          <SelectItem value="90">Letzte 90 Tage</SelectItem>
          <SelectItem value="365">Letztes Jahr</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="w-full sm:w-48">
      <Select
        value={selectedRegion || ''}
        onValueChange={(value) => setSelectedRegion(value || undefined)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Alle Regionen</SelectItem>
          {userSummaries.map((summary) => (
            <SelectItem key={summary.region} value={summary.region}>
              {summary.region || 'Unbekannt'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default FilterOptions;
