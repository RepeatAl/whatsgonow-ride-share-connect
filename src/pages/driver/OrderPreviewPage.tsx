
import Layout from '@/components/Layout';
import { DriverOrderPreview } from "@/components/driver/DriverOrderPreview";

export default function OrderPreviewPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-semibold mb-6">Offene Aufträge</h1>
        <DriverOrderPreview />
      </div>
    </Layout>
  );
}
