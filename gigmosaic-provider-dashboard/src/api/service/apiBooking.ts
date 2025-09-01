import {
  IPageNumberAndLimt,
  IReshedulePostData,
  ITimeslotAvailabilityFetchProps,
} from "../../types";
import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const createBooking = async (data: any) => {
  try {
    const res = await apiClient.post(`${Path.booking}`, data);
    return res.data;
  } catch (error: any) {
    console.log("Error Create booking by provider: ", error);
    throw error;
  }
};

export const getAllBookins = async ({
  page = 1,
  limit = 10,
}: IPageNumberAndLimt) => {
  const quary = `?page=${page}&limit=${limit}`;
  try {
    const res = await apiClient.get(`${Path.booking}${quary}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get all bookings: ", error);
    throw error;
  }
};

export const getBookingDataById = async (id: string) => {
  try {
    const res = await apiClient.get(Path.booking + `/${id}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error booking by id: ", error);
    throw error;
  }
};

export const updateBookingStatus = async (
  id: string,
  newStatus: string,
  note?: string
) => {
  try {
    console.log("Payload: ", id, newStatus, note);
    const res = await apiClient.put(Path.bookingStatus.replace(":id", id), {
      newStatus: newStatus,
      note,
    });
    return res.data;
  } catch (error: unknown) {
    console.log("Error update booking state: ", error);
    throw error;
  }
};

export const checkBookingAvailableStaff = async (data) => {
  try {
    const res = await apiClient.post(Path.checkBookingAvailableStaff, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error ckeck available booking: ", error);
    throw error;
  }
};

export const checkBookingAvailableTimeSlotByDate = async (data) => {
  try {
    const res = await apiClient.post(Path.checkTimeslotAvailable, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error ckeck available timeslot: ", error);
    throw error;
  }
};

export const getTimeSlotRelatedStaff = async (
  data: ITimeslotAvailabilityFetchProps
) => {
  console.log("Payloadttwftfwtyarn: ", data);
  try {
    const res = await apiClient.post(Path.checkTimeslotAvailable, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get staff booking  time slot : ", error);
    throw error;
  }
};

export const submitBookingReshedule = async (data: IReshedulePostData) => {
  try {
    const res = await apiClient.put(
      Path.bookingReshedule.replace(":id", data.bookingId),
      data
    );
    return res.data;
  } catch (error: unknown) {
    console.log("Error get staff booking  time slot : ", error);
    throw error;
  }
};

export const getBookingsByRefrenceId = async (id: string) => {
  try {
    const res = await apiClient.get(Path.bookingReferenceId.replace(":id", id));
    return res.data;
  } catch (error: unknown) {
    console.log("Error booking by id: ", error);
    throw error;
  }
};
