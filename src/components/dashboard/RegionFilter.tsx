
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";

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
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="text-sm font-medium flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-brand-primary" aria-hidden="true" />
            Region:
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filter dashboard by region</p>
        </TooltipContent>
      </Tooltip>
      <Select 
        value={selectedRegion} 
        onValueChange={onRegionChange}
        aria-label="Select region"
      >
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
