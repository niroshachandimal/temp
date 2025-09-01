import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import store from './core/data/redux/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.ts';
import { AuthProvider } from 'react-oidc-context';

const redirect_uri = import.meta.env.VITE_APP_SIGN_IN_REDIRECT_URI;

const cognitoAuthConfig = {
  authority:
    'https://cognito-idp.ca-central-1.amazonaws.com/ca-central-1_hdjkyTt0Q',
  client_id: '7pe0bnbohfvtlf8abfadd92mup',
  redirect_uri: redirect_uri,
  response_type: 'code',
  scope: 'aws.cognito.signin.user.admin email openid profile',
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            {/* <ToastProviders> */}
            <div className="lg:max-w-[1980px] mx-auto items-center">
              <AuthProvider {...cognitoAuthConfig}>
                <App />
              </AuthProvider>
            </div>
            {/* </ToastProviders> */}
          </I18nextProvider>
        </QueryClientProvider>
      </Provider>
    </HeroUIProvider>
  </StrictMode>
);
