
import KYCValidationTool from './tools/KYCValidationTool';
import PreRegistrationsTool from './tools/PreRegistrationsTool';
import FeedbackAnalyticsTool from './tools/FeedbackAnalyticsTool';
import FeedbackManagementTool from './tools/FeedbackManagementTool';
import InvoiceManagementTool from './tools/InvoiceManagementTool';
import UserManagementTool from './tools/UserManagementTool';

const AdminToolsGrid = () => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Admin-Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KYCValidationTool />
        <PreRegistrationsTool />
        <FeedbackAnalyticsTool />
        <FeedbackManagementTool />
        <InvoiceManagementTool />
        <UserManagementTool />
      </div>
    </div>
  );
};

export default AdminToolsGrid;
