import moment from "moment";
import {
  IAvailabilityField,
  IServiceProps,
  IAvailabilityProps,
  ILocationProps,
  IResponseAvailability,
  IAdditionalServicesSubmit,
  IAdditionalServicesResponse,
  IAvailability,
  IPackageProps,
  IDiscountProps,
} from "../types";
import { convertReadableTimeToTimeObject } from "./convertTime";
import { uploadFileToS3 } from "./s3FileUploader";

interface TimeSlot {
  from: string;
  to: string;
  maxBookings: number;
}

type RawAvailability = {
  day: string;
  available: boolean;
  timeSlots: {
    from: string;
    to: string;
    maxBookings: string | number;
    restDuration?: string | number;
  };
}[];

type FormattedAvailability = {
  day: string;
  available: boolean;
  timeSlots: {
    from: string;
    to: string;
    maxBookings: number;
  }[];
}[];

export const convertToTagsArray = (tags: string) => {
  return tags.split(",").map((tag) => tag.trim());
};

export const formatServiceData = (
  basicInfo: IServiceProps,
  staff: string[],
  updatedAdditionalInfo: {
    id: number;
    image: string;
    serviceItem: string;
    price: number;
  }[],
  include: string[],
  faq: { question: string; answer: string }[],
  // metaDetails: {
  //   metaTitle: string;
  //   metaKeywords: string[];
  //   metaDescription: string;
  // },
  location: ILocationProps | undefined,
  formatGallary: { images: string[]; videoLink: string },
  Availability: IAvailabilityProps[] | undefined,
  isActive: boolean,
  isUpdate?: boolean
) => {
  const formattedAvailability = Availability
    ? Availability.reduce(
        (acc, { day, available = true, from, to, maxBookings }) => {
          const fromTime = moment(from, ["HH:mm", "h:mm A"]).format("hh:mm A");
          const toTime = moment(to, ["HH:mm", "h:mm A"]).format("hh:mm A");

          const existingEntry = acc.find((entry) => entry.day === day);
          const newTimeSlot = { from: fromTime, to: toTime, maxBookings };

          if (existingEntry) {
            existingEntry.timeSlots.push(newTimeSlot);
          } else {
            acc.push({
              day,
              available,
              timeSlots: [newTimeSlot],
            });
          }

          return acc;
        },
        [] as {
          day: string;
          available: boolean;
          timeSlots: { from: string; to: string; maxBookings: number }[];
        }[]
      )
    : [];

  return {
    serviceTitle: basicInfo.serviceTitle || "",
    slug: (basicInfo?.slug || "").trim().replace(/\s+/g, "_"),
    categoryId: basicInfo.categoryId || "",
    subCategoryId: basicInfo.subCategoryId || "",
    serviceOverview: basicInfo?.serviceOverview || "",
    price: Number(basicInfo?.price) || 0,
    // staff: ["G_UID_73"],
    staff: staff || [],
    includes: include || [],
    isActive: isActive ?? true,
    gallery: [
      {
        serviceImages: formatGallary?.images || [],
        videoLink: formatGallary?.videoLink || "",
      },
    ],
    location: [
      {
        address: isUpdate ? location?.address || "" : location?.address || "",
        city: isUpdate ? location?.city || "" : location?.city || "",
        state: isUpdate ? location?.state || "" : location?.state || "",
        country: isUpdate ? location?.country || "" : location?.country || "",
        pinCode: isUpdate ? location?.pinCode || "" : location?.pinCode || "",
        googleMapsPlaceId: isUpdate
          ? location?.googleMapsPlaceId || ""
          : location?.googleMapsPlaceId || "",
        longitude: isUpdate
          ? location?.coordinates?.longitude || ""
          : location?.longitude || 0,
        latitude: isUpdate
          ? location?.coordinates?.latitude || ""
          : location?.latitude || 0,
      },
    ],
    additionalService: updatedAdditionalInfo || [],
    faq: faq || [],
    availability: formattedAvailability,
    // seo: [metaDetails],
  };
};

export const formatAvailabilityPayload = (fields: IAvailabilityField[]) => {
  const availabilityMap: Record<
    string,
    { day: string; available: boolean; timeSlots: TimeSlot[] }
  > = {};

  const isAllDay = fields?.every((field) => field.day === "all-date");

  const isTimeOverlap = (existingSlots: TimeSlot[], newSlot: TimeSlot) => {
    const newFromTime = moment(newSlot.from, "HH:mm");
    const newToTime = moment(newSlot.to, "HH:mm");

    return existingSlots.some(({ from, to }) => {
      const existingFromTime = moment(from, "HH:mm");
      const existingToTime = moment(to, "HH:mm");

      return (
        newFromTime.isBetween(
          existingFromTime,
          existingToTime,
          undefined,
          "[)"
        ) || // Overlaps at the start
        newToTime.isBetween(
          existingFromTime,
          existingToTime,
          undefined,
          "(]"
        ) || // Overlaps at the end
        (newFromTime.isSameOrBefore(existingFromTime) &&
          newToTime.isSameOrAfter(existingToTime)) // Encloses an existing slot
      );
    });
  };

  let errors: string[] = [];

  for (const { day, maxBookings, from, to, slot } of fields) {
    if (!day || !maxBookings || !from || !to || slot === null) continue;

    // Function to parse time in both 24-hour and 12-hour formats
    const parseTime = (time: string) => {
      let parsedTime = moment(time, "HH:mm", true); // Try 24-hour format
      if (!parsedTime.isValid()) {
        parsedTime = moment(time, "hh:mm A", true); // Try 12-hour format
      }
      return parsedTime;
    };

    const fromTime = parseTime(from);
    const toTime = parseTime(to);

    // Ensure time conversion was successful
    if (!fromTime.isValid() || !toTime.isValid()) {
      console.error("Invalid time format:", { from, to });
      errors.push("Invalid time format.");
      continue; // Skip this entry instead of returning
    }

    // Ensure the availability map is initialized for the day
    if (!availabilityMap[day]) {
      availabilityMap[day] = {
        day,
        available: true,
        timeSlots: [],
      };
    }

    const newSlot = {
      from: fromTime.format("HH:mm"), // Convert to 24-hour format
      to: toTime.format("HH:mm"),
      maxBookings: maxBookings,
    };

    // console.log("New slot: ", newSlot);

    // Check if the new slot overlaps with existing ones
    if (isTimeOverlap(availabilityMap[day].timeSlots, newSlot)) {
      errors.push("Time slots cannot overlap.");
      continue; // Skip adding this slot
    }

    // Check if end time is later than start time
    if (!toTime.isAfter(fromTime)) {
      errors.push("End time must be later than start time.");
      continue; // Skip adding this slot
    }

    // Update availability map
    availabilityMap[day] = {
      ...availabilityMap[day], // Preserve existing data
      timeSlots: [...availabilityMap[day].timeSlots, newSlot], // Append new slot
    };
  }

  if (errors.length > 0) {
    return {
      allDay: isAllDay,
      isValid: false,
      errors, // Return all collected errors
    };
  }

  // return Object.values(availabilityMap);
  return {
    allDay: isAllDay,
    isValid: true,
    errors,
  };
};

export const formateDataForDropdown = (
  data: string[] | number[],
  dataLabel: string,
  dataId: string
) => {
  if (
    data === null ||
    dataLabel === "" ||
    dataId === "" ||
    dataId.length === 0
  ) {
    return [];
  }

  // Format the dropdown data
  const formattedData = data?.map((item: any) => {
    return {
      label: item[dataLabel],
      id: item[dataId],
    };
  });

  return formattedData;
};

export const availabilityFormatForDisplay = (data) => {
  const result: any[] = [];

  data.forEach((item) => {
    const { day, available, timeSlots } = item;

    timeSlots?.forEach((slot: any) => {
      result.push({
        day,
        available: !!available,
        timeSlots: {
          from: slot.from,
          // from: convertReadableTimeToTimeObject(slot.from),
          // to: convertReadableTimeToTimeObject(slot.to),
          to: slot.to,
          maxBookings: String(slot.maxBookings ?? ""),
          restDuration: slot.restDuration ?? 0,
        },
      });
    });
  });

  return result;
};

//ADDTIONAL SERVICE PROCESS
export const processAdditionalServices = async (
  items: IAdditionalServicesSubmit[],
  subFolder: string,
  nestedFilePath: string
): Promise<IAdditionalServicesResponse[]> => {
  const updatedItems: IAdditionalServicesResponse[] = await Promise.all(
    items.map(async (item) => {
      const file = item.images[0];

      let uploadedUrl: string;

      if (typeof file === "string") {
        // Already a URL, skip upload
        uploadedUrl = file;
      } else {
        // Upload new File
        const { url } = await uploadFileToS3(file, {
          baseFolder: "provider",
          mainFolder: "service",
          subFolder: subFolder,
          nestedPath: nestedFilePath,
          fileName: file.name,
        });
        uploadedUrl = url;
      }

      return {
        id: item.id,
        images: uploadedUrl,
        price: item.price,
        serviceItem: item.serviceItem,
      };
    })
  );

  return updatedItems;
};

export const processSelectedStaff = async (selectedStaff: string) => {
  const convertToArray = Array.from(selectedStaff);
  return convertToArray;
  //  console.log("convertToArray: ", convertToArray);
};

// const convertToArray = Array.from(selectedStaff);
// setValue("availability.0.timeSlots.0.maxBookings", 32);

export const formatStaffIdsToDisplay = (staff: string[]) => {
  const allStaff = [...new Set(staff)];
  return allStaff.join(",");
};

//STAFF IDs CONVERT TO ARRAY
export const convertStaffStringToArray = (staff: string): string[] => {
  if (!staff || typeof staff !== "string") return [];
  return staff
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// export const processAvailability = (availability: IAvailability[]) => {
//   console.log("Avi: ", availability);
// };

//PROCESS AVAILABILITY FOR SUBMIT
export const processAvailability = (
  input: RawAvailability
): FormattedAvailability => {
  const dayMap = new Map<string, FormattedAvailability[number]>();

  for (const item of input) {
    const maxBookings = Number(item.timeSlots.maxBookings);
    const restDuration = Number(item.timeSlots?.restDuration);

    const timeSlot = {
      from: item.timeSlots.from,
      to: item.timeSlots.to,
      maxBookings: isNaN(maxBookings) ? 0 : maxBookings,
      restDuration: isNaN(restDuration) ? 0 : restDuration,
    };

    if (dayMap.has(item.day)) {
      const existing = dayMap.get(item.day)!;
      existing.timeSlots.push(timeSlot);
    } else {
      dayMap.set(item.day, {
        day: item.day,
        available: item.available,
        timeSlots: [timeSlot],
      });
    }
  }

  return Array.from(dayMap.values());
};

//CREATE SLUG
export const createSlug = (str: string) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

// PROCESS PACKAGE
export const processPackage = async (data?: IPackageProps[]): Promise<[]> => {
  if (!data) return [];

  return data.map((item) => {
    let includesArray: string[] | undefined;

    if (item.includes && !Array.isArray(item.includes)) {
      includesArray = Object.values(item.includes);
    } else if (Array.isArray(item.includes)) {
      includesArray = item.includes;
    }

    if (includesArray) {
      includesArray = includesArray.filter((val) => val.trim() !== "");
    }

    let discountFormat = null;

    if (item.isDiscount) {
      discountFormat = {
        discountType: item.discount?.discountType,
        amount: Number(item.discount?.amount),
        maxCount: Number(item.discount?.maxCount),
        valueType: item.discount?.valueType,
        durationType: item.discount?.durationType,
        duration: {
          start: item.discount?.duration.start,
          end:
            item.discount?.durationType === "time-base"
              ? item.discount?.duration.end
              : null,
        },
        isDiscount: true,
      };
    }

    return {
      ...item,
      includes: includesArray,
      discount: discountFormat,
      price: Number(item.price),
    };
  });
};

// PROCESS DISCOUNT
export const processDiscount = (
  data?: IDiscountProps
): Promise<IDiscountProps | null> => {
  console.log("data: ", data);

  if (!data) {
    return Promise.resolve(null);
  }

  const formatDiscount = {
    isDiscount: data.isDiscount,
    discountType: data.discountType,
    valueType: data.valueType,
    durationType: data.durationType,
    amount: Number(data.amount),
    promoCode: data.discountType === "promo-code" ? data.promoCode : "",
    maxCount: Number(data.maxCount),
    duration: {
      start:
        data.durationType === "time-base"
          ? data.duration.start.start
          : data.duration.start,
      end: data.durationType === "time-base" ? data.duration.start.end : null,
    },
  };

  return Promise.resolve(formatDiscount);
};
