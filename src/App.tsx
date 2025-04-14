import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CommunityManager from "./pages/CommunityManager";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Deal from "./pages/Deal";
import DeliveryConfirmation from "./pages/DeliveryConfirmation";
import NotFound from "./pages/NotFound";

// Import the RLSTest page
import RLSTest from "./pages/RLSTest";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/community-manager" element={<CommunityManager />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/deal/:orderId" element={<Deal />} />
          <Route path="/delivery/:token" element={<DeliveryConfirmation />} />
          <Route path="/rls-test" element={<RLSTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
