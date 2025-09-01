import { apiClient } from "../axios/apiClient";
import { Path } from "../axios/endpoint";

export const verifyToken = async () => {
  try {
    const res = await apiClient.get(Path.tokenVerify);
    return res.data;
  } catch (error: unknown) {
    console.log("Verify token error: ", error);
    throw error;
  }
};
