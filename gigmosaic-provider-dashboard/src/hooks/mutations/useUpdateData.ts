import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateServiceData } from "../../api/service/apiService";
import { addToast } from "@heroui/react";
import { QueryKey } from "../queryKey";
import {
  updateStaffHolidayByStaffId,
  updateStffData,
} from "../../api/service/apiStaff";
import { useNavigate } from "react-router-dom";
import { updateBookingStatus } from "../../api/service/apiBooking";
import { editUserProfile } from "../../api/user/apiUser";

export const useUpdateServiceMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, serviceData }: { id: string; serviceData: any }) =>
      updateServiceData(id, serviceData),
    onSuccess: ({ id }: { id: string }) => {
      addToast({
        title: "Update Success",
        description: "Service data updated successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_SERVICE] });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_SERVICE_BY_ID, id],
      });

      navigate("/service/all-service");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while updateting service data.";
      addToast({
        title: "Update Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
      console.error("useUpdateServiceMutation 001:", errorMessage);
    },
  });
};

export const useUpdateStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staffData }: { id: string; staffData: any }) =>
      updateStffData(id, staffData),
    onSuccess: () => {
      addToast({
        title: "Update Success",
        description: "Staff data updated successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_STAFF] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while updateting service data.";
      addToast({
        title: "Update Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
      console.error("useUpdateServiceMutation 001:", errorMessage);
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      newStatus,
      note,
    }: {
      id: string;
      newStatus: string;
      note?: string;
    }) => updateBookingStatus(id, newStatus, note),
    onSuccess: (_data, variables) => {
      const { newStatus } = variables;
      addToast({
        title: "Success",
        description: `Booking status changed to "${newStatus}" successfully.`,
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_BOOKING] });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: `Failed to change booking status.`,
        radius: "md",
        color: "danger",
      });
    },
  });
};

export const useUpdateStaffHolidayById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateStaffHolidayByStaffId(id, data),
    onSuccess: () => {
      addToast({
        title: "Update Success",
        description: "Staff holiday updated successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_ALL_STAFF_HOLIDAY],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while updateting staff holiday.";
      addToast({
        title: "Update Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};

// UPDATE USER PROFILE
export const useUpdateUserprofile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      editUserProfile(id, data),
    onSuccess: ({ id }: { id: string }) => {
      addToast({
        title: "Update Success",
        description: "Profile updated successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_USER_BY_ID, id],
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors[0]?.msg ||
        "An error occurred while updateting user profile.";
      addToast({
        title: "Update Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};
