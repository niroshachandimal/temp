import moment from "moment";

interface TimeSlot {
  fromFormatted: string;
  toFormatted: string;
}

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export const validateTimeSlots = (fields: TimeSlot[]): ValidationResult => {
  for (let i = 0; i < fields.length; i++) {
    const { fromFormatted, toFormatted } = fields[i];

    // Ensure both times are selected before validation
    // if (!fromFormatted || !toFormatted) {
    //   return { isValid: false, error: "Both From and To times are required." };
    // }

    // Convert times to Moment.js objects
    const fromTime = moment(fromFormatted, "HH:mm");
    const toTime = moment(toFormatted, "HH:mm");

    // Rule 1: Ensure To time is not earlier than From time
    if (toTime.isBefore(fromTime)) {
      return {
        isValid: false,
        error: "End time must be later than start time.",
      };
    }

    // Rule 2: Prevent overlapping time slots
    for (let j = 0; j < fields.length; j++) {
      if (i !== j) {
        const otherFromTime = moment(fields[j].fromFormatted, "HH:mm");
        const otherToTime = moment(fields[j].toFormatted, "HH:mm");

        if (
          fromTime.isBetween(otherFromTime, otherToTime, null, "[)") ||
          toTime.isBetween(otherFromTime, otherToTime, null, "(]") ||
          (fromTime.isSame(otherFromTime) && toTime.isSame(otherToTime))
        ) {
          return { isValid: false, error: "Time slots cannot overlap." };
        }
      }
    }
  }

  return { isValid: true, error: null };
};
