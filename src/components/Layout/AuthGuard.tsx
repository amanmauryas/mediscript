import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !currentUser) {
        navigate('/login', { replace: true });
      } else if (!requireAuth && currentUser) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, loading, navigate, requireAuth]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // For auth routes, only render children if user is authenticated
  // For non-auth routes, only render children if user is not authenticated
  if ((requireAuth && currentUser) || (!requireAuth && !currentUser)) {
    return <>{children}</>;
  }

  // Return loading spinner while navigation is happening
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default AuthGuard;