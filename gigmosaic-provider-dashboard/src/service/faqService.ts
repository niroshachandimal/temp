import { apiClient } from "../api/axios/apiClient";

export interface FAQ {
  _id: string;
  faqId: string;
  category: "customer" | "provider" | "general";
  question: string;
  answer: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQSearchResponse {
  query: any;
  query: string;
  success: boolean;
  faqs: FAQ[];
  count: number;
}

export const searchFaqs = async (query: string): Promise<FAQSearchResponse> => {
  const response = await apiClient.get(
    `/api/v1/faq/search?category=provider&query=${encodeURIComponent(query)}`
  );
  return response.data;
};
