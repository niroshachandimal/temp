import * as Yup from 'yup';
import { faqRule } from './ValidationRules';

const faqValidation = Yup.object().shape({
  faq: faqRule,
});

export default faqValidation;
