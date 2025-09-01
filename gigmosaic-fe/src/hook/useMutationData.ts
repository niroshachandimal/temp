/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import {
  checkBookingAvailability,
  sumbitServiceData,
} from '../service/serviceService';
import logger from '../utils/logger';

// SERVICE
export const useSumbitServiceMutation = () => {
  return useMutation({
    mutationFn: sumbitServiceData,
    onSuccess: () => {
      localStorage.removeItem('information');
      localStorage.removeItem('availability');
      localStorage.removeItem('location');
      localStorage.removeItem('seo');
    },
    onError: (error: any) => {
      logger.error('Failed to submit service data:', error);

      const errorMessage =
        error?.response?.data?.errors ||
        error ||
        'An error occurred while submitting service data.';
      console.log(errorMessage);
    },
  });
};

export const useCheckBookingAvailability = () => {
  return useMutation({
    mutationFn: checkBookingAvailability,
    onSuccess: () => {},
    onError: (error: any) => {
      logger.error('Failed to submit service data:', error);

      const errorMessage =
        error?.response?.data?.errors ||
        error ||
        'An error occurred while submitting service data.';
      console.log(errorMessage);
    },
  });
};
