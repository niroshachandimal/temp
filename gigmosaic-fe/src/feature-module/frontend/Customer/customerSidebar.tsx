import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem } from '@heroui/react';
import { useAuth } from 'react-oidc-context';
import {
  FaTh,
  FaMobileAlt,
  FaHeart,
  FaWallet,
  FaStar,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaBell,
  FaPlug,
  FaTrash,
  FaUserCircle,
} from 'react-icons/fa';
import customer from '../../../assets/Img/Leonardo_Kino_XL_Professional_Man_2.jpg';
import { JSX } from 'react/jsx-runtime';
import { apiClient } from '../../../api';

const CustomerSidebar = () => {
  // Set default key (which accordion item is selected by default)
  const [defaultKey] = useState('settings');
  const [userName, setUserName] = useState('User');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  // Get user ID from auth context
  const getUserId = useCallback(() => {
    if (auth.user) {
      return auth.user.profile.preferred_username ||
             auth.user.profile.sub ||
             auth.user.profile.email;
    }
    return null;
  }, [auth.user]);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    const uid = getUserId();
    if (!uid || !auth.isAuthenticated) {
      console.log('Cannot fetch user data: No user ID or not authenticated');
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching user data for sidebar, ID: ${uid}`);

      const response = await apiClient.get(`api/v1/user/${uid}`);

      if (response.status === 200 && response.data) {
        console.log('User data fetched for sidebar:', response.data);

        const userData = response.data.user;
        if (userData) {
          // Get profile image URL
          const imageUrl = userData.profileImage || userData.avatar || userData.profile_image || '';
          if (imageUrl) {
            console.log('Found profile image URL:', imageUrl);
            setProfileImage(imageUrl);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data for sidebar:', error);
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, getUserId]);

  // Get user name from auth context
  useEffect(() => {
    if (!auth.isLoading) {
      if (auth.isAuthenticated && auth.user) {
        console.log('User profile in sidebar:', auth.user.profile);

        // Try to get user's name from different possible profile fields
        const name = auth.user.profile.name ||
                    auth.user.profile.given_name ||
                    auth.user.profile.preferred_username ||
                    auth.user.profile.email?.split('@')[0] ||
                    'User';

        console.log('Using name for sidebar:', name);
        setUserName(name);

        // Fetch user data including profile image
        fetchUserData();
      } else {
        console.log('User not authenticated in sidebar');
        setUserName('Guest User');
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, fetchUserData]);

  return (
    <div className="bg-white shadow-lg rounded-lg  h-[1000px] p-4">
      {/* User Profile Section */}
      <div className="flex flex-col items-center bg-white rounded-lg p-4  border border-gray-300 shadow-md">
        <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full overflow-hidden">
          {profileImage ? (
            <img
              className="w-full h-full object-cover"
              src={profileImage}
              alt="User Avatar"
            />
          ) : loading ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 animate-pulse">
              <FaUserCircle className="text-gray-400 text-6xl" />
            </div>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={customer}
              alt="User Avatar"
            />
          )}
        </div>
        {loading ? (
          <div className="mt-3 h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <h6 className="text-lg font-semibold mt-3">{userName}</h6>
        )}
        <p className="text-sm text-gray-500">Member Since Sep 2021</p>
      </div>

      {/* Sidebar Menu */}
      <ul className="mt-4 space-y-2 w-[256px] h-[352px]">
        <SidebarItem
          link="/customer/customer-dashboard"
          icon={<FaTh />}
          text="Dashboard"
        />
        <SidebarItem
          link="/customer/customer-booking"
          icon={<FaMobileAlt />}
          text="Bookings"
        />
        <SidebarItem
          link="/customer/customer-favourite"
          icon={<FaHeart />}
          text="Favorites"
        />
        <SidebarItem
          link="/customer/customer-wallet"
          icon={<FaWallet />}
          text="Wallet"
        />
        <SidebarItem
          link="/customer/customer-reviews"
          icon={<FaStar />}
          text="Reviews"
        />
        <SidebarItem
          link="/customer/customer-chat"
          icon={<FaComments />}
          text="Chat"
        />

        <Accordion defaultExpandedKeys={[defaultKey]}>
          <AccordionItem
            key="settings"
            aria-label="Settings"
            title={
              <>
                <FaCog className="inline mr-2" /> Settings
              </>
            }
          >
            <ul className="ml-4 space-y-2">
              <SidebarItem
                link="/customer/settings/customer-profile"
                text="Account Settings"
                icon={<FaCog />}
              />
              <SidebarItem
                link="/customer/settings/customer-security"
                text="Security Settings"
                icon={<FaShieldAlt />}
              />
              <SidebarItem
                link="/customer/settings/notification"
                text="Notifications"
                icon={<FaBell />}
              />
              <SidebarItem
                link="/customers/settings/connected-apps"
                text="Connected Apps"
                icon={<FaPlug />}
              />
              <SidebarItem
                link="/customers/customer-favourite"
                text="Delete Account"
                modalTarget="#del-account"
                icon={<FaTrash />}
              />
            </ul>
          </AccordionItem>
        </Accordion>

        <SidebarItem
          link="/authentication/login"
          icon={<FaSignOutAlt />}
          text="Logout"
        />
      </ul>
    </div>
  );
};

// Reusable Sidebar Item Component
interface SidebarItemProps {
  link: string;
  icon?: JSX.Element;
  text: string;
  active?: boolean;
  modalTarget?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  link,
  icon,
  text,
  active = false,
  modalTarget,
}) => {
  return (
    <li>
      <Link
        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
          active
            ? 'text-primary font-semibold bg-blue-100'
            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
        }`}
        to={link}
        {...(modalTarget
          ? { 'data-bs-toggle': 'modal', 'data-bs-target': modalTarget }
          : {})}
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span>{text}</span>
      </Link>
    </li>
  );
};

export default CustomerSidebar;
