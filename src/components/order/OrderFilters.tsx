
import { Slider } from "@/components/ui/slider";
import { RegionFilter } from "@/components/dashboard/RegionFilter";

interface OrderFiltersProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  maxWeight: number;
  onWeightChange: (value: number) => void;
}

const OrderFilters = ({
  selectedRegion,
  onRegionChange,
  maxWeight,
  onWeightChange
}: OrderFiltersProps) => {
  return (
    <div className="mb-6 p-4 bg-background border rounded-lg shadow-sm">
      <h2 className="font-medium mb-4">Filter Aufträge</h2>
      
      <div className="space-y-4">
        <RegionFilter 
          selectedRegion={selectedRegion}
          onRegionChange={onRegionChange}
        />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Max. Gewicht: {maxWeight}kg</span>
            <span className="text-xs text-muted-foreground">{maxWeight >= 100 ? "Unbegrenzt" : `${maxWeight}kg`}</span>
          </div>
          <Slider
            value={[maxWeight]}
            onValueChange={(values) => onWeightChange(values[0])}
            max={100}
            step={5}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
