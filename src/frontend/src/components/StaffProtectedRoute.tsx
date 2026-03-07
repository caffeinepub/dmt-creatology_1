import { useStaffAuth } from "@/hooks/useStaffAuth";
import { useEffect } from "react";

interface StaffProtectedRouteProps {
  children: React.ReactNode;
}

export default function StaffProtectedRoute({
  children,
}: StaffProtectedRouteProps) {
  const { isAuthenticated, session } = useStaffAuth();

  useEffect(() => {
    // Redirect if not authenticated or session is malformed
    if (!isAuthenticated || !session?.role) {
      window.location.href = "/staff/login";
    }
  }, [isAuthenticated, session]);

  if (!isAuthenticated || !session?.role) {
    return null;
  }

  return <>{children}</>;
}
