import * as yup from "yup";
import moment, { min } from "moment";

export const serviceTitleRule = yup
  .string()
  .required("Service Title is required")
  .min(3, "Service Title is too short")
  .max(100, "Service  must be less than 100 characters");

export const serviceSlugRule = yup
  .string()
  .required("Slug is required")
  .min(3, "Slug is too short")
  .max(100, "Slug is too long");

export const serviceCategoryRule = yup
  .string()
  .required("Category is required");

export const serviceSubCategoryRule = yup
  .string()
  .required("Sub-Category is required");

export const serviceDurationRule = yup
  .number()
  .typeError("Duration must be a valid number")
  .required("Duration is required")
  .positive("Duration must be greater than 0");

export const priceRule = yup
  .number()
  // .required("Price is required")
  // .positive("Price must be greater than 0");
  // .transform((val) => (val === "" ? null : val))
  .typeError("Price must be a valid number")
  .test("Price", "Invalid price", function (value) {
    const isPackage = this.options.context?.isPackage;
    if (isPackage) return true;

    if (!value) return this.createError({ message: "Price is required" });
    if (Number(value) <= 0)
      return this.createError({
        message: "Price must be greater than 0",
      });
    if (Number(value) > 1000000)
      return this.createError({
        message: "Price must be less than $1M",
      });

    return true;
  });

export const descriptionRule = yup.string();

export const offerTypeRule = yup.string().required("Offer Type is required");

export const offerAmountRule = yup
  .number()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("Offer Amount must be a valid number")
  .positive("Offer Amount must be greater than 0")
  .nullable();

export const offerDurationTypeRule = yup
  .string()
  .typeError("Offer Duration Type must be a valid text")
  .required("Offer Duration Type is required");

export const offerDurationRule = yup
  .string()
  .typeError("Offer Duration must be a valid text")
  .required("Offer Duration is required");

export const afterDiscountAmountRule = yup
  .number()
  .typeError("After Discount Amount  must be a valid number")
  .required("After Discount Amount is required")
  .positive("After Discount Amount must be greater than 0");

export const isActiveRule = yup.boolean().required("Is Active is required");

export const serviceProviderRule = yup
  .string()
  .required("Service Provider is required");

export const serviceOverviewRule = yup
  .string()
  .required("Service Overview is required")
  .min(10, "Service Overview is too short")
  .max(3000, "Service Overview is too long");

export const staffRule = yup
  .array()
  .min(1, "Staff is required")
  .required("Staff is required");

export const includesRule = yup
  .array()
  .required("Includes is required")
  .max(5, "Includes must be less than 5")
  .nullable();

export const additionalServiceRule = yup
  .array()
  .of(
    yup.object().shape({
      serviceItem: yup
        .string()
        .required("Title is required")
        .max(80, "Title is too long")
        .min(2, "Title is too short"),
      price: yup
        .number()
        .required("Price is required")
        .moreThan(0, "Price must be greater than 0"),
      duration: yup
        .number()
        .required("Duration is required")
        .moreThan(0, "Duration must be greater than 0"),
      images: yup.mixed().required("Image is required"),
    })
  )
  .nullable();

// export const faqRule = yup
//   .array()
//   .nullable()
//   .test(
//     "min-items",
//     "Question and answer must be at least 3 characters long",
//     (value) => {
//       return (
//         !value ||
//         value.length === 0 ||
//         value.some(
//           (faq) => faq.question?.length >= 3 && faq.answer?.length >= 3
//         )
//       );
//     }
//   );

// export const additionalInfoRule = yup.array().of(
//   yup.object().shape({
//     id: yup
//       .number()
//       .required("ID is required")
//       .positive("ID must be a positive number"),

//     serviceItem: yup
//       .string()
//       .min(3, "Service Item must be at least 3 characters long")
//       .required("Service Item is required"),

//     price: yup
//       .number()
//       .positive("Price must be a positive number")
//       .required("Price is required"),

//     images: yup
//       .mixed()
//       .required("Image is required")
//       .test(
//         "fileSize",
//         "Image size must be less than 5MB",
//         (value) => value && value.size <= 5 * 1024 * 1024 // Image size check
//       )
//       .test(
//         "fileType",
//         "Only JPEG and PNG formats are supported",
//         (value) => value && ["image/jpeg", "image/png"].includes(value.type) // File type check
//       ),
//   })
// );

export const metaTitleRule = yup
  .string()
  .typeError("Meta Title must be a valid text")
  .required("Meta Title is required")
  .min(3, "Meta Title is too short")
  .max(160, "Meta Title is too long");

export const metaDescriptionRule = yup
  .string()
  .typeError("Meta Description  must be a valid text")
  .required("Meta Description is required")
  .min(3, "Meta Description is too short")
  .max(160, "Meta Description must be less than 160");

export const metaKeywordsRule = yup
  .array()
  .of(
    yup
      .string()
      .trim()
      .matches(
        /^[a-zA-Z0-9.-]+$/,
        "Keywords can only contain letters, numbers, dots, and hyphens"
      )
      .min(1, "Each keyword must not be empty")
  )
  .required("Meta Keywords are required")
  .min(1, "At least one meta keyword is required")
  .max(10, "Meta Keywords must be less than 10");

export const videoLinkRule = yup.string().required("Video Link is required");

//SERVICE INCLUDE
export const serviceIncludeRule = yup.array().of(
  yup
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .min(3, "Include is too short")
    .max(40, "Include must be less than 40 characters")
);

//PERSONAL
export const nameRule = yup
  .string()
  .required("Name is required")
  .matches(/^[A-Za-z\s]+$/, "Name must contain only letters")
  .min(3, "Name is too short")
  .max(30, "Name must be less than 30 characters");

export const emailRule = yup
  .string()
  .required("Email is required")
  .email("Email is not valid");

export const phoneNoRule = yup
  .string()
  .required("Phone Number is required")
  .matches(
    /^(?:\+1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/,
    "Phone Number is not valid"
  );

// ADDRESS
export const addressRule = yup
  .string()
  .required("Address is required")
  .min(3, "Address is too short")
  .max(100, "Address must be less than 100 characters");

export const countryRule = yup
  .string()
  .matches(/^[A-Za-z\s]+$/, "Country must contain only letters")
  .required("Country is required")
  .min(3, "Country is too short")
  .max(20, "Country  must be less than 20 characters");

export const cityRule = yup
  .string()
  .required("City is required")
  .matches(/^[A-Za-z\s]+$/, "City must contain only letters")
  .min(3, "City is too short ")
  .max(20, "City must be less than 20 characters");

export const stateRule = yup
  .string()
  .required("State is required")
  .matches(/^[A-Za-z\s]+$/, "State must contain only letters")
  .min(3, "State is too short")
  .max(20, "State  must be less than 20 characters");

export const pincodeRule = yup
  .string()
  .required("Pincode is required")
  .matches(
    /^([ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ])\s*([0-9][ABCEGHJKLMNPRSTVWXYZ][0-9])$/i,
    "Pincode must be valid"
  );

export const latitudeRule = yup
  .number()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("Latitude must be a valid number")
  .nullable();

export const longitudeRule = yup
  .number()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .typeError("Longitude must be a valid number")
  .nullable();

export const googleMapIdRule = yup
  .string()
  .max(200, "Google Map Id is too long")
  .typeError("Google Map Id must be a valid string")
  .nullable();

//NOTE
export const noteRule = yup
  .string()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .min(3, "Note is too short")
  .max(200, "Note must be less than 200 characters");

//IS FAQ  --------------> COMBINE WITH FAQ
export const isFaqRule = yup.boolean().default(false);

//IS FAQ  --------------> COMBINE WITH ADDTIONAL SERVICE
export const isAddtionalRule = yup.boolean().default(false);

//FAQ
export const faqRule = yup.array().of(
  yup.object().shape({
    question: yup
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .test(
        "isFaqValidation",
        "Question is required and must be 3-100 characters",
        function (value) {
          const isFaq = this.options.context?.isFaq; //Referance ---> AddService.tsx ---> react hook form in top
          if (!isFaq) return true;

          if (!value)
            return this.createError({ message: "Question is required" });
          if (value.length < 3)
            return this.createError({
              message: "Question must be at least 3 characters",
            });
          if (value.length > 100)
            return this.createError({
              message: "Question must be at most 100 characters",
            });

          return true;
        }
      ),

    answer: yup
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .test(
        "isFaqValidation",
        "Answer is required and must be 3-100 characters",
        function (value) {
          const isFaq = this.options.context?.isFaq;
          if (!isFaq) return true;

          if (!value)
            return this.createError({ message: "Answer is required" });
          if (value.length < 3)
            return this.createError({
              message: "Answer must be at least 3 characters",
            });
          if (value.length > 100)
            return this.createError({
              message: "Answer must be at most 100 characters",
            });

          return true;
        }
      ),
  })
);

// ADDTIONAL SERVICE
export const additionalServicesRule = yup.array().of(
  yup.object().shape({
    price: yup
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .test("isAddtional", "Invalid price", function (value) {
        const isAddtional = this.options.context?.isAddtional;
        if (!isAddtional) return true;

        if (!value) return this.createError({ message: "Price is required" });
        if (Number(value) <= 0)
          return this.createError({
            message: "Price must be greater than 0",
          });
        if (Number(value) > 1000000)
          return this.createError({
            message: "Price must be less than $1M",
          });

        return true;
      }),

    serviceItem: yup
      .string()
      .nullable()
      .transform((val) => (val === "" ? null : val))
      .test(
        "isAddtional",
        "Service title is required and must be 3-100 characters",
        function (value) {
          const isAddtional = this.options.context?.isAddtional;
          if (!isAddtional) return true;

          if (!value) return this.createError({ message: "Title is required" });
          if (value.length < 3)
            return this.createError({
              message: "Title must be at least 3 characters",
            });
          if (value.length > 30)
            return this.createError({
              message: "Title must be at most 30 characters",
            });

          return true;
        }
      ),

    // images: yup
    //   .mixed()
    //   .nullable()
    //   .transform((val) => (val === "" ? null : val))
    //   .test("isAddtional", "Invalid image", function (value) {
    //     const isAddtional = this.options.context?.isAddtional;
    //     if (!isAddtional) return true;
    //     console.log()
    //     if (!value?.[0]) {
    //       return this.createError({
    //         message: "Image is required",
    //       });
    //     }
    //   }),
  })
);

// GALLRY AND LINK
export const serviceGalleryRule = yup.array().of(
  yup.object().shape({
    serviceImages: yup
      .array()
      .of(yup.mixed())
      .min(1, "At least one image is required"),

    videoLink: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        "Must be a valid YouTube URL"
      )
      .nullable()
      .notRequired(),
  })
);

//COMMON LINK
export const linkRule = yup.string().url("Invalid URL");

//AVAILABILITY
export const availabilityRule = yup.array().of(
  yup.object().shape({
    day: yup.string().required("Day is required"),
    // available: yup.boolean().required(),
    timeSlots: yup.object().shape({
      from: yup
        .string()
        .required("Start time is required")
        .test(
          "is-before-to",
          "Start time must be before end time",
          function (value) {
            const { to } = this.parent;
            if (!to || !value) return true;
            return moment(value, "h:mm a").isBefore(moment(to, "h:mm a"));
          }
        )
        .test(
          "min-duration",
          "Start time must be at least 5 minutes before end time",
          function (value) {
            const { to } = this.parent;
            if (!to || !value) return true;
            return (
              moment(to, "h:mm a").diff(moment(value, "h:mm a"), "minutes") >= 5
            );
          }
        ),

      to: yup
        .string()
        .required("End time is required")
        .test(
          "is-after-from",
          "End time must be after start time",
          function (value) {
            const { from } = this.parent;
            if (!from || !value) return true;
            return moment(value, "h:mm a").isAfter(moment(from, "h:mm a"));
          }
        )
        .test(
          "min-duration",
          "End time must be at least 5 minutes after start time",
          function (value) {
            const { from } = this.parent;
            if (!from || !value) return true;
            return (
              moment(value, "h:mm a").diff(moment(from, "h:mm a"), "minutes") >=
              5
            );
          }
        ),

      maxBookings: yup
        .number()
        .transform((value) => (value === 0 ? null : value))
        .typeError("Slot must be a number")
        .required("Slot is required"),
    }),

    restDuration: yup
      .number()
      .transform((value) => (value === 0 ? null : value))
      .notRequired()
      .typeError("Duration must be a number"),
  })
);
// .test("no-overlap", "Overlapping time slot", function (availability) {
//   const message = getOverlapErrorMessage(availability);
//   return message ? this.createError({ message }) : true;
// });
// .test(
//   "no-overlap",
//   "Time slots must not overlap on the same day",
//   function (availability) {
//     if (!Array.isArray(availability)) return true;

//     const daySlotsMap: Record<
//       string,
//       { from: moment.Moment; to: moment.Moment }[]
//     > = {};

//     for (const item of availability) {
//       if (!item?.day || !item?.timeSlots) continue;

//       const day = item.day;
//       const from = moment(item.timeSlots.from, "h:mm a");
//       const to = moment(item.timeSlots.to, "h:mm a");

//       if (!daySlotsMap[day]) {
//         daySlotsMap[day] = [];
//       }

//       for (const slot of daySlotsMap[day]) {
//         const isOverlap = from.isBefore(slot.to) && to.isAfter(slot.from);
//         if (isOverlap) {
//           return this.createError({
//             // message: `Overlapping time slot found on ${day}`,
//             message: `Overlap on ${day}: ${item.timeSlots.from}–${
//               item.timeSlots.to
//             } conflicts with ${slot.from.format("h:mm a")}–${slot.to.format(
//               "h:mm a"
//             )} (time slots must not overlap).`,
//           });
//         }
//       }

//       daySlotsMap[day].push({ from, to });
//     }

//     return true;
//   }
// );

//LOCATION
export const locationRule = yup.array().of(
  yup.object().shape({
    address: addressRule,
    city: cityRule,
    state: stateRule,
    country: countryRule,
    pinCode: pincodeRule,
    googleMapsPlaceId: googleMapIdRule,
    latitude: latitudeRule,
    longitude: longitudeRule,
  })
);

//PACKAGE INCLUDE
const includeFieldSchema = yup
  .string()
  .nullable()
  .notRequired()
  .test("include", "Invalid include", function (value) {
    const isPackage = this.options.context?.isPackage;

    if (!isPackage) return true;
    if (!value) return true;

    if (value.length < 3) {
      return this.createError({
        message: "Include must be at least 3 characters",
      });
    }
    if (value.length > 30) {
      return this.createError({
        message: "Include must be at most 30 characters",
      });
    }

    return true;
  });

//PACKAGE INCLUDE
const includesSchema = yup.object().shape({
  input1: includeFieldSchema,
  input2: includeFieldSchema,
  input3: includeFieldSchema,
  input4: includeFieldSchema,
});

// PACKAGE
export const packagesRule = yup.array().of(
  yup.object().shape({
    isDiscount: yup.boolean(),
    packageName: yup
      .string()
      .nullable()
      .test("packageName", "Invalid package name", function (value) {
        const isPackage = this.options.context?.isPackage;
        const isDiscount = this.parent.isDiscount;
        console.log("isDiscount: ", isDiscount);
        if (!isPackage) return true;

        if (!value) return this.createError({ message: "Name is required" });
        if (value.length < 3)
          return this.createError({
            message: "Name must be at least 3 characters",
          });
        if (value.length > 30)
          return this.createError({
            message: "Name must be at most 30 characters",
          });

        return true;
      }),

    price: yup
      .string()
      .nullable()
      .test("price", "Invalid price", function (value) {
        const isPackage = this.options.context?.isPackage;
        if (!isPackage) return true;

        if (!value) return this.createError({ message: "Price is required" });
        if (Number(value) <= 0)
          return this.createError({
            message: "Price must be greater than 0",
          });
        if (Number(value) > 1000000)
          return this.createError({
            message: "Price must be less than $1M",
          });

        return true;
      }),

    discount: yup.object().shape({
      isDiscount: yup.boolean().default(false),
      amount: yup
        .string()
        .nullable()
        .test("amount", "Invalid Amount", function (value) {
          const isDiscount = this.parent.isDiscount;

          console.log("is discount package: ", isDiscount);
          if (!isDiscount) return true;
          console.log("VALUE: ", value);

          if (!value)
            return this.createError({ message: "Amount is required" });

          if (Number(value) <= 1) {
            return this.createError({
              message: "Amount must be greater than 0",
            });
          }

          if (Number(value) > 1000000) {
            return this.createError({
              message: "Amount must be less than $1M",
            });
          }
          return true;
        }),

      maxCount: yup
        .string()
        .nullable()
        .notRequired()
        .test("Max Count", "Invalid count", function (value) {
          const isDiscount = this.parent.isDiscount;

          if (!isDiscount) return true;

          if (!value || value === "") return true;

          if (Number(value) > 100000) {
            return this.createError({
              message: "Count must be less than 100000 digits",
            });
          }
          return true;
        }),
    }),
    includes: includesSchema,
  })
);

//DISCOUNT
export const discountRule = yup.object().shape({
  discountType: yup
    .string()
    .nullable()
    .test("discount type", "Invalid discount type", function (value) {
      const isDiscount = this.parent?.isDiscount;

      console.log("Full discount: ", isDiscount);
      if (!isDiscount) return true;
      console.log("VALUE: ", value);

      if (!value)
        return this.createError({ message: "Discount type is required" });

      if (value !== "promo-code" && value !== "general-discount") {
        return this.createError({ message: "Invalid discount type" });
      }
      return true;
    }),

  valueType: yup
    .string()
    .nullable()
    .test(
      "discount value type",
      "Invalid discount value type",
      function (value) {
        const isDiscount = this.parent?.isDiscount;

        console.log("Full discount: ", isDiscount);
        if (!isDiscount) return true;
        console.log("VALUE: ", value);

        if (!value)
          return this.createError({ message: "Discount value is required" });

        if (value !== "percentage" && value !== "amount") {
          return this.createError({ message: "Invalid value type" });
        }
        return true;
      }
    ),

  durationType: yup
    .string()
    .nullable()
    .test(
      "discount duration type",
      "Invalid discount duration type",
      function (value) {
        const isDiscount = this.parent?.isDiscount;

        console.log("Full discount: ", isDiscount);
        if (!isDiscount) return true;
        console.log("VALUE: ", value);

        if (!value)
          return this.createError({ message: "Discount duration is required" });

        if (value !== "life-time" && value !== "time-base") {
          return this.createError({ message: "Invalid duration type" });
        }
        return true;
      }
    ),

  amount: yup
    .string()
    .nullable()
    .test("amount", "Invalid Amount", function (value) {
      const isDiscount = this.parent.isDiscount;

      console.log("Full discount: ", isDiscount);
      if (!isDiscount) return true;
      console.log("VALUE: ", value);

      if (!value) return this.createError({ message: "Amount is required" });

      if (Number(value) <= 1) {
        return this.createError({
          message: "Amount must be greater than 0",
        });
      }
      if (Number(value) > 1000000) {
        return this.createError({
          message: "Amount must be less than $1M",
        });
      }
      return true;
    }),

  promoCode: yup
    .string()
    .nullable()
    .test("amount", "Invalid Code", function (value) {
      const isDiscount = this.parent.isDiscount;
      const isPromoCode = this.parent.discountType;

      console.log("Full isPromoCode: ", isPromoCode);
      if (!isDiscount) return true;
      if (isPromoCode != "promo-code") return true;
      console.log("VALUE: ", value);

      if (!value) return this.createError({ message: "Code is required" });

      if (value.length < 3) {
        return this.createError({
          message: "Code must be at least 3 characters",
        });
      }
      if (value.length > 15) {
        return this.createError({
          message: "Code must be at most 15 characters",
        });
      }
      return true;
    }),

  maxCount: yup
    .string()
    .nullable()
    .notRequired()
    .test("Max Count", "Invalid count", function (value) {
      const isDiscount = this.parent.isDiscount;

      if (!isDiscount) return true;

      if (!value || value === "") return true;

      if (Number(value) > 100000) {
        return this.createError({
          message: "Count must be less than 100000 digits",
        });
      }
      return true;
    }),

  // duration: yup.object().shape({
  //   start: yup
  //     .string()
  //     .nullable()
  //     .notRequired()
  //     .test("Duration start", "Invalid date", function (value) {
  //       const root = this.from?.[this.from.length - 1]?.value.start;
  //       const isDiscount = root?.discount?.isDiscount;
  //       console.log("isDiscount868:", isDiscount);
  //       // console.log("durationType:", durationType);

  //       console.log("START: ", value);
  //       // if (!isDiscount) return true;

  //       // if (!value) {
  //       //   return this.createError({
  //       //     message: "Start date is required",
  //       //   });
  //       // }
  //       // return true;
  //     }),
  // }),

  duration: yup.object().shape({
    start: yup
      .mixed()
      .nullable()
      .test("Duration start", "Invalid date", function (value) {
        const root = this.from?.[this.from.length - 1]?.value;
        const isDiscount = root?.discount?.isDiscount;

        console.log("isDiscount:", isDiscount);
        console.log("start value received:", value);

        if (!isDiscount) return true;

        // Handle if value is an object { start, end }
        if (typeof value === "object" && value !== null) {
          if (!value.start) {
            return this.createError({ message: "Start date is required" });
          }
          // Add object-format specific validation if needed
          return true;
        }

        // Handle if value is a string
        if (typeof value === "string") {
          if (!value.trim()) {
            return this.createError({ message: "Start date is required" });
          }
          // Optionally check date format here
          return true;
        }

        return this.createError({ message: "Invalid date format" });
      }),
  }),
});

// export const availabilityRule = yup.object().shape({
//   availability: yup
//     .object()
//     .test(
//       "at-least-one-valid-day",
//       "At least one day must have a valid time slot.",
//       (value) =>
//         value &&
//         Object.values(value).some(
//           (daySlots) =>
//             Array.isArray(daySlots) &&
//             daySlots.some(
//               (slot) =>
//                 slot.from &&
//                 slot.to &&
//                 slot.slots &&
//                 !isNaN(Number(slot.slots)) &&
//                 Number(slot.slots) > 0
//             )
//         )
//     ),
//   // .required('Availability is required.'),
// });

/////////////////////////new validation

export const basicInfo = yup.object().shape({
  serviceTitle: yup.string().required("Service Title is required"),
});

// export function getOverlapErrorMessage(availability: any[]): string | null {
//   if (!Array.isArray(availability)) return null;

//   const daySlotsMap: Record<
//     string,
//     { from: moment.Moment; to: moment.Moment }[]
//   > = {};

//   for (const item of availability) {
//     if (!item?.day || !item?.timeSlots?.from || !item?.timeSlots?.to) continue;

//     const day = item.day;
//     const from = moment(item.timeSlots.from, "h:mm a");
//     const to = moment(item.timeSlots.to, "h:mm a");

//     if (!daySlotsMap[day]) {
//       daySlotsMap[day] = [];
//     }

//     for (const slot of daySlotsMap[day]) {
//       const isOverlap = from.isBefore(slot.to) && to.isAfter(slot.from);
//       if (isOverlap) {
//         return `Overlap on ${day}: ${item.timeSlots.from}–${
//           item.timeSlots.to
//         } conflicts with ${slot.from.format("h:mm a")}–${slot.to.format(
//           "h:mm a"
//         )} (time slots must not overlap).`;
//       }
//     }

//     daySlotsMap[day].push({ from, to });
//   }

//   return null;
// }

export function getFlatOverlapError(flatSlots: any[]): string | null {
  const daySlotsMap: Record<
    string,
    { from: moment.Moment; to: moment.Moment; rawFrom: string; rawTo: string }[]
  > = {};

  console.log("daySlotsMap: ", daySlotsMap);

  for (const slotObj of flatSlots) {
    const { day, timeSlots } = slotObj;
    if (!day || !timeSlots?.from || !timeSlots?.to) continue;

    const from = moment(timeSlots.from, "h:mm a");
    const to = moment(timeSlots.to, "h:mm a");

    if (!daySlotsMap[day]) {
      daySlotsMap[day] = [];
    }

    for (const existing of daySlotsMap[day]) {
      const isOverlap = from.isBefore(existing.to) && to.isAfter(existing.from);
      if (isOverlap) {
        return `Overlap on ${day}: ${timeSlots.from}–${timeSlots.to} conflicts with ${existing.rawFrom}–${existing.rawTo}`;
      }
    }

    daySlotsMap[day].push({
      from,
      to,
      rawFrom: timeSlots.from,
      rawTo: timeSlots.to,
    });
  }

  return null;
}
