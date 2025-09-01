import { Navigate, Route } from 'react-router-dom';
import { all_routes } from '../../core/data/routes/all_routes';
import Home from '../frontend/Home/Home';
import Services from '../frontend/services/services';
import Booking from '../frontend/Booking/Booking';
import ProviderRegistration from '../frontend/auth/ProviderRegistration';
import ConfirmationStep from '../components/steps/ConfirmationStep';

const routes = all_routes;
const publicRoutes = [
  {
    path: routes.index,
    name: 'Home',
    element: <Home />,
    route: Route,
  },
  {
    path: '/',
    name: 'Root',
    element: <Navigate to="/home" replace />,
    route: Route,
  },

  {
    path: routes.services,
    name: 'services',
    element: <Services />,
    route: Route,
  },
  {
    path: '*',
    name: 'NotFound',
    element: <Navigate to="/home" replace />,
    route: Route,
  },

  // pages module's path
  {
    path: routes.serviceBooking,
    name: 'Booking',
    element: <Booking />,
    route: Route,
  },

  {
    path: '/registration-provider',
    name: 'Provider Registration',
    element: <ProviderRegistration />,
    route: Route,
  },

  {
    path: '/booking/success',
    name: 'Booking Success',
    element: <ConfirmationStep />,
    route: Route,
  },

  // {
  //   path: routes.booking2,
  //   name: 'booking-2',
  //   element: <Booking2 />,
  //   route: Route,
  // },
  // {
  //   path: routes.bookingDone,
  //   name: 'booking-done',
  //   element: <BookingDone />,
  //   route: Route,
  // },
  // {
  //   path: routes.bookingPayment,
  //   name: 'booking-payment',
  //   element: <BookingPayment />,
  //   route: Route,
  // },

  // provider module's path

  // {
  //   path: routes.paymentSetting,
  //   name: 'payment-setting',
  //   element: <PaymentSetting />,
  //   route: Route,
  // },

  //customer module's path

  // blog module's path
  // service path

  // {
  //   path: routes.pages,
  //   name: 'pages',
  //   element: <Pages />,
  //   route: Route,
  // },
  // {
  //   path: routes.customers,
  //   name: 'customers',
  //   element: <Customers />,
  //   route: Route,
  // },

  // {
  //   path: routes.blog,
  //   name: 'blog',
  //   element: <Blog />,
  //   route: Route,
  // },
  // {
  //   path: routes.providers,
  //   name: 'providers',
  //   element: <Providers />,
  //   route: Route,
  // },

  // // Admin Module Path
  // {
  //   path: routes.admin,
  //   name: 'admin',
  //   element: <Admin />,
  //   route: Route,
  // },
  // {
  //   path: 'admin',
  //   name: 'Root',
  //   element: <Navigate to="/admin/dashboard" />,
  //   route: Route,
  // },
];

export const authRoutes = [
  // {
  //   path: '/authentication/reset-password',
  //   name: 'reset-password',
  //   element: <ResetPassword />,
  //   route: Route,
  // },
  // {
  //   path: routes.passwordRecovery,
  //   name: 'password-recovery',
  //   element: <PasswordRecovery />,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/login',
  //   name: 'login',
  //   element: <Login/>,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/login-phone1',
  //   name: 'login-phone1',
  //   element: <LoginPhone1/>,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/phone-otp',
  //   name: 'Phone-Otp',
  //   element: <PhoneOtp/>,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/email-otp',
  //   name: 'email-Otp',
  //   element: <EmailOtp/>,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/choose-signup',
  //   name: 'choose-signup',
  //   element: <ChooseSignup/>,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/user-signup',
  //   name: 'user-signup',
  //   element: <UserSignup />,
  //   route: Route,
  // },
  // {
  //   path: routes.providerSignup,
  //   name: 'Provider-signup',
  //   element: <ProviderRegister />,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/success',
  //   name: 'success',
  //   element: <Success />,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/free-trail',
  //   name: 'free-trial',
  //   element: <FreeTrail />,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/error-404',
  //   name: 'Error404',
  //   element: <Error404 />,
  //   route: Route,
  // },
  // {
  //   path: '/authentication/error-500',
  //   name: 'Error500',
  //   element: <Error500 />,
  //   route: Route,
  // },
];
export { publicRoutes };
