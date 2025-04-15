
import { useState } from "react";
import Layout from "@/components/Layout";
import { useLaunch } from "@/components/launch/LaunchProvider";
import FeedbackForm, { FeedbackData } from "@/components/feedback/FeedbackForm";
import FeedbackHeader from "@/components/feedback/FeedbackHeader";
import FeatureUnavailable from "@/components/feedback/FeatureUnavailable";
import SuccessConfirmation from "@/components/data-deletion/SuccessConfirmation";

const Feedback = () => {
  const { isLaunchReady, isTest, trackEvent } = useLaunch();
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Only show if launched or in test region
  if (!isLaunchReady && !isTest) {
    return (
      <Layout>
        <FeatureUnavailable />
      </Layout>
    );
  }

  const handleSubmit = (feedbackData: FeedbackData) => {
    trackEvent("feedback_submitted", {
      feedbackType: feedbackData.feedbackType,
      satisfaction: feedbackData.satisfaction,
      features: feedbackData.features,
    });
    
    console.log("Feedback submitted:", feedbackData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="container max-w-2xl px-4 py-8">
          <FeedbackHeader isSubmitted={true} />
          <SuccessConfirmation 
            title="Vielen Dank für Ihr Feedback!"
            message="Ihre Rückmeldung hilft uns, Whatsgonow kontinuierlich zu verbessern." 
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <FeedbackHeader />
        <FeedbackForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default Feedback;
