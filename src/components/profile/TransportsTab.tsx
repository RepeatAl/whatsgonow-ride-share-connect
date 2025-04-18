
import TransportCard from "@/components/transport/TransportCard";
import { mockTransports } from "@/data/mockData";

export function TransportsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {mockTransports.map(t => <TransportCard key={t.id} transport={t} />)}
    </div>
  );
}
