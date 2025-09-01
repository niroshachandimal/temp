import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";
import { IServiceProps } from "../../types";

interface IPagaginationParams {
  page?: number;
  limit?: number;
}

export const sumbitServiceData = async (data: IServiceProps) => {
  try {
    const res = await apiClient.post(Path.service, data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error submit service: ", error);
    throw error;
  }
};

export const getAllServiceData = async ({
  page = 1,
  limit = 8,
}: IPagaginationParams) => {
  const quary = `?page=${page?.page}&limit=${limit}`;
  try {
    const res = await apiClient.get(`${Path.service}${quary}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get all service: ", error);
    throw error;
  }
};

export const getAllServiceByProvider = async ({
  page = 1,
  limit = 10,
}: IPagaginationParams) => {
  const query = `?page=${page}&limit=${limit}`;
  try {
    const res = await apiClient.get(`${Path.providerService}${query}`);
    console.log("get all service by provider: ", res.data);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get all service by Provider: ", error);
    throw error;
  }
};

export const getServiceDataById = async (id: string) => {
  try {
    const res = await apiClient.get(Path.service + `/${id}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error service by id: ", error);
    throw error;
  }
};

export const updateServiceData = async (
  id: string,
  serviceData: IServiceProps
) => {
  try {
    const res = await apiClient.put(`${Path.service}/${id}`, serviceData);
    return res.data;
  } catch (error: unknown) {
    console.log("Error update service: ", error);
    throw error;
  }
};
