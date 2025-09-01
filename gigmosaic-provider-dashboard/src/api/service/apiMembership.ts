/* eslint-disable @typescript-eslint/no-explicit-any */
import { Addon } from "../../types";
import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const getAllMembershipPlans = async () => {
  try {
    const res = await apiClient.get(Path.membership);
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const getSubscriptionData = async () => {
  try {
    const res = await apiClient.get(Path.getSubscription);
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const createSubscription = async (planId: string, isAnnual: boolean, customerEmail: string | undefined) => {
  try {
    const res = await apiClient.post(Path.membershipCreateSubscription, {
      planId,
      isAnnual,
      customerEmail,
    });
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const createAddons = async (addons:Addon, total:number,customerEmail: string | undefined) => {
  try {
    const res = await apiClient.post(Path.membershipCreateAddons, {
      addons, total,
      customerEmail,
    });
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const updateAddons = async (stripeItemId: string, quantity: number ,addonId:string) => {
  try {
    const res = await apiClient.post(Path.membershipUpdateAddons, {
      stripeItemId,
      quantity,
      addonId,
    });
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const changeBilling = async () => {
  try {
    const res = await apiClient.post(Path.membershipChangeBilling);
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};

export const updateSubscription = async (subscriptionId: string, planId: string) => {
  try {
    const res = await apiClient.post(Path.membershipUpdateSubscription, {
      subscriptionId,
      newPriceId: planId,
    });
    console.log("Update Subscription Response: ", res.data);
    
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const res = await apiClient.post(Path.membershipCancelSubscription, {
      subscriptionId,
    });
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};