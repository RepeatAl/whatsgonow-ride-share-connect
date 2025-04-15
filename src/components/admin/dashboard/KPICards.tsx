
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, BadgeDollarSign, Star } from "lucide-react";

interface KPICardsProps {
  stats: {
    totalDeliveries: number;
    totalTransactions: number;
    averageRating: number;
  };
  timeRange: number;
}

const KPICards = ({ stats, timeRange }: KPICardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Lieferungen</CardTitle>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
        <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Transaktionsvolumen</CardTitle>
        <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">€{stats.totalTransactions.toFixed(2)}</div>
        <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Ø Bewertung</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.averageRating}</div>
        <p className="text-xs text-muted-foreground">In den letzten {timeRange} Tagen</p>
      </CardContent>
    </Card>
  </div>
);

export default KPICards;
