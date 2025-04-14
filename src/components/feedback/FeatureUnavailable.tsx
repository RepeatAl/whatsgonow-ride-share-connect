
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FeatureUnavailable = () => {
  return (
    <div className="container max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Feature Not Available</h1>
      <p>This feature is not yet available in your region.</p>
      <Button asChild className="mt-4">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default FeatureUnavailable;
