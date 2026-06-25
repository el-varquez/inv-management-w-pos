import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RoleRouteProps {
  allow: (role: string) => boolean;
  redirectTo: string;
}

export const RoleRoute = ({ allow, redirectTo }: RoleRouteProps) => {
  const role = useAuthStore((s) => s.user?.role) ?? '';
  return allow(role) ? <Outlet /> : <Navigate to={redirectTo} replace />;
};
