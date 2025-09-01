import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { PrimeReactProvider } from "primereact/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import ToastProviders from "./components/ui/ToastProviders.tsx";
import "./i18n";
import { AuthProvider } from "react-oidc-context";

const redirect_uri = import.meta.env.VITE_APP_SIGN_IN_REDIRECT_URI;

const cognitoAuthConfig = {
  authority: `https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_hdjkyTt0Q`,
  client_id: "7pe0bnbohfvtlf8abfadd92mup",
  redirect_uri: redirect_uri,
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <PrimeReactProvider>
          <ToastProviders>
            <AuthProvider {...cognitoAuthConfig}>
              <App />
            </AuthProvider>
          </ToastProviders>
        </PrimeReactProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>
);
