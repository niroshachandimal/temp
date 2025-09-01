import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import CustomerLayout from './layout/CustomerLayout';
import Callback from './feature-module/frontend/auth/Callback';
import CallbackSignIn from './feature-module/frontend/auth/CallbackSignIn';
import ProtectedRoute from './feature-module/frontend/auth/ProtectedRoute';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { setToken } from './tokenprovider';
import ProviderRegistrationCallback from './feature-module/frontend/auth/ProviderRegistrationCallback';
import ToastProvider from './service/ToastProvider';

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;
    if (auth?.user?.id_token) {
      console.log('Running setToken function...');
      // console.log('User ID Token: ', auth.user.id_token);
      setToken(auth.user.id_token);
    }
  }, [auth, auth.user, auth.isLoading]);

  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        {/* Redirect root path to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Main layout */}
        <Route path="/*" element={<DefaultLayout />} />
        {/* Customer layout */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerLayout />
            </ProtectedRoute>
          }
        />

        {/* Handle invalid paths */}
        <Route path="*" element={<Navigate to="/home" replace />} />

        <Route path="/callback" element={<Callback />} />
        <Route path="/callback-signin" element={<CallbackSignIn />} />
        <Route
          path="/provider-registration-callback"
          element={<ProviderRegistrationCallback />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
