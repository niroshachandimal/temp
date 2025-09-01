export interface Category {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryImage: string;
  createdAt: string;
  isFeatured: boolean;
  isCertificateRequired: boolean;
}

export interface SubCategory {
  subCategoryId: string;
  categoryId: string;
  subCategoryName: string;
  subCategorySlug: string;
  categoryName: string;
  subCategoryImage: string;
  createdAt: string;
}

export interface CategoriesModalProps {
  editCategoryData?: {
    id?: string;
    category: string;
    categorySlug: string;
    categoryImage?: string;
    featured: boolean;
    certificate: boolean;
    createdAt: string;
  };
}

export interface SubCategoriesModalProps {
  editSubCategoryData?: {
    id?: string;
    categoryId: string;
    subCategory: string;
    subCategorySlug: string;
    subCategoryImage?: string | null;
  };
}

export interface CategoriesResponse {
  success: boolean;
  categories: Category[];
  total: number;
  page: number;
  pages: number;
}

export interface SubCategoriesResponse {
  success: boolean;
  subCategories: SubCategory[];
  total: number;
  page: number;
  pages: number;
}

export interface SubCategoryProps {
  editSubCategoryData?: EditSubCategoryData;
  onSuccess?: () => void;
  isModalOpen: boolean;
}

export interface EditSubCategoryData {
  id?: string;
  categoryId: string;
  subCategory: string;
  subCategorySlug: string;
  subCategoryImage?: string | null;
  createdAt: string;
}

export interface FAQ {
  _id: string;
  faqId: string;
  category: "customer" | "provider" | "general";
  question: string;
  answer: string;
  isEnabled: boolean;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQsResponse {
  success: boolean;
  faqs: FAQ[];
  total?: number;
  page?: number;
  pages?: number;
}
