/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSubscription, changeBilling, createAddons, createSubscription, updateAddons, updateSubscription } from "../../api/service/apiMembership";
import { addToast } from "@heroui/react";
import { QueryKey } from "../queryKey";
import { Addon } from "../../types";

export const useSubmitMembershipMutation = () => {
    return useMutation({
        mutationFn: ({ planId, isAnnual, customerEmail }: { planId: string, isAnnual: boolean, customerEmail: string | undefined }) =>
            createSubscription(planId, isAnnual, customerEmail),
        onSuccess: (data) => {
            if (data.url) {
        window.location.href = data.url; // Redirect on success
      } else {
        throw new Error('Stripe session URL missing');
      }
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};

export const useSubmitAddOnsMutation = () => {
    return useMutation({
        mutationFn: ({addons, total,customerEmail }: {addons:Addon, total:number, customerEmail: string | undefined }) =>
            createAddons(addons, total,customerEmail),
        onSuccess: (data) => {
            if (data.url) {
        window.location.href = data.url; // Redirect on success
      } else {
        throw new Error('Stripe session URL missing');
      }
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};

export const useSubmitChangeBillingMutation = () => {
    return useMutation({
        mutationFn: () =>
            changeBilling(),
        onSuccess: (data) => {
            if (data.url) {
        window.location.href = data.url; // Redirect on success
      } else {
        throw new Error('Stripe session URL missing');
      }
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};

export const useUpdateMembershipMutation = () => {
    return useMutation({
        mutationFn: ({ subscriptionId, planId }: { subscriptionId: string, planId: string }) =>
            updateSubscription(subscriptionId, planId),
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Membership updated successfully",
                radius: "md",
                color: "success",
            });
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};

export const useUpdateAddonsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ stripeItemId, quantity, addonId }: { stripeItemId: string, quantity: number, addonId: string }) =>
            updateAddons(stripeItemId, quantity, addonId),
        onSuccess: () => {
            addToast({
                title: "Success",
                description: "Addons updated successfully",
                radius: "md",
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ALL_SUBSCRIPTIONS] });
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};

export const useCancelMembershipMutation = () => {
    return useMutation({
        mutationFn: ({ subscriptionId }: { subscriptionId: string}) =>
            cancelSubscription(subscriptionId),
        onSuccess: () => {
           addToast({
               title: "Delete Success",
               description: "Membership canceled successfully",
               radius: "md",
               color: "success",
           });
        },
        onError: (error: any) => {
            console.error("Failed to submit membership data:", error);

            const errorMessage =
                error?.response?.data?.errors[0]?.msg ||
                "An error occurred while submitting membership data.";

            addToast({
                title: "Error",
                description: errorMessage,
                radius: "md",
                color: "danger",
            });
            console.error("useSubmitMembershipMutation :", errorMessage);
        },
    });
};