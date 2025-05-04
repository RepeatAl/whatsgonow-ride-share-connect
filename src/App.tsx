import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TransportRequestForm from './pages/TransportRequestForm';
import TransportOfferForm from './pages/TransportOfferForm';
import DealConfirmationPage from './pages/DealConfirmationPage';
import DealDetailsPage from './pages/DealDetailsPage';
import TrackingPage from './pages/TrackingPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import Inbox from './pages/Inbox';
import Messages from './pages/Messages';
import { ChatRealtimeProvider } from './features/chat/context/ChatRealtimeContext';

function App() {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ChatRealtimeProvider>
            <Router>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Layout><Home /></Layout>} />
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                  <Route path="/transport-request" element={<Layout><TransportRequestForm /></Layout>} />
                  <Route path="/transport-offer" element={<Layout><TransportOfferForm /></Layout>} />
                  <Route path="/deal-confirmation/:orderId" element={<Layout><DealConfirmationPage /></Layout>} />
                  <Route path="/deal/:orderId" element={<Layout><DealDetailsPage navigateToOfferTransport={() => {}} /></Layout>} />
                  <Route path="/tracking/:orderId" element={<Layout><TrackingPage /></Layout>} />
                  <Route path="/payment-status/:orderId" element={<Layout><PaymentStatusPage /></Layout>} />
                  <Route path="/inbox/:orderId?" element={<Layout><Inbox /></Layout>} />
                  <Route path="/messages" element={<Layout><Messages /></Layout>} />
                </Routes>
              </Suspense>
            </Router>
          </ChatRealtimeProvider>
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
