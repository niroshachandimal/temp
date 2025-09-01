import { apiClient } from "../api";
import { Path } from "../api/backendUrl";
import logger from "../utils/logger";

export const getAllFaqs = async () => {
  try {
    const res = await apiClient.get(`${Path.faq}?includeDisabled=true`);
    return res.data;
  } catch (error) {
    logger.error("Error fetching FAQs", error);
    throw error;
  }
};

export const createFaq = async (data: any) => {
  try {
    const res = await apiClient.post(Path.faq, data);
    return res.data;
  } catch (error) {
    logger.error("Error creating FAQ", error);
    throw error;
  }
};

export const updateFaq = async (id: string, data: any) => {
  try {
    const res = await apiClient.put(`${Path.faq}/${id}`, data);
    return res.data;
  } catch (error) {
    logger.error("Error updating FAQ", error);
    throw error;
  }
};

export const deleteFaq = async (id: string) => {
  try {
    const res = await apiClient.delete(`${Path.faq}/${id}`);
    return res.data;
  } catch (error) {
    logger.error("Error deleting FAQ", error);
    throw error;
  }
};
