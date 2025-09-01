import { Navigate, Route, Routes } from 'react-router-dom';

import CustomerDashboard from './Dashboard/CustomerDashboard';
import BookingList from './Bookinglist/Bookinglist';
import Wallet from './wallet/wallet';
import CustomerFavorite from './customer- favorite/customerfavorite';
import Reviews from './Reviews/Reviews';
import AccountSettings from './AccountSettings/AccountSettings';
import SecuritySettings from './SecuritySettings/SecuritySettings';
import NotificationSettings from './NotificationSettings/NotificationSettings';
import Chat from './Chat/Chat';

const CustomersRoutes = () => {
  const all_customers_routes = [
    {
      path: '/customer-chat',
      name: 'customer-chat',
      element: <Chat />,
      route: Route,
    },
    {
      path: '/customer/',
      name: 'customer-dashboard',
      element: <Navigate to="/customer-dashboard" replace />,
      route: Route,
    },

    // {
    //   path: '/customer-booking-calendar',
    //   name: 'customer-booking-calendar',
    //   element: <CustomerBookingCalendar />,
    //   route: Route,
    // },
    {
      path: '/customer-dashboard',
      name: 'customer-dashboard',
      element: <CustomerDashboard />,
      route: Route,
    },

    {
      path: '/customer-booking',
      name: 'customer-booking',
      element: <BookingList />,
      route: Route,
    },

    {
      path: '/customer-wallet',
      name: 'customer-wallet',
      element: <Wallet />,
      route: Route,
    },

    {
      path: '/customer-favourite',
      name: 'customer-favourite',
      element: <CustomerFavorite />,
      route: Route,
    },

    {
      path: '/customer-reviews',
      name: 'customer-reviews',
      element: <Reviews />,
      route: Route,
    },
    {
      path: '/settings/customer-profile',
      name: 'customer-profile',
      element: <AccountSettings />,
      route: Route,
    },

    {
      path: '/settings/customer-security',
      name: 'customer-security',
      element: <SecuritySettings />,
      route: Route,
    },

    {
      path: '/settings/notification',
      name: 'notification',
      element: <NotificationSettings />,
      route: Route,
    },

    // {
    //   path: '/customer-favourite',
    //   name: 'customer-favourite',
    //   element: <CustomerFavourite />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/notification',
    //   name: 'customer-notifications',
    //   element: <CustomerNotifications />,
    //   route: Route,
    // },
    // {
    //   path: '/customer-reviews',
    //   name: 'customer-reviews',
    //   element: <CustomerReviews />,
    //   route: Route,
    // },
    // {
    //   path: '/customer-wallet',
    //   name: 'customer-reviews',
    //   element: <CustomerWallet />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/customer-profile',
    //   name: 'customer-profile',
    //   element: <CustomerProfile />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/connected-apps',
    //   name: 'Connected App',
    //   element: <CustomerConnectedApp />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/device-management',
    //   name: 'device-management',
    //   element: <DeviceManagement />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/login-activity',
    //   name: 'login-activity',
    //   element: <LoginActivity />,
    //   route: Route,
    // },

    // {
    //   path: '/user-bookings',
    //   name: 'booking-2',
    //   element: <Booking1 />,
    //   route: Route,
    // },

    // {
    //   path: '/booking-done',
    //   name: 'booking-done',
    //   element: <BookingDone />,
    //   route: Route,
    // },
    // {
    //   path: '/booking-payment',
    //   name: 'booking-payment',
    //   element: <BookingPayment />,
    //   route: Route,
    // },
    // {
    //   path: '/notification',
    //   name: 'notification',
    //   element: <Notification />,
    //   route: Route,
    // },
    // {
    //   path: '/settings/customer-security',
    //   name: 'SecuritySetting',
    //   element: <SecuritySetting />,
    //   route: Route,
    // },
    // {
    //   path: '*',
    //   name: 'NotFound',
    //   element: <Navigate to="/" />,
    //   route: Route,
    // },
  ];
  return (
    <>
      <Routes>
        {/* Redirect /customer/ to /customer/customer-dashboard */}
        <Route
          path="/"
          element={<Navigate to="/customer/customer-dashboard" replace />}
        />

        {/* Map all customer routes */}
        {all_customers_routes.map((route, idx) => (
          <Route path={route.path} element={route.element} key={idx} />
        ))}
      </Routes>
    </>
  );
};

export default CustomersRoutes;
