import * as yup from 'yup';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const isValidPhone = (value: string) => {
  const phoneNumber = parsePhoneNumberFromString(value);
  return phoneNumber?.isValid() ?? false;
};

export const personalInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .matches(
      /^[a-zA-Z\s]*$/,
      'First name must contain only letters and spaces'
    ),

  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Last name must contain only letters and spaces'),

  email: yup.string().email('Invalid email').required('Email is required'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\+/, 'Phone number must include country code')
    .test('is-valid-phone', 'Enter a valid phone number', isValidPhone),

  streetAddress: yup
    .string()
    .required('Street  is required')
    .min(2, 'Street name must be at least 2 characters')
    .max(50, 'Street name must be at most 50 characters'),

  city: yup
    .string()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(20, 'City must be at most 20 characters')
    .matches(/^[a-zA-Z\s]*$/, 'City must contain only letters and spaces'),

  state: yup
    .string()
    .required('State address is required')
    .min(2, 'State name must be at least 2 characters')
    .max(20, 'State name must be at most 20 characters')
    .matches(
      /^[a-zA-Z\s]*$/,
      'State name must contain only letters and spaces'
    ),

  postalCode: yup
    .string()
    .required('Postal Code  is required')
    .min(2, 'Postal Code  must be at least 2 characters')
    .max(20, 'Postal Code  must be at most 20 characters')
    .matches(
      /^[0-9 a-zA-Z\s]*$/,
      'Postal Code  must contain only letters and spaces'
    ),

  notes: yup
    .string()
    .max(250, 'Notes must be at most 250 characters')
    .optional(),
  // error: yup.boolean().default(false),
});
