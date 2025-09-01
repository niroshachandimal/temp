import { useAuth } from "react-oidc-context";

const UnauthorizedPage = () => {
  const auth = useAuth();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] ">
      <h1 className="text-2xl font-bold text-red-500 text-center mt-10">
        Unauthorized
      </h1>
      <p className="text-center mt-4">
        You do not have permission to access this site.
      </p>
      <p className="text-center mt-4">
        Please contact your administrator if you believe this is an error.
      </p>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => auth.signinRedirect()}
      >
        Sign In Again
      </button>
    </div>
  );
};

export default UnauthorizedPage;
