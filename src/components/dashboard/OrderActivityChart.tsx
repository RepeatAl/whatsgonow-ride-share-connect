
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";

interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  amount: number;
  commission: number;
  date: Date;
  region: string;
}

interface OrderActivityChartProps {
  orders: Order[];
}

export const OrderActivityChart = ({ orders }: OrderActivityChartProps) => {
  // Prepare chart data - group by month for the last 6 months
  const chartData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    
    // Initialize data for last 6 months
    const monthsData: Record<string, { month: string; completed: number; cancelled: number }> = {};
    
    // Create entries for the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      monthsData[monthKey] = {
        month: monthName,
        completed: 0,
        cancelled: 0
      };
    }
    
    // Fill with order data
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      
      // Only include last 6 months
      if (orderDate >= sixMonthsAgo) {
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`;
        
        if (monthsData[monthKey]) {
          if (order.status === 'completed') {
            monthsData[monthKey].completed += 1;
          } else if (order.status === 'cancelled') {
            monthsData[monthKey].cancelled += 1;
          }
        }
      }
    });
    
    // Convert to array and sort by date (oldest first)
    return Object.values(monthsData).reverse();
  }, [orders]);

  const chartConfig = {
    completed: {
      label: "Completed",
      theme: {
        light: "#10b981",
        dark: "#10b981" 
      }
    },
    cancelled: {
      label: "Cancelled",
      theme: {
        light: "#ef4444",
        dark: "#ef4444" 
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Activity</CardTitle>
        <CardDescription>Trend of completed and cancelled orders</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload} 
                    label={label} 
                  />
                )}
              />
              <ChartLegend 
                content={({ payload }) => (
                  <ChartLegendContent payload={payload} />
                )}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-completed)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cancelled"
                stroke="var(--color-cancelled)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
