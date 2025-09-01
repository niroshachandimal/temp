import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";
import { IReshedulePostData, IServiceProps } from "../../types";

interface IStaffProps {
  id: string;
  data: {
    startDate: string;
    endDate: string;
    reason: string;
    approved: boolean;
  };
}

export const sumbitStaffData = async (data) => {
  try {
    const res = await apiClient.post(Path.staff, data);
    return res.data;
  } catch (error: unknown) {
    console.log(error);
    console.log("Error submit staff data: ", error);
    throw error;
  }
};

// export const getAllStaffData = async ({ page = 1, limit: string = 8 }) => {
//   const quary = `?page=${page?.page}&limit=${limit}`;

//   console.log("888888888888888888888888888888");

//   try {
//     console.log("RUN GET ALL STAFF");
//     const res = await apiClient.get(`${Path.staff}${quary}`);
//     console.log("Staff res: ", res);
//     return res.data;
//   } catch (error: unknown) {
//     console.log("Error get all staff: ", error);
//     throw error;
//   }
// };

export const getAllStaffData = async ({ page = 1, limit = 8 }) => {
  const query = `?page=${page}&limit=${limit}`;
  try {
    const res = await apiClient.get(`${Path.staff}${query}`);
    return res.data;
  } catch (error) {
    console.error("Error get all staff: ", error);
    throw error;
  }
};

export const getStaffById = async (id: string) => {
  try {
    const res = await apiClient.get(Path.staff + `/${id}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get staff by id: ", error);
    throw error;
  }
};

export const updateStffData = async (
  id: string,
  serviceData: IServiceProps
) => {
  try {
    const res = await apiClient.put(`${Path.staff}/${id}`, serviceData);
    return res.data;
  } catch (error: unknown) {
    console.log("Error update staff data: ", error);
    throw error;
  }
};

export const deleteStffData = async (id: string) => {
  try {
    const res = await apiClient.delete(Path.staff + `/${id}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error delete staff: ", error);
    throw error;
  }
};

export const submitStaffHoliday = async ({ id, data }: IStaffProps) => {
  try {
    const res = await apiClient.post(`${Path.staff}/${id}/holidays`, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error create staff holiday: ", error);
    throw error;
  }
};

export const getStaffHolidayByStaffId = async (id: string) => {
  try {
    const res = await apiClient.get(`${Path.staff}/${id}/holidays`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error create staff holiday by id: ", error);
    throw error;
  }
};

export const updateStaffHolidayByStaffId = async (id: string, data) => {
  console.log("RUN.................");
  try {
    console.log("Reshedule data: ", data);
    const res = await apiClient.put(`${Path.staff}/holidays/${id}`, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error update staff holiday by id: ", error);
    throw error;
  }
};

export const getAllStaffHolidays = async () => {
  try {
    const res = await apiClient.get(`${Path.staff}/holidays/all`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error create staff holiday by id: ", error);
    throw error;
  }
};

export const deleteStaffHoliday = async (id: string) => {
  console.log("RUN DELETE.............");
  try {
    const res = await apiClient.delete(`${Path.staff}/holidays/${id}`);
    console.log("RES: ", res);
    return res.data;
  } catch (error: unknown) {
    console.log("Error create staff holiday by id: ", error);
    throw error;
  }
};
