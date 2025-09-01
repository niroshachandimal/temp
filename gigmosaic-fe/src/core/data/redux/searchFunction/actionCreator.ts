/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '../../../../api';
import { FetchSearchDataParams } from '../../../../utils/type';
import actions from './actions';

const { getAllServiceBegin, getAllServiceSuccess, getAllServiceErr } = actions;

// Define the type for the dispatch function
type Dispatch = (action: { type: string; payload?: any }) => void;

// Get all institutes
const getAllService = (params: FetchSearchDataParams) => {
  return async (dispatch: Dispatch): Promise<void> => {
    console.log('Start getAllInstitutes');
    dispatch(getAllServiceBegin());
    console.log('Params:', params);

    const { filter } = params || {};
    console.log('Filters:', filter);
    // const { filter } = params;
    console.log('Query Params:', filter);
    const queryParams = new URLSearchParams(filter).toString();

    try {
      const response = await apiClient.get(
        `${import.meta.env.VITE_APP_BACKEND_SERVICE}/service/getService/?${queryParams}`
      );
      const data = response.data;
      console.log('Institute data', data);
      dispatch(getAllServiceSuccess(data));
    } catch (err: any) {
      console.error('Error:', err.message);

      dispatch(getAllServiceErr(err));
    }
  };
};

export { getAllService };
