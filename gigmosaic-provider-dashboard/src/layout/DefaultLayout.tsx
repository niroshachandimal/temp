import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

import AppContent from "../components/AppContent";
import Sidebar from "../components/Sidebar";
import { setToken } from "../api/axios/tokenProvider";
import FAQChatbot from "../components/FAQChatbot";

const DefaultLayout = () => {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth?.user?.id_token) {
      console.log("Running setToken function...");
      setToken(auth.user.id_token);
    }
  }, [auth, auth.user, auth.isLoading]);

  return (
    <div className="flex flex-row min-h-screen bg-[#F8F8F8] dark:bg-darkModeBackground text-gray-800 dark:text-white ">
      {/* // <div className="flex flex-row min-h-screen bg-[#F8F8F8] dark:bg-gray-900 text-gray-800 dark:text-white "> */}
      <Sidebar />
      <AppContent />
      <FAQChatbot />
    </div>
  );
};

export default DefaultLayout;
