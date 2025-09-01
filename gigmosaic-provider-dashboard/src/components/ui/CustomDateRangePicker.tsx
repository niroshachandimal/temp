import { DateRangePicker } from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { ReactNode, useEffect, useState } from "react";

interface CustomDateRangePickerProps {
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  errorMessage?: string;
  description?: string;
  visibleMonths?: number;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  alreadyHolidays: string[];
  className?: string;
  startDate?: string;
  endDate?: string;
  onChange?: (range: { start: string; end: string }) => void;
}

const CustomDateRangePicker = ({
  label = "",
  size = "md",
  radius = "sm",
  color = "default",
  variant = "bordered",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  visibleMonths = 1,
  alreadyHolidays = [],
  startContent,
  endContent,
  className,
  startDate,
  endDate,
  onChange,
  ...props
}: CustomDateRangePickerProps) => {
  const [value, setValue] = useState(() => {
    if (startDate && endDate) {
      return {
        start: parseDate(startDate),
        end: parseDate(endDate),
      };
    }
    return { start: undefined, end: undefined };
  });

  useEffect(() => {
    if (startDate && endDate) {
      setValue({
        start: parseDate(startDate),
        end: parseDate(endDate),
      });
    }
  }, [startDate, endDate]);

  const handleDateRangeChange = (newValue: typeof value) => {
    setValue(newValue);
    if (onChange) {
      onChange({
        start: newValue.start?.toString() || "",
        end: newValue.end?.toString() || "",
      });
    }
  };

  console.log("Range holiday: ", alreadyHolidays);

  return (
    <DateRangePicker
      isDateUnavailable={(date) =>
        alreadyHolidays?.some(({ startDate, endDate }) => {
          const start = parseDate(startDate.split("T")[0]);
          const end = parseDate(endDate.split("T")[0]);
          return date.compare(start) >= 0 && date.compare(end) <= 0;
        }) ?? false
      }
      label={label}
      visibleMonths={visibleMonths}
      color={color}
      value={value}
      variant={variant}
      labelPlacement={labelPlacement}
      defaultValue={
        startDate && endDate
          ? {
              start: parseDate(startDate),
              end: parseDate(endDate),
            }
          : undefined
      }
      size={size}
      radius={radius}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isRequired={isRequired}
      onChange={handleDateRangeChange}
      startContent={startContent}
      endContent={endContent}
      minValue={today(getLocalTimeZone())}
      className={className}
      {...props}
    />
  );
};

export default CustomDateRangePicker;
