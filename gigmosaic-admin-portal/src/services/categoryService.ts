import { apiClient } from "../api";
import { Path } from "../api/backendUrl";
import {
  CategoriesResponse,
  Category,
  SubCategoriesResponse,
  SubCategory,
} from "../types";
import logger from "../utils/logger";

export const getAllCategory = async (): Promise<CategoriesResponse> => {
  try {
    const res = await apiClient.get(Path.category);
    return res.data;
  } catch (error: unknown) {
    logger.error("Error fetching categories:", error);
    throw error;
  }
};

export const getAllSubCategory = async (): Promise<SubCategoriesResponse> => {
  try {
    const res = await apiClient.get(Path.subCategory);
    return res.data;
  } catch (error: unknown) {
    logger.error("Error fetching subcategories:", error);
    throw error;
  }
};

export const categoryService = {
  addCategory: async (data: Category) => {
    try {
      const response = await apiClient.post(Path.category, data);
      return response.data;
    } catch (error) {
      logger.error("Error in addCategory:", error);
      throw error;
    }
  },

  updateCategory: async (id: string, data: Category) => {
    try {
      const response = await apiClient.put(`${Path.category}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error in updateCategory:", error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = await apiClient.delete(`${Path.category}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error in deleteSubCategory:", error);
      throw error;
    }
  },
};

export const subCategoryService = {
  addSubCategory: async (data: SubCategory) => {
    try {
      const response = await apiClient.post(Path.subCategory, data);
      return response.data;
    } catch (error) {
      logger.error("Error in addSubCategory:", error);
      throw error;
    }
  },

  updateSubCategory: async (id: string, data: Partial<SubCategory>) => {
    try {
      const response = await apiClient.put(`${Path.subCategory}/${id}`, data);
      return response.data;
    } catch (error) {
      logger.error("Error in updateSubCategory:", error);
      throw error;
    }
  },

  deleteSubCategory: async (id: string) => {
    try {
      const response = await apiClient.delete(`${Path.subCategory}/${id}`);
      return response.data;
    } catch (error) {
      logger.error("Error in deleteSubCategory:", error);
      throw error;
    }
  },
};
