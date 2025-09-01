/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';
import { Path } from '../api/backendUrl';
import logger from '../utils/logger';
import { CategoriesAndSubResponse, CategoriesResponse } from '../utils/type';

interface SubCategory {
  subCategoryId: string;
  subCategoryName: string;
  subCategorySlug: string;
  categoryName: string;
  categoryId: string;
  createdAt: string;
  isFeatured: boolean;
  isCertificateRequired: boolean;
}



interface SubCategoriesResponse {
  success: boolean;
  subCategories: SubCategory[];
  total: number;
  page: number;
  pages: number;
}

export const getAllCategory = async (): Promise<CategoriesResponse> => {
  try {
    const res = await apiClient.get(`${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.getAllCategory}`);
    return res.data;
  } catch (error: any) {
    logger.error('Error fetching categories:', error);
    throw error;
  }
};
export const getAllCategoryAndSub = async (): Promise<CategoriesAndSubResponse> => {
  try {
    const res = await apiClient.get(`${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.getAllCategoryAndSub}`);
    console.log("RES: ", res.data);
    
    return res.data;
  } catch (error: any) {
    logger.error('Error fetching categories:', error);
    throw error;
  }
};

export const getAllSubCategory = async (): Promise<SubCategoriesResponse> => {
  try {
    const res = await apiClient.get(`${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.getAllSubCategory}`);
    return res.data;
  } catch (error: any) {
    logger.error('Error fetching subcategories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const res = await apiClient.get(`${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.getAllCategory}` + `/${id}`);
    return res.data;
  } catch (error: any) {
    console.log("ERROR: ", error);
    // logger.error(error);
    throw error;
  }
};