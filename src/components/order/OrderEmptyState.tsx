
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderEmptyStateProps {
  noOrdersAvailable: boolean;
  onResetFilters: () => void;
}

const OrderEmptyState = ({ noOrdersAvailable, onResetFilters }: OrderEmptyStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium mb-2">Keine Aufträge gefunden</h3>
        <p className="text-muted-foreground text-center mb-4">
          {noOrdersAvailable 
            ? "Es sind derzeit keine offenen Aufträge verfügbar."
            : "Keine Aufträge entsprechen deinen Filterkriterien."}
        </p>
        <Button onClick={onResetFilters} variant="outline">
          Filter zurücksetzen
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderEmptyState;
