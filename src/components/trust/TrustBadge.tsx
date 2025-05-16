
import React from "react";
import { Shield, ShieldCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useTrustScore } from "@/hooks/use-trust-score";

interface TrustBadgeProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  userId, 
  size = "md", 
  showTooltip = true,
  className = "" 
}) => {
  const { score, isVerified, loading } = useTrustScore(userId);
  
  if (loading) {
    return <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>;
  }
  
  if (score === null) {
    return null;
  }
  
  // Determine trust level
  const getTrustLevel = () => {
    if (score >= 150) {
      return {
        text: "Sehr vertrauenswürdig",
        icon: <ShieldCheck className="h-3.5 w-3.5" />,
        color: "bg-green-50 text-green-700 border-green-200"
      };
    } else if (score >= 100) {
      return {
        text: "Vertrauenswürdig",
        icon: <Shield className="h-3.5 w-3.5" />,
        color: "bg-blue-50 text-blue-700 border-blue-200"
      };
    } else if (score >= 50) {
      return {
        text: "Neutral",
        icon: <Shield className="h-3.5 w-3.5" />,
        color: "bg-gray-50 text-gray-700 border-gray-200"
      };
    } else {
      return {
        text: "Neu",
        icon: <Info className="h-3.5 w-3.5" />,
        color: "bg-gray-50 text-gray-600 border-gray-200"
      };
    }
  };

  const trustLevel = getTrustLevel();
  
  const badge = (
    <Badge 
      variant="outline" 
      className={`gap-1 ${trustLevel.color} ${className}`}
    >
      {trustLevel.icon}
      <span className={size === "sm" ? "text-xs" : ""}>{trustLevel.text}</span>
      {size !== "sm" && score !== null && (
        <span className="ml-1 text-xs font-normal">({score})</span>
      )}
    </Badge>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <p>Trust Score: {score}/200</p>
              {isVerified && <p>Nutzer ist verifiziert</p>}
              <p className="text-xs text-gray-500 mt-1">
                Basierend auf Bewertungen, Aktivität und Verifizierung
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
};

export default TrustBadge;
