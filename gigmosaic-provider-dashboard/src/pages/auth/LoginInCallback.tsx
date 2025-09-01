import { useAuth } from "react-oidc-context";
import Loading from "../../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ROLE from "../../Role";
import axios from "axios";
import CustomButton from "../../components/ui/CustomButton";

const CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
const DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
const LOGOUT_REDIRECT_URI = import.meta.env.VITE_APP_LOGOUT_2_REDIRECT_URI;
const BACKEND_URL = import.meta.env.VITE_BACKEND_PORT;

const LoginInCallback = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  // const [navigateToVerifyAccount, setNavigateToVerifyAccount] = useState(false);
  // const [userCreateError, setUserCreateError] = useState(false);
  const [loading, setLoading] = useState(false);

  const buildLogoutUrl = () => {
    return `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      LOGOUT_REDIRECT_URI
    )}`;
  };

  const handleProviderregistration = async () => {
    try {
      console.log("ID TOKEN: ", auth.user?.id_token);
      // Register user as pending provider
      const response = await axios.post(
        `${BACKEND_URL}/user/api/v1/user`,
        // `http://localhost:3010/api/v1/user`,
        {
          groupRole: ROLE.CUSTOMER,
          provider_status: "pending",
        },
        {
          headers: { Authorization: `Bearer ${auth.user?.id_token}` },
        }
      );

      if (response.status === 201) {
        console.log("✅ User created in backend:", response.data);
        auth.signinRedirect();
        // setNavigateToVerifyAccount(true);
      } else {
        console.error("Unexpected response creating user:", response);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Axios error response:", error.response.data);
      } else {
        console.error(
          "Unexpected error:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
      return false;
    }
  };

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const role = auth.user?.profile["cognito:groups"] as string[] | undefined;
    const providerStatus = auth.user?.profile[
      "custom:providerStatus"
    ] as string;
    const isPending = providerStatus === "pending";
    localStorage.setItem("rl", role?.[0] || "none");

    if (role?.includes(ROLE.PROVIDER)) {
      navigate("/dashboard", { replace: true });
    } else if (isPending && role?.includes(ROLE.CUSTOMER)) {
      navigate("/dashboard", { replace: true });
      // setNavigateToVerifyAccount(true);
    } else if (role?.includes(ROLE.CUSTOMER)) {
      window.location.href = buildLogoutUrl();
    } else {
      handleProviderregistration();
    }
  }, [auth.isAuthenticated, auth.user, navigate, buildLogoutUrl]);

  if (auth.error) return <div>Error: {auth.error.message}</div>;

  // const navigateToHome = () => {
  //   setLoading(true);
  //   window.location.href = buildLogoutUrl();
  //   sessionStorage.removeItem("didLogin");
  // };

  // if (navigateToVerifyAccount) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50 p-3">
  //       <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
  //         <h1 className="text-2xl font-bold text-sky-500 mt-2">
  //           Verify Your Provider Account !
  //         </h1>
  //         <p className="mt-4 text-gray-700 text-md">
  //           Your account needs to be verified before you can proceed.
  //         </p>
  //         <div className="mt-4 text-gray-600 text-sm text-left">
  //           <p className="mb-1 font-semibold">To verify your account:</p>
  //           <ol className="list-decimal list-inside space-y-1">
  //             <li>
  //               Go to <strong>www.gigmosaic.ca</strong>
  //             </li>
  //             <li>
  //               Click on <strong>Login</strong> and sign in with your provider
  //               account
  //             </li>
  //             <li>
  //               Complete the provider verification steps shown on your dashboard
  //             </li>
  //           </ol>
  //         </div>
  //         <CustomButton
  //           isLoading={loading}
  //           label="  Go to Verify Account"
  //           color="primary"
  //           size="md"
  //           className="mt-6 "
  //           onPress={navigateToHome}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div>
      <Loading label="Verifying access..." />
    </div>
  );
};

export default LoginInCallback;
