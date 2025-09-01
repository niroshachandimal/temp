/* eslint-disable @typescript-eslint/no-explicit-any */
// export interface Filters {
//   priceRange?: number | number[];
//   page?: number;
//   search: string;
//   limit?: number;
//   ratingValues?: number | null;
//   state: string;
// }

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface FetchSearchDataParams {
  filter: Record<string, any>; // Adjust this type based on your API's expected filter structure
}

export interface FetchSearchDataResponse {
  data: any; // Replace `any` with the actual data structure returned by your API
}

export interface SlideProps {
  image: string;
  title: string;
  description: string;
  button?: string;
}

export interface SubCategoriesResponse {
  success: boolean;
  subCategories: SubCategory[];
  total: number;
  page: number;
  pages: number;
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  total: number;
  page: number;
  pages: number;
}

export interface CategoriesAndSubResponse {
  success: boolean;
  categoriesWithSubCategories: CategoryWithSub[];
  total: number;
  page: number;
  pages: number;
}

export interface Filters {
  // keyword: string;
  search: string;
  categories: string[];
  subCategory: string | string[];
  // location: string;
  state: string;
  priceRange: number[];
  ratings: number[];
  page?: number;
}

export interface SubCategory {
  subCategoryId: string;
  subCategoryName: string;
  subCategorySlug: string;
  categoryName: string;
  categoryId: string;
  createdAt: string;
  isFeatured: boolean;
  isCertificateRequired: boolean;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  createdAt: string;
  isFeatured: boolean;
  isCertificateRequired: boolean;
}

export interface CategoryWithSub {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  subCategories: SubCategory[];
  createdAt: string;
  isFeatured: boolean;
  isCertificateRequired: boolean;
}

export interface ServiceData {
  gallery: { serviceImages: string[] }[];
  serviceTitle: string;
  location: {
    city: string;
    state: string;
  }[];
  price: number;
  categoryId: string;
  serviceId: number;
  slug: string;
}

// src/features/booking/types.ts

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  serviceCount: number;
  rating: number;
  image: string;
  services?: string[]; // Array of service IDs this staff can perform
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  rating: number;
  image: string;
  requiresStaff?: boolean; // Whether this service requires staff selection
}

export interface DateTimeState {
  selectedDate: string;
  selectedFromTime: string;
  selectedToTime: string;
  selectedTime: string | null;
}

export interface StaffState {
  // selectedStaff: StaffMember | null;
  selectedStaff: string;
  selectAnyone: boolean;
  allStaff: StaffMember[];
  availableStaff?: StaffMember[]; // Staff available for selected service
  isStaffAvilableInDay?: boolean; // Flag to check if staff is available on selected date
  isStaffAvilableInService?: boolean; // Flag to check if staff is available on selected time
}

export interface ServicesState {
  selectedServices: string[];
  allServices: Service[];
  // additionalServices: AdditionalServiceData[];
  serviceBasicDetails: ServiceBasicDetails[];
}

export interface PersonalInfo {
  addressId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
  address_line_1?: unknown;
  error: boolean;
}

export interface BookingState {
  currentStep: number;
  dateTime: DateTimeState;
  staff: StaffState;
  services: ServicesState;
  personalInfo: PersonalInfo;
  selectedService?: Service | null;
}

export interface AdditionalServiceData {
  id: string;
  price: number;
  serviceItem: number;
  images: string;
  // rating: number;
  // requiresStaff: boolean;
}

export interface ServiceBasicDetails {
  serviceId: string;
  providerId: string;
  serviceTitle: string;
  categoryId: string;
  subCategoryId: string;
  price: number;
  isOffers: boolean;
  isAdditional: boolean;
  serviceImages: string;
  city: string;
  state: string;
  country: string;
  staff: string;
  referenceCode?: string;
  availableDate: [];
}
