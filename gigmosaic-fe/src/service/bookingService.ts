import { apiClient } from '../api';
import { Path } from '../api/backendUrl';

export const getStaffById = async (id: string) => {
  try {
    const res = await apiClient.get(
      `${import.meta.env.VITE_APP_BACKEND_SERVICE}/${Path.getStaff}` + `/${id}`
    );
    return res.data;
  } catch (error: unknown) {
    console.log('ERROR: ', error);
    // logger.error(error);
    throw error;
  }
};
