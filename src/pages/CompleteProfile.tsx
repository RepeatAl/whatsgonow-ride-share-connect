
import Layout from "@/components/Layout";
import { ProfileCompletion } from "@/components/profile/ProfileCompletion";

const CompleteProfile = () => {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <ProfileCompletion />
      </div>
    </Layout>
  );
};

export default CompleteProfile;
