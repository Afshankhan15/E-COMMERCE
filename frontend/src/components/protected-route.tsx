import React, { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminRoute?: boolean;
  isAdmin?: boolean; // whether LOGGED-IN USER IS ADMIN OR NOT
  redirect?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  children,
  adminRoute,
  isAdmin,
  redirect = "/",
}) => {
  // if user is un-authenticated redirect user to '/'
  if (!isAuthenticated) return <Navigate to={redirect} />;
  
  
  if (adminRoute && !isAdmin) return <Navigate to={redirect} />;

  return children ? children : <Outlet />; // if childer then childer else outlet-> outlet means if protected routes has child routes simple can see in app.tsx like shiiping ..
};

export default ProtectedRoute;
