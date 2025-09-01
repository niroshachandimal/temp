import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  categoryService,
  subCategoryService,
} from "../services/categoryService";
import { Category, SubCategory } from "../types/index";

type UpdatePayload<T> = {
  id: string;
  data: Partial<T>;
};

export const useAddCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Category) => categoryService.addCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Category }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useAddSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubCategory) => subCategoryService.addSubCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};

export const useUpdateSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdatePayload<SubCategory>) =>
      subCategoryService.updateSubCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};

export const useDeleteSubCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subCategoryService.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};
