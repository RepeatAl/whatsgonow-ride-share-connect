
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const OfferTransport = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (profile?.role === 'driver') {
        navigate('/dashboard/driver', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  return <LoadingSpinner />;
};

export default OfferTransport;
