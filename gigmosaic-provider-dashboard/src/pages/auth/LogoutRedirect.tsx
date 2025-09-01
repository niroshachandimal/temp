import Loading from "../../components/ui/Loading";
import { useAuth } from "react-oidc-context";

const LogoutRedirect = () => {
  const auth = useAuth();

  if (auth.isLoading) return <Loading label="Redirecting to login page..." />;
  auth.signinRedirect();
  // auth.removeUser();

  return null;
};

export default LogoutRedirect;
