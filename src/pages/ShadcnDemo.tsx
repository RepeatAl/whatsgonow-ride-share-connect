
import Layout from "@/components/Layout";
import ShadcnDemo from "@/components/demo/ShadcnDemo";

const ShadcnDemoPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Shadcn UI Komponenten Demo</h1>
        <ShadcnDemo />
      </div>
    </Layout>
  );
};

export default ShadcnDemoPage;
