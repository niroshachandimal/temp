import * as Yup from 'yup';
import { linkRule } from './ValidationRules';

const gallaryValidation = Yup.object().shape({
  videoLink: linkRule,
  //   images: imageRule,
});

export default gallaryValidation;
