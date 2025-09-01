import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes.tsx";
import { useAuth } from "react-oidc-context";
import ROLE from "./Role.tsx";
import Loading from "./components/ui/Loading.tsx";
// import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
// import LoginInCallback from "./pages/auth/LoginInCallback.tsx";
// import LogoutRedirect from "./pages/auth/LogoutRedirect.tsx";
// import Error404Page from "./pages/Error404Page.tsx";
import "quill/dist/quill.snow.css";

const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const Error404Page = React.lazy(() => import("./pages/Error404Page.tsx"));
const UnauthorizedPage = React.lazy(
  () => import("./pages/UnauthorizedPage.tsx")
);
const LoginInCallback = React.lazy(
  () => import("./pages/auth/LoginInCallback.tsx")
);
const LogoutRedirect = React.lazy(
  () => import("./pages/auth/LogoutRedirect.tsx")
);

const App = () => {
  const auth = useAuth();

  const isAuthenticated = auth?.isAuthenticated || false;

  useEffect(() => {
    if (auth?.isAuthenticated) {
      const roles = auth?.user?.profile?.["cognito:groups"] as string[];
      if (roles) {
        const provider = roles?.includes(ROLE.PROVIDER);
        const customer = roles?.includes(ROLE.CUSTOMER);

        sessionStorage.setItem("hasP-rl", String(provider || "false"));
        sessionStorage.setItem("hasC-rl", String(customer || "false"));
        sessionStorage.setItem("isAuth", "true");
      }
    } else {
      sessionStorage.setItem("isAuth", "false");
    }
  }, [auth?.isAuthenticated, auth?.user?.profile]);

  if (auth.isLoading) {
    return <Loading label="Loading..." />;
  }

  if (!isAuthenticated) {
    auth.signinRedirect();
    return null;
  }

  localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));

  return (
    <BrowserRouter>
      <Suspense fallback={<Loading label="Loading..." />}>
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            {/* {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))} */}
            {routes.map(({ path, element }, index) => (
              <Route
                key={index}
                path={path}
                element={
                  <Suspense fallback={<Loading label="Loading..." />}>
                    {element}
                  </Suspense>
                }
              />
            ))}
          </Route>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/callback-signin" element={<LoginInCallback />} />
          <Route path="/logout/redirect" element={<LogoutRedirect />} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;