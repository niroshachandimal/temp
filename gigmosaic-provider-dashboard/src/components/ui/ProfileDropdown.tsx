import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import Loading from "./Loading";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useFetchUserDetailsById } from "../../hooks/queries/useFetchData";

const ProfileDropdown = () => {
  const [isLoading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
  const DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
  const LOGOUT_REDIRECT_URI = import.meta.env.VITE_APP_LOGOUT_REDIRECT_URI;

  console.log("ProfileDropdown: ", auth.user?.profile?.preferred_username);
  const { data, isFetching } = useFetchUserDetailsById(
    auth.user?.profile?.preferred_username || ""
  );

  const handleLogout = () => {
    setLoading(true);
    try {
      sessionStorage.setItem("didLogout", "true");

      setTimeout(() => {
        window.location.href = `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
          LOGOUT_REDIRECT_URI
        )}`;
        // auth.removeUser();
      }, 1000);
    } catch (error) {
      sessionStorage.removeItem("didLogout");
      console.log("Error Logout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Loading label=" Logging out..." />;
  }

  return (
    <>
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: data?.user?.profilePicture || "",
            }}
            className="transition-transform"
            description={
              isFetching ? "Loading..." : data?.user?.email || "Error"
            }
            name={isFetching ? "Loading..." : data?.user?.name || "Error"}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{data?.user?.email || "No email"}</p>
          </DropdownItem>
          <DropdownItem
            key="settings"
            onPress={() => navigate("user/profile/general-information")}
          >
            My Profile
          </DropdownItem>
          {/* <DropdownItem key="team_settings">Team Settings</DropdownItem> */}
          {/* <DropdownItem key="analytics">Analytics</DropdownItem> */}
          {/* <DropdownItem key="system">System</DropdownItem> */}
          <DropdownItem
            key="configurations"
            onPress={() => navigate("user/profile/security")}
          >
            Change Password
          </DropdownItem>
          {/* <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem> */}
          <DropdownItem
            onPress={() => handleLogout()}
            key="logout"
            color="danger"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default ProfileDropdown;
