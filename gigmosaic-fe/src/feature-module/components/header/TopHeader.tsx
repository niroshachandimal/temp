import { Divider } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiBell } from 'react-icons/bi';
import { BsCurrencyDollar } from 'react-icons/bs';
import { FaRegUser } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { HiOutlineMailOpen } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../common/ui/dropdown-menu';
import Language from '../common/Language';
import { TbLogout2 } from 'react-icons/tb';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { ROLE } from '../../../Role';
import { LuLayoutDashboard } from 'react-icons/lu';
import LoadingSpinner from '../common/loading/LoadingSprinner';
import { GrUserSettings } from 'react-icons/gr';

const TopHeader = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [providerRole, setProviderRole] = useState(false);
  const [customerRole, setCustomerRole] = useState(false);
  const [isProviderPending, setIsProviderPending] = useState(false);

  const CLIENT_ID = import.meta.env.VITE_APP_COGNITO_CLIENT_ID;
  const DOMAIN = import.meta.env.VITE_APP_COGNITO_DOMAIN;
  const SIGN_UP_REDIRECT_URI_2 = import.meta.env
    .VITE_APP_2_SIGN_UP_REDIRECT_URI;

  const SIGN_UP_REDIRECT_URI = import.meta.env.VITE_APP_SIGN_UP_REDIRECT_URI;
  const LOGOUT_REDIRECT_URI = import.meta.env.VITE_APP_LOGOUT_REDIRECT_URI;

  const [currency, setCurrency] = useState('USD');
  const { t } = useTranslation();
  const currencies = ['USD', 'EUR', 'GBP', 'JPY'];
  interface BuildSignUpUrlParams {
    role: string;
  }

  useEffect(() => {
    if (auth.user) {
      const roles = auth.user?.profile['cognito:groups'] as
        | string[]
        | undefined;
      const hasProviderRole = roles?.includes(ROLE.PROVIDER);
      const hasCustomerRole = roles?.includes(ROLE.CUSTOMER);
      const providerStatus = auth.user?.profile[
        'custom:providerStatus'
      ] as string;
      const isPending = providerStatus === 'pending';

      sessionStorage.setItem(
        'hasProviderRole',
        String(hasProviderRole || 'false')
      );
      sessionStorage.setItem(
        'hasCustomerRole',
        String(hasCustomerRole || 'false')
      );
      sessionStorage.setItem('IsProviderPending', String(isPending || 'false'));

      setProviderRole(hasProviderRole || false);
      setCustomerRole(hasCustomerRole || false);
      setIsProviderPending(isPending || false);
      console.log('PR: ', hasProviderRole);
      console.log('CR: ', hasCustomerRole);
      console.log('isPending: ', isPending);
    }
  }, [auth.user]);

  const handleLogout = () => {
    sessionStorage.removeItem('didLogin');
    sessionStorage.removeItem('hasProviderRole');
    sessionStorage.removeItem('hasCustomerRole');
    sessionStorage.removeItem('IsProviderPending');
    window.location.href = `https://${DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      LOGOUT_REDIRECT_URI
    )}`;
    auth.removeUser();
  };

  const login = async () => {
    sessionStorage.setItem('didLogin', 'true');
    await auth.signinRedirect();
  };

  const handleProviderRegistration = async () => {
    if (providerRole && customerRole) {
      console.log('Role is provider');
      navigate('/home', { replace: true });
    } else if (customerRole && !providerRole) {
      navigate('/registration-provider');
      console.log('Role is customer');
    } else if (!providerRole && !customerRole) {
      console.log('No role or unknown role');
      window.location.href = buildSignUpUrlForProviderRegi(ROLE.CUSTOMER);
    }
  };

  const buildSignUpUrl = (role: BuildSignUpUrlParams['role']): string => {
    return `https://${DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${SIGN_UP_REDIRECT_URI}&state=${role}`;
  };

  const buildSignUpUrlForProviderRegi = (
    role: BuildSignUpUrlParams['role']
  ): string => {
    return `https://${DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${SIGN_UP_REDIRECT_URI_2}&state=${role}`;
  };

  const userRegistration = () => {
    sessionStorage.setItem('didRegistration', 'true');
    window.location.href = buildSignUpUrl(ROLE.CUSTOMER);
  };

  if (auth.isLoading) {
    return <LoadingSpinner label="Loading..." />;
  }
  console.log('Auth: ', auth.isAuthenticated);
  return (
    <div className="px-14 py-1 font-primary text-xs  border-b flex justify-between items-center">
      <div className="flex gap-3">
        <div className="flex items-center gap-3">
          <FiPhone />
          <span>1-437-424-4015</span>
          <Divider orientation="vertical" />
        </div>
        <div className="flex items-center gap-3">
          <HiOutlineMailOpen />
          <span>info@gigmosaic.ca</span>
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex gap-3 items-center border-gray-300 ">
          {auth.isAuthenticated && customerRole && (
            <>
              <button
                onClick={() => navigate('/customer/customer-dashboard')}
                className="flex items-center gap-3 hover:text-primary transition"
              >
                <RxDashboard />
                Dashboard
              </button>
              <span className="h-5 w-px bg-gray-400"></span>
            </>
          )}

          {auth.isAuthenticated &&
            ((customerRole && providerRole && !isProviderPending) ||
              (customerRole && !providerRole && isProviderPending)) && (
              <>
                <button
                  onClick={() =>
                    window.open(
                      'https://www.int.provider-dashboard.gigmosaic.ca/',
                      '_blank'
                    )
                  }
                  className="flex items-center gap-3 hover:text-primary transition"
                >
                  <LuLayoutDashboard />
                  Provider Portal
                </button>
                <span className="h-5 w-px bg-gray-400"></span>
              </>
            )}

          {(!auth.isAuthenticated ||
            (auth.isAuthenticated &&
              customerRole &&
              !providerRole &&
              !isProviderPending) ||
            (auth.isAuthenticated &&
              customerRole &&
              !providerRole &&
              !isProviderPending)) && (
            <>
              <button
                onClick={handleProviderRegistration}
                className="flex items-center gap-3  text-primary transition font-normal"
              >
                <GrUserSettings className="text-primary " />
                Become a Provider
              </button>
              <span className="h-5 w-px bg-gray-400"></span>
            </>
          )}

          <Language />
          <span className="h-5 w-px bg-gray-400"></span>

          {/* Currency Selector */}
          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center space-x-2 hover:text-primary transition">
                  <BsCurrencyDollar className="text-sm" />
                  <span>{currency}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="Static Actions">
                {currencies.map((curr) => (
                  <DropdownMenuItem
                    key={curr}
                    onClick={() => setCurrency(curr)}
                  >
                    {curr}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <span className="h-5 w-px bg-gray-400"></span>

        <button className="flex items-center gap-3">
          <BiBell />
          {t('authentication.notification')}
        </button>
        <span className="h-5 w-px bg-gray-400"></span>
        {!auth.isAuthenticated ? (
          <>
            <button
              onClick={login}
              className="flex items-center gap-3 hover:text-primary transition"
            >
              <FaRegUser />
              {/* {t('authentication.login_register')} */}
              Login
            </button>
            <span className="h-5 w-px bg-gray-400"></span>

            <button
              // onClick={() =>
              //   (window.location.href = buildSignUpUrl('customer'))
              // }
              onClick={userRegistration}
              className="flex items-center gap-3 hover:text-primary transition"
            >
              <FaRegUser />
              {/* {t('authentication.login_register')} */}
              Register
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-gray-700 flex items-center gap-3 hover:text-red-600 transition"
          >
            <TbLogout2 />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default TopHeader;
