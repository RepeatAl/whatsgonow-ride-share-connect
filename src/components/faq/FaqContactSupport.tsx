
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FaqContactSupport = () => {
  return (
    <div className="mt-12 p-6 bg-muted rounded-lg text-center">
      <h2 className="text-xl font-semibold mb-4">Noch Fragen?</h2>
      <p className="text-muted-foreground mb-6">
        Falls du keine Antwort auf deine Frage gefunden hast, kontaktiere unseren Support.
      </p>
      <Button asChild>
        <Link to="/support">Support kontaktieren</Link>
      </Button>
    </div>
  );
};

export default FaqContactSupport;
