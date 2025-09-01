// import React, { ElementType, useEffect, useState } from "react";
// import { useAuth } from "react-oidc-context";
// import ROLE from "./Role";

// interface ProtectedRouteProps {
//   element: ElementType;
//   allowedRoles: string[];
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   element: Component,
//   allowedRoles,
//   ...rest
// }) => {
//   const auth = useAuth();
//   const [isRedirecting, setIsRedirecting] = useState(false);

//   const isAuthenticated = auth?.isAuthenticated;
//   const userRoles: string[] =
//     (auth?.user?.profile?.["cognito:groups"] as string[]) || [];
//   const providerStatus = auth?.user?.profile?.[
//     "custom:providerStatus"
//   ] as string;
//   const isProviderPending = providerStatus === "pending";

//   // Store in sessionStorage for reuse
//   useEffect(() => {
//     sessionStorage.setItem(
//       "IsProviderPending",
//       String(isProviderPending ?? false)
//     );
//   }, [isProviderPending]);

//   const isAuthorized =
//     allowedRoles.some((role) => userRoles.includes(role)) ||
//     (userRoles.includes(ROLE.CUSTOMER) && isProviderPending);

//   useEffect(() => {
//     if (!isAuthenticated || !isAuthorized) {
//       setIsRedirecting(true);
//       auth.signinRedirect();
//     }
//   }, [isAuthenticated, isAuthorized, auth]);

//   if (isRedirecting) {
//     return null;
//   }

//   return <Component {...rest} />;
// };

// export default ProtectedRoute;

import React, { ElementType, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: ElementType;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element: Component,
  ...rest
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      auth.signinRedirect();
      return;
    }

    const isAuthorized = true;

    if (!isAuthorized) {
      navigate("/no-permission");
    } else {
      setIsChecking(false);
    }
  }, [navigate, auth]);

  if (isChecking) return null;

  return <Component {...rest} />;
};

export default ProtectedRoute;
