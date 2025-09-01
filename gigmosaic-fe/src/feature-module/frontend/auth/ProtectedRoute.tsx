import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import LoadingSpinner from '../../components/common/loading/LoadingSprinner';

const ProtectedRoute = ({
  children,
}: {
  children: React.ReactNode;
  allowedRole: string;
}) => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div>
        <LoadingSpinner label="Loading.." />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
