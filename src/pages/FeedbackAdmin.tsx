
import Layout from '@/components/Layout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeedbackCard } from '@/components/feedback/admin/FeedbackCard';
import { useFeedbackAdmin } from '@/hooks/use-feedback-admin';

const FeedbackAdmin = () => {
  const { feedbackItems, loading, filter, setFilter, updateFeedbackStatus } = useFeedbackAdmin();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Feedback-Verwaltung</h1>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              <SelectItem value="open">Offen</SelectItem>
              <SelectItem value="in_progress">In Bearbeitung</SelectItem>
              <SelectItem value="resolved">Erledigt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {feedbackItems.map((item) => (
            <FeedbackCard 
              key={item.id}
              item={item}
              onUpdateStatus={updateFeedbackStatus}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FeedbackAdmin;
