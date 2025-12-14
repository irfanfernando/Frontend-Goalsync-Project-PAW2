import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("AuthToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
