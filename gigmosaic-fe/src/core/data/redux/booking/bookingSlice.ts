// src/features/booking/bookingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BookingState,
  DateTimeState,
  PersonalInfo,
  Service,
  ServicesState,
  StaffState,
  ServiceBasicDetails,
} from '../../../../utils/type';

const initialState: BookingState = {
  currentStep: 1,
  dateTime: {
    selectedDate: '',
    selectedFromTime: '',
    selectedToTime: '',
    selectedTime: null,
  },
  staff: {
    selectedStaff: '',
    selectAnyone: false,
    allStaff: [],
    availableStaff: [],
    isStaffAvilableInDay: false,
    isStaffAvilableInService: false,
  },
  services: {
    selectedServices: [],
    allServices: [],
    serviceBasicDetails: [],
  },
  personalInfo: {
    addressId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
    error: false,
  },
  selectedService: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    updateDateTime: (state, action: PayloadAction<Partial<DateTimeState>>) => {
      state.dateTime = { ...state.dateTime, ...action.payload };
    },

    updateStaff: (state, action: PayloadAction<Partial<StaffState>>) => {
      state.staff = { ...state.staff, ...action.payload };
    },

    updateServices: (state, action: PayloadAction<Partial<ServicesState>>) => {
      state.services = { ...state.services, ...action.payload };
    },

    updatePersonalInfo: (
      state,
      action: PayloadAction<Partial<PersonalInfo>>
    ) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },

    // addServiceBasicDetails: (
    //   state,
    //   action: PayloadAction<ServiceBasicDetails>
    // ) => {
    //   state.services.serviceBasicDetails.push(action.payload);
    // },
    addServiceBasicDetails: (
      state,
      action: PayloadAction<ServiceBasicDetails>
    ) => {
      const alreadyExists = state.services.serviceBasicDetails.some(
        (service) => service.serviceId === action.payload.serviceId
      );

      if (!alreadyExists) {
        state.services.serviceBasicDetails.push(action.payload);
      }
    },

    selectService: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;

      // If service requires staff, filter available staff
      if (action.payload.requiresStaff) {
        state.staff.availableStaff = state.staff.allStaff.filter((staff) =>
          staff.services?.includes(action.payload.id)
        );
      } else {
        state.staff.availableStaff = [];
        // state.staff.selectedStaff = null;
        state.staff.selectedStaff = '';
      }

      // Reset selected services and add the main service
      state.services.selectedServices = [action.payload.id];
    },

    addAdditionalService: (state, action: PayloadAction<string>) => {
      if (!state.services.selectedServices.includes(action.payload)) {
        state.services.selectedServices.push(action.payload);
      }
    },

    removeAdditionalService: (state, action: PayloadAction<string>) => {
      state.services.selectedServices = state.services.selectedServices.filter(
        (id) => id !== action.payload
      );
    },

    resetSelectedTime: (state) => {
      state.dateTime.selectedFromTime = '';
      state.dateTime.selectedToTime = '';
    },

    resetBooking: () => initialState,

    // New action to handle service selection flow
    initializeServiceBooking: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;
      state.currentStep = 1;

      // Set up staff availability if needed
      if (action.payload.requiresStaff) {
        state.staff.availableStaff = state.staff.allStaff.filter((staff) =>
          staff.services?.includes(action.payload.id)
        );
      } else {
        state.staff.availableStaff = [];
        // state.staff.selectedStaff = null;
        state.staff.selectedStaff = '';
      }

      // Initialize with the main service selected
      state.services.selectedServices = [action.payload.id];
    },
  },
});

export const {
  setCurrentStep,
  updateDateTime,
  updateStaff,
  updateServices,
  updatePersonalInfo,
  selectService,
  addAdditionalService,
  removeAdditionalService,
  resetBooking,
  initializeServiceBooking,
  addServiceBasicDetails,
  resetSelectedTime,
} = bookingSlice.actions;

export default bookingSlice.reducer;
