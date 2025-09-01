// export const Path = {
//   service: "/service/api/v1/service",
//   // service: "/api/v1/service",
//   staff: "/service/api/v1/staff",
//   category: "/service/api/v1/category",
//   subcategory: "/service/api/v1/subcategory",
//   tokenVerify: "/user/api/v1/auth/verifiedToken",
//   user: "/user/api/v1/user",

//   booking: "/service/api/v1/booking",
// };

const isProd = true; // Force development mode for local backend
// DEV ---- PROD
export const Path = {
  checkTimeslotAvailable:
    "/service/api/v1/booking/checkAvailableStaffForTimeSlot",
  providerService: "/service/api/v1/service/providerService",
  service: isProd ? "/api/v1/service" : "/service/api/v1/service",

  staff: isProd ? "/api/v1/staff" : "/service/api/v1/staff",
  category: isProd ? "/api/v1/category" : "/service/api/v1/category",
  subcategory: isProd ? "/api/v1/subcategory" : "/service/api/v1/subcategory",
  tokenVerify: isProd
    ? "/api/v1/auth/verifiedToken"
    : "/user/api/v1/auth/verifiedToken",
  user: isProd ? "/api/v1/user" : "/user/api/v1/user",

  booking: isProd ? "/api/v1/booking" : "/service/api/v1/booking", // Same in both
  bookingStatus: "/service/api/v1/booking/:id/status",
  checkBookingAvailableStaff: "/service/api/v1/booking/checkAvailableStaff",
  checkAvailableTime: "/service/api/v1/booking/checkAvailability",
  bookingReshedule: "/service/api/v1/booking/:id/reschedule",
  bookingReferenceId: "/service/api/v1/booking/referenceCode/:id",

  membership: isProd ? "/api/v1/membership" : "/payment/api/v1/membership",
  membershipCreateSubscription: isProd
    ? "/api/v1/membership/create-subscription"
    : "/payment/api/v1/membership/create-subscription",
  membershipCreateAddons: isProd
    ? "/api/v1/membership/create-addons"
    : "/payment/api/v1/membership/create-addons",
  membershipChangeBilling: isProd
    ? "/api/v1/membership/create-billing-portal-session"
    : "/payment/api/v1/membership/create-billing-portal-session",
  membershipUpdateSubscription: isProd
    ? "/api/v1/membership/upgrade-subscription"
    : "/payment/api/v1/membership/upgrade-subscription",
  membershipUpdateAddons: isProd
    ? "/api/v1/membership/upgrade-addons"
    : "/payment/api/v1/membership/upgrade-addons",
  membershipCancelSubscription: isProd
    ? "/api/v1/membership/cancel-subscription"
    : "/payment/api/v1/membership/cancel-subscription",
  getSubscription: isProd
    ? "/api/v1/membership/get-subscription"
    : "/payment/api/v1/membership/get-subscription",
};

// https://api.staging.gigmosaic.ca
