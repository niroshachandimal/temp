import { NumberInput } from "@heroui/react";
import { ReactNode } from "react";

interface CustomInputProps {
  label: string;
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
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  isReadOnly?: boolean;
  isWheelDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  formatOptions?: Intl.NumberFormatOptions;
  onValueChange?: (value: number) => void;
  value?: number;
}

const CustomNumberInput = ({
  label = "Enter label",
  placeholder = "Enter placeholder",
  size = "md",
  radius = "md",
  color = "default",
  variant = "flat",
  labelPlacement = "outside",
  description = "",
  errorMessage = "",
  isWheelDisabled = false,
  isInvalid = false,
  defaultValue = 0,
  minValue = 0,
  maxValue = 999999999,
  formatOptions,
  startContent,
  endContent,
  onValueChange,
  value,
  ...props
}: CustomInputProps) => {
  return (
    <NumberInput
      label={label}
      placeholder={placeholder}
      size={size}
      radius={radius}
      color={color}
      variant={variant}
      defaultValue={defaultValue}
      labelPlacement={labelPlacement}
      isWheelDisabled={isWheelDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      formatOptions={formatOptions}
      onValueChange={onValueChange}
      startContent={startContent}
      endContent={endContent}
      {...props}
    />
  );
};

export default CustomNumberInput;
