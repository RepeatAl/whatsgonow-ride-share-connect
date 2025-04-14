
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from "./pages/Index";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import Faq from "./pages/FAQ";
import Legal from "./pages/Legal";
import Profile from "./pages/Profile";
import DataDeletion from "./pages/DataDeletion";
import ShadcnDemoPage from "./pages/ShadcnDemo";
import EmailTest from "./pages/EmailTest";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Function to handle route changes
    const handleRouteChange = () => {
      // Scroll to the top of the page on route change
      window.scrollTo(0, 0);
    };

    // Call the function on initial render
    handleRouteChange();

    // Listen for changes to the location
    return () => {
      handleRouteChange();
    };
  }, [location]);

  return (
    <>
      {/* Routes configuration */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/shadcn-demo" element={<ShadcnDemoPage />} />
        <Route path="/email-test" element={<EmailTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
