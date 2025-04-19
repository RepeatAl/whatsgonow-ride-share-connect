
import { FileBarChart } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const FeedbackAnalyticsTool = () => {
  return (
    <AdminToolCard
      title="Feedback-Analytics"
      description="Detaillierte Auswertungen und Visualisierungen aller Nutzer-Feedbacks."
      icon={FileBarChart}
      linkTo="/admin/feedback-analytics"
    />
  );
};

export default FeedbackAnalyticsTool;
