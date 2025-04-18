
import RequestCard from "@/components/transport/RequestCard";
import { mockRequests } from "@/data/mockData";

export function RequestsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {mockRequests.map(r => <RequestCard key={r.id} request={r} />)}
    </div>
  );
}
