import * as yup from "yup";
import {
  addressRule,
  cityRule,
  emailRule,
  nameRule,
  noteRule,
  phoneNoRule,
  pincodeRule,
  stateRule,
} from "./ValidationRules";

export const bookingSchema = yup.object().shape({
  staffId: yup.string().required("Staff is required"),
  serviceId: yup.string().required("Service is required"),
  appointmentDate: yup.string().required("Appointment date is required"),
  appointmentTimeFrom: yup.string().required("Start time is required"),
  appointmentTimeTo: yup.string().required("End time is required"),
  additionalServiceIds: yup.array().of(yup.string()),

  personalInfo: yup.object().shape({
    firstName: nameRule,
    lastName: nameRule,
    phone: phoneNoRule,
    email: emailRule,
    bookingNotes: noteRule,
    address: yup.object().shape({
      street: addressRule,
      city: cityRule,
      state: stateRule,
      postalCode: pincodeRule,
    }),
  }),

  paymentMethod: yup.string().required("Payment method is required"),
  isPaid: yup.boolean(),
  subtotal: yup.number().required(),
  tax: yup.number().required(),
  discount: yup.number(),
  total: yup.number().required(),
});
