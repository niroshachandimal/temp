import { useQuery } from "@tanstack/react-query";
import { CategoriesResponse, SubCategoriesResponse } from "../types";
import { getAllCategory, getAllSubCategory } from "../services/categoryService"; // Note the correct path

export const useCategoryQuery = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });
};

export const useSubCategoryQuery = () => {
  return useQuery<SubCategoriesResponse>({
    queryKey: ["subcategories"],
    queryFn: getAllSubCategory,
  });
};
