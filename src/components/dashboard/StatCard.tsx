
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  tooltip: string;
  icon: ReactNode;
}

export const StatCard = ({
  title,
  value,
  description,
  tooltip,
  icon
}: StatCardProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              {icon}
            </div>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
