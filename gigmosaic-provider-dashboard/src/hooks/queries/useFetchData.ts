import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  getAllServiceByProvider,
  getAllServiceData,
  getServiceDataById,
} from "../../api/service/apiService";
import {
  getAllStaffData,
  getAllStaffHolidays,
  getStaffById,
  getStaffHolidayByStaffId,
} from "../../api/service/apiStaff";
import {
  getAllCategoryData,
  getCategoryById,
} from "../../api/service/apiCategory";
import { getAllSubCategoryData } from "../../api/service/apiSubCategory";
import { QueryKey } from "../queryKey";
import { verifyToken } from "../../api/auth/apiAuth";
import { getUserDetailsById } from "../../api/user/apiUser";
import {
  getAllBookins,
  getBookingDataById,
  getBookingsByRefrenceId,
} from "../../api/service/apiBooking";
import { getAllMembershipPlans, getSubscriptionData } from "../../api/service/apiMembership";

//GET ALL SERVICE
export const useFetchAllService = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_SERVICE, page, limit],
    queryFn: ({ queryKey }) => {
      const [_, page, limit] = queryKey as [string, number?, number?];
      return getAllServiceData({ page, limit });
    },
    // staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

//GET ALL SERVICE
export const useFetchAllServiceByProvider = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_SERVICE, page, limit],
    queryFn: ({ queryKey }) => {
      const [_, page, limit] = queryKey as [string, number?, number?];
      return getAllServiceByProvider({ page, limit });
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

//GET SERVICE DATA BY ID
export const useFetchServiceDataById = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_SERVICE_BY_ID, id],
    queryFn: () =>
      id ? getServiceDataById(id) : Promise.reject("No ID provided"),
    // staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

//GET Category DATA BY ID
export const useFetchCategoryById = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_SERVICE_BY_ID, id],
    queryFn: () =>
      id ? getCategoryById(id) : Promise.reject("No ID provided"),
    // staleTime: 5 * 60 * 1000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// //GET ALL STAFF
// export const useFetchStaff = (page?: number, limit?: number) => {
//   return useQuery({
//     queryKey: [QueryKey.GET_ALL_STAFF, page, limit],
//     queryFn: ({ queryKey }) => {
//       const [_, page, limit] = queryKey as [string, number?, number?];
//       return getAllStaffData({ page, limit });
//     },
//     // staleTime: 5 * 60 * 1000,
//     retry: false,
//     placeholderData: keepPreviousData,
//     refetchOnWindowFocus: false,
//   });
// };

export const useFetchStaff = ({
  page = 1,
  limit = 8,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_STAFF, page, limit],
    queryFn: () => getAllStaffData({ page, limit }),
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

export const useFetchStaffById = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_STAFF, id],
    queryFn: () => (id ? getStaffById(id) : Promise.reject("No ID provided")),
    // staleTime: 5 * 60 * 1000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

//GET ALL CATEGORY
export const useFetchCategory = () => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_CATEGORY],
    queryFn: getAllCategoryData,
    // staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

//GET ALL SUB CATEGORY
export const useFetchSubCategory = () => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_SUBCATEGORY],
    queryFn: getAllSubCategoryData,
    // staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

//VERIFY TOKEN
export const useVerifyToken = () => {
  return useQuery({
    queryKey: [QueryKey.VERIFY_TOKEN],
    queryFn: verifyToken,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

//GET USER BY ID
export const useFetchUserDetailsById = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_USER_BY_ID, id],
    queryFn: () =>
      id ? getUserDetailsById(id) : Promise.reject("No ID provided"),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

//GET ALL BOOKINGS
export const useFetchAllBookings = (page?: number, limit?: number) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_BOOKING, page, limit],
    queryFn: ({ queryKey }) => {
      const [_, page, limit] = queryKey as [string, number?, number?];
      return getAllBookins({ page, limit });
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

//GET BOOKING BY ID
export const useFetchBookingById = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_BOOKING_BY_ID, id],
    queryFn: () =>
      id ? getBookingDataById(id) : Promise.reject("No ID provided"),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

//GET STAFF HOLIDAY BY ID
export const useFetchHolidayByStaffId = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_STAFF_HOLIDAY_BY_ID, id],
    queryFn: () =>
      id ? getStaffHolidayByStaffId(id) : Promise.reject("No ID provided"),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

//GET ALL STAFF HOLIDAYS
export const useFetchAllStaffHolidays = ({
  page = 1,
  limit = 8,
}: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_STAFF_HOLIDAY, page, limit],
    queryFn: () => getAllStaffHolidays({ page, limit }),
     retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};
// GET Membership plans

export const useFetchAllMembershipPlans = () => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_MEMBERSHIP_PLANS],
    queryFn: () => {
      return getAllMembershipPlans();
    },
    // staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

//GET BOOKING BY REFRENCE ID
export const useFetchBookingByReferenceId = (id?: string) => {
  return useQuery({
    queryKey: [QueryKey.GET_BOOKING_BY_REFERENCE_ID, id],
    queryFn: () =>
      id ? getBookingsByRefrenceId(id) : Promise.reject("No ID provided"),
    staleTime: 5 * 60 * 1000,

    enabled: !!id,
    retry: false,
     refetchOnWindowFocus: false,
  });
}

export const useFetchSubscriptions = () => {
  return useQuery({
    queryKey: [QueryKey.GET_ALL_SUBSCRIPTIONS],
    queryFn: () => {
      return getSubscriptionData();
    },
    // staleTime: 5 * 60 * 1000,
    retry: false,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
};

