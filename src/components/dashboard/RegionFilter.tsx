
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";
import { fetchAllRegions, getRegionDisplayName, type CMRegion } from "@/utils/regionUtils";

interface RegionFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const RegionFilter = ({ selectedRegion, onRegionChange }: RegionFilterProps) => {
  const [regions, setRegions] = useState<CMRegion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegions = async () => {
      try {
        const allRegions = await fetchAllRegions();
        setRegions(allRegions);
      } catch (error) {
        console.error("Failed to load regions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  const regionOptions = [
    { value: "all", label: "All Regions" },
    ...regions.map(region => ({
      value: region.region_id,
      label: getRegionDisplayName(region)
    }))
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
        disabled={loading}
      >
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder={loading ? "Loading regions..." : "Select region"} />
        </SelectTrigger>
        <SelectContent>
          {regionOptions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
