import { TimeInput, TimeInputValue } from "@heroui/react";
import { ReactNode } from "react";

interface CustomTimeInputProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  labelPlacement?: "inside" | "outside" | "outside-left";
  errorMessage?: string;
  description?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onChange?: (value: TimeInputValue | null) => void;
  value?: TimeInputValue | null;
}

const CustomTimeInput = ({
  label = "Enter label",
  size = "md",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  isDisabled = false,
  isInvalid = false,
  startContent,
  endContent,
  onChange,
  defaultValue,
  value,
}: CustomTimeInputProps) => {
  return (
    <TimeInput
      label={label}
      size={size}
      labelPlacement={labelPlacement}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      value={value}
      onChange={onChange}
      startContent={startContent}
      endContent={endContent}
      defaultValue={defaultValue}
      className="bg-transparent"
    />
  );
};

export default CustomTimeInput;
