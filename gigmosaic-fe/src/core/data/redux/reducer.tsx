/* eslint-disable @typescript-eslint/no-explicit-any */
// import initialState from './initial.values';

// const rootReducer: any = (state = initialState, action: any) => {
//   switch (action.type) {
//     case 'GET_ALL_SERVICE_SUCCESS':
//       return { ...state, searchData: action.payload };
//     default:
//       return state;
//   }
// };

// export default rootReducer;


import { combineReducers } from 'redux';
import { getAllServiceReducer } from './searchFunction/reducers';
import  bookingReducer  from './booking/bookingSlice';
 // Make sure this is correct

const rootReducer = combineReducers({
  searchData: getAllServiceReducer,
  booking: bookingReducer
});

export type RootState = ReturnType<typeof rootReducer>; // Get the RootState type
export default rootReducer;
