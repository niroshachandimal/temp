import moment from "moment";
import { CalendarDate, TimeInputValue } from "@heroui/react";
import { TimeValue } from "@react-types/datepicker";

export const convertTimeToReadble = (value: TimeInputValue | null) => {
  try {
    if (value) {
      const formattedTime = moment()
        .hour(value.hour)
        .minute(value.minute)
        .format("hh:mm A");

      return formattedTime;
    }
  } catch (error) {
    console.error(
      "Something went wrong while converting time to readable format: ",
      error
    );
  }
};

export const convertDateToReadble = (value: string | null) => {
  try {
    if (value) {
      const formattedTime = moment(value).format("DD-MM-YYYY");
      return formattedTime;
    }
  } catch (error) {
    console.error(
      "Something went wrong while converting time to readable format: ",
      error
    );
  }
};

export const convertTimeTo12ClockWithAmPm = (value: string | null) => {
  try {
    if (value) {
      const formattedTime = moment(value).format("h:mm a");
      return formattedTime;
    }
  } catch (error) {
    console.error(
      "Something went wrong while converting time to readable format: ",
      error
    );
  }
};

export const convertToInternationalizedDateTimeToReadble = (
  value: CalendarDate
) => {
  try {
    if (value) {
      const formattedTime = `${value?.year}-${value?.month}-${value?.day} `;
      return moment(formattedTime).format("YYYY-MM-DD") as string;
    }
  } catch (error) {
    console.error(
      "Something went wrong while converting time to readable format: ",
      error
    );
  }
};

export const convertReadableDateToDateObject = (value: string): Date | null => {
  try {
    if (!value) return null;

    // Expecting format "DD-MM-YYYY"
    const parts = value.split("-");
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    return { year, month, day };
  } catch (error) {
    console.error("Error converting readable date to calendar object:", error);
    return null;
  }
};

export const convertToInternationalizedTimeToReadble = (
  value: TimeValue
): string | undefined => {
  try {
    if (value) {
      const hour = value?.hour.toString().padStart(2, "0");
      const minute = value?.minute.toString().padStart(2, "0");

      const formattedTime = `${hour}:${minute}`;
      return moment(formattedTime, "HH:mm").format("h:mm a");
    }
  } catch (error) {
    console.error(
      "Something went wrong while converting time to readable format: ",
      error
    );
  }
};

export const convertReadableTimeToTimeObject = (timeStr: string) => {
  try {
    if (!timeStr) return null;
    const parsed = moment(timeStr, ["h:mm A", "H:mm"]);
    if (!parsed.isValid()) return null;

    const val = {
      hour: parsed.hour(),
      minute: parsed.minute(),
      second: 0,
      millisecond: 0,
    };

    return val;
  } catch (error) {
    console.error("Failed to convert readable time string:", error);
    return null;
  }
};
