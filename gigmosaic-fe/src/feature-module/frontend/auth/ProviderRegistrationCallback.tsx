import { useCallback, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/common/loading/LoadingSprinner';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../../../Role';

interface CreateUserToBackendParams {
  id_token: string;
  role: string | null;
}

interface TokenResponse {
  data: {
    id_token: string;
  };
}
const clientId = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_APP_COGNITO_DOMAIN;
const signUpRedirectUri = import.meta.env.VITE_APP_2_SIGN_UP_REDIRECT_URI;
const backendUrl = import.meta.env.VITE_APP_BACKEND_PORT;

const ProviderRegistrationCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const createUserToBackend = useCallback(
    async ({ id_token, role }: CreateUserToBackendParams): Promise<boolean> => {
      try {
        const response = await axios.post(
          `${backendUrl}/user/api/v1/user`,
          // `http://localhost:3010/api/v1/user`,
          { groupRole: role, provider_status: 'pending' },
          { headers: { Authorization: `Bearer ${id_token}` } }
        );

        if (response.status === 201) {
          console.log('✅ User created in backend:', response.data);
          return true;
        } else {
          console.error('Unexpected response creating user:', response);
          return false;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error creating user in backend:', error.response.data);
        } else {
          console.error(
            'Error creating user in backend:',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
        return false;
      }
    },
    []
  );

  useEffect(() => {
    const fetchUser = async () => {
      console.log('Running...... Signup callback...');
      // setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log('Authorization code:', code);
      console.log('URL Params:', urlParams.toString());

      if (!code) {
        console.error('No authorization code found. Redirecting...');
        // setLoading(false);
        auth.signinRedirect();
        return;
      }

      if (!clientId || !domain || !signUpRedirectUri) {
        console.error('Missing environment variables!');
        // setLoading(false);
        // auth.signinRedirect();
        return;
      }

      try {
        // const tokenResponse = await getTokenFrom(code);
        const tokenResponse: TokenResponse = await axios.post(
          `https://${domain}/oauth2/token`,
          new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: clientId,
            redirect_uri: signUpRedirectUri,
            code,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        console.log('Token response:', tokenResponse);

        // if (!tokenResponse || !tokenResponse.data.id_token) {
        //   console.error('Failed to retrieve id_token.');
        //   // sessionStorage.setItem('didLogin', 'true');
        //   // auth.signinRedirect();
        //   setLoading(false);
        //   return;
        // }

        const { id_token } = tokenResponse.data;
        console.log('id_token:', id_token);

        console.log('Creating user in backend...');
        const success = await createUserToBackend({
          id_token,
          role: ROLE.CUSTOMER, // Set to PROVIDER for provider callback
        });

        if (success) {
          // sessionStorage.setItem('didLogin', 'true');
          auth.signinRedirect();
        }
      } catch (error) {
        console.error('Token exchange error:', error);
      } finally {
        // setLoading(false);
      }
    };

    fetchUser();
  }, [auth, navigate, createUserToBackend]);

  return <LoadingSpinner label="Please wait, processing regitration..." />;
};

export default ProviderRegistrationCallback;
