/* eslint-disable @typescript-eslint/no-explicit-any */
// reducer.ts
import { AnyAction } from 'redux';
import actions from './actions';

interface ServiceState {
  data: any[]; // Adjust this type if you know what data structure you're expecting
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  data: [],
  loading: false,
  error: null,
};

// Reducer function
const getAllServiceReducer = (
  state = initialState,
  action: AnyAction
): ServiceState => {
  const { type, payload, error } = action;
  switch (type) {
    case actions.GET_ALL_SERVICE_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actions.GET_ALL_SERVICE_SUCCESS:
      return {
        ...state,
        data: payload,
        loading: false,
        error: null,
      };
    case actions.GET_ALL_SERVICE_ERR:
      return {
        ...state,
        error,
        loading: false,
      };
    default:
      return state;
  }
};

export { getAllServiceReducer };
