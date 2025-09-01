// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import LoadingSpinner from '../../components/common/loading/LoadingSprinner';

// interface CreateUserToBackendParams {
//   id_token: string;
//   role: string | null;
// }

// const Callback = () => {
//   const [loading, setLoading] = useState(false);

//   const clientId = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
//   const domain = import.meta.env.VITE_APP_COGNITO_DOMAIN;
//   const signUpRedirectUri = import.meta.env.VITE_APP_SIGN_UP_REDIRECT_URI;
//   const signInRedirectUri = import.meta.env.VITE_APP_SIGN_IN_REDIRECT_URI;
//   const backendUrl = import.meta.env.VITE_APP_BACKEND_PORT;
//   const clientSecret = import.meta.env.VITE_APP_COGNITO_CLIENT_SECRET;

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       const urlParams = new URLSearchParams(window.location.search);
//       const code = urlParams.get('code');
//       console.log('Running...... Signup callback...');
//       // console.log('Code: ', code);
//       const role = urlParams.get('state'); // "provider" or "customer"
//       // console.log('Role: ', role);

//       if (!code) {
//         window.location.href = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
//           signUpRedirectUri
//         )}`;
//         setLoading(false);
//         return;
//       }

//       if (
//         clientId === '' ||
//         domain === '' ||
//         clientSecret === '' ||
//         signInRedirectUri === ''
//       ) {
//         console.log(
//           'Missing required parameters---------------------------------------'
//         );
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log('clientId: ', clientId);
//         console.log('domain: ', domain);
//         console.log('redirectUri: ', signUpRedirectUri);
//         console.log('signInRedirectUri: ', signInRedirectUri);
//         console.log('Code: ', code);
//         const tokenResponse = await axios.post(
//           `https://${domain}/oauth2/token`,
//           new URLSearchParams({
//             grant_type: 'authorization_code',
//             client_id: clientId,
//             redirect_uri: signInRedirectUri,
//             code,
//           }),
//           {
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//               // Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
//             },
//           }
//         );

//         const { id_token } = tokenResponse.data;
//         // console.log('Tokenresponse: ', tokenResponse);
//         console.log('id_token: ', id_token);
//         // localStorage.setItem('id_token', id_token);
//         // localStorage.setItem('role', role || '');
//         await createUserToBackend({ id_token, role });
//       } catch (error) {
//         setLoading(false);
//         console.error('Error fetching tokens002:', error);
//         // window.location.href = `https://${domain}/login?client_id=${clientId}&redirect_uri=${signInRedirectUri}&response_type=code&scope=email+openid+profile`;
//       }
//     };

//     fetchUser();
//   }, [clientId, clientSecret, domain, signInRedirectUri, signUpRedirectUri]);

//   const createUserToBackend = async ({
//     id_token,
//     role,
//   }: CreateUserToBackendParams) => {
//     // console.log('id_token002: ', id_token);
//     // console.log('role: ', role);
//     try {
//       const data = await axios.post(
//         `${backendUrl}/user/api/v1/user`,

//         {
//           groupRole: role,
//         },
//         {
//           headers: { Authorization: `Bearer ${id_token}` },
//         }
//       );

//       if (data.status === 201) {
//         console.log('User created:', data.data);
// window.location.href = `https://${domain}/login?client_id=${clientId}&redirect_uri=${signInRedirectUri}&response_type=code&scope=email+openid+profile`;
//       }
//     } catch (error) {
//       window.location.href = `https://${domain}/login?client_id=${clientId}&redirect_uri=${signInRedirectUri}&response_type=code&scope=email+openid+profile`;
//       console.log('Error signup user: ', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {loading && <LoadingSpinner label="Processing authentication..." />}
//     </div>
//   );
// };

// export default Callback;

import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/common/loading/LoadingSprinner';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { ROLE } from '../../../Role';

interface CreateUserToBackendParams {
  id_token: string;
  role: string | null;
}

const Callback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const clientId = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
  const domain = import.meta.env.VITE_APP_COGNITO_DOMAIN;
  const signUpRedirectUri = import.meta.env.VITE_APP_SIGN_UP_REDIRECT_URI;
  // const signIpRedirectUri = import.meta.env.VITE_APP_SIGN_IN_REDIRECT_URI;
  const backendUrl = import.meta.env.VITE_APP_BACKEND_PORT;

  // const redirectToCognito = () => {
  //   window.location.href = `https://${domain}/login?client_id=${clientId}&redirect_uri=${signIpRedirectUri}&response_type=code&scope=email+openid+profile`;
  // };

  useEffect(() => {
    if (auth.isLoading) return;
    const didRegistration = sessionStorage.getItem('didRegistration');
    console.log('didRegistration: ', didRegistration);

    if (!didRegistration) {
      console.log('User did not login, redirecting to home page...');
      navigate('/home', { replace: true });
      return;
    } else {
      console.log('User did login, removing session storage...');
      sessionStorage.removeItem('didRegistration');
    }

    const fetchUser = async () => {
      console.log('Running...... Signup callback...');
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        console.warn('No authorization code found. Redirecting...');
        // redirectToCognito();
        return;
      }

      if (!clientId || !domain || !signUpRedirectUri) {
        console.error('Missing environment variables!');
        setLoading(false);
        return;
      }

      try {
        const tokenResponse = await axios.post(
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

        const { id_token } = tokenResponse.data;
        console.log('id_token:', id_token);

        if (!id_token) {
          console.error('No id_token returned from Cognito.');
          // redirectToCognito();
          sessionStorage.setItem('didLogin', 'true');
          auth.signinRedirect();
          return;
        }

        // Call backend to create user
        await createUserToBackend({ id_token, role: ROLE.CUSTOMER });
        sessionStorage.setItem('didLogin', 'true');
        // auth.signinRedirect();

        // Redirect to sign-in (Hosted UI login screen)
        // redirectToCognito();
      } catch (error) {
        console.error('Token exchange error:', error);
        // redirectToCognito();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [auth, navigate, clientId, domain, signUpRedirectUri, backendUrl]);

  const createUserToBackend = async ({
    id_token,
    role,
  }: CreateUserToBackendParams) => {
    try {
      const response = await axios.post(
        `${backendUrl}/user/api/v1/user`,
        // `http://localhost:3010/api/v1/user`,
        { groupRole: role },
        { headers: { Authorization: `Bearer ${id_token}` } }
      );

      if (response.status === 201) {
        console.log('✅ User created in backend:', response.data);
        // redirectToCognito();
        auth.signinRedirect();
      } else {
        console.error('Unexpected response creating user:', response);
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
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner label="Processing authentication..." />}
    </div>
  );
};

export default Callback;
