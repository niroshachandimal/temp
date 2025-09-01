import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sumbitServiceData } from "../../api/service/apiService";
import { addToast } from "@heroui/react";
import { QueryKey } from "../queryKey";
import {
  submitStaffHoliday,
  sumbitStaffData,
} from "../../api/service/apiStaff";
import { useNavigate } from "react-router-dom";
import {
  createBooking,
  getTimeSlotRelatedStaff,
  submitBookingReshedule,
} from "../../api/service/apiBooking";
import { AxiosError } from "axios";

// SERVICE
export const useSumbitServiceMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: sumbitServiceData,
    onSuccess: () => {
      addToast({
        title: "Service Added",
        description: "Service Added Successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_SERVICE] });
      navigate("/service/all-service");
    },
    onError: (error: AxiosError<{ errors: { msg: string }[] }>) => {
      console.error("Failed to submit service data:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while submitting service data.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

// STAFF
export const useSumbitStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sumbitStaffData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_STAFF] });
    },
    onError: (error: any) => {
      console.error("Failed to submit staff data:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while submitting staff data.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

// STAFF HOLIDAY CREATE
export const useSumbitStaffHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitStaffHoliday,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_ALL_STAFF_HOLIDAY],
      });
      addToast({
        title: "Success",
        description: "Staff holiday added successfully.",
        radius: "md",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Failed to submit staff data:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while submitting staff holiday.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

// BOOKING RESHEDULE
export const useBookingReshedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitBookingReshedule,
    onSuccess: (variables) => {
      const { bookingId } = variables;
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_ALL_BOOKING],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_BOOKING_BY_ID, bookingId],
      });
      addToast({
        title: "Success",
        description: "Booking reshedule successfully.",
        radius: "md",
        color: "success",
      });
    },
    onError: (error: any) => {
      console.error("Failed to booking reshedule:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while booking reshedule.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

//CHECK TIMESLOT AVAILABILITY BY DATE AND SERVICE ID
export const useCheckTimesSlotAvailability = () => {
  return useMutation({
    mutationFn: getTimeSlotRelatedStaff,
    onError: (error: any) => {
      console.error("Failed to check timeslot availability:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while booking reshedule.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

// SERVICE
export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      addToast({
        title: "Booking Placed",
        description: "Booking Placed Successfully",
        radius: "md",
        color: "success",
      });
      // queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_BOOKING] });
    },
    onError: (error: any) => {
      console.error("Failed to create booking:", error);

      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while create booking.";

      addToast({
        title: "Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
      console.error("useSumbitServiceMutation :", errorMessage);
    },
  });
};
