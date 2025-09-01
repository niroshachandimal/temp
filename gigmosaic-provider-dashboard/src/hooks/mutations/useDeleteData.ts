import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaffHoliday, deleteStffData } from "../../api/service/apiStaff";
import { addToast } from "@heroui/react";
import { QueryKey } from "../queryKey";

export const useDeleteStaffMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStffData(id),
    onSuccess: () => {
      addToast({
        title: "Delete Success",
        description: "Staff data deleted successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_STAFF] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        "An error occurred while deleting staff data.";
      addToast({
        title: "Delete Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
      console.error("useDeleteStaffMutation Error:", errorMessage);
    },
  });
};

export const useDeleteStaffHoliday = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStaffHoliday(id),
    onSuccess: () => {
      addToast({
        title: "Delete Success",
        description: "Staff holiday deleted successfully",
        radius: "md",
        color: "success",
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKey.GET_ALL_STAFF_HOLIDAY],
        exact: false,
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        "An error occurred while deleting staff holiday.";
      addToast({
        title: "Delete Error",
        description: errorMessage,
        radius: "md",
        color: "danger",
      });
    },
  });
};
