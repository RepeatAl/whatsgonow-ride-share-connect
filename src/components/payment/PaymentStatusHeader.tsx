
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PaymentStatusHeaderProps {
  onBack: () => void;
}

const PaymentStatusHeader: React.FC<PaymentStatusHeaderProps> = ({ onBack }) => {
  return (
    <Button 
      variant="ghost" 
      className="mb-4 pl-0 w-fit" 
      onClick={onBack}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Zurück zum Auftrag
    </Button>
  );
};

export default PaymentStatusHeader;
