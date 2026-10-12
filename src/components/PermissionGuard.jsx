import { useAuth } from '../context/AuthContext';
import AccessDenied from './AccessDenied';

const PermissionGuard = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  // If no allowedRoles are specified, allow access (or you could block by default)
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has any of the allowed roles
  const userRole = user?.role || user?.roles?.[0]?.name; // adjust based on your user object
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return children;
};

export default PermissionGuard;