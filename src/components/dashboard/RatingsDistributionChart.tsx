import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

interface User {
  id: string;
  name: string;
  rating: {
    average: number;
    count: number;
  };
  // ...other properties
}

interface RatingsDistributionChartProps {
  users: User[];
}

export const RatingsDistributionChart = ({ users }: RatingsDistributionChartProps) => {
  // Prepare chart data - count users by rating
  const chartData = useMemo(() => {
    // Initialize counters for each rating
    const ratingCounts = {
      "5": 0,
      "4": 0, 
      "3": 0,
      "2": 0,
      "1": 0
    };
    
    // Count users by rounded rating
    users.forEach(user => {
      if (user.rating.count > 0) {  // Only include users with ratings
        const roundedRating = Math.round(user.rating.average).toString();
        if (roundedRating in ratingCounts) {
          ratingCounts[roundedRating as keyof typeof ratingCounts] += 1;
        }
      }
    });
    
    // Convert to array for the chart
    return Object.entries(ratingCounts).map(([rating, count]) => ({
      rating,
      count
    }));
  }, [users]);

  const chartConfig = {
    count: {
      label: "Users",
      theme: {
        light: "#8b5cf6",
        dark: "#8b5cf6"
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Distribution</CardTitle>
        <CardDescription>Number of users by rating level</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="rating" 
                tickLine={false}
                axisLine={false}
                label={{ value: 'Rating', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                label={{ value: 'Users', angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip
                content={({ active, payload, label }) => (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={`${label} Star Rating`}
                  />
                )}
              />
              <Bar 
                dataKey="count" 
                fill="var(--color-count)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
