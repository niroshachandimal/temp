import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFaq,
  deleteFaq,
  getAllFaqs,
  updateFaq,
} from "../services/faqService";
import { FAQ } from "../types";

export const useFaqsQuery = (portal: string) => {
  return useQuery({
    queryKey: ["faqs", portal],
    queryFn: () => getAllFaqs(portal),
  });
};

export const useCreateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useUpdateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FAQ> }) =>
      updateFaq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};

export const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};