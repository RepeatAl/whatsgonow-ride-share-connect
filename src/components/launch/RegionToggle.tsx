
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLaunch } from "./LaunchProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface Region {
  code: string;
  name: string;
  active: boolean;
}

const RegionToggle = () => {
  const { trackEvent } = useLaunch();
  const [regions, setRegions] = useState<Region[]>([
    { code: "US-CA", name: "California, USA", active: true },
    { code: "US-NY", name: "New York, USA", active: true },
    { code: "UK-LDN", name: "London, UK", active: true },
    { code: "DE-BER", name: "Berlin, Germany", active: false },
    { code: "FR-PAR", name: "Paris, France", active: false },
  ]);

  const handleToggle = (code: string) => {
    setRegions(
      regions.map((region) => {
        if (region.code === code) {
          const newActiveState = !region.active;
          
          // Track toggle events
          trackEvent("region_toggle", {
            region: region.name,
            active: newActiveState,
          });
          
          return { ...region, active: newActiveState };
        }
        return region;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Test Regions</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle regions where the beta features are available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>
          Control which regions have access to beta features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {regions.map((region) => (
            <div
              key={region.code}
              className="flex items-center justify-between"
            >
              <Label htmlFor={`region-${region.code}`} className="flex-1">
                {region.name}
              </Label>
              <Switch
                id={`region-${region.code}`}
                checked={region.active}
                onCheckedChange={() => handleToggle(region.code)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionToggle;
