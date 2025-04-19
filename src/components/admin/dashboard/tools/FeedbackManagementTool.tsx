
import { MessageSquareWarning } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const FeedbackManagementTool = () => {
  return (
    <AdminToolCard
      title="Feedback-Management"
      description="Verwaltung und Beantwortung von Nutzerfeedback und Anfragen."
      icon={MessageSquareWarning}
      linkTo="/admin/feedback"
    />
  );
};

export default FeedbackManagementTool;
