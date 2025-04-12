
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  amount: number;
  commission: number;
  date: Date;
  region: string;
}

interface CommissionOverviewProps {
  orders: Order[];
}

export const CommissionOverview = ({ orders }: CommissionOverviewProps) => {
  // Get completed orders for commission calculation
  const completedOrders = orders.filter(order => order.status === 'completed');
  
  // Calculate total commission
  const totalCommission = completedOrders.reduce((sum, order) => sum + order.commission, 0);
  
  // Group by region for the breakdown
  const regionCommissions = completedOrders.reduce((acc, order) => {
    if (!acc[order.region]) {
      acc[order.region] = {
        region: order.region,
        commission: 0,
        orderCount: 0
      };
    }
    
    acc[order.region].commission += order.commission;
    acc[order.region].orderCount += 1;
    
    return acc;
  }, {} as Record<string, { region: string; commission: number; orderCount: number }>);
  
  // Convert to array and sort by commission (highest first)
  const regionData = Object.values(regionCommissions).sort((a, b) => b.commission - a.commission);
  
  // Calculate percentages for progress bars
  const highestCommission = regionData.length > 0 ? regionData[0].commission : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Overview</CardTitle>
        <CardDescription>
          Based on {completedOrders.length} completed orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-6">${totalCommission.toFixed(2)}</div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Commission by Region</h4>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead className="w-[100px]">Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionData.map((item) => (
                <TableRow key={item.region}>
                  <TableCell className="font-medium">{item.region}</TableCell>
                  <TableCell>{item.orderCount}</TableCell>
                  <TableCell>${item.commission.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(item.commission / highestCommission) * 100} 
                        className="h-2" 
                      />
                      <span className="text-xs w-9 text-right">
                        {Math.round((item.commission / totalCommission) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
