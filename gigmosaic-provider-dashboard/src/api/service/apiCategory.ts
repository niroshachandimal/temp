import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const getAllCategoryData = async () => {
  try {
    const res = await apiClient.get(Path.category);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get all category: ", error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const res = await apiClient.get(Path.category + `/${id}`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error get category by id: ", error);
    throw error;
  }
};
