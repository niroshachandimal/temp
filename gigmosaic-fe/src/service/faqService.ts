import { apiClient } from '../api';

export interface FAQ {
  _id: string;
  faqId: string;
  category: 'customer' | 'provider' | 'general';
  question: string;
  answer: string;
  isEnabled: boolean;
  user?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQResponse {
  success: boolean;
  faqs: FAQ[];
  count: number;
}

export interface FAQSearchResponse {
  success: boolean;
  faqs: FAQ[];
  count: number;
  query: string;
}

export const getFaqs = async (
  category: 'customer' | 'provider'
): Promise<FAQResponse> => {
  try {
    const response = await apiClient.get(
      `/api/v1/faq/category?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
};

export const searchFaqs = async (
  category: 'customer' | 'provider',
  query: string
): Promise<FAQSearchResponse> => {
  try {
    const response = await apiClient.get(
      `/api/v1/faq/search?category=${category}&query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching FAQs:', error);
    throw error;
  }
};
