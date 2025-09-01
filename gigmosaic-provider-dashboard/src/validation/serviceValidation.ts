import * as yup from "yup";
import {
  // additionalServiceRule,
  // amountRule,
  // includesRule,
  serviceCategoryRule,
  serviceOverviewRule,
  serviceSlugRule,
  serviceSubCategoryRule,
  serviceTitleRule,
  // metaTitleRule,
  // metaDescriptionRule,
  // metaKeywordsRule,
  cityRule,
  stateRule,
  countryRule,
  addressRule,
  pincodeRule,
  latitudeRule,
  longitudeRule,
  faqRule,
  // additionalInfoRule,
} from "./ValidationRules";

const serviceValidation = yup.object().shape({
  basicInfo: yup.object().shape({
    serviceTitle: serviceTitleRule,
    slug: serviceSlugRule,
    categoryId: serviceCategoryRule,
    subCategoryId: serviceSubCategoryRule,
    // price: amountRule,
    serviceOverview: serviceOverviewRule,
  }),

  // metaDetails: yup.object().shape({
  //   metaTitle: metaTitleRule,
  //   metaDescription: metaDescriptionRule,
  //   // metaKeywords: metaKeywordsRule,
  // }),

  location: yup.object().shape({
    city: cityRule,
    state: stateRule,
    country: countryRule,
    pinCode: pincodeRule,
    address: addressRule,
    latitude: latitudeRule,
    longitude: longitudeRule,
  }),

  faq: faqRule,

  // addtionalInfo: additionalInfoRule,

  availability: yup.array().of(
    yup.object().shape({
      day: yup.string().required("Day is required"),
      from: yup.string().required("From time is required"),
      to: yup.string().required("To time is required"),
      maxBookings: yup
        .number()
        .required("Slot is required")
        .positive("Slot must be positive number"),
    })
  ),

  include: yup
    .array()
    .nullable()
    .of(yup.string().min(3, "Include must be at least 3 characters long"))
    .test("min-items", " At least one include is required", (value) => {
      return (
        value === null ||
        value.length === 0 ||
        value.every((item) => item.length >= 3)
      );
    }),

  gallaryData: yup.object().shape({
    images: yup.array().ensure().min(1, "At least one image is required"),
    videoLink: yup.string().url("Enter valid YouTube video link").nullable(),
  }),
});

export default serviceValidation;
