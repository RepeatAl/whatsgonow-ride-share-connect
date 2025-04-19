
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const OfferTransport = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return <LoadingSpinner />;
};

export default OfferTransport;
