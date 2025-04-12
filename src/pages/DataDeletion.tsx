
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DataDeletionForm, { FormValues } from "@/components/data-deletion/DataDeletionForm";
import SuccessConfirmation from "@/components/data-deletion/SuccessConfirmation";

const DataDeletion = () => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitSuccess = (data: FormValues) => {
    setIsSuccess(true);
  };

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Data Deletion Request</h1>
          <p className="text-gray-600 mb-4">
            In accordance with GDPR, you have the right to request deletion of your personal data.
          </p>
        </div>

        {isSuccess ? (
          <SuccessConfirmation />
        ) : (
          <DataDeletionForm onSubmitSuccess={handleSubmitSuccess} />
        )}
      </div>
    </Layout>
  );
};

export default DataDeletion;
