
import { Filter, Package } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RegionFilter } from "@/components/dashboard/RegionFilter";

interface OrderFiltersProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  maxWeight: number;
  onWeightChange: (weight: number) => void;
}

const OrderFilters = ({
  selectedRegion,
  onRegionChange,
  maxWeight,
  onWeightChange,
}: OrderFiltersProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Aufträge filtern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <RegionFilter selectedRegion={selectedRegion} onRegionChange={onRegionChange} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-1 text-brand-primary" />
              Max. Gewicht: {maxWeight} kg
            </label>
            <Slider
              value={[maxWeight]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => onWeightChange(value[0])}
              className="my-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderFilters;
