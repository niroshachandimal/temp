import React, { ElementType } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: ElementType;
  allowedRoles: string[];
  userRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
  allowedRoles,
  userRole,
  ...rest
}) => {
  console.log("Protected Route Role: ", userRole);
  console.log("Allowed Roles: ", allowedRoles);

  const isAuthorized =
    allowedRoles.includes(userRole) || allowedRoles.includes("*");

  console.log("isAuthorized: ", isAuthorized);

  return isAuthorized ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
