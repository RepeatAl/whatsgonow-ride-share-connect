
import { Bell, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  onRefresh: () => void;
}

const OrdersHeader = ({ onRefresh }: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">Verfügbare Aufträge</h1>
        <p className="text-muted-foreground mt-1">Finde Aufträge, die zu dir passen</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 text-sm"
          onClick={onRefresh}
        >
          <Bell className="h-4 w-4" /> 
          <span className="hidden sm:inline">Echtzeit-Updates aktiv</span>
          <span className="inline sm:hidden">Updates aktiv</span>
        </Button>
        
        <Button onClick={onRefresh} variant="outline" className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4" /> Aufträge aktualisieren
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
