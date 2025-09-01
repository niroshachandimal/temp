/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchSearchData } from './useSearchData';
import {
  CategoriesAndSubResponse,
  CategoriesResponse,
  FetchSearchDataParams,
  FetchSearchDataResponse,
  SubCategoriesResponse,
} from '../utils/type';
import {
  getAllCategory,
  getAllCategoryAndSub,
  getAllSubCategory,
  getCategoryById,
} from '../service/categoryService';
import { getServiceDataById } from '../service/serviceService';
import { getStaffById } from '../service/bookingService';

export const useSearchData = (filter: Record<string, any>) => {
  return useQuery({
    queryKey: ['searchData', filter],
    queryFn: () => fetchSearchData({ filter }), // Wrap the function call properly
    enabled: false, // Prevent automatic fetching
  });
};

export const useSearchDataMutation = () => {
  return useMutation<FetchSearchDataResponse, Error, FetchSearchDataParams>(
    { mutationFn: fetchSearchData } // Pass the `fetchSearchData` function as a property of an object
  );
};

export const useCategoryQuery = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ['categories'],
    queryFn: getAllCategory,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCategoryAndSubQuery = () => {
  return useQuery<CategoriesAndSubResponse>({
    queryKey: ['categoriesAndSub'],
    queryFn: getAllCategoryAndSub,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useSubCategoryQuery = () => {
  return useQuery<SubCategoriesResponse>({
    queryKey: ['subcategories'],
    queryFn: getAllSubCategory,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useFetchCategoryById = (id?: string) => {
  return useQuery({
    queryKey: ['GET_SERVICE_BY_ID', id],
    queryFn: () =>
      id ? getCategoryById(id) : Promise.reject('No ID provided'),
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useFetchServiceDataById = (id?: string) => {
  return useQuery({
    queryKey: ['fetchServiceDataById', id],
    queryFn: () =>
      id ? getServiceDataById(id) : Promise.reject('No ID provided'),
    // staleTime: 5000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useFetchStaffById = (id?: string) => {
  return useQuery({
    queryKey: ['fetchStaffById', id],
    queryFn: () => (id ? getStaffById(id) : Promise.reject('No ID provided')),
    // staleTime: 5000,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};
