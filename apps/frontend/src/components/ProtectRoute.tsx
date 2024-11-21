import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '@/services/AuthApi';

interface ProtectedRouteProps {
  element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default ProtectedRoute;
