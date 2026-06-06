import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, configured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="auth-loading">
        <p>Cognito is not configured. Set VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_CLIENT_ID, and VITE_COGNITO_REGION in your .env file.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
