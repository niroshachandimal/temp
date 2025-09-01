import * as Yup from 'yup';
import {
  addressRule,
  cityRule,
  countryRule,
  googleMapIdRule,
  latitudeRule,
  longitudeRule,
  pincodeRule,
  stateRule,
} from './ValidationRules';

const locationValidation = Yup.object().shape({
  address: addressRule,
  country: countryRule,
  state: stateRule,
  city: cityRule,
  pincode: pincodeRule,
  latitude: latitudeRule,
  longitude: longitudeRule,
  googleMapId: googleMapIdRule,
});

export default locationValidation;
