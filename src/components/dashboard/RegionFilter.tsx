
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const RegionFilter = ({ selectedRegion, onRegionChange }: RegionFilterProps) => {
  const regions = [
    { value: "all", label: "All Regions" },
    { value: "North", label: "North" },
    { value: "South", label: "South" },
    { value: "East", label: "East" },
    { value: "West", label: "West" },
    { value: "Central", label: "Central" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Region:</span>
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
