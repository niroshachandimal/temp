import {
  IDiscountAddProps,
  IProviderInformationProps,
  IServiceSubmitProps,
} from "../types";

//SERVICE ADD
export const defaultServiceValues: IServiceSubmitProps = {
  test: "",
  serviceId: "",
  serviceTitle: "",
  slug: "",
  categoryId: "",
  subCategoryId: "",
  serviceProvider: "",
  serviceOverview: "",
  price: 0,
  staff: [],
  includes: [],
  isActive: true,
  isPackage: false,
  isDiscount: false,
  gallery: [
    {
      serviceImages: [],
      videoLink: "",
    },
  ],
  location: [
    {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      googleMapsPlaceId: "",
      longitude: 0,
      latitude: 0,
    },
  ],
  isAddtional: false,
  additionalService: [
    {
      id: "",
      images: "",
      price: 0,
      serviceItem: "",
    },
  ],
  faq: [{ question: "", answer: "" }],

  isfaq: false,

  availability: [
    {
      day: "",
      available: false,
      timeSlots: {
        from: "",
        to: "",
        maxBookings: 0,
        restDuration: 0,
      },
    },
  ],

  seo: [
    {
      metaTitle: "",
      metaKeywords: [],
      metaDescription: "",
    },
  ],

  discount: {
    isDiscount: false,
    discountType: "general-discount",
    valueType: "percentage",
    durationType: "life-time",
    amount: 0,
    promoCode: "",
    maxCount: 0,
    duration: {
      start: "",
      end: "",
    },
  },

  packages: [
    {
      isDiscount: false,
      packageName: "",
      price: 0,
      // includes: [],
      includes: {
        input1: "",
        input2: "",
        input3: "",
        input4: "",
      },
      discount: {
        isDiscount: false,
        discountType: "general-discount",
        valueType: "percentage",
        durationType: "life-time",
        amount: 0,
        duration: {
          start: "",
          end: "",
        },
        maxCount: 0,
      },
    },
  ],
};

//DISCOUNT ADD
export const discountAddDefaultValue: IDiscountAddProps = {
  serviceId: "",
  isDiscount: false,
  discountType: "general-discount",
  valueType: "percentage",
  durationType: "life-time",
  amount: 0,
  promoCode: "",
  maxCount: 0,
  duration: {
    start: "",
    end: "",
  },
};

//PROVIDER

export const providerDefaultValue: IProviderInformationProps = {
  name: "",
  mobile: "",
  email: "",
  dateOfBirth: "",
  bio: "",
  profilePicture: "",
  address: {
    addressLine1: "",
    country: "",
    state: "",
    city: "",
    postalCode: "",
  },
  language: "",
  currencyCode: "",
  status: false,
  providerStatus: "approved",
  groupRole: "provider",
};
