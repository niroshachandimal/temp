import * as Yup from 'yup';
import {
  metaDescriptionRule,
  metaKeywordsRule,
  metaTitleRule,
} from './ValidationRules';

const seoValidation = Yup.object().shape({
  metaTitle: metaTitleRule,
  metaDescription: metaDescriptionRule,
  metaKeywords: metaKeywordsRule,
});

export default seoValidation;
