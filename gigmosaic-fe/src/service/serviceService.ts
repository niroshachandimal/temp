/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../api';
import { Path } from '../api/backendUrl';
import logger from '../utils/logger';

export const sumbitServiceData = async (data: any) => {
  try {
    const res = await apiClient.post(
      `${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.updateService}`,
      data
    );
    return res.data;
  } catch (error: any) {
    console.log('Errro submit data: ', error);
    logger.error(error);
    throw error;
  }
};

export const getServiceDataById = async (id: string) => {
  try {
    const res = await apiClient.get(
      `${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.updateService}` +
        `/${id}`
    );
    return res.data;
  } catch (error: any) {
    logger.error(error);
    throw error;
  }
};

export const checkBookingAvailability = async (data: any) => {
  try {
    const res = await apiClient.post(
      `${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.checkBookingAvailability}`,
      data
    );
    return res.data;
  } catch (error: any) {
    console.log('Error booking availability: ', error);
    logger.error(error);
    throw error;
  }
};
