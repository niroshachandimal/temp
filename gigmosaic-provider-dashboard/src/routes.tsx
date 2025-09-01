import Dashboard from "./pages/Dashboard";
import AddService from "./pages/service/AddService";
import AllService from "./pages/service/AllService";
import EditService from "./pages/service/EditService";
import SingleService from "./pages/service/SingleService";
import AllStaff from "./pages/staff/AllStaff";

// const routes = [
// {
//   path: "/dashboard",
//   name: "Dashboard",
//   element: (
//     <ProtectedRoute element={Dashboard} allowedRoles={[ROLE.PROVIDER]} />
//   ),
// },

//   {
//     path: "/service/all-service",
//     name: "All Service",
//     element: (
//       <ProtectedRoute element={AllService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "/service/add-service",
//     name: "Add Service",
//     element: (
//       <ProtectedRoute element={AddService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "/service/:id/:slug",
//     name: "Service",
//     element: (
//       <ProtectedRoute element={SingleService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "/service/edit-service/:id",
//     name: "Update Service",
//     element: (
//       <ProtectedRoute element={EditService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },
//   {
//     path: "/staff/all-staff",
//     name: "All Staff",
//     element: (
//       <ProtectedRoute element={AllStaff} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "/offer/all-offer",
//     name: "Offers",
//     element: (
//       <ProtectedRoute element={EditService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "/offer/all-offer",
//     name: "Offers",
//     element: (
//       <ProtectedRoute element={EditService} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },

//   {
//     path: "*",
//     name: "Error 404",
// element: (
//   <ProtectedRoute element={Error404Page} allowedRoles={[ROLE.PROVIDER]} />
// ),
//   },

// {
//   path: "/no-permission",
//   name: "No-Permission",
//   element: <NoPermissionPage />,
// },
// ];

// export default routes;

// import ProtectedRoute from "./ProtectedRoute";
// import ROLE from "./Role";

// const routes = [
//   {
//     path: "/dashboard", // ✅ fixed from Path
//     name: "Dashboard",
//     icon: <FaBox />,
//     allowedRoles: [ROLE.PROVIDER],
//     element: (
//       <ProtectedRoute allowedRoles={[ROLE.PROVIDER]} element={Dashboard} />
//     ),
//   },
//   {
//     name: "Services",
//     icon: <FaBox />,
//     allowedRoles: [ROLE.PROVIDER],
//     children: [
//       {
//         path: "/service/all-service",
//         name: "All Services",
//         allowedRoles: [ROLE.PROVIDER],
//         element: (
//           <ProtectedRoute allowedRoles={[ROLE.PROVIDER]} element={Dashboard} />
//         ),
//       },
//       {
//         path: "/service/add-service",
//         name: "Add Service",
//         allowedRoles: [ROLE.PROVIDER],
//       },
//     ],
//   },
//   {
//     path: "/staff/all-staff",
//     name: "All Staff",
//     icon: <FaUsers />,
//     allowedRoles: [ROLE.PROVIDER],
//   },
//   {
//     path: "/dashboard/new",
//     name: "Dashboards",
//     element: (
//       <ProtectedRoute element={AllStaff} allowedRoles={[ROLE.PROVIDER]} />
//     ),
//   },
// ];

// export default routes;



import ChatUi from "./pages/chat/ChatUi";
import SubscriptionPlans from "./pages/membership/SubscriptionPlans";
import { ManageSubscription } from "./pages/user/ManageSubscription";


import React from "react";
// import UserProfile from "./pages/user/UserProfile";
// import BookingList from "./pages/booking/BookingList";
// import UserSecurity from "./pages/user/UserSecurity";
// import StaffLeavePage from "./pages/staff/StaffLeavePage";
// import BookingCalendar from "./pages/booking/BookingCalendar";
// import AddBookingModal from "./pages/booking/AddBookingModal";
// import AddService1 from "./pages/service/AddService1";
// import EditService1 from "./pages/service/EditService1";

// import Dashboard from "./pages/Dashboard";
// import AllService from "./pages/AllService";
// import AddService from "./pages/AddService";
// import AllStaff from "./pages/AllStaff";

const UserProfile = React.lazy(() => import("./pages/user/UserProfile"));
const BookingList = React.lazy(() => import("./pages/booking/BookingList"));
const UserSecurity = React.lazy(() => import("./pages/user/UserSecurity"));
const StaffLeavePage = React.lazy(() => import("./pages/staff/StaffLeavePage"));
const BookingCalendar = React.lazy(
  () => import("./pages/booking/BookingCalendar")
);
const AddBookingModal = React.lazy(
  () => import("./pages/booking/AddBookingModal")
);
const AddService1 = React.lazy(() => import("./pages/service/AddService1"));
const EditService1 = React.lazy(() => import("./pages/service/EditService1"));

const AllDiscount = React.lazy(() => import("./pages/discount/AllDiscount"));

const routes = [
  { path: "dashboard", element: <Dashboard /> },
  { path: "service/all-service", element: <AllService /> },
  // { path: "service/add-service", element: <AddService /> },
  { path: "service/add-service", element: <AddService1 /> },
  { path: "service/:id/:slug", element: <SingleService /> },
  // { path: "service/edit-service/:id", element: <EditService /> },
  { path: "service/edit-service/:id", element: <EditService1 /> },
  { path: "staff/all", element: <AllStaff /> },
  { path: "staff/leave", element: <StaffLeavePage /> },
  { path: "account/profile/profile-setting", element: <UserProfile /> },
  { path: "account/profile/security", element: <UserSecurity /> },
  { path: "booking/all", element: <BookingList /> },
  { path: "booking/calendar", element: <BookingCalendar /> },
  { path: "booking/add", element: <AddBookingModal /> },

  { path: "user/profile/plan", element: <ManageSubscription /> },
  { path: "booking", element: <BookingList /> },
  { path: "chat", element: <ChatUi /> },
  { path: "membership", element: <SubscriptionPlans /> },




  { path: "discount/all", element: <AllDiscount /> },

];

export default routes;
