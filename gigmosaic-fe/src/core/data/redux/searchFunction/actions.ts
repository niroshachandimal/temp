/* eslint-disable @typescript-eslint/no-explicit-any */
// actions.ts
export const actions = {
  GET_ALL_SERVICE_BEGIN: 'GET_ALL_SERVICE_BEGIN',
  GET_ALL_SERVICE_SUCCESS: 'GET_ALL_SERVICE_SUCCESS',
  GET_ALL_SERVICE_ERR: 'GET_ALL_SERVICE_ERR',

  getAllServiceBegin: () => ({
    type: actions.GET_ALL_SERVICE_BEGIN,
  }),

  getAllServiceSuccess: (data: any) => ({
    type: actions.GET_ALL_SERVICE_SUCCESS,
    payload: [data],
  }),

  getAllServiceErr: (error: string) => ({
    type: actions.GET_ALL_SERVICE_ERR,
    payload: error,
  }),
};

export default actions;
