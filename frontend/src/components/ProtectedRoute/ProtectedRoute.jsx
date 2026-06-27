import { Navigate } from "react-router-dom";
import { hasRole, isAuthenticated } from "../../utils/auth";

function ProtectedRoute({ children, roles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;

