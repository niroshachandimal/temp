import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const getUserDetailsById = async (id: string) => {
  try {
    const res = await apiClient.get(Path.user + `/${id}`);
    return res.data;
  } catch (error: any) {
    console.log("Error get user details by id: ", error);
    throw error;
  }
};

export const editUserProfile = async (id: string, data: any) => {
  console.log("FINAL: ", data);
  console.log("FINAL ID: ", id);
  try {
    const res = await apiClient.put(Path.user + `/${id}`, data);
    return res.data;
  } catch (error: any) {
    console.log("Error edit user profile: ", error);
    throw error;
  }
};
