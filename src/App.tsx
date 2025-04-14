import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from "./pages/Index";
import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import Faq from "./pages/Faq";
import Legal from "./pages/Legal";
import Profile from "./pages/Profile";
import DataDeletion from "./pages/DataDeletion";
import ShadcnDemoPage from "./pages/ShadcnDemo";
import EmailTest from "./pages/EmailTest";
import NotFound from "./pages/NotFound";
import Feedback from "./pages/Feedback";

function App() {
  const location = useLocation();

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    handleRouteChange();

    return () => {
      handleRouteChange();
    };
  }, [location]);

  return (
    <>
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
        <Route path="/feedback" element={<Feedback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
