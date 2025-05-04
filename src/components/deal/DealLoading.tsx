
import { Loader2 } from "lucide-react";

export const DealLoading = () => {
  return (
    <div className="flex-grow flex justify-center items-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
};
