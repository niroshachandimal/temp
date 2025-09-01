import { TimeInputValue } from "@heroui/react";

export interface ISubcategoryProps {
  subCategoryId: string;
  subCategoryName: string;
  subCategorySlug: string;
  subCategoryImage: string;
  categoryId: string;
  createdAt: string;
}

export interface IPageNumberAndLimt {
  page: number;
  limit?: number;
}
export interface IFaqProps {
  question: string;
  answer: string;
}

export interface IGallaryProps {
  images?: File[];
  videoLink?: string;
}

export interface IAvailabilityField {
  id: number;
  day: string | null;
  from: TimeInputValue | null;
  fromFormatted?: string;
  to: TimeInputValue | null;
  toFormatted?: string;
  slot: number | null;
}

export interface IAvailabilityProps {
  day: string;
  available: boolean;
  timeSlots: {
    from: string;
    to: string;
    maxBookings: number;
  }[];
}

export interface ILocationProps {
  address: string;
  country: string;
  city: string;
  state: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  googleMapsPlaceId: string;
}
export interface IServiceProps {
  serviceId: string;
  serviceTitle: string;
  slug: string;
  offerPrice?: number;
  categoryId: string;
  serviceProvider: string;
  subCategoryId: string;
  duration?: number;
  serviceOverview: string;
  price: number;
  staff: string[];
  includes?: string[];
  isActive: boolean;
  gallery: [
    {
      serviceImages: [];
      videoLink: string;
    }
  ];
  location: [
    {
      address: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
      googleMapsPlaceId?: string;
      longitude?: number;
      latitude?: number;
    }
  ];
  additionalServices?: [
    {
      id: string;
      images: File | string;
      price: number;
      serviceItem: string;
    }
  ];
  faq?: [];
  availability: IAvailability[];
  seo?: [
    {
      metaTitle: string;
      metaKeywords: string[];
      metaDescription: string;
    }
  ];
}

export interface IServiceSubmitProps {
  test?: string;
  serviceId: string;
  serviceTitle: string;
  slug: string;
  categoryId: string;
  serviceProvider: string;
  subCategoryId: string;
  serviceOverview: string;
  price: number;
  staff: string[];
  includes?: string[];
  isActive: boolean;
  isfaq?: boolean;
  isPackage: boolean;
  isDiscount?: boolean;
  gallery: [
    {
      serviceImages: [];
      videoLink: string;
    }
  ];
  location: [
    {
      address: string;
      city: string;
      state: string;
      country: string;
      pinCode: string;
      googleMapsPlaceId?: string;
      longitude?: number;
      latitude?: number;
    }
  ];
  isAddtional?: boolean;
  additionalService?: [
    {
      id: string;
      images: File | string;
      price: number;
      serviceItem: string;
    }
  ];
  faq?: IFaq[];
  availability: IAvailability[];
  seo?: [
    {
      metaTitle: string;
      metaKeywords: string[];
      metaDescription: string;
    }
  ];
  discount?: IDiscountProps;
  packages?: IPackageProps[];
}

export interface IFaq {
  question: string;
  answer: string;
}

export interface IAdditionalServicesSubmit {
  id?: string;
  images: [File | string];
  price: number;
  serviceItem: string;
}

export interface IAdditionalServicesResponse {
  id?: string;
  images: string;
  price: number;
  serviceItem: string;
  [key: string]: any;
}
export interface IAvailability {
  day: string;
  available: boolean;
  timeSlots: {
    from: string;
    to: string;
    maxBookings: number;
    restDuration?: number;
  };
}

export interface IResponseAvailability {
  day: string;
  available: boolean;
  timeSlots: {
    from: string;
    to: string;
    maxBookings: number;
    restDuration?: number;
  };
}

export interface IDiscountProps {
  isDiscount: boolean;
  discountType: "promo-code" | "general-discount";
  valueType: "amount" | "percentage";
  durationType: "life-time" | "time-base";
  amount: number;
  duration: {
    start: string;
    end?: string;
  };
  promoCode?: string;
  maxCount?: number;
}

export interface IPackageProps {
  isDiscount: boolean;
  packageName: string;
  price: number;
  includes?: {
    input1?: string;
    input2?: string;
    input3?: string;
    input4?: string;
  };
  discount?: {
    isDiscount?: boolean;
    discountType: "general-discount";
    valueType: "amount" | "percentage";
    durationType: "life-time" | "time-base";
    amount: number;
    duration: {
      start: string;
      end?: string;
    };
    maxCount?: number;
  };
}

//DISCOUNT ADD
export interface IDiscountAddProps {
  serviceId: string;
  isDiscount: boolean;
  discountType: "promo-code" | "general-discount";
  valueType: "amount" | "percentage";
  durationType: "life-time" | "time-base";
  amount: number;
  duration: {
    start: string;
    end?: string;
  };
  promoCode?: string;
  maxCount?: number;
}

export interface IPackageDiscountAddProps {
  serviceId: string;
  packageId: string;
  isDiscount: boolean;
  price: number;
  discount?: {
    isDiscount?: boolean;
    discountType: "general-discount";
    valueType: "amount" | "percentage";
    durationType: "life-time" | "time-base";
    amount: number;
    duration: {
      start: string;
      end?: string;
    };
    maxCount?: number;
  };
}

//CUSTOMER
export interface IPersonalInformationProps {
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bookingNotes?: string;
}

//PROVIDER
export interface IProviderInformationProps {
  name: string;
  mobile: string;
  email: string;
  dateOfBirth: string;
  bio?: string;
  profilePicture: string;
  address: {
    addressLine1: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
  };
  language: string;
  currencyCode: string;
  status: false;
  providerStatus: "approved";
  groupRole: "provider";
}

export interface IBookingProps {
  bookingId: string;
  referenceCode: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  staffId: string;

  additionalServices: {
    id: string;
    serviceItem: string;
    price: number;
    images: string;
    selected: boolean;
  }[];

  appointmentDate: string;
  appointmentTimeFrom: string;
  appointmentTimeTo: string;
  bookingStatus: string;
  personalInfo: IPersonalInformationProps;
  providerAcceptanceDate?: string;
  isPaid: boolean;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  updatedAt: string;

  auditLogs: {
    action: string;
    performedBy: string;
    timestamp: string;
  }[];

  serviceDetails: {
    title: string;
    description: string;
    price: number;
    offerPrice: number;
    priceAfterDiscount: number;
    duration: string;
    includes: string[];
  };
  gallery: {
    serviceImages: [];
  };
}

export interface iStaffGetProps {
  staffId: string;
  providerId: string;
  providerStaffId?: string;
  fullName: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  description?: string;
  serviceIds?: string[];
  status: boolean;
  numberOfCompletedServices: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITimeslotResponse {
  booked: string;
  bookedStaffId: string;
  bookingDate: null;
  bookingId: null;
  bookingStatus: string;
  from: string;
  maxBookings: number;
  referenceCode: string;
  staffStatus: string;
  timeSlotId: string;
  to: string;
}

export interface IStaffHolidayResponse {
  holidayId: string;
  staffId: string;
  staffName: string;
  providerId: string;
  startDate: string;
  endDate: string;
  reason: string;
  approved: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const BookingStatus = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  INPROGRESS: "Inprogress",
  CONFIRMED: "Confirmed",
  // EXPIRED: "EXPIRED",
  // REBOOKED: "REBOOKED",
};

export interface IReshedulePostData {
  bookingId: string;
  staffId: string;
  newDate: string;
  newFrom: string;
  newTo: string;
  note: string;
}

export interface ITimeslotAvailabilityFetchProps {
  date: string;
  serviceId: string;
}

export interface ITimeslotAvailabilityResponseProps {
  timeSlots: [
    timeSlotId: string,
    from: string,
    to: string,
    availableStaff: [
      {
        staffId: string;
        fullName: string;
        providerStaffId: string;
      }
    ]
  ];
}
export type Addon = {
  _id: string;
  name: string;
  quantity: number;
  pricing: {
    amount: number;
  };
};
