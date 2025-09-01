import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const getAllSubCategoryData = async () => {
  try {
    const res = await apiClient.get(Path.subcategory);
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};
