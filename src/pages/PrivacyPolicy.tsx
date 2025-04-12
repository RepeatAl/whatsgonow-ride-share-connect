
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>
              At whatsgonow, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our platform.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Data We Collect</h2>
            <p>We collect several types of information from and about users of our platform, including:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Personal identifiers (name, email address, phone number)</li>
              <li>Profile information (profile pictures, ratings, reviews)</li>
              <li>Location data (pickup and delivery addresses)</li>
              <li>Transaction and payment data</li>
              <li>Device and usage information</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. How We Use Your Data</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>To provide and maintain our service</li>
              <li>To process and complete transactions</li>
              <li>To verify your identity for security purposes</li>
              <li>To improve our platform and user experience</li>
              <li>To communicate with you about your account or orders</li>
              <li>To detect and prevent fraudulent activities</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p>
              Under the GDPR, we process your personal data based on one or more of the following 
              legal grounds:
            </p>
            <ul className="list-disc ml-6 mt-2">
              <li>Performance of a contract</li>
              <li>Your consent</li>
              <li>Legitimate interests</li>
              <li>Compliance with legal obligations</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for 
              which we collected it, including to satisfy legal or reporting requirements.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Your Data Protection Rights</h2>
            <p>Under the GDPR, you have the following rights:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure (right to be forgotten)</li>
              <li>Right to restriction of processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, please visit our <Link to="/data-deletion" className="text-brand-primary underline">Data Deletion Request</Link> page 
              or contact our Data Protection Officer at privacy@whatsgonow.com.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our platform 
              and store certain information. You can instruct your browser to refuse all cookies or 
              to indicate when a cookie is being sent.
            </p>
            <p className="mt-2">
              For more information about the cookies we use, please see our 
              <Link to="/cookies" className="text-brand-primary underline ml-1">Cookie Policy</Link>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <address className="not-italic mt-2">
              whatsgonow GmbH<br />
              Musterstraße 123<br />
              10115 Berlin, Germany<br />
              Email: privacy@whatsgonow.com<br />
              Phone: +49 30 1234567
            </address>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
