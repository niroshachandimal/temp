import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/loading/LoadingSprinner';
import { useAuth } from 'react-oidc-context';
import { useEffect, useState } from 'react';
import { ROLE } from '../../../Role';

const CallbackSignIn = () => {
  const [noRoleError, setNoRoleError] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  // const gigmosaicProviderSite = import.meta.env.VITE_GIG_PROVIDER_URL;
  const CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
  const DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
  const LOGOUT_REDIRECT_URI = import.meta.env.VITE_APP_LOGOUT_REDIRECT_URI;

  useEffect(() => {
    if (auth.isLoading) return;
    const didLogin = sessionStorage.getItem('didLogin');

    if (!didLogin) {
      console.log('User did not login, redirecting to home page...');
      navigate('/home', { replace: true });
      return;
    } else {
      sessionStorage.removeItem('didLogin');
    }
  }, [auth.isLoading, navigate]);

  if (auth.isLoading) {
    return <LoadingSpinner label="Loading..." />;
  }
  if (auth.error) return <div>Login Error: {auth.error.message}</div>;

  const navigateToHome = () => {
    window.location.href = `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      LOGOUT_REDIRECT_URI
    )}`;
    auth.removeUser();
    sessionStorage.removeItem('didLogin');
  };

  if (noRoleError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-3">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mt-2">
            Something went wrong!
          </h1>
          <p className="mt-4 text-gray-700 text-md">
            User role is missing. please contact support.
          </p>

          <button
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={navigateToHome}
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    console.log('Cblogin: ', true);
    // console.log('4343Authenticated: ', auth.user);
    // console.log('4332Access_token: ', auth.user?.access_token);
    // console.log('323Id Token: ', auth.user?.id_token);
    // console.log('323Role: ', auth.user?.profile['cognito:groups']);
    // console.log('323Email: ', auth.user?.profile.email);

    const role = auth.user?.profile['cognito:groups'] as string[] | undefined;
    localStorage.setItem('rl', role?.[0] || 'none');
    console.log('Role: ', role);

    if (role && role.includes(ROLE.PROVIDER)) {
      console.log('provider role found');
      navigate('/home');
    } else if (role?.includes(ROLE.CUSTOMER)) {
      console.log('customer" role found');
      navigate('/home');
    } else {
      setNoRoleError(true);
      setTimeout(() => {
        setNoRoleError(false);
        window.location.href = `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
          LOGOUT_REDIRECT_URI
        )}`;
        auth.removeUser();
        sessionStorage.removeItem('didLogin');
        console.error('No role found, redirecting to home page...');
      }, 5000);
    }
  }

  return <div></div>;
};

export default CallbackSignIn;
