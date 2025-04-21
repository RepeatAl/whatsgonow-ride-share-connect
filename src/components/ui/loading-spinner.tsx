
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-12 w-12",
    large: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary`} />
    </div>
  );
};
